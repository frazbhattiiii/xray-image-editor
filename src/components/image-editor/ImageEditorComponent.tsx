import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Minus,
  ArrowDownToLine,
  PencilLine,
  Sun,
  Contrast,
} from "lucide-react";
import { imagePathAtom } from "@/atom/atom";
import { useAtom } from "jotai";
import { Button } from "../ui/button";
interface Point {
  x: number;
  y: number;
}

interface PointNames {
  [key: string]: string;
}
interface Line {
  start: Point;
  end: Point;
}
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

function ImageEditorComponent() {
  const [points, setPoints] = useState<Point[]>([]);
  const [, setIsDrawingLine] = useState<boolean>(false);
  const [lines, setLines] = useState<Line[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const isAddingPoint = useRef<boolean>(false);
  const isRemovingPoint = useRef<boolean>(false);
  const isRenamingPoint = useRef<boolean>(false); // Add a flag for renaming
  const isDrawingLine = useRef<boolean>(false);
  const [pointNames, setPointNames] = useState<PointNames>({});
  const [pointNameInput, setPointNameInput] = useState<string>("");
  const [showPointNameInput, setShowPointNameInput] = useState<boolean>(false);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [startLinePoint, setStartLinePoint] = useState<Point | null>(null);
  const [, setIsDialogOpen] = useState<boolean>(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [imagePath, ] = useAtom(imagePathAtom);
  const [, setScaleX] = useState(1);
  const [, setScaleY] = useState(1);

  const drawPoints = (ctx: CanvasRenderingContext2D, pointsToDraw: Point[]) => {
    ctx.fillStyle = "yellow";
    ctx.font = "18px Arial";

    pointsToDraw.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "white";
      const pointName = pointNames[`${point.x}-${point.y}`];
      if (pointName) {
        ctx.fillText(pointName, point.x + 10, point.y - 10);
      }
      ctx.fillStyle = "yellow";
    });
  };

  const drawLines = (ctx: CanvasRenderingContext2D, linesToDraw: Line[]) => {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    linesToDraw.forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.stroke();
    });
  };

  const drawAll = (ctx: CanvasRenderingContext2D) => {
    // Clear the canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Draw the scaled image
    ctx.drawImage(imageRef.current!, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Draw the lines
    drawLines(ctx, lines);
    // Draw the points
    drawPoints(ctx, points);
  };

  const handleIncreaseBrightness = () => {
    // Increase brightness (e.g., by 10%)
    setBrightness(brightness + 10);
  };
  const handleDecreaseBrightness = () => {
    // Increase brightness (e.g., by 10%)
    setBrightness(brightness - 10);
  };

  const handleIncreaseContrast = () => {
    // Increase contrast (e.g., by 10%)
    setContrast(contrast + 10);
  };
  const handleDecreaseContrast = () => {
    // Increase contrast (e.g., by 10%)
    setContrast(contrast - 10);
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    const image = imageRef.current;

    if (ctx && image) {
      // Load the image onto the canvas when the component mounts
      image.onload = () => {
        // Calculate the scaling factors
        setScaleX(CANVAS_WIDTH / image.width);
        setScaleY(CANVAS_HEIGHT / image.height);

        // Set canvas dimensions
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        // Draw the image scaled to fit the canvas
        ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      };
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      drawAll(ctx);
    }
  }, [points, lines]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      // Apply brightness and contrast adjustments here
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

      // Clear and redraw the image with adjustments
      drawAll(ctx);
    }
  }, [brightness, contrast]);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawingLine.current) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;

      if (!startLinePoint) {
        setStartLinePoint({ x, y });
      } else {
        // When drawing lines, add the line to the lines array with start and end points
        setLines([...lines, { start: startLinePoint, end: { x, y } }]);
        setStartLinePoint(null);
      }
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDrawingLine.current) {
      setIsDrawingLine(false);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (isAddingPoint.current) {
      setSelectedPoint({ x, y });
      setShowPointNameInput(true);
    } else if (isRemovingPoint.current) {
      // Remove a point if it's close to the clicked position
      const updatedPoints = points.filter((point) => {
        const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
        return distance > 10;
      });
      setPoints(updatedPoints);
      delete pointNames[`${x}-${y}`];
      setPointNames({ ...pointNames });
    }
  };

  const handlePointNameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPointNameInput(e.target.value);
  };

  const handlePointNameInputConfirm = () => {
    if (selectedPoint && pointNameInput.trim() !== "") {
      if (pointNames[`${selectedPoint.x}-${selectedPoint.y}`]) {
        // If the point already has a name, update it
        setPointNames({
          ...pointNames,
          [`${selectedPoint.x}-${selectedPoint.y}`]: pointNameInput,
        });
      } else {
        // Otherwise, add a new point with a name
        setPoints([...points, selectedPoint]);
        setPointNames({
          ...pointNames,
          [`${selectedPoint.x}-${selectedPoint.y}`]: pointNameInput,
        });
      }
    }
    setShowPointNameInput(false);
    setSelectedPoint(null);
    setPointNameInput("");
  };

  const handleAddPointClick = () => {
    isAddingPoint.current = true;
    isRemovingPoint.current = false;
    isRenamingPoint.current = false; // Reset renaming flag
    isDrawingLine.current = false;
    openDialog();
    setShowPointNameInput(false);
  };

  const handleRemovePointClick = () => {
    isAddingPoint.current = false;
    isRemovingPoint.current = true;
    isRenamingPoint.current = false; // Reset renaming flag
    isDrawingLine.current = false;
    setShowPointNameInput(false);
  };

  const handleSaveImageClick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "edited_image.png";
    link.click();
  };

  const handleDrawLineClick = () => {
    isAddingPoint.current = false;
    isRemovingPoint.current = false;
    isDrawingLine.current = true;
    setShowPointNameInput(false);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };
  console.log(imagePath);

  return (
    <div className="">
      <div className="flex gap-4 mb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger onClick={handleAddPointClick}>
              <Plus className="h-8 w-8 p-2 text-gray-500 rounded-md bg-slate-200" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Point to Canvas</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger onClick={handleRemovePointClick}>
              <Minus className="h-8 w-8 p-2 text-gray-500 rounded-md bg-slate-200" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove Point from the Canvas</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger onClick={handleSaveImageClick}>
              <ArrowDownToLine className="h-8 w-8 p-2 text-gray-500 rounded-md bg-slate-200" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Download Image</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger onClick={handleDrawLineClick}>
              <PencilLine className="h-8 w-8 p-2 text-gray-500 rounded-md bg-slate-200" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Draw a Line on the Canvas</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Sun className="h-8 w-8 p-2 text-gray-500 rounded-md bg-slate-200" />
            </TooltipTrigger>
            <TooltipContent className="flex flex-col gap-2">
              <p className="text-gray-600 text-sm font-medium text-center">
                {" "}
                Brightness{" "}
              </p>
              <div className="flex gap-4">
                <Plus
                  className="h-8 w-8 p-2 text-gray-500 rounded-md bg-slate-200 cursor-pointer"
                  onClick={handleIncreaseBrightness}
                />
                <Minus
                  className="h-8 w-8 p-2 text-gray-500 rounded-md bg-slate-200 cursor-pointer"
                  onClick={handleDecreaseBrightness}
                />
              </div>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Contrast className="h-8 w-8 p-2 text-gray-500 rounded-md bg-slate-200" />
            </TooltipTrigger>
            <TooltipContent className="flex flex-col gap-2">
              <p className="text-gray-600 text-sm font-medium text-center">
                {" "}
                Contrast{" "}
              </p>
              <div className="flex gap-4">
                <Plus
                  className="h-8 w-8 p-2 text-gray-500 rounded-md bg-slate-200 cursor-pointer"
                  onClick={handleIncreaseContrast}
                />
                <Minus
                  className="h-8 w-8 p-2 text-gray-500 rounded-md bg-slate-200 cursor-pointer"
                  onClick={handleDecreaseContrast}
                />
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <img ref={imageRef} src={imagePath} alt="Image" className="hidden" />
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseDown={handleCanvasMouseDown}
        onMouseUp={handleCanvasMouseUp}
      />

      {showPointNameInput && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="bg-white w-1/4 p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Rename Point</h2>
            <input
              type="text"
              value={pointNameInput}
              onChange={handlePointNameInputChange}
              placeholder="Enter a new name for the point"
              className="border p-2 mb-2 w-full"
            />
            <div className="text-right">
              <Button
                onClick={handlePointNameInputConfirm}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg mr-2"
              >
                Confirm
              </Button>
              <Button
                onClick={() => setShowPointNameInput(false)}
                className="px-4 py-2 bg-[#722f99] hover:bg-[#60178a] text-white rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageEditorComponent;
