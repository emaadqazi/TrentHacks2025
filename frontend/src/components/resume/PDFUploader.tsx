import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PDFUploaderProps {
  onParse: (blocks: any[]) => void;
  onFileSelect: (file: File | null) => void;
}

export function PDFUploader({ onParse, onFileSelect }: PDFUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0];
    if (pdfFile && pdfFile.type === 'application/pdf') {
      setFile(pdfFile);
      setError(null);
      onFileSelect(pdfFile);
      parsePDF(pdfFile);
    } else {
      setError('Please upload a valid PDF file');
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const parsePDF = async (pdfFile: File) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', pdfFile);

      // Call backend API
      console.log('Uploading PDF to backend...');
      const response = await fetch('http://localhost:5001/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      console.log('Backend response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (data.blocks && data.blocks.length > 0) {
        onParse(data.blocks);
      } else {
        // If parsing failed, use mock data as fallback
        const mockBlocks = [
          {
            id: 'job-1',
            company: 'Parsing Failed - Edit Manually',
            title: 'Job Title',
            location: 'Location',
            dateRange: 'Date Range',
            bullets: [
              {
                id: 'bullet-1-1',
                text: 'Could not automatically parse PDF. Please edit this manually.',
              },
            ],
          },
        ];
        onParse(mockBlocks);
        setError('PDF parsing incomplete. Please review and edit the blocks.');
      }

      setLoading(false);
    } catch (err) {
      // Fallback to mock data if backend is not available
      console.error('Backend error:', err);
      
      const mockBlocks = [
        {
          id: 'job-1',
          company: 'Backend Not Connected - Using Sample',
          title: 'Software Engineer',
          location: 'City, State',
          dateRange: 'Jan 2024 - Present',
          bullets: [
            {
              id: 'bullet-1-1',
              text: 'Backend server is not running. Start it with: cd backend && python api/main.py',
            },
            {
              id: 'bullet-1-2',
              text: 'These are sample blocks. Click to edit them manually.',
            },
          ],
        },
      ];
      
      onParse(mockBlocks);
      setError('Backend not available. Using sample data. To enable parsing, start the backend server.');
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card
              {...getRootProps()}
              className={`cursor-pointer border-4 border-dashed transition-all ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <CardContent className="p-12">
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {isDragActive ? 'Drop your resume here' : 'Upload Your Resume'}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Drag and drop your PDF resume, or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Select PDF File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {loading ? (
                      <div className="flex items-center gap-2 text-primary">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm font-medium">Parsing...</span>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={clearFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-2 border-destructive">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

