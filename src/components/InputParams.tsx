import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { CoffeeParam, RoastLevelType, TranslationType } from '../types';

interface InputParamsValues {
  beansAmount: number;
  waterRatio: number;
  roastLevel: RoastLevelType;
  flavor: string;
  strength: string;
}

interface InputParamsProps {
  params: CoffeeParam[];
  values: InputParamsValues;
  onChange: (key: string, value: number | string) => void;
  t: TranslationType;
}

const NumberInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  unit?: string;
}> = ({ value, onChange, unit }) => {
  return (
    <>
      <Button
        variant="outlined"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        size="small"
        sx={{ minWidth: '30px', padding: '5px' }}
      >
        <RemoveIcon fontSize="small" />
      </Button>
      <span style={{ margin: '0 8px' }}>
        {value}
        {unit || ''}
      </span>
      <Button
        variant="outlined"
        onClick={() => onChange(value + 1)}
        size="small"
        sx={{ minWidth: '30px', padding: '5px' }}
      >
        <AddIcon fontSize="small" />
      </Button>
    </>
  );
};

const EnumInput: React.FC<{
  value: string;
  options: string[];
  onChange: (value: string) => void;
  t: TranslationType;
}> = ({ value, options, onChange, t }) => {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_e, newValue) => { if (newValue) onChange(newValue); }}
      size="small"
      sx={{ '& .MuiToggleButton-root': { fontSize: '1.0rem' } }}
    >
      {options.map((option) => (
        <ToggleButton key={option} value={option}>
          {String(t[option as keyof TranslationType])}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

const waterAmountFormula = (beansAmount: number, waterRatio: number) =>  Math.floor(Math.round(beansAmount * waterRatio));

const waterTempFormula = (temps: Record<RoastLevelType, number>, roastLevel: RoastLevelType): number => temps[roastLevel];

const calcFormula = (formulaType: string, beansAmount: number, waterRatio: number, roastLevel: RoastLevelType, temps?: Record<RoastLevelType, number>) => {
  if (formulaType === 'waterAmount') {
    return waterAmountFormula(beansAmount, waterRatio);
  }
  if (formulaType === 'waterTemp' && temps) {
    return waterTempFormula(temps, roastLevel);
  }
  return null;
}

const InputParams: React.FC<InputParamsProps> = ({
  params,
  values,
  onChange,
  t,
}) => {
  return (
    <Table sx={{
      '& td, & th': { fontSize: '1.1rem' },
      '& .MuiTableCell-root': {
        borderBottom: 'none',
        padding: '10px 16px',
      },
      mb: 2,
    }}>
      <TableBody>
        {params.map((param) => {
          if (!param.input) {
            return (
              <TableRow key={param.key}>
                <TableCell align="right">
                  {String(t[param.key])}:
                </TableCell>
                <TableCell align="left">
                  {param.formulaType ? calcFormula(param.formulaType, values.beansAmount, values.waterRatio, values.roastLevel, param.temps) : param.default}
                  {param.unit || ''}
                </TableCell>
              </TableRow>
            );
          }
          if (param.input && param.type === 'number') {
            return (
              <TableRow key={param.key}>
                <TableCell align="right">
                  {String(t[param.key])}:
                </TableCell>
                <TableCell align="left">
                  <NumberInput
                    value={Number(values[param.key as keyof InputParamsValues])}
                    onChange={(value) => onChange(param.key, value)}
                    unit={param.unit}
                  />
                </TableCell>
              </TableRow>
            );
          }
          if (param.input && param.type === 'enum' && param.options) {
            return (
              <TableRow key={param.key}>
                <TableCell align="right">
                  {String(t[param.key])}:
                </TableCell>
                <TableCell align="left">
                  <EnumInput
                    value={String(values[param.key as keyof InputParamsValues])}
                    options={param.options}
                    onChange={(value) => onChange(param.key, value)}
                    t={t}
                  />
                </TableCell>
              </TableRow>
            );
          }
          return null;
        })}
      </TableBody>
    </Table>
  );
};

export default InputParams;
