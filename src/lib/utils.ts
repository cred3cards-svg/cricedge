import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, symbol: string = 'DC') {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ` ${symbol}`;
}

export function formatPercentage(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * A safe method to copy text to the clipboard that includes a fallback for environments
 * where the modern Clipboard API is blocked by Permissions-Policy.
 * @param text The text to copy to the clipboard.
 * @returns {Promise<boolean>} A promise that resolves to true if successful, false otherwise.
 */
export async function copyTextSafe(text: string): Promise<boolean> {
  try {
    // Modern approach: Works only if clipboard-write is allowed.
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for restricted environments.
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
      ta.style.left = '-9999px';
      ta.setAttribute('readonly', ''); // Prevent mobile keyboards from popping up.
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (fallbackErr) {
      console.error("Fallback clipboard copy failed:", fallbackErr);
      return false;
    }
  }
}

    