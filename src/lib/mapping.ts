import type {
  ExtractedQuestion,
  ExtractedAnswer,
  MappedQuestion,
} from "@/types";

function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s()q.]/g, "");
}

export function mapAnswersToQuestions(
  questions: ExtractedQuestion[],
  answers: ExtractedAnswer[],
): MappedQuestion[] {
  const answerMap = new Map<string, ExtractedAnswer>();
  const unmatchedAnswers: ExtractedAnswer[] = [];

  for (const ans of answers) {
    const normalizedNum = normalize(ans.questionNumber);
    const matchedQuestion = questions.find((q) => normalize(q.number) === normalizedNum);

    if (matchedQuestion) {
      answerMap.set(normalizedNum, ans);
    } else {
      unmatchedAnswers.push(ans);
    }
  }

  const mapped = questions.map((q) => {
    const key = normalize(q.number);
    const answer = answerMap.get(key) || null;
    return { question: q, answer, isAnswered: answer !== null };
  });

  for (const unmatched of unmatchedAnswers) {
    mapped.push({
      question: { number: unmatched.questionNumber, text: "Unmatched answer", page: unmatched.pages[0] || 1 },
      answer: unmatched,
      isAnswered: true,
    });
  }

  return mapped;
}

export function getStats(mapped: MappedQuestion[]) {
  const total = mapped.filter((m) => m.question.text !== "Unmatched answer").length;
  const answered = mapped.filter((m) => m.isAnswered && m.question.text !== "Unmatched answer").length;
  const unanswered = total - answered;
  const unmatched = mapped.filter((m) => m.question.text === "Unmatched answer").length;
  return { total, answered, unanswered, unmatched };
}
