import { useEffect, useRef } from 'react';

export function useJSMpegPlayer(wsUrl: string, isActive: boolean) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const JSMpeg = (window as any).JSMpeg;
    if (!JSMpeg || !JSMpeg.Player) {
      console.error('❌ JSMpeg not loaded! Check if script tag is added in index.html.');
      return;
    }

    const player = new JSMpeg.Player(wsUrl, {
      canvas: canvasRef.current,
      autoplay: true,
      audio: false,
    });

    playerRef.current = player;

    return () => {
      try {
        if (playerRef.current?.destroy) playerRef.current.destroy();
      } catch (err) {
        console.warn('[useJSMpegPlayer] Cleanup error:', err);
      }
      playerRef.current = null;
    };
  }, [isActive, wsUrl]);

  return canvasRef;
}
