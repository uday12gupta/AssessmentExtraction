export interface BoundingBox {
  yMin: number;
  yMax: number;
  xMin: number;
  xMax: number;
}

export interface ExtractedQuestion {
  number: string;
  text: string;
  maxMarks?: number | null;
  page: number;
}

export interface ExtractedAnswer {
  questionNumber: string;
  text: string;
  pages: number[];
  boundingBoxes: BoundingBox[];
}

export interface GradeResult {
  questionNumber: string;
  awardedMarks: number;
  maxMarks: number;
  correct: boolean;
  feedback: string;
}

export interface PageImage {
  page: number;
  dataUrl: string;
  base64: string;
  mimeType: string;
  width: number;
  height: number;
}

export interface ProcessedDocument {
  name: string;
  type: string;
  pages: PageImage[];
}

export interface MappedQuestion {
  question: ExtractedQuestion;
  answer: ExtractedAnswer | null;
  isAnswered: boolean;
}

export type ProcessingStage =
  | "idle"
  | "converting"
  | "extracting-questions"
  | "extracting-answers"
  | "mapping"
  | "grading"
  | "complete"
  | "error";

export interface ProcessingState {
  stage: ProcessingStage;
  message: string;
  progress: number;
}
