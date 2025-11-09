import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Printer, 
  Maximize2,
  Minimize2,
  Eye,
  FileText,
  RotateCw,
} from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface PDFViewerProps {
  file: File | null;
  onDownload?: () => void;
  className?: string;
}

type ZoomMode = 'auto' | 'fit' | 'width' | 'custom';

export function PDFViewer({ file, onDownload, className }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [zoomMode, setZoomMode] = useState<ZoomMode>('auto');
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [rotation, setRotation] = useState<number>(0);

  // Convert File to URL for react-pdf
  useEffect(() => {
    if (file) {
      setLoading(true);
      setError(null);
      setPageNumber(1);
      setScale(1.0);
      setZoomMode('auto');
      
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      
      // Cleanup URL when component unmounts or file changes
      return () => {
        URL.revokeObjectURL(url);
        setFileUrl(null);
      };
    } else {
      setFileUrl(null);
      setLoading(false);
    }
  }, [file]);

  // Measure container width for auto-fit
  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById('pdf-container');
      if (container) {
        setContainerWidth(container.offsetWidth - 100); // Account for padding
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Calculate auto scale based on container width
  useEffect(() => {
    if (zoomMode === 'auto' && containerWidth > 0 && numPages > 0) {
      // Fit to width (approximately A4 width is 595 points at 72 DPI)
      const autoScale = containerWidth / 595;
      setScale(Math.min(autoScale, 2.0));
    } else if (zoomMode === 'fit' && containerWidth > 0) {
      // Fit to page height
      const autoScale = (containerWidth * 0.75) / 595; // Approximate A4 ratio
      setScale(Math.min(autoScale, 2.0));
    } else if (zoomMode === 'width') {
      const autoScale = containerWidth / 595;
      setScale(Math.min(autoScale, 2.0));
    }
  }, [zoomMode, containerWidth, numPages]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
    setLoading(false);
    setPageNumber(1);
  }

  function onDocumentLoadError(error: Error) {
    console.error('PDF load error:', error);
    setError(`Failed to load PDF: ${error.message}`);
    setLoading(false);
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setZoomMode('custom');
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setZoomMode('custom');
    setScale((prev) => Math.max(prev - 0.25, 0.25));
  };

  const handleZoomChange = (mode: ZoomMode) => {
    setZoomMode(mode);
    if (mode === 'custom') {
      setScale(1.0);
    }
  };

  const handleDownload = () => {
    if (file && onDownload) {
      onDownload();
    } else if (file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handlePrint = () => {
    if (fileUrl) {
      const printWindow = window.open(fileUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      const element = document.getElementById('pdf-viewer-fullscreen');
      if (element?.requestFullscreen) {
        element.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Handle fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!file) {
    return (
      <div className={`flex h-full items-center justify-center rounded-lg border-2 border-[#8B6F47]/30 bg-[#221410]/90 ${className || ''}`}>
        <div className="text-center">
          <FileText className="mx-auto h-16 w-16 text-[#8B6F47]/50 mb-4" />
          <p className="text-[#C9B896]">No PDF uploaded</p>
          <p className="text-sm text-[#8B6F47] mt-2">Upload a resume to view it here</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="pdf-viewer-fullscreen"
      className={`flex flex-col h-full bg-[#1a0f08] rounded-lg border-2 border-[#8B6F47]/30 overflow-hidden ${className || ''}`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-[#8B6F47]/30 bg-[#221410]/90">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#1a0f08] border border-[#8B6F47]/20">
            <Eye className="h-4 w-4 text-[#8B6F47]" />
            <span className="text-xs text-[#C9B896] ml-1">View Resume</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#1a0f08] border border-[#8B6F47]/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomOut}
              disabled={scale <= 0.25}
              className="h-7 w-7 p-0 text-[#C9B896] hover:text-[#F5F1E8] hover:bg-[#3a5f24]/20"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <select
              value={zoomMode}
              onChange={(e) => handleZoomChange(e.target.value as ZoomMode)}
              className="bg-[#1a0f08] text-[#F5F1E8] text-xs px-2 py-1 border border-[#8B6F47]/20 rounded focus:outline-none focus:border-[#8B6F47]/50"
            >
              <option value="auto">Automatic Zoom</option>
              <option value="fit">Fit to Page</option>
              <option value="width">Fit to Width</option>
              <option value="custom">Custom: {Math.round(scale * 100)}%</option>
            </select>
            
            {zoomMode === 'custom' && (
              <span className="text-xs text-[#C9B896] px-1">{Math.round(scale * 100)}%</span>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomIn}
              disabled={scale >= 3.0}
              className="h-7 w-7 p-0 text-[#C9B896] hover:text-[#F5F1E8] hover:bg-[#3a5f24]/20"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Page Navigation */}
          {numPages > 1 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#1a0f08] border border-[#8B6F47]/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                className="h-7 w-7 p-0 text-[#C9B896] hover:text-[#F5F1E8] hover:bg-[#3a5f24]/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <input
                type="number"
                min="1"
                max={numPages}
                value={pageNumber}
                onChange={(e) => {
                  const page = parseInt(e.target.value) || 1;
                  setPageNumber(Math.max(1, Math.min(page, numPages)));
                }}
                className="w-12 text-center text-xs bg-[#1a0f08] text-[#F5F1E8] border border-[#8B6F47]/20 rounded px-1 py-1 focus:outline-none focus:border-[#8B6F47]/50"
              />
              
              <span className="text-xs text-[#C9B896]">of {numPages}</span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                className="h-7 w-7 p-0 text-[#C9B896] hover:text-[#F5F1E8] hover:bg-[#3a5f24]/20"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={rotate}
              className="h-7 w-7 p-0 text-[#C9B896] hover:text-[#F5F1E8] hover:bg-[#3a5f24]/20"
              title="Rotate"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-7 w-7 p-0 text-[#C9B896] hover:text-[#F5F1E8] hover:bg-[#3a5f24]/20"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrint}
              className="h-7 w-7 p-0 text-[#C9B896] hover:text-[#F5F1E8] hover:bg-[#3a5f24]/20"
              title="Print"
            >
              <Printer className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="h-7 w-7 p-0 text-[#C9B896] hover:text-[#F5F1E8] hover:bg-[#3a5f24]/20"
              title="Fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Display Area */}
      <div 
        id="pdf-container"
        className="flex-1 overflow-auto bg-[#2a1f18] p-4 flex justify-center"
      >
        {loading && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B6F47] mx-auto mb-4"></div>
              <p className="text-[#C9B896]">Loading PDF...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-red-400 font-medium mb-2">Failed to load PDF</p>
              <p className="text-sm text-[#C9B896]">{error}</p>
            </div>
          </div>
        )}

        {fileUrl && (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B6F47] mx-auto mb-4"></div>
                  <p className="text-[#C9B896]">Loading PDF...</p>
                </div>
              </div>
            }
            error={
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-400 font-medium mb-2">Failed to load PDF</p>
                  {error && <p className="text-sm text-[#C9B896]">{error}</p>}
                </div>
              </div>
            }
          >
            {numPages > 0 && (
              <div className="bg-white shadow-2xl" style={{ transform: `rotate(${rotation}deg)` }}>
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  loading={
                    <div className="flex h-96 w-full items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B6F47]"></div>
                    </div>
                  }
                />
              </div>
            )}
          </Document>
        )}
      </div>
    </div>
  );
}

