// import { useEffect, useRef } from "react";
// import Hls from "hls.js";

// interface HLSPlayerProps {
//     src: string;
//     autoPlay?: boolean;
//     controls?: boolean;
//     width?: string;
//     height?: string;
// }

// const HLSPlayer = ({
//     src,
//     autoPlay = true,
//     controls = true,
//     width = "100%",
//     height = "100%",
// }: HLSPlayerProps) => {
//     const videoRef = useRef<HTMLVideoElement>(null);

//     useEffect(() => {
//         const video = videoRef.current;

//         if (!video) return;

//         if (Hls.isSupported()) {
//             const hls = new Hls();
//             hls.loadSource(src);
//             hls.attachMedia(video);

//             hls.on(Hls.Events.MANIFEST_PARSED, () => {
//                 if (autoPlay) {
//                     video.muted = true; // Required for autoplay in some browsers
//                     video.play().catch((err) => {
//                         console.warn("Autoplay failed:", err);
//                     });
//                 }
//             });

//             return () => {
//                 hls.destroy();
//             };
//         } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
//             video.src = src;
//             video.muted = true;
//             if (autoPlay) {
//                 video.play().catch((err) => {
//                     console.warn("Autoplay failed:", err);
//                 });
//             }
//         }
//     }, [src, autoPlay]);

//     return (
//         <video
//             ref={videoRef}
//             controls={controls}
//             style={{ width, height, backgroundColor: "#000" }}
//         />
//     );
// };

// export default HLSPlayer;


import { useRef, useEffect } from 'react';
import Hls from 'hls.js';

const HLSPlayer = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }
  }, [src]);

  return (
    <div>
      <video ref={videoRef} controls style={{ width: '100%', maxWidth: '800px' }} />
    </div>
  );
};

export default HLSPlayer;

