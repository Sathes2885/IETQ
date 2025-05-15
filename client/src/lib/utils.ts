import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj instanceof Date && !isNaN(dateObj.getTime())
      ? new Intl.DateTimeFormat('en-IN', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).format(dateObj)
      : '';
  } catch {
    return '';
  }
}

export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numAmount);
}

export function calculateProgress(current: number, total: number): number {
  if (total === 0) return 0;
  const progress = Math.floor((current / total) * 100);
  return progress > 100 ? 100 : progress;
}

export function getGradeLabel(grade: string): string {
  return `Grade ${grade}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export function isValidGrade(grade: string): boolean {
  const validGrades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  return validGrades.includes(grade);
}

export function getQuizTypeLabel(type: string): string {
  switch(type) {
    case 'anytime':
      return 'Take Anytime';
    case 'scheduled':
      return 'Scheduled';
    default:
      return type;
  }
}

export function getDurationLabel(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
}

export function getTimeRemaining(endDate: Date | string): string {
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  
  if (now > end) return 'Expired';
  
  const difference = end - now;
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours > 1 ? 's' : ''}`;
}
