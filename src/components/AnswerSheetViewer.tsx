import { useRef, useState, useEffect } from "react";
import type { PageImage, ExtractedAnswer } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AnswerSheetViewerProps {
  pages: PageImage[];
  selectedAnswer: ExtractedAnswer | null;
  hoveredQuestionNumber: string | null;
}

export function AnswerSheetViewer({
  pages,
  selectedAnswer,
  hoveredQuestionNumber,
}: AnswerSheetViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [imgRenderedSize, setImgRenderedSize] = useState<{ w: number; h: number } | null>(null);

  const page = pages.find((p) => p.page === currentPage) || pages[0];

  useEffect(() => {
    if (selectedAnswer && selectedAnswer.pages.length > 0) {
      setCurrentPage(selectedAnswer.pages[0]);
    }
  }, [selectedAnswer]);

  useEffect(() => {
    setImgNaturalSize(null);
    setImgRenderedSize(null);
  }, [currentPage]);

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImgNaturalSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight });
    updateRenderedSize(e.currentTarget);
  };

  const updateRenderedSize = (img: HTMLImageElement) => {
    setImgRenderedSize({ w: img.clientWidth, h: img.clientHeight });
  };

  useEffect(() => {
    const handleResize = () => {
      const img = containerRef.current?.querySelector("img");
      if (img) updateRenderedSize(img);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!page) return null;

  const activeAnswer = selectedAnswer || (hoveredQuestionNumber ? null : null);
  const boxesForPage = activeAnswer
    ? activeAnswer.boundingBoxes.filter((_, i) => activeAnswer.pages[i] === currentPage)
    : [];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5 bg-gray-50/80">
        <span className="text-sm font-medium text-gray-600">
          Answer Sheet — Page {currentPage} of {pages.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(pages.length, p + 1))}
            disabled={currentPage >= pages.length}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative flex-1 overflow-auto bg-gray-100 p-4 flex items-start justify-center"
      >
        <div className="relative inline-block">
          <img
            src={page.dataUrl}
            alt={`Answer sheet page ${currentPage}`}
            onLoad={handleImgLoad}
            className="max-w-full h-auto rounded-lg shadow-md"
            style={{ maxHeight: "calc(100vh - 220px)" }}
          />
          {imgNaturalSize && imgRenderedSize && boxesForPage.map((box, i) => {
            const scaleX = imgRenderedSize.w / 1000;
            const scaleY = imgRenderedSize.h / 1000;
            const top = box.yMin * scaleY;
            const left = box.xMin * scaleX;
            const width = (box.xMax - box.xMin) * scaleX;
            const height = (box.yMax - box.yMin) * scaleY;
            return (
              <div
                key={i}
                className="absolute border-2 border-blue-500 bg-blue-500/15 rounded-sm pointer-events-none"
                style={{
                  top: `${top}px`,
                  left: `${left}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                  boxShadow: "0 0 0 3px rgba(59,130,246,0.2)",
                  animation: "pulseHighlight 1.5s ease-in-out infinite",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
