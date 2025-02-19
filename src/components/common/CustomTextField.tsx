import { TextField } from "@mui/material";
import React from "react";
import { warningFieldIcon } from "../../assets";

type CustomTextFieldProps = {
  id?: string;
  key?: React.Key | null | undefined;
  value?: string;
  name?: string | undefined; // identify in form or state management
  placeholder?: string;
  errorMessage?: string;
  type?: "text" | "email" | "password" | "number";
  minWidth?: string; // User-defined minimum width
  maxWidth?: string; // User-defined maximum width
  onValueChange?: (value: string) => void; // triggered whenever the value changes
  onKeyPress?: (e: React.KeyboardEvent) => void; // Optional onKeyPress handler
};

const colors = {
  helperText: "black",
  errorText: "#fd4a1a",
  errorBorder: "#fd4a1a",
};

const getHelperText = (errorMessage?: string) => {
  return (
    <span style={styles.helperTextContainer}>
      <img
        src={warningFieldIcon}
        alt="warning"
        style={styles.warningIcon}
      />
      {errorMessage}
    </span>
  );
};

const styles = {
  helperTextContainer: {
    display: "flex",
    alignItems: "center",
  },
  warningIcon: {
    width: "16px",
    height: "16px",
    marginRight: "8px",
    filter:
      "invert(16%) sepia(99%) saturate(7495%) hue-rotate(355deg) brightness(93%) contrast(110%)",
  },
};

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  id,
  key,
  placeholder,
  errorMessage,
  value,
  name,
  type,
  minWidth = "200px",
  maxWidth = "none",
  onValueChange,
  onKeyPress,
}: CustomTextFieldProps) => {
  const isError = !!errorMessage;

  return (
    <TextField
      id={id}
      key={key}
      name={name}
      error={isError}
      value={value}
      type={type}
      onKeyPress={onKeyPress}
      placeholder={placeholder || "Type here"}
      onChange={(data) => {
        if (onValueChange) onValueChange(data.target.value);
      }}
      helperText={errorMessage ? getHelperText(errorMessage) : " "}
      slotProps={{
        formHelperText: {
          color: isError ? colors.errorText : colors.helperText,
        },
      }}
      sx={{
        borderRadius: "8px",
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          height: "40px",
          "&.Mui-error": {
            borderColor: colors.errorBorder,
            "& fieldset": {
              borderColor: colors.errorBorder,
            },
          },
        },
        marginBottom: "12px",
        width: "100%",
        minWidth: minWidth, // Default minWidth
        maxWidth: maxWidth, // Default maxWidth
      }}
    />
  );
};

export default CustomTextField;
