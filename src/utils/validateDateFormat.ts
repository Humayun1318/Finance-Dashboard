import { MONTHS } from "@/constants/month";

// Validate date format: "Apr 30, 2026"
  export const validateDateFormat = (dateStr: string): boolean => {
    const dateRegex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{1,2}),\s(\d{4})$/;
    
    if (!dateRegex.test(dateStr)) {
      return false;
    }
    
    const parts = dateStr.match(dateRegex);
    if (!parts) return false;

    console.log("Parsed date parts:", parts);
    
    const month = parts[1];
    const day = parseInt(parts[2], 10);
    const year = parseInt(parts[3], 10);
    
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;
    if (!MONTHS.includes(month)) return false;
    
    return true;
  };