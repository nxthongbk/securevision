import { useEffect, useRef } from 'react';

export function CameraCard({ title, wsUrl, isActive }: { title: string; wsUrl: string; isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (isActive && canvasRef.current && !playerRef.current) {
      const JSMpeg = (window as any).JSMpeg;
      playerRef.current = new JSMpeg.Player(wsUrl, {
        canvas: canvasRef.current,
        autoplay: true,
        audio: false,
        videoBufferSize: 1024 * 1024 * 4,
      });
    }

    // Cleanup: destroy player on unmount or inactive
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying JSMpeg player:', e);
        }
        playerRef.current = null;
      }
    };
  }, [isActive, wsUrl]);

  return (
    <div className="bg-[#0a0f1d] rounded-xl border border-[#36BFFA]/20 shadow-lg flex flex-col overflow-hidden">
      <div className="p-3 text-sm font-semibold text-gray-200">{title}</div>
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
    </div>
  );
}
