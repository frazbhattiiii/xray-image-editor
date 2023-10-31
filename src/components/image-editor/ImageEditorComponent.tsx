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
  Hand,
} from "lucide-react";
import { imagePathAtom } from "@/atom/atom";
import { useAtom } from "jotai";
import { Button } from "../ui/button";

interface Point {
  x: number;
  y: number;
  name?: string;
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
  const [points, setPoints] = useState<Point[]>([
     { x: 50, y: 50, name: 'Point 1' },
  { x: 150, y: 50, name: 'Point 2' },
  { x: 50, y: 150, name: 'Point 3' },
  { x: 150, y: 150, name: 'Point 4' }
  ]);
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
  const [draggingPoint, setDraggingPoint] = useState<Point | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [startLinePoint, setStartLinePoint] = useState<Point | null>(null);
  const isDraggingPoint = useRef<boolean>(false);
  const [, setIsDialogOpen] = useState<boolean>(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [imagePath] = useAtom(imagePathAtom);
  const [, setScaleX] = useState(1);
  const [, setScaleY] = useState(1);
  const [isHandToolActive, setIsHandToolActive] = useState<boolean>(false);

  const drawPoints = (ctx: CanvasRenderingContext2D, pointsToDraw: Point[]) => {
    ctx.fillStyle = "yellow";
    ctx.font = "18px Arial";

    pointsToDraw.forEach((point) => {
      // Draw the circle in yellow
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Draw the text in white
      ctx.fillStyle = "white";
      const pointName = pointNames[`${point.x}-${point.y}`];
      point.name = pointName;
      if (pointName) {
        ctx.fillText(pointName, point.x + 10, point.y - 10);
      }
    });
    ctx.fillStyle = "yellow";
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
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.drawImage(imageRef.current!, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawLines(ctx, lines);
    drawPoints(ctx, points);
  };

  const findClosePoint = (x: number, y: number): Point | null => {
    for (let point of points) {
      const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
      if (distance <= 10) {
        return point;
      }
    }
    return null;
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

  const enableDragging = () => {
    isDraggingPoint.current = true;
    isAddingPoint.current = false;
    isRemovingPoint.current = false;
    isDrawingLine.current = false;
    setShowPointNameInput(false);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log("Dragging point:", draggingPoint);
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const closePoint = findClosePoint(x, y);
    if (closePoint) {
      setDraggingPoint(closePoint);
    }

    if (isHandToolActive) {
      const closePoint = findClosePoint(x, y);
      if (closePoint) {
        setDraggingPoint(closePoint);
        return;
      }
    }

    if (isDraggingPoint.current && closePoint) {
      setDraggingPoint(closePoint);
    }

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
    // setDraggingPoint(null);
    if (isDraggingPoint.current && draggingPoint) {
      const oldKey = `${draggingPoint.x}-${draggingPoint.y}`;
      const newName = pointNames[oldKey];
      
      if (newName) {
        const newKey = `${draggingPoint.x}-${draggingPoint.y}`;
        setPointNames((prevPointNames) => {
          const updatedPointNames = { ...prevPointNames };
          delete updatedPointNames[oldKey];
          updatedPointNames[newKey] = newName;
          return updatedPointNames;
        });
      }
    }
    setLines((prevLines) => {
      return prevLines.map((line) => {
        if (!draggingPoint) return line; // Add this null check

        if (line.start.x === draggingPoint.x && line.start.y === draggingPoint.y) {
          return { ...line, start: { x: draggingPoint.x, y: draggingPoint.y } };
        }
        if (line.end.x === draggingPoint.x && line.end.y === draggingPoint.y) {
          return { ...line, end: { x: draggingPoint.x, y: draggingPoint.y } };
        }
        return line;
      });
    });
    setDraggingPoint(null);

    setDraggingPoint(null);
    if (isDrawingLine.current) {
      setIsDrawingLine(false);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (isHandToolActive && draggingPoint) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      setDraggingPoint({ x, y, name: draggingPoint.name });
    }

    if (draggingPoint) {
    const updatedPoints = points.map((point) => {
        if (point.x === draggingPoint.x && point.y === draggingPoint.y) {
            return { x, y, name: point.name }; // Include the name
        }
        return point;
    });

    const oldKey = `${draggingPoint.x}-${draggingPoint.y}`;
    const newKey = `${x}-${y}`;

    // Update pointNames with the new key
    setPointNames((prevPointNames) => {
        const updatedPointNames = { ...prevPointNames };
        const name = updatedPointNames[oldKey];
        delete updatedPointNames[oldKey];
        updatedPointNames[newKey] = name;
        return updatedPointNames;
    });

    setPoints(updatedPoints);
    setDraggingPoint({ x, y, name: draggingPoint.name }); // Include the name
}


    if (isDraggingPoint.current && draggingPoint) {
      setDraggingPoint({ x, y, name: draggingPoint.name });
      const updatedPoints = points.map((point) => {
        if (point.x === draggingPoint.x && point.y === draggingPoint.y) {
          return { x, y, name: point.name }; // Include the name
        }
        return point;
      });
      setPoints(updatedPoints);
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

  const handleHandToolClick = () => {
    isAddingPoint.current = false;
    isRemovingPoint.current = false;
    isDrawingLine.current = false;
    setIsHandToolActive(true);
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
            <TooltipTrigger onClick={handleHandToolClick}>
              <Hand className="h-8 w-8 p-2 text-gray-500 rounded-md bg-slate-200" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Drag points on the canvas</p>
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
        onMouseMove={handleCanvasMouseMove}
      />

      {showPointNameInput && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="bg-white w-1/4 p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-2">New Point</h2>
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
