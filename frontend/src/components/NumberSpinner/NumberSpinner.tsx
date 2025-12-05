import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface NumberSpinnerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export const NumberSpinner: React.FC<NumberSpinnerProps> = ({
  value,
  onChange,
  min = 0,
  max = Infinity,
  label,
}) => {
  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {label && <Box mb={0.5}>{label}</Box>}
      <Box display="flex" alignItems="center">
        <Button size={"medium"} onClick={handleDecrement} variant="outlined">
          <RemoveIcon fontSize={"medium"} />
        </Button>
        <OutlinedInput
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          type="number"
          inputProps={{ min, max, style: { textAlign: 'center' } }}
          sx={{ width: 60, mx: 1 }}
        />
        <Button size={"medium"} onClick={handleIncrement} variant="outlined">
          <AddIcon fontSize={"medium"} />
        </Button>
      </Box>
    </Box>
  );
};
