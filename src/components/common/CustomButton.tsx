import React from "react";
import Button from "@mui/material/Button";
import { SxProps, Theme } from "@mui/material";

type CustomButtonStyling = "primary" | "secondary" | "destructive";
type CustomButtonSize = "s" | "m" | "l";

interface CustomButtonProps {
  styling: CustomButtonStyling; // button type (primary, secondary, destructive)
  inverse?: boolean; // whether to invert the button color or not
  disabled?: boolean; // whether to disable the button or not
  label: string; // button text
  size?: CustomButtonSize; // button size (s, m, l)
  width?: string;
  onClick?: () => void; // click event handler
}

const getButtonStyles = (
  styling: CustomButtonStyling = 'primary',
  inverse: boolean = false,
  size: CustomButtonSize = 'm'
): SxProps<Theme> => {
  const baseStyles = {
    primary: {
      backgroundColor: inverse ? "white" : "#3790cf",
      color: inverse ? "#3790cf" : "white",
      border: inverse ? "2px solid #3790cf" : "none",
      "&:hover": {
        backgroundColor: inverse ? "#ccebfb" : "#2d56c8",
        border: inverse ? "2px solid #3790cf" : "none",
      },
      "&.Mui-disabled": {
        backgroundColor: inverse ? "#f5f5f5" : "#a5c7e8",
        color: inverse ? "#a5c7e8" : "#f5f5f5",
        border: inverse ? "2px solid #a5c7e8" : "none",
      },
    },
    secondary: {
      backgroundColor: inverse ? "white" : "#b2b3b4",
      color: inverse ? "#424242" : "white",
      border: inverse ? "2px solid #424242" : "none",
      "&:hover": {
        backgroundColor: inverse ? "#d9d9d8" : "#424242",
        border: inverse ? "2px solid #424242" : "none",
      },
      "&.Mui-disabled": {
        backgroundColor: inverse ? "#f5f5f5" : "#e0e0e0",
        color: inverse ? "#e0e0e0" : "#f5f5f5",
        border: inverse ? "2px solid #e0e0e0" : "none",
      },
    },
    destructive: {
      backgroundColor: inverse ? "white" : "#f26e4a",
      color: inverse ? "#f26e4a" : "white",
      border: inverse ? "2px solid #f26e4a" : "none",
      "&:hover": {
        backgroundColor: inverse ? "#fcdad0" : "#fc4a1a",
        border: inverse ? "2px solid #fc4a1a" : "none",
      },
      "&.Mui-disabled": {
        backgroundColor: inverse ? "#f5f5f5" : "#ffccbc",
        color: inverse ? "#ffccbc" : "#f5f5f5",
        border: inverse ? "2px solid #ffccbc" : "none",
      },
    },
  };

  const sizeStyles = {
    s: {
      padding: "4px 8px",
      fontSize: "0.75rem",
    },
    m: {
      padding: "6px 12px",
      fontSize: "0.875rem",
    },
    l: {
      padding: "8px 16px",
      fontSize: "1rem",
    },
  };

  return {
    ...baseStyles[styling],
    ...sizeStyles[size]
  };
};

const CustomButton: React.FC<CustomButtonProps> = ({
  styling,
  inverse,
  disabled,
  label,
  size,
  width,
  ...props
}) => {
  return (
    <Button
      sx={{
        ...getButtonStyles(styling, inverse, size),
        textTransform: 'none',
        width: width,
      }}
      disabled={disabled}
      {...props}
    >
      {label}
    </Button>
  );
};

export default CustomButton;