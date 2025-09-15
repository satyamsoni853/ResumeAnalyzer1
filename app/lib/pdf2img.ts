export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

// Vite-friendly worker for PDF.js
// Import both a Worker constructor and a URL string; use constructor when possible.
// @ts-expect-error - Vite worker import
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker';
// @ts-expect-error - Vite url import
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    // Dynamically import the ESM entry so SSR doesn't choke.
    loadPromise = import("pdfjs-dist").then((lib) => {
        // Prefer WorkerPort (ensures type: 'module')
        try {
            // @ts-expect-error - constructor provided by Vite
            const workerInstance: Worker = typeof PdfWorker === 'function' ? new PdfWorker() : undefined as any;
            if (workerInstance) {
                // @ts-expect-error - pdfjs types are loose in ESM
                lib.GlobalWorkerOptions.workerPort = workerInstance;
            } else {
                // @ts-expect-error - pdfjs types are loose in ESM
                lib.GlobalWorkerOptions.workerSrc = workerUrl || "/pdf.worker.min.mjs";
            }
        } catch {
            // Fallback to URL
            // @ts-expect-error - pdfjs types are loose in ESM
            lib.GlobalWorkerOptions.workerSrc = workerUrl || "/pdf.worker.min.mjs";
        }
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    });

    return loadPromise;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        // Compute scale to limit output size and memory usage
        const baseViewport = page.getViewport({ scale: 1 });
        const maxWidth = 2000; // cap width for stability
        const scale = Math.max(1, Math.min(3, maxWidth / baseViewport.width));
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        if (context) {
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
        }

        if (!context) {
            throw new Error('Canvas context unavailable');
        }

        await page.render({ canvasContext: context, viewport }).promise;

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        // Create a File from the blob with the same name as the pdf
                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: "image/png",
                        });

                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    }
                },
                "image/png",
                1.0
            ); // Set quality to maximum (1.0)
        });
    } catch (err) {
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err instanceof Error ? err.message : String(err)}`,
        };
    }
}
