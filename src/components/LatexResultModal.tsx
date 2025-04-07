
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface Result {
  expr: string;
  result: any;
  assign?: boolean;
}

interface LatexResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: Result[];
}

const LatexResultModal: React.FC<LatexResultModalProps> = ({
  isOpen,
  onClose,
  results
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard!");
      });
  };

  if (!results.length) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>No Results</DialogTitle>
            <DialogDescription>
              No mathematical expressions were detected. Try drawing more clearly.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>LaTeX Results</DialogTitle>
          <DialogDescription>
            Here's the LaTeX representation of your mathematical expression.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {results.map((result, index) => (
            <div key={index} className="bg-secondary p-4 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Expression:</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(result.expr)}
                  className="h-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="mb-4 bg-background p-2 rounded border overflow-x-auto">
                <code className="text-sm">{result.expr}</code>
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Result:</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(String(result.result))}
                  className="h-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-background p-2 rounded border overflow-x-auto">
                <code className="text-sm">{String(result.result)}</code>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LatexResultModal;
