import { Sparkles, ArrowRight } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";

interface ExamsPageProps {
  questionFiles: File[];
  answerFiles: File[];
  setQuestionFiles: (files: File[]) => void;
  setAnswerFiles: (files: File[]) => void;
  onProcess: () => void;
  processing: boolean;
  error: string | null;
}

export function ExamsPage({
  questionFiles,
  answerFiles,
  setQuestionFiles,
  setAnswerFiles,
  onProcess,
  processing,
  error,
}: ExamsPageProps) {
  return (
    <main className="min-h-[calc(100vh-62px)] px-4 pb-12 pt-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[900px] text-center">
        <h1 className="text-[29px] font-bold tracking-[-0.045em] text-[#292927] sm:text-[36px]">
          Upload <span className="rounded-md bg-[#fff0e9] px-2 py-1 text-[#ff5f35]">Question Paper & Answer Sheets</span>
        </h1>
        <p className="mt-3 text-[16px] text-[#666663]">Upload both files to get started</p>

        <div className="relative mx-auto my-6 flex h-[112px] w-[112px] items-center justify-center rounded-full bg-[#f8ddd3]">
          <div className="flex h-[78px] w-[78px] items-center justify-center overflow-hidden rounded-full border-[7px] border-white bg-[#ffc7b3] shadow-sm">
            <img src="https://images.pexels.com/photos/16160869/pexels-photo-16160869.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Teacher" className="h-full w-full object-cover" />
          </div>
          <span className="absolute left-2 top-8 flex h-3 w-3 items-center justify-center rounded-full bg-[#ff633a] text-[8px] font-bold text-white">+</span>
          <span className="absolute right-3 top-4 flex h-3 w-3 items-center justify-center rounded-full bg-[#ff633a] text-[8px] font-bold text-white">+</span>
          <span className="absolute bottom-1 right-5 flex h-3 w-3 items-center justify-center rounded-full bg-[#ff633a] text-[8px] font-bold text-white">+</span>
          <span className="absolute bottom-3 left-4 flex h-3 w-3 items-center justify-center rounded-full bg-[#ff633a] text-[8px] font-bold text-white">+</span>
        </div>

        <div className="mx-auto grid max-w-[650px] gap-3 sm:grid-cols-2">
          <FileUpload
            label="Question Paper"
            description="Upload the exam question paper (PDF or images)"
            icon="paper"
            files={questionFiles}
            onFilesChange={setQuestionFiles}
          />
          <FileUpload
            label="Student Answer Sheet"
            description="Upload the handwritten answer sheet (PDF or images)"
            icon="answer"
            files={answerFiles}
            onFilesChange={setAnswerFiles}
          />
        </div>

        {error && (
          <div className="mx-auto mt-4 max-w-[650px] rounded-lg border border-red-200 bg-red-50 p-3 text-left text-sm text-red-700">{error}</div>
        )}

        <button
          onClick={onProcess}
          disabled={questionFiles.length === 0 || answerFiles.length === 0 || processing}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#373735] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_3px_0_#1e1e1d] transition hover:-translate-y-0.5 hover:bg-[#292927] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          <Sparkles size={16} />
          Start Mapping <ArrowRight size={16} />
        </button>
        <p className="mt-5 text-[11px] text-[#92928e]">Once both files are uploaded, you'll be able to map answers with questions</p>
      </div>
    </main>
  );
}
