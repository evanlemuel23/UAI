
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DrawingCanvas from '@/components/DrawingCanvas';
import LatexResultModal from '@/components/LatexResultModal';
import LoadingOverlay from '@/components/LoadingOverlay';
import { analyzeImage } from '@/lib/api-service';
import { toast } from 'sonner';

interface Result {
  expr: string;
  result: any;
  assign?: boolean;
}

const Index = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleImageCapture = async (imageBase64: string) => {
    setIsLoading(true);
    
    try {
      // For this example, we'll use an empty variables dictionary
      const dictOfVars = {};
      
      const analyzedResults = await analyzeImage(imageBase64, dictOfVars);
      
      if (analyzedResults.length > 0) {
        setResults(analyzedResults);
        setIsModalOpen(true);
      } else {
        toast.error("No mathematical expressions detected. Try drawing more clearly.");
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error("Failed to analyze the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
          Ultimate AI
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Draw mathematical equations and get LaTeX results instantly
        </p>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Drawing Canvas</CardTitle>
            <CardDescription>
              Use the canvas below to draw your mathematical equations or expressions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DrawingCanvas
              width={800}
              height={400}
              onImageCapture={handleImageCapture}
            />
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-gray-600">
          <p>Draw your equation or mathematical expression, then click "Analyze" to get the LaTeX result</p>
        </div>
      </div>
      
      <LatexResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        results={results}
      />
      
      {isLoading && <LoadingOverlay />}
    </div>
  );
};

export default Index;
