import React from 'react';

interface StoreLogoProps {
  className?: string;
  customUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  inverted?: boolean;
}

export const StoreLogo: React.FC<StoreLogoProps> = ({
  className = 'w-10 h-10',
  customUrl,
  size = 'md',
  inverted = false
}) => {
  // If user uploaded a custom logo image, render it
  if (customUrl && customUrl.trim() && customUrl !== '/store-logo.svg') {
    return (
      <img
        src={customUrl}
        alt="شعار ذكرى للطباعة"
        className={`${className} object-contain rounded-xl`}
      />
    );
  }

  const strokeColor = inverted ? '#ffffff' : '#000000';
  const fillColor = inverted ? '#ffffff' : '#000000';

  return (
    <svg
      viewBox="0 0 500 500"
      className={`${className} shrink-0 select-none`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="شعار ذكرى للطباعة"
    >
      {/* Outer Broken Circle Arc */}
      <path
        d="M 195 385 A 160 160 0 1 1 305 385"
        fill="none"
        stroke={strokeColor}
        strokeWidth="15"
        strokeLinecap="round"
      />

      {/* Diamond Dot of Letter Dhal (ذ) */}
      <rect
        x="238"
        y="135"
        width="24"
        height="24"
        rx="3"
        transform="rotate(45 250 147)"
        fill={fillColor}
      />

      {/* Main Arabic Calligraphy Body of Letter Dhal (ذ) */}
      <path
        d="M 245 185 C 235 220, 205 270, 200 300 C 196 325, 212 342, 235 342 C 265 342, 296 318, 303 285 C 298 296, 280 324, 240 324 C 220 324, 214 314, 215 300 C 219 275, 246 225, 253 185 Z"
        fill={fillColor}
      />
      <path
        d="M 242 188 C 255 210, 280 245, 280 275 C 280 310, 245 330, 215 345 C 245 345, 275 335, 292 312 C 298 304, 302 292, 297 284 C 292 276, 280 278, 274 285 C 262 298, 246 312, 225 318 C 212 322, 205 312, 205 300 C 205 280, 222 245, 242 188 Z"
        fill={fillColor}
      />

      {/* Bottom Brand Dash & Text Line: — ذكرى للطباعة — */}
      <line x1="80" y1="430" x2="135" y2="430" stroke={strokeColor} strokeWidth="6" strokeLinecap="round" />
      <text
        x="250"
        y="438"
        textAnchor="middle"
        fontFamily="'Cairo', 'Tajawal', sans-serif"
        fontSize="34"
        fontWeight="900"
        fill={fillColor}
        letterSpacing="0.5"
      >
        ذكرى للطباعة
      </text>
      <line x1="365" y1="430" x2="420" y2="430" stroke={strokeColor} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
};
