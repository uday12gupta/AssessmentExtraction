import type { PageImage } from "@/types";

const MAX_DIMENSION = 1600;

function stripBase64Prefix(dataUrl: string): string {
  const idx = dataUrl.indexOf(",");
  return idx >= 0 ? dataUrl.substring(idx + 1) : dataUrl;
}

function getMimeType(dataUrl: string): string {
  const match = dataUrl.match(/^data:([^;]+);/);
  return match ? match[1] : "image/png";
}

function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function getImageDimensions(
  dataUrl: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = dataUrl;
  });
}

async function resizeImage(
  dataUrl: string,
  maxDim: number,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const { width: origW, height: origH } = await getImageDimensions(dataUrl);
  if (origW === 0 || origH === 0) {
    return { dataUrl, width: origW, height: origH };
  }
  const scale = Math.min(1, maxDim / Math.max(origW, origH));
  if (scale >= 1) {
    return { dataUrl, width: origW, height: origH };
  }
  const newW = Math.round(origW * scale);
  const newH = Math.round(origH * scale);
  const canvas = document.createElement("canvas");
  canvas.width = newW;
  canvas.height = newH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { dataUrl, width: origW, height: origH };
  const img = await loadImage(dataUrl);
  ctx.drawImage(img, 0, 0, newW, newH);
  return { dataUrl: canvas.toDataURL("image/jpeg", 0.85), width: newW, height: newH };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function pdfToImages(file: File): Promise<PageImage[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjs = await import("pdfjs-dist");
  const workerSrc = (
    await import("pdfjs-dist/build/pdf.worker.mjs?url")
  ).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const pages: PageImage[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: ctx, viewport, canvas } as unknown as Parameters<typeof page.render>[0]).promise;
    const fullDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const { dataUrl, width, height } = await resizeImage(fullDataUrl, MAX_DIMENSION);
    pages.push({
      page: i,
      dataUrl,
      base64: stripBase64Prefix(dataUrl),
      mimeType: getMimeType(dataUrl),
      width,
      height,
    });
  }
  return pages;
}

async function imageFileToPageImage(
  file: File,
  pageNumber: number,
): Promise<PageImage> {
  const rawDataUrl = await fileToDataUrl(file);
  const { dataUrl, width, height } = await resizeImage(rawDataUrl, MAX_DIMENSION);
  return {
    page: pageNumber,
    dataUrl,
    base64: stripBase64Prefix(dataUrl),
    mimeType: getMimeType(dataUrl),
    width,
    height,
  };
}

export async function fileToPages(file: File): Promise<PageImage[]> {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (isPdf) {
    return pdfToImages(file);
  }
  return [await imageFileToPageImage(file, 1)];
}

export async function filesToPages(
  files: File[],
  onProgress?: (current: number, total: number) => void,
): Promise<PageImage[]> {
  const allPages: PageImage[] = [];
  let pageNum = 1;
  for (let i = 0; i < files.length; i++) {
    onProgress?.(i + 1, files.length);
    const pages = await fileToPages(files[i]);
    for (const p of pages) {
      p.page = pageNum++;
      allPages.push(p);
    }
  }
  return allPages;
}
