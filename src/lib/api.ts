import type {
  PageImage,
  ExtractedQuestion,
  ExtractedAnswer,
  GradeResult,
} from "@/types";

function getEdgeFunctionUrl(): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (supabaseUrl) {
    return `${supabaseUrl}/functions/v1/extract-assessment`;
  }
  return "https://0ec90b57d6e95fcbda19832f.supabase.co/functions/v1/extract-assessment";
}

interface ApiRequestBody {
  mode: "questions" | "answers" | "grade";
  images?: { page: number; base64: string; mimeType: string }[];
  questions?: ExtractedQuestion[];
  answers?: ExtractedAnswer[];
}

export async function extractQuestions(
  images: PageImage[],
): Promise<ExtractedQuestion[]> {
  const body: ApiRequestBody = {
    mode: "questions",
    images: images.map((i) => ({
      page: i.page,
      base64: i.base64,
      mimeType: i.mimeType,
    })),
  };
  const res = await fetch(getEdgeFunctionUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to extract questions");
  return data.questions as ExtractedQuestion[];
}

export async function extractAnswers(
  images: PageImage[],
): Promise<ExtractedAnswer[]> {
  const body: ApiRequestBody = {
    mode: "answers",
    images: images.map((i) => ({
      page: i.page,
      base64: i.base64,
      mimeType: i.mimeType,
    })),
  };
  const res = await fetch(getEdgeFunctionUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to extract answers");
  return data.answers as ExtractedAnswer[];
}

export async function gradeAnswers(
  questions: ExtractedQuestion[],
  answers: ExtractedAnswer[],
): Promise<{ grades: GradeResult[]; overallFeedback: string }> {
  const body: ApiRequestBody = {
    mode: "grade",
    questions,
    answers,
  };
  const res = await fetch(getEdgeFunctionUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to grade answers");
  return {
    grades: data.grades as GradeResult[],
    overallFeedback: data.overallFeedback as string,
  };
}
