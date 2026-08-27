import type { MappedQuestion, GradeResult } from "@/types";
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, Award } from "lucide-react";

interface GradingPanelProps {
  mapped: MappedQuestion[];
  grades: GradeResult[];
  overallFeedback: string;
  totalMarks: number;
  maxMarks: number;
}

export function GradingPanel({
  mapped,
  grades,
  overallFeedback,
  totalMarks,
  maxMarks,
}: GradingPanelProps) {
  const correct = grades.filter((g) => g.correct).length;
  const incorrect = grades.filter((g) => !g.correct && g.awardedMarks === 0).length;
  const partial = grades.filter((g) => !g.correct && g.awardedMarks > 0).length;
  const percentage = maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100) : 0;

  const statCards = [
    { label: "Correct", value: correct, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
    { label: "Partial", value: partial, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
    { label: "Incorrect", value: incorrect, icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
            <Award size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">Grading Summary</h3>
            <p className="text-xs text-gray-500">AI-generated evaluation</p>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-gray-900">{totalMarks}</span>
          <span className="text-lg text-gray-400">/ {maxMarks}</span>
          <span className={`ml-auto rounded-lg px-3 py-1 text-sm font-bold ${
            percentage >= 75 ? "bg-emerald-100 text-emerald-700"
            : percentage >= 50 ? "bg-amber-100 text-amber-700"
            : "bg-red-100 text-red-600"
          }`}>
            {percentage}%
          </span>
        </div>

        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              percentage >= 75 ? "bg-emerald-500"
              : percentage >= 50 ? "bg-amber-500"
              : "bg-red-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {statCards.map((stat) => (
          <div key={stat.label} className={`rounded-xl border ${stat.border} ${stat.bg} p-3 text-center`}>
            <stat.icon size={20} className={`mx-auto mb-1 ${stat.color}`} />
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {overallFeedback && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">Overall Feedback</span>
          </div>
          <p className="text-sm text-blue-900 leading-relaxed">{overallFeedback}</p>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700">Question Breakdown</h4>
        {mapped
          .filter((m) => m.question.text !== "Unmatched answer")
          .map((item, i) => {
            const grade = grades.find((g) => g.questionNumber === item.question.number);
            if (!grade) return null;
            return (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-sm">
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-700 shrink-0">
                  {item.question.number}
                </span>
                <span className="truncate text-gray-600 flex-1">
                  {grade.feedback}
                </span>
                <span className={`shrink-0 font-bold ${
                  grade.correct ? "text-emerald-600"
                  : grade.awardedMarks > 0 ? "text-amber-600"
                  : "text-red-500"
                }`}>
                  {grade.awardedMarks}/{grade.maxMarks}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
