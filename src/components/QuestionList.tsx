import type { MappedQuestion, GradeResult } from "@/types";
import { CheckCircle2, XCircle, Circle, FileQuestion, AlertTriangle } from "lucide-react";

interface QuestionListProps {
  mapped: MappedQuestion[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onHover: (questionNumber: string | null) => void;
  grades: GradeResult[] | null;
}

export function QuestionList({
  mapped,
  selectedIndex,
  onSelect,
  onHover,
  grades,
}: QuestionListProps) {
  const getGrade = (qNumber: string) =>
    grades?.find((g) => g.questionNumber === qNumber);

  return (
    <div className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 180px)" }}>
      {mapped.map((item, index) => {
        const isUnmatched = item.question.text === "Unmatched answer";
        const grade = getGrade(item.question.number);
        const isSelected = selectedIndex === index;

        return (
          <button
            key={index}
            onClick={() => onSelect(index)}
            onMouseEnter={() => onHover(item.answer ? item.question.number : null)}
            onMouseLeave={() => onHover(null)}
            className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${
              isSelected
                ? "border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-200"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {isUnmatched ? (
                  <AlertTriangle size={20} className="text-amber-500" />
                ) : item.isAnswered ? (
                  grade ? (
                    grade.correct ? (
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    ) : (
                      <XCircle size={20} className="text-red-400" />
                    )
                  ) : (
                    <CheckCircle2 size={20} className="text-emerald-500" />
                  )
                ) : (
                  <Circle size={20} className="text-gray-300" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-700">
                    {item.question.number}
                  </span>
                  {item.question.maxMarks != null && item.question.maxMarks > 0 && (
                    <span className="text-xs font-medium text-gray-400">
                      {item.question.maxMarks} marks
                    </span>
                  )}
                  {isUnmatched && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      No matching question
                    </span>
                  )}
                  {!isUnmatched && !item.isAnswered && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                      Unanswered
                    </span>
                  )}
                  {grade && (
                    <span className={`ml-auto rounded-md px-2 py-0.5 text-xs font-bold ${
                      grade.correct
                        ? "bg-emerald-100 text-emerald-700"
                        : grade.awardedMarks > 0
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {grade.awardedMarks}/{grade.maxMarks}
                    </span>
                  )}
                </div>

                <p className="mt-1.5 text-sm text-gray-700 line-clamp-2">
                  {isUnmatched
                    ? item.answer?.text || "No text extracted"
                    : item.question.text}
                </p>

                {item.isAnswered && !isUnmatched && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-600">
                    <FileQuestion size={13} />
                    <span>Answer found — Page {item.answer?.pages.join(", ")}</span>
                  </div>
                )}

                {grade?.feedback && (
                  <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 border border-gray-100">
                    {grade.feedback}
                  </p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
