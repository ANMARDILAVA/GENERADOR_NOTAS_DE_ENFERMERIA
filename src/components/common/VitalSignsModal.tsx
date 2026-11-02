import React, { useState, useEffect } from 'react';
import { VitalSigns } from '../../types/clinical';
import { Activity, X, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signs: VitalSigns) => void;
  initialValues?: VitalSigns;
  title?: string;
}

export const VitalSignsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialValues,
  title = 'Registro de Signos Vitales Alterados',
}) => {
  const [ta, setTa] = useState('');
  const [fc, setFc] = useState('');
  const [fr, setFr] = useState('');
  const [temp, setTemp] = useState('');
  const [spo2, setSpo2] = useState('');

  useEffect(() => {
    if (initialValues) {
      setTa(initialValues.ta || '');
      setFc(initialValues.fc || '');
      setFr(initialValues.fr || '');
      setTemp(initialValues.temp || '');
      setSpo2(initialValues.spo2 || '');
    } else {
      setTa('');
      setFc('');
      setFr('');
      setTemp('');
      setSpo2('');
    }
  }, [initialValues, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      ta: ta.trim(),
      fc: fc.trim(),
      fr: fr.trim(),
      temp: temp.trim(),
      spo2: spo2.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-amber-500 text-white">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-white" />
            <h3 className="font-bold text-sm tracking-wide">{title}</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg hover:bg-amber-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-500">
            Diligencie los valores alterados que se integrarán en el reporte de la nota clínica:
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tensión Arterial (TA)
              </label>
              <input
                type="text"
                placeholder="Ej: 145/95 mmHg"
                value={ta}
                onChange={(e) => setTa(e.target.value)}
                className="w-full p-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Frecuencia Cardíaca (FC)
              </label>
              <input
                type="text"
                placeholder="Ej: 108 lpm"
                value={fc}
                onChange={(e) => setFc(e.target.value)}
                className="w-full p-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Frec. Respiratoria (FR)
              </label>
              <input
                type="text"
                placeholder="Ej: 24 rpm"
                value={fr}
                onChange={(e) => setFr(e.target.value)}
                className="w-full p-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Temperatura (T°)
              </label>
              <input
                type="text"
                placeholder="Ej: 38.6 °C"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                className="w-full p-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Saturación de Oxígeno (SpO2)
              </label>
              <input
                type="text"
                placeholder="Ej: 89%"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                className="w-full p-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition"
          >
            <Check className="w-4 h-4" />
            Guardar Signos Vitales
          </button>
        </div>
      </div>
    </div>
  );
};
