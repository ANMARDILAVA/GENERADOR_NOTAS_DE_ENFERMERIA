import React, { useState } from 'react';
import { SavedNote } from '../../types/clinical';
import { X, Copy, Check, Trash2, Clock, FileText } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  savedNotes: SavedNote[];
  onDeleteNote: (id: string) => void;
  onClearAll: () => void;
  onSelectNoteToView: (note: SavedNote) => void;
}

export const HistoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  savedNotes,
  onDeleteNote,
  onClearAll,
  onSelectNoteToView,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (note: SavedNote) => {
    const success = await copyToClipboard(note.noteText);
    if (success) {
      setCopiedId(note.id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Historial de Notas Clínicas</h3>
              <p className="text-xs text-slate-400">
                Almacenado localmente en su navegador ({savedNotes.length} notas guardadas)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar bg-slate-50">
          {savedNotes.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <FileText className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">Aún no hay notas en el historial.</p>
              <p className="text-xs text-slate-400">
                Cada vez que genere o copie una nota, se guardará aquí automáticamente.
              </p>
            </div>
          ) : (
            savedNotes.map((note) => {
              const dateStr = new Date(note.timestamp).toLocaleString('es-CO', {
                dateStyle: 'short',
                timeStyle: 'short',
              });

              return (
                <div
                  key={note.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                        {note.moduleName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{dateStr}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(note)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                      >
                        {copiedId === note.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectNoteToView(note)}
                        className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                      >
                        Ver
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteNote(note.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Eliminar esta nota"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-mono text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {note.summary}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {savedNotes.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-white border-t border-slate-200">
            <button
              type="button"
              onClick={onClearAll}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar todo el historial</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
