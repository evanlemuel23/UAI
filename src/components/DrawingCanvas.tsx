
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Eraser, RefreshCcw, Play } from 'lucide-react';

interface DrawingCanvasProps {
  width: number;
  height: number;
  onImageCapture: (imageBase64: string) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ 
  width, 
  height, 
  onImageCapture 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [isEraser, setIsEraser] = useState(false);
  const [lineWidth, setLineWidth] = useState(3);

  const colors = [
    { value: '#000000', label: 'Black' },
    { value: '#1E40AF', label: 'Blue' },
    { value: '#047857', label: 'Green' },
    { value: '#B91C1C', label: 'Red' },
    { value: '#7E22CE', label: 'Purple' },
    { value: '#B45309', label: 'Orange' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    
    // Set canvas background to white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setContext(ctx);
  }, []);

  useEffect(() => {
    if (!context) return;
    
    context.strokeStyle = isEraser ? '#ffffff' : currentColor;
    context.lineWidth = isEraser ? 20 : lineWidth;
  }, [context, currentColor, isEraser, lineWidth]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context) return;
    
    setIsDrawing(true);
    
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault(); // Prevent scrolling when drawing
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    context.lineTo(x, y);
    context.stroke();
  };

  const endDrawing = () => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  const captureCanvas = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onImageCapture(dataUrl);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center gap-2 mb-4">
        <div className="color-picker">
          {colors.map((color) => (
            <button
              key={color.value}
              className={`color-option ${currentColor === color.value && !isEraser ? 'active' : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => {
                setCurrentColor(color.value);
                setIsEraser(false);
              }}
              title={color.label}
              aria-label={`Select ${color.label} color`}
            />
          ))}
        </div>
        <Button
          variant={isEraser ? "secondary" : "outline"}
          size="icon"
          onClick={toggleEraser}
          title="Eraser"
        >
          <Eraser className="h-5 w-5" />
        </Button>
        <Button
          variant={!isEraser ? "secondary" : "outline"}
          size="icon"
          onClick={() => setIsEraser(false)}
          title="Pencil"
        >
          <Pencil className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="drawing-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
      </div>
      
      <div className="flex justify-center gap-4 mt-4">
        <Button 
          variant="outline" 
          onClick={clearCanvas}
          className="flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button 
          onClick={captureCanvas}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          Analyze
        </Button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
