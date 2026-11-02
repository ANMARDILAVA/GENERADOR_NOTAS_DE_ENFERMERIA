import React, { useState } from 'react';
import { Copy, Check, Download, Printer, RotateCcw, Sparkles } from 'lucide-react';
import { copyToClipboard, downloadAsTxt, printNote } from '../../utils/clipboard';

interface Props {
  noteText: string;
  onNoteChange: (newText: string) => void;
  onClear: () => void;
  onAutoFillDemo?: () => void;
  title?: string;
  placeholder?: string;
  rows?: number;
  badgeLabel?: string;
}

export const NotePreview: React.FC<Props> = ({
  noteText,
  onNoteChange,
  onClear,
  onAutoFillDemo,
  title = 'Vista Previa de la Nota',
  placeholder = 'La nota generada aparecerá aquí en mayúsculas...',
  rows = 24,
  badgeLabel,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!noteText.trim()) return;
    const success = await copyToClipboard(noteText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleDownload = () => {
    if (!noteText.trim()) return;
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAsTxt(noteText, `nota-enfermeria-${dateStr}.txt`);
  };

  const handlePrint = () => {
    if (!noteText.trim()) return;
    printNote(noteText, title);
  };

  const charCount = noteText.length;
  const wordCount = noteText.trim() ? noteText.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 text-slate-100">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </span>
          {badgeLabel && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {badgeLabel}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {onAutoFillDemo && (
            <button
              type="button"
              onClick={onAutoFillDemo}
              title="Cargar datos clínicos de ejemplo"
              className="flex items-center gap-1 px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-[11px] font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ejemplo</span>
            </button>
          )}

          {noteText && (
            <button
              type="button"
              onClick={onClear}
              title="Borrar contenido de la nota"
              className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-rose-300 bg-slate-800 hover:bg-rose-950/40 rounded-lg transition-colors text-[11px] font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Textarea container */}
      <div className="relative flex-1 min-h-[300px]">
        <textarea
          value={noteText}
          onChange={(e) => onNoteChange(e.target.value.toUpperCase())}
          rows={rows}
          placeholder={placeholder}
          className="w-full h-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm font-mono uppercase text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 leading-relaxed resize-none custom-scrollbar"
        />

        {/* Copy floating feedback */}
        {copied && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
            <Check className="w-4 h-4" />
            <span>¡COPIADO!</span>
          </div>
        )}
      </div>

      {/* Metrics footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2.5 pb-3">
        <span>
          {charCount} caracteres · {wordCount} palabras
        </span>
        <span className="text-slate-500 text-[10px]">
          Editable directamente antes de copiar
        </span>
      </div>

      {/* Actions toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!noteText.trim()}
          className={`sm:col-span-2 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm tracking-wide transition shadow-lg ${
            noteText.trim()
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-[0.99]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? '¡NOTA COPIADA!' : 'COPIAR NOTA'}</span>
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!noteText.trim()}
            title="Descargar como archivo de texto .txt"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.TXT</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            disabled={!noteText.trim()}
            title="Imprimir formato clínico"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
