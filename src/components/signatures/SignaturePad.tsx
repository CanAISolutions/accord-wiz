import { useEffect, useRef, useState } from "react";

interface SignaturePadProps {
  width?: number;
  height?: number;
  onChange?: (dataUrl: string | null) => void;
}

export default function SignaturePad({ width = 500, height = 160, onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111827";
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e && e.touches[0]) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    const me = e as React.MouseEvent;
    return { x: me.clientX - rect.left, y: me.clientY - rect.top };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = () => {
    setIsDrawing(false);
    if (onChange) onChange(canvasRef.current?.toDataURL("image/png") || null);
  };

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (onChange) onChange(null);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ border: "1px solid #e5e7eb", borderRadius: 6, touchAction: "none", backgroundColor: "#fff" }}
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={end}
      />
      <div style={{ marginTop: 8 }}>
        <button type="button" onClick={clear} className="text-sm underline">Clear</button>
      </div>
    </div>
  );
}

