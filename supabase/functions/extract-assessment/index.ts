import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OPENROUTER_API_KEY =
  Deno.env.get("OPENROUTER_API_KEY") ||
  "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";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const VISION_MODEL = "google/gemma-4-31b-it:free";
const TEXT_MODEL = "google/gemma-4-31b-it:free";
const FALLBACK_MODEL = "google/gemma-4-26b-a4b-it:free";

interface PageImage {
  page: number;
  base64: string;
  mimeType: string;
}

interface ExtractRequest {
  mode: "questions" | "answers" | "grade";
  images: PageImage[];
  questions?: ExtractedQuestion[];
  answers?: ExtractedAnswer[];
}

interface ExtractedQuestion {
  number: string;
  text: string;
  maxMarks?: number | null;
  page: number;
}

interface BoundingBox {
  yMin: number;
  yMax: number;
  xMin: number;
  xMax: number;
}

interface ExtractedAnswer {
  questionNumber: string;
  text: string;
  pages: number[];
  boundingBoxes: BoundingBox[];
}

interface GradeResult {
  questionNumber: string;
  awardedMarks: number;
  maxMarks: number;
  correct: boolean;
  feedback: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as ExtractRequest;
    const { mode, images, questions, answers } = body;

    let result: unknown;

    if (mode === "questions") {
      result = await extractQuestions(images);
    } else if (mode === "answers") {
      result = await extractAnswers(images);
    } else if (mode === "grade") {
      result = await gradeAnswers(questions!, answers!);
    } else {
      return jsonResponse(400, { error: "Invalid mode" });
    }

    return jsonResponse(200, result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonResponse(500, { error: message });
  }

  function jsonResponse(status: number, data: unknown): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});

interface ChatMessage {
  role: string;
  content: Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

async function callOpenRouter(
  prompt: string,
  images: PageImage[],
  model: string,
): Promise<string> {
  const content: ChatMessage["content"] = [{ type: "text", text: prompt }];

  for (const img of images) {
    content.push({
      type: "image_url",
      image_url: { url: `data:${img.mimeType};base64,${img.base64}` },
    });
  }

  const body: Record<string, unknown> = {
    model,
    messages: [{ role: "user", content }],
    temperature: 0.1,
  };

  // Only set response_format for models that support it
  if (!model.includes("nemotron")) {
    body.response_format = { type: "json_object" };
  }

  let res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://vedaai.bolt.new",
      "X-Title": "VedaAI Assessment Extraction",
    },
    body: JSON.stringify(body),
  });

  // Retry with fallback model if the primary model fails
  if (!res.ok && model !== FALLBACK_MODEL) {
    body.model = FALLBACK_MODEL;
    res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://vedaai.bolt.new",
        "X-Title": "VedaAI Assessment Extraction",
      },
      body: JSON.stringify(body),
    });
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("Empty response from AI model");
  }
  return text;
}

function extractJson(text: string): string {
  let cleaned = text.trim();
  // Strip markdown code fences if present (without regex to avoid bundler issues)
  if (cleaned.startsWith("```")) {
    const firstNewline = cleaned.indexOf("\n");
    if (firstNewline >= 0) {
      cleaned = cleaned.substring(firstNewline + 1);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3);
    }
  }
  // Find the first { and last } to extract just the JSON object
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first >= 0 && last > first) {
    cleaned = cleaned.substring(first, last + 1);
  }
  return cleaned.trim();
}

async function extractQuestions(
  images: PageImage[],
): Promise<{ questions: ExtractedQuestion[] }> {
  const pageList = images.map((i) => `Page ${i.page}`).join(", ");
  const prompt = `You are an expert at reading exam question papers. Analyze the provided ${images.length} page image(s) (${pageList}).
Extract EVERY question from the question paper in the correct printed order.

Rules:
- Treat labelled sub-parts as SEPARATE questions. Example: "11 (a)" and "11 (b)" are two separate entries.
- Preserve the original question numbering exactly as printed. The "number" field should contain the full label including sub-parts, e.g. "11(a)", "Q3(b)", "1a", etc.
- The "text" field should contain the full question text as printed.
- If marks are indicated for a question, include them in "maxMarks". If not found, omit or set to null.
- The "page" field indicates which page number the question appears on (1-indexed).

Return JSON in this exact format:
{
  "questions": [
    { "number": "1", "text": "...", "maxMarks": 5, "page": 1 },
    { "number": "2(a)", "text": "...", "maxMarks": 3, "page": 1 },
    { "number": "2(b)", "text": "...", "maxMarks": 3, "page": 2 }
  ]
}`;

  const text = await callOpenRouter(prompt, images, VISION_MODEL);
  const parsed = JSON.parse(extractJson(text));
  return { questions: parsed.questions || [] };
}

