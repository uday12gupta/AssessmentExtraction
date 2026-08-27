import { useState, useCallback } from "react";
import {
  FileText,
  FileImage,
  RotateCcw,
  ScanText,
  GraduationCap,
  Eye,
  ChevronRight,
  Grid2X2,
  School,
  ClipboardList,
  Library,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import type { Section } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { QuestionList } from "@/components/QuestionList";
import { AnswerSheetViewer } from "@/components/AnswerSheetViewer";
import { GradingPanel } from "@/components/GradingPanel";
import { ProcessingOverlay } from "@/components/ProcessingOverlay";
import { HomePage } from "@/pages/HomePage";
import { ClassroomPage } from "@/pages/ClassroomPage";
import { AssignmentsPage } from "@/pages/AssignmentsPage";
import { LibraryPage } from "@/pages/LibraryPage";
import { ExamsPage } from "@/pages/ExamsPage";
import { filesToPages } from "@/lib/pdf";
import { extractQuestions, extractAnswers, gradeAnswers } from "@/lib/api";
import { mapAnswersToQuestions, getStats } from "@/lib/mapping";
import type {
  PageImage,
  ExtractedQuestion,
  ExtractedAnswer,
  GradeResult,
  MappedQuestion,
  ProcessingState,
} from "@/types";

type View = "results" | "grading";

export default function App() {
  const [section, setSection] = useState<Section>("exams");
  const [questionFiles, setQuestionFiles] = useState<File[]>([]);
  const [answerFiles, setAnswerFiles] = useState<File[]>([]);
  const [questionPages, setQuestionPages] = useState<PageImage[]>([]);
  const [answerPages, setAnswerPages] = useState<PageImage[]>([]);
  const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
  const [answers, setAnswers] = useState<ExtractedAnswer[]>([]);
  const [mapped, setMapped] = useState<MappedQuestion[]>([]);
  const [grades, setGrades] = useState<GradeResult[]>([]);
  const [overallFeedback, setOverallFeedback] = useState("");
  const [hoveredQuestionNumber, setHoveredQuestionNumber] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [processing, setProcessing] = useState<ProcessingState | null>(null);
  const [hasResults, setHasResults] = useState(false);
  const [view, setView] = useState<View>("results");
  const [error, setError] = useState<string | null>(null);

  const totalMarks = grades.reduce((sum, g) => sum + g.awardedMarks, 0);
  const maxMarks = grades.reduce((sum, g) => sum + (g.maxMarks || 0), 0);
  const stats = getStats(mapped);

  const reset = () => {
    setQuestionFiles([]);
    setAnswerFiles([]);
    setQuestionPages([]);
    setAnswerPages([]);
    setQuestions([]);
    setAnswers([]);
    setMapped([]);
    setGrades([]);
    setOverallFeedback("");
    setSelectedIndex(-1);
    setHasResults(false);
    setError(null);
    setView("results");
    setSection("exams");
  };

  const updateProgress = (stage: ProcessingState["stage"], message: string, progress: number) => {
    setProcessing({ stage, message, progress });
  };

  const handleProcess = useCallback(async () => {
    if (questionFiles.length === 0 || answerFiles.length === 0) return;

    setError(null);

    try {
      updateProgress("converting", "Converting files to images...", 5);
      const qPages = await filesToPages(questionFiles);
      setQuestionPages(qPages);

      const aPages = await filesToPages(answerFiles);
      setAnswerPages(aPages);

      updateProgress("extracting-questions", "Extracting questions from question paper...", 25);
      const extractedQs = await extractQuestions(qPages);
      setQuestions(extractedQs);

      updateProgress("extracting-answers", "Extracting answers from answer sheet...", 55);
      const extractedAs = await extractAnswers(aPages);
      setAnswers(extractedAs);

      updateProgress("mapping", "Mapping answers to questions...", 80);
      const mappedResults = mapAnswersToQuestions(extractedQs, extractedAs);
      setMapped(mappedResults);

      updateProgress("grading", "Grading and generating feedback...", 90);
      try {
        const gradeResult = await gradeAnswers(extractedQs, extractedAs);
        setGrades(gradeResult.grades);
        setOverallFeedback(gradeResult.overallFeedback);
      } catch {
        // Grading is optional — continue without it
      }

      updateProgress("complete", "Done!", 100);
      setHasResults(true);
      setTimeout(() => setProcessing(null), 600);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      setProcessing(null);
    }
  }, [questionFiles, answerFiles]);

  const handleQuestionClick = (index: number) => {
    setSelectedIndex(index);
  };

  // --- Results view (full screen, no sidebar) ---
  if (hasResults) {
    return (
      <div className="min-h-screen bg-[#f4f4f3] text-[#292927]">
        <header className="sticky top-0 z-30 border-b border-[#e9e9e7] bg-white/90 backdrop-blur-lg">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-3 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2d2d2b] text-white">
                <ScanText size={18} />
              </div>
              <span className="text-[17px] font-bold tracking-[-0.04em] text-[#272725]">VedaAI</span>
              <span className="hidden ml-1 text-[13px] text-[#a1a19d] sm:inline">Assessment Results</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="mr-1 hidden items-center gap-2 md:flex">
                <span className="rounded-full bg-[#e8f3ec] px-2.5 py-1 text-[11px] font-bold text-[#3c7a45]">{stats.answered} Answered</span>
                <span className="rounded-full bg-[#f0f0ef] px-2.5 py-1 text-[11px] font-bold text-[#6b6b68]">{stats.unanswered} Unanswered</span>
                {stats.unmatched > 0 && (
                  <span className="rounded-full bg-[#fff0e9] px-2.5 py-1 text-[11px] font-bold text-[#ff5f35]">{stats.unmatched} Unmatched</span>
                )}
              </div>

              <div className="flex rounded-full border border-[#e2e2df] bg-white p-0.5">
                <button
                  onClick={() => setView("results")}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all ${
                    view === "results" ? "bg-[#2d2d2b] text-white" : "text-[#7a7a76] hover:text-[#4b4b48]"
                  }`}
                >
                  <Eye size={14} />
                  <span className="hidden sm:inline">Results</span>
                </button>
                <button
                  onClick={() => setView("grading")}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all ${
                    view === "grading" ? "bg-[#2d2d2b] text-white" : "text-[#7a7a76] hover:text-[#4b4b48]"
                  }`}
                >
                  <GraduationCap size={14} />
                  <span className="hidden sm:inline">Grading</span>
                </button>
              </div>

              <button
                onClick={reset}
                className="flex items-center gap-1.5 rounded-full border border-[#e2e2df] bg-white px-3 py-2 text-[12px] font-semibold text-[#555552] hover:bg-[#f6f6f5] transition-all"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline">New</span>
              </button>
            </div>
          </div>
        </header>

        {view === "results" ? (
          <div className="mx-auto max-w-[1600px] px-4 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4">
              <div className="lg:sticky lg:top-16 lg:self-start lg:max-h-[calc(100vh-80px)] flex flex-col">
                <div className="mb-3 flex items-center gap-2 px-1">
                  <FileText size={18} className="text-gray-700" />
                  <h2 className="font-bold text-gray-800">Questions</h2>
                  <span className="text-sm text-gray-400">({mapped.length})</span>
                </div>
                <QuestionList
                  mapped={mapped}
                  selectedIndex={selectedIndex}
                  onSelect={handleQuestionClick}
                  onHover={setHoveredQuestionNumber}
                  grades={grades.length > 0 ? grades : null}
                />
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden" style={{ height: "calc(100vh - 100px)" }}>
                {selectedIndex >= 0 && mapped[selectedIndex]?.answer ? (
                  <AnswerSheetViewer
                    pages={answerPages}
                    selectedAnswer={mapped[selectedIndex].answer}
                    hoveredQuestionNumber={hoveredQuestionNumber}
                  />
                ) : selectedIndex >= 0 && !mapped[selectedIndex]?.answer ? (
                  <div className="flex h-full flex-col items-center justify-center bg-gray-50 p-8 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                      <FileImage size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">No Answer Found</h3>
                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                      This question was not answered in the student's answer sheet. The student left it blank or it couldn't be matched to any written answer.
                    </p>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center bg-gray-50 p-8 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                      <Eye size={32} className="text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">Select a Question</h3>
                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                      Click any question on the left to see the corresponding answer highlighted on the answer sheet.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-md">
                      {mapped.slice(0, 5).map((m, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuestionClick(i)}
                          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
                        >
                          Q{m.question.number}
                          <ChevronRight size={14} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl px-4 py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Grading & Feedback</h2>
              <p className="mt-1 text-sm text-gray-500">AI-generated evaluation of the student's answers</p>
            </div>
            {grades.length > 0 ? (
              <GradingPanel
                mapped={mapped}
                grades={grades}
                overallFeedback={overallFeedback}
                totalMarks={totalMarks}
                maxMarks={maxMarks}
              />
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                <GraduationCap size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Grading was not available for this assessment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // --- Main app shell with sidebar + section routing ---
  return (
    <div className="min-h-screen bg-[#f4f4f3] text-[#292929]">
      {processing && <ProcessingOverlay state={processing} />}

      <Sidebar active={section} onNavigate={setSection} />

      <div className="lg:pl-[260px]">
        <TopBar section={section} onBack={() => setSection("home")} />

        {section === "home" && <HomePage onNavigate={setSection} />}

        {section === "classroom" && <ClassroomPage />}

        {section === "assignments" && <AssignmentsPage />}

        {section === "library" && <LibraryPage />}

        {section === "exams" && (
          <ExamsPage
            questionFiles={questionFiles}
            answerFiles={answerFiles}
            setQuestionFiles={setQuestionFiles}
            setAnswerFiles={setAnswerFiles}
            onProcess={handleProcess}
            processing={!!processing}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
