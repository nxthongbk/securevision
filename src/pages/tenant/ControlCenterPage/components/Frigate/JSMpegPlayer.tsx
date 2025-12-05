import { useEffect, useRef, useState, useCallback } from 'react';

declare global {
  interface Window {
    JSMpeg: any;
    __JSMPEG_LOADER?: Promise<void>;
  }
}

interface JSMpegPlayerProps {
  url?: string;
}

function useJSMpegLoader() {
  return useCallback(() => {
    if (window.JSMpeg) return Promise.resolve();
    if (window.__JSMPEG_LOADER) return window.__JSMPEG_LOADER;

    window.__JSMPEG_LOADER = new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = '/libs/jsmpeg.min.js';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load jsmpeg.min.js'));
      document.head.appendChild(s);
    });
    return window.__JSMPEG_LOADER;
  }, []);
}

function useResizeCanvas(wrapperRef: React.RefObject<HTMLDivElement>, canvasRef: React.RefObject<HTMLCanvasElement>) {
  return useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapperRef.current;
    if (!canvas || !wrap) return;

    // const w = Math.max(1, Math.floor(wrap.clientWidth));
    // const h = Math.max(1, Math.floor(wrap.clientHeight));

    // if (canvas.width !== w || canvas.height !== h) {
    //   canvas.width = w;
    //   canvas.height = h;
    // }

    // canvas.style.objectFit = 'contain';
    // canvas.style.width = '100%';
    // canvas.style.height = '100%';
    // canvas.style.display = 'block';

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [wrapperRef, canvasRef]);
}

export default function JSMpegPlayer({ url }: JSMpegPlayerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadJSMpeg = useJSMpegLoader();
  const resizeCanvas = useResizeCanvas(wrapperRef, canvasRef);

  useEffect(() => {
    let mounted = true;
    let resizeObserver: ResizeObserver | null = null;
    let connectTimeout: number | undefined;

    function cleanupPlayer() {
      if (playerRef.current) {
        try {
          // remove any socket listeners
          const listeners = playerRef.current?.__listeners;
          if (listeners) {
            listeners.socket?.removeEventListener('open', listeners.onOpen);
            listeners.socket?.removeEventListener('error', listeners.onError);
            listeners.socket?.removeEventListener('close', listeners.onClose);
          }
          playerRef.current.destroy();
        } catch {
          // ignore
        }
        playerRef.current = null;
      }
    }

    async function init() {
      if (!url) return;

      setHasError(false);
      setLoading(true);

      if (!wrapperRef.current || !canvasRef.current) {
        setHasError(true);
        setLoading(false);
        return;
      }

      resizeCanvas();

      try {
        await loadJSMpeg();
      } catch (e) {
        console.error('Failed to load jsmpeg:', e);
        if (!mounted) return;
        setHasError(true);
        setLoading(false);
        return;
      }

      // Disable WebGL (forces Canvas renderer)
      try {
        if (window.JSMpeg?.Renderer) {
          window.JSMpeg.Renderer.WebGL = null;
        }
      } catch {
        // ignore
      }

      cleanupPlayer();

      try {
        const opts = {
          canvas: canvasRef.current,
          audio: false,
          autoplay: true,
          pauseWhenHidden: false,
          disableGl: true,
          disableWebGL: true,
          forceCanvas: true,
          onDecodeFrame: () => {
            if (mounted) {
              setLoading(false);
              setHasError(false);
            }
          }
        };

        playerRef.current = new window.JSMpeg.Player(url, opts);

        const socket = playerRef.current?.source?.socket;

        if (socket) {
          const onOpen = () => {
            if (!mounted) return;
            setLoading(false);
            setHasError(false);
            if (connectTimeout) {
              window.clearTimeout(connectTimeout);
              connectTimeout = undefined;
            }
          };

          const onError = () => {
            if (!mounted) return;
            setHasError(true);
            setLoading(false);
          };

          const onClose = () => {
            if (!mounted) return;
            setHasError(true);
            setLoading(false);
          };

          socket.addEventListener?.('open', onOpen);
          socket.addEventListener?.('error', onError);
          socket.addEventListener?.('close', onClose);

          playerRef.current.__listeners = { onOpen, onError, onClose, socket };
        }

        // Connection timeout
        connectTimeout = window.setTimeout(() => {
          if (mounted && loading) {
            // setHasError(true);
            setLoading(false);
          }
        }, 3000);
      } catch (e) {
        console.error('JSMpeg init error:', e);
        setHasError(true);
        setLoading(false);
      }
    }

    if (typeof ResizeObserver !== 'undefined' && wrapperRef.current) {
      resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(wrapperRef.current);
    } else {
      window.addEventListener('resize', resizeCanvas);
    }

    init();

    return () => {
      mounted = false;

      // remove listeners first
      // const listeners = playerRef.current?.__listeners;
      // if (listeners) {
      //   try {
      //     listeners.socket?.removeEventListener('open', listeners.onOpen);
      //     listeners.socket?.removeEventListener('error', listeners.onError);
      //     listeners.socket?.removeEventListener('close', listeners.onClose);
      //   } catch {}
      // }

      cleanupPlayer();

      if (resizeObserver && wrapperRef.current) {
        resizeObserver.unobserve(wrapperRef.current);
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', resizeCanvas);
      }

      if (connectTimeout) window.clearTimeout(connectTimeout);
    };
  }, [url, loadJSMpeg, resizeCanvas]);

  return (
    <div ref={wrapperRef} className='relative w-full h-full flex items-center justify-center overflow-hidden bg-black'>
      <canvas ref={canvasRef} className='absolute top-0 left-0 w-full h-full object-contain ' />

      {loading && !hasError && (
        <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
          <div className='w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin' />
        </div>
      )}

      {hasError && (
        <div className='absolute inset-0 flex items-center justify-center bg-black'>
          <span className='text-white text-lg font-semibold'>No Camera Available</span>
        </div>
      )}
    </div>
  );
}