async function extractAnswers(
  images: PageImage[],
): Promise<{ answers: ExtractedAnswer[] }> {
  const pageList = images.map((i) => `Page ${i.page}`).join(", ");
  const prompt = `You are an expert at reading handwritten student answer sheets. Analyze the provided ${images.length} page image(s) (${pageList}).

Extract EVERY answer written by the student. For each answer:
- Identify which question number it corresponds to based on the handwritten label (e.g. "1", "2(a)", "Q3"). Use "UNKNOWN" if the answer cannot be associated with any question label.
- Extract the full text of the handwritten answer (transcribe the handwriting).
- Identify ALL pages this answer spans (it may continue across multiple pages).
- Provide bounding boxes for the answer region on EACH page it appears. Bounding box coordinates are normalized 0-1000 (based on the image dimensions) using the format [y_min, x_min, y_max, x_max]. So a box covering the top-left quarter would be [0, 0, 500, 500].

Rules:
- Handle answers written out of order.
- Handle unanswered questions (just don't include them).
- Handle answers that don't match any question (use "UNKNOWN" as questionNumber).
- Each answer may have multiple bounding boxes if it spans multiple pages or has multiple regions on one page.

Return JSON in this exact format:
{
  "answers": [
    {
      "questionNumber": "1",
      "text": "Transcribed answer text...",
      "pages": [1],
      "boundingBoxes": [{ "yMin": 100, "yMax": 300, "xMin": 50, "xMax": 900 }]
    },
    {
      "questionNumber": "2(a)",
      "text": "Answer spans two pages...",
      "pages": [1, 2],
      "boundingBoxes": [
        { "yMin": 800, "yMax": 1000, "xMin": 50, "xMax": 900 },
        { "yMin": 0, "yMax": 200, "xMin": 50, "xMax": 900 }
      ]
    }
  ]
}`;

  const text = await callOpenRouter(prompt, images, VISION_MODEL);
  const parsed = JSON.parse(extractJson(text));
  return { answers: parsed.answers || [] };
}

async function gradeAnswers(
  questions: ExtractedQuestion[],
  answers: ExtractedAnswer[],
): Promise<{ grades: GradeResult[]; overallFeedback: string }> {
  const questionAnswerPairs: Array<{
    question: ExtractedQuestion;
    answer: ExtractedAnswer | null;
  }> = questions.map((q) => {
    const ans = answers.find((a) => normalize(a.questionNumber) === normalize(q.number));
    return { question: q, answer: ans || null };
  });

  const qaText = questionAnswerPairs
    .map((pair, i) => {
      const q = pair.question;
      const a = pair.answer;
      const ansText = a ? a.text : "[NO ANSWER PROVIDED]";
      return `${i + 1}. Question ${q.number} (${q.maxMarks || "N/A"} marks): ${q.text}\n   Student Answer: ${ansText}`;
    })
    .join("\n\n");

  const prompt = `You are an experienced teacher grading a student's exam. Below are the questions and the student's transcribed answers.

For each question:
- Award marks based on the correctness and completeness of the answer.
- "correct" should be true if the answer is substantially correct, false otherwise. For unanswered questions, correct is false and awardedMarks is 0.
- Provide concise, constructive feedback for each question.
- "maxMarks" should match the question's max marks (use 0 if unknown).

Questions and Answers:
${qaText}

Return JSON in this exact format:
{
  "grades": [
    { "questionNumber": "1", "awardedMarks": 4, "maxMarks": 5, "correct": true, "feedback": "Good answer, but missed mentioning..." },
    { "questionNumber": "2(a)", "awardedMarks": 0, "maxMarks": 3, "correct": false, "feedback": "No answer provided." }
  ],
  "overallFeedback": "Overall the student performed well in... but needs improvement in..."
}`;

  const text = await callOpenRouter(prompt, [], TEXT_MODEL);
  const parsed = JSON.parse(extractJson(text));
  return {
    grades: parsed.grades || [],
    overallFeedback: parsed.overallFeedback || "",
  };
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s()q.]/g, "");
}
