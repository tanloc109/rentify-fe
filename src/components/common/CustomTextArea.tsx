import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

const CustomTextArea = ({
    maxChars = 200,
    placeholder = '',
    initialContent = '',
    externalError = false,
    onChange
}: {
    maxChars?: number;
    placeholder?: string;
    initialContent?: string;
    externalError?: boolean;
    onChange?: (value: string) => void;
}) => {
    const [value, setValue] = useState(initialContent);
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(externalError);
    }, [externalError]);

    useEffect(() => {
        setValue(initialContent);
    }, [initialContent]);

    const handleChange = (e: { target: { value: any; }; }) => {
        let newValue = e.target.value;

        if (newValue.length > maxChars) {
            newValue = newValue.slice(0, maxChars);
        }

        setValue(newValue);
        setError(newValue.length > maxChars);

        if (onChange) {
            onChange(newValue);  // Call the onChange prop when value changes
        }
    };

    return (
        <TextField
            multiline
            rows={4}
            variant="outlined"
            value={value}
            onChange={handleChange}
            fullWidth
            placeholder={placeholder}
            error={error}
            helperText={`${value.length}/${maxChars} characters`}
            sx={{
                borderRadius: "8px",
                '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                        borderColor: error ? '#fc4a1a' : '#c4c4c4',
                    },
                    '&:hover fieldset': {
                        borderColor: error ? '#fc4a1a' : '#8c8c8c',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: error ? '#fc4a1a' : '#3f51b5',
                    },
                },
            }}
        />
    );
};

export default CustomTextArea;
