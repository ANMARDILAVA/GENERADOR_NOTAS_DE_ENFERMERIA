import React from 'react';
import { DERECHOS_Y_DEBERES } from '../../constants/clinicalOptions';

interface Props {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  className?: string;
}

export const DerechoDeberSelect: React.FC<Props> = ({
  value,
  onChange,
  label = 'Derecho y Deber del Mes:',
  className = '',
}) => {
  return (
    <div className={className}>
      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      >
        {DERECHOS_Y_DEBERES.map((item) => (
          <option key={item.id} value={item.fullString}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};
