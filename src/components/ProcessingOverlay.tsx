import type { ProcessingState } from "@/types";
import { Loader2, FileSearch, ScanText, Link2, GraduationCap } from "lucide-react";

interface ProcessingOverlayProps {
  state: ProcessingState;
}

export function ProcessingOverlay({ state }: ProcessingOverlayProps) {
  const steps = [
    { key: "converting", label: "Converting files to images", icon: FileSearch },
    { key: "extracting-questions", label: "Extracting questions", icon: ScanText },
    { key: "extracting-answers", label: "Extracting answers", icon: ScanText },
    { key: "mapping", label: "Mapping answers to questions", icon: Link2 },
    { key: "grading", label: "Grading & generating feedback", icon: GraduationCap },
  ];

  const order = ["converting", "extracting-questions", "extracting-answers", "mapping", "grading"];
  const currentIdx = order.indexOf(state.stage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-fade-in-up">
        <div className="mb-6 text-center">
          <Loader2 size={40} className="mx-auto mb-3 animate-spin text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">Processing Assessment</h3>
          <p className="mt-1 text-sm text-gray-500">{state.message}</p>
        </div>

        <div className="space-y-1">
          {steps.map((step, i) => {
            const isDone = i < currentIdx;
            const isActive = i === currentIdx;
            return (
              <div
                key={step.key}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive ? "bg-blue-50" : isDone ? "bg-emerald-50/50" : ""
                }`}
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-full shrink-0 ${
                  isDone ? "bg-emerald-500 text-white"
                  : isActive ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-400"
                }`}>
                  {isDone ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : isActive ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <step.icon size={14} />
                  )}
                </div>
                <span className={`text-sm ${
                  isDone ? "text-emerald-700"
                  : isActive ? "text-blue-700 font-medium"
                  : "text-gray-400"
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            style={{ width: `${state.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
