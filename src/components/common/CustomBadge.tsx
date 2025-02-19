import { Chip } from '@mui/material';
import { ReactNode } from 'react';

interface CustomBadgeProps {
  content: ReactNode;
  background: string;
  color: string;
  size: "S" | "M" | "L";
}

function CustomBadge({ content, background, color, size }: CustomBadgeProps) {
    let fontSize;
    let padding;
    let width;
    let height;
  
    switch (size) {
      case "S":
        fontSize = "11px";
        width = "70px";
        height = "22px";
        break;
      case "M":
        fontSize = "12px";
        width = "90px";
        height = "24px";
        break;
      case "L":
        fontSize = "14px";
        width = "110px";
        height = "26px";
        break;
      default:
        fontSize = "12px";
        width = "90px";
        height = "24px";
    }

  return (
    <Chip 
      label={content} 
      sx={{
        background: background, 
        color: color, 
        borderRadius: "10px", 
        padding: padding,
        marginRight: "10px",
        fontWeight: "Bold", 
        fontSize: fontSize, 
        
        width: width,
        height: height
      }}
    />
  );
}

export default CustomBadge;