import { useRef, useState } from "react";
import { UploadCloud, FileText, X, FileImage } from "lucide-react";

interface FileUploadProps {
  label: string;
  description: string;
  icon: "paper" | "answer";
  files: File[];
  onFilesChange: (files: File[]) => void;
  icon: "paper" | "answer";
}

export function FileUpload({
  label,
  description,
  files,
  onFilesChange,
  icon,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const acceptFiles = (incoming: File[]) => {
    const validFiles = incoming.filter((file) =>
      file.type.startsWith("image/") || file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"),
    );
    if (validFiles.length > 0) onFilesChange([...files, ...validFiles]);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    acceptFiles(Array.from(event.dataTransfer.files));
  };

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    acceptFiles(Array.from(event.target.files || []));
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (index: number) => onFilesChange(files.filter((_, fileIndex) => fileIndex !== index));
  const primaryFile = files[0];
  const isPdf = primaryFile?.type === "application/pdf" || primaryFile?.name.toLowerCase().endsWith(".pdf");

  return (
    <div className="w-full text-left">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex min-h-[154px] cursor-pointer flex-col items-center justify-center rounded-[13px] border border-dashed border-[#d6d6d3] bg-[#fafafa] px-5 py-5 transition-all duration-200 hover:border-[#b8b8b4] hover:bg-white ${isDragging ? "border-[#ff7652] bg-[#fff6f2] ring-4 ring-[#ff7652]/10" : ""}`}
      >
        <input ref={inputRef} type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={handleSelect} />
        {primaryFile ? (
          <div className="w-full max-w-[235px]">
            <div className="relative flex items-center gap-3 rounded-[10px] bg-[#f1f1f0] px-3 py-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] text-white ${isPdf ? "bg-[#f05e56]" : "bg-[#6f8eac]"}`}>
                {isPdf ? <FileText size={19} /> : <FileImage size={19} />}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-[#3e3e3b]">{primaryFile.name}</p>
                <p className="mt-1 text-[10px] text-[#92928e]">{(primaryFile.size / 1024 / 1024).toFixed(1)} MB <span className="px-1">•</span> Ready to process</p>
              </div>
              <button
                type="button"
                onClick={(event) => { event.stopPropagation(); removeFile(0); }}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#666663] text-white shadow-sm transition hover:bg-[#343432]"
                aria-label={`Remove ${label}`}
              >
                <X size={13} />
              </button>
            </div>
            {files.length > 1 && <p className="mt-2 text-center text-[10px] text-[#8e8e8b]">+ {files.length - 1} more file{files.length > 2 ? "s" : ""}</p>}
            <p className="mt-3 text-center text-[10px] font-medium text-[#858582]">Click to replace or add files</p>
          </div>
        ) : (
          <>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#8a8a86] shadow-sm ring-1 ring-[#e7e7e4]">
              {icon === "paper" ? <FileText size={19} strokeWidth={1.8} /> : <UploadCloud size={20} strokeWidth={1.8} />}
            </div>
            <p className="text-[13px] font-semibold text-[#555552]">{label}</p>
            <p className="mt-1 text-center text-[10px] leading-4 text-[#999995]">{description}</p>
            <p className="mt-3 text-[10px] font-medium text-[#8c8c88]">Drop your file here or click to browse</p>
          </>
        )}
      </div>
    </div>
  );
}
