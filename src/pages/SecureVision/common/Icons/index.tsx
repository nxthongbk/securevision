import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  width?: number;
  height?: number;
}

// Base SVG component with common properties
const BaseSVG: React.FC<{
  children: React.ReactNode;
  className?: string;
  size?: number;
  width?: number;
  height?: number;
  fill?: string;
}> = ({ children, className = 'w-6 h-6', size, width, height, fill = 'none' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width || size || 24}
    height={height || size || 24}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export const Icons = {
  // Security Features Icons
  Camera: ({ className, size, width, height }: IconProps) => (
    <BaseSVG className={className} size={size} width={width} height={height}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </BaseSVG>
  ),

  SensorNetwork: ({ className, size, width, height }: IconProps) => (
    <BaseSVG className={className} size={size} width={width} height={height}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </BaseSVG>
  ),

  Brain: ({ className, size, width, height }: IconProps) => (
    <BaseSVG className={className} size={size} width={width} height={height}>
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </BaseSVG>
  ),

  Smartphone: ({ className, size, width, height }: IconProps) => (
    <BaseSVG className={className} size={size} width={width} height={height}>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </BaseSVG>
  ),

  Bell: ({ className, size, width, height }: IconProps) => (
    <BaseSVG className={className} size={size} width={width} height={height}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </BaseSVG>
  ),

  Lock: ({ className, size, width, height }: IconProps) => (
    <BaseSVG className={className} size={size} width={width} height={height}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </BaseSVG>
  ),

  // Navigation Icons
  Shield: ({ className, size, width, height }: IconProps) => (
    <BaseSVG className={className} size={size} width={width} height={height}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </BaseSVG>
  ),

  Zap: ({ className, size, width, height }: IconProps) => (
    <BaseSVG className={className} size={size} width={width} height={height}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </BaseSVG>
  ),

  Play: ({ className, size, width, height }: IconProps) => (
    <BaseSVG className={className} size={size} width={width} height={height}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </BaseSVG>
  ),

  Eye: ({ className, size, width, height }: IconProps) => (
    <BaseSVG className={className} size={size} width={width} height={height}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </BaseSVG>
  ),

  // UI Icons
  CheckCircle: ({ className, size, width, height }: IconProps) => (
    <BaseSVG className={className} size={size} width={width} height={height}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </BaseSVG>
  ),

  ArrowRight: ({ className, size, width, height }: IconProps) => (
    <BaseSVG className={className} size={size} width={width} height={height}>
      <path d="M9 5l7 7-7 7" />
    </BaseSVG>
  ),

  Award: ({ className, size, width, height }: IconProps) => (
    <BaseSVG className={className} size={size} width={width} height={height}>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </BaseSVG>
  ),

  Star: ({ className, size, width, height }: IconProps) => (
    <BaseSVG className={className} size={size} width={width} height={height} fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 0 0 .95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 0 0-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 0 0-1.176 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 0 0-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 0 0 .95-.69l1.286-3.967Z" />
    </BaseSVG>
  ),

	Quotes: ({ className, size, width, height }: IconProps) => (
		<BaseSVG className={className} size={size} width={width} height={height}>
		<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
		<path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
		</BaseSVG>
	),

	PaperPlaneTilt: ({ className, size, width, height }: IconProps) => (
		<BaseSVG className={className} size={size} width={width} height={height}>
			<path d="M2 12l18-6-6 18-6-6-6 6z" />
		</BaseSVG>
	),

  ShieldCheck: ({ className, size, width, height }: IconProps) => (
    <BaseSVG className={className} size={size} width={width} height={height}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </BaseSVG>
  ),
} as const;

export default Icons;
