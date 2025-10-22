import type { SVGProps } from "react";

export function CricketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="m13.23 13.23 7.07-7.07" />
      <path d="M5.21 5.21 2 2l1.41-1.41.71.71L8.5 5.67l4.24 4.24.71.71L22 18.33l-1.41 1.41-.71-.71-4.38-4.38-3.53-3.53-.71-.71-4.24-4.24Z" />
      <path d="M14.64 14.64 22 22" />
      <circle cx="6.5" cy="17.5" r="2.5" />
    </svg>
  );
}
