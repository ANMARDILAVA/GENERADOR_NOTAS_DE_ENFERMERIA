import React, { useState } from 'react';
import { Gender, SavedNote } from '../../types/clinical';
import { DERECHOS_Y_DEBERES } from '../../constants/clinicalOptions';
import { DerechoDeberSelect } from '../common/DerechoDeberSelect';
import { NotePreview } from '../common/NotePreview';
import { Activity, Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  onSaveToHistory: (noteText: string, summary: string) => SavedNote;
}

export const EkgModule: React.FC<Props> = ({ onSaveToHistory }) => {
  const [genero, setGenero] = useState<Gender>('MASCULINO');
  const [enviadoPor, setEnviadoPor] = useState('DR. MARCO A. RIVERA');
  const [motivo, setMotivo] = useState('DOLOR PRECORDIAL OPRESIVO EN REPOSO');
  const [derechoDeber, setDerechoDeber] = useState(DERECHOS_Y_DEBERES[2].fullString);
  const [noteOutput, setNoteOutput] = useState('');

  const parseDD = (full: string) => {
    const parts = full.split('|');
    const d = parts[0]?.replace('Derecho:', '').trim() || '-';
    const b = parts[1]?.replace('Deber:', '').trim() || '-';
    return { d, b };
  };

  const generateNote = () => {
    const e = genero === 'MASCULINO' ? 'O' : 'A';
    const al = genero === 'MASCULINO' ? 'AL' : 'A LA';
    const { d, b } = parseDD(derechoDeber);

    const text = `INGRESA PACIENTE A SALA DE ENFERMERÍA, ALERTA, ORIENTAD${e}, CONSCIENTE, CAMINANDO, TRAE ORDEN MÉDICA PARA ELECTROCARDIOGRAMA, ENVIADO POR ${enviadoPor.trim().toUpperCase()} AL PRESENTAR ${motivo.trim().toUpperCase()}.

SE SOCIALIZA DERECHO Y DEBER: (DERECHO: ${d}. DEBER: ${b}).

SE EXPLICA EL PROCEDIMIENTO ${al} PACIENTE, REFIERE ENTENDER Y ACEPTAR. SE LE INDICA RETIRAR OBJETOS METÁLICOS. SE UBICA EN CAMILLA DECÚBITO SUPINO, SE TOMAN TRAZOS SIN NOVEDAD.

FINALIZADO EL EXAMEN, SE LE INDICA ESPERAR RESULTADOS. SALE PACIENTE DE SALA DE ENFERMERÍA, ALERTA, ORIENTAD${e}.`.toUpperCase();

    setNoteOutput(text);
    onSaveToHistory(text, `EKG: ${motivo}`);
  };

  const handleClear = () => {
    setGenero('MASCULINO');
    setEnviadoPor('');
    setMotivo('');
    setNoteOutput('');
  };

  const autoFillDemo = () => {
    setGenero('FEMENINO');
    setEnviadoPor('DRA. CLAUDIA RESTREPO');
    setMotivo('PALPITACIONES Y EPISODIOS DE LIPOTIMIA');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-cyan-100 text-cyan-700 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Electrocardiograma (EKG)
            </h2>
            <p className="text-xs text-slate-500">
              Toma de trazo electrocardiográfico de 12 derivaciones, preparación del paciente y retiro de objetos metálicos
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={autoFillDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-xl border border-cyan-200 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autollenar Ejemplo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateNote();
          }}
          className="lg:col-span-7 space-y-6"
        >
          <fieldset className="border border-slate-200 p-5 rounded-2xl bg-white shadow-xs space-y-4">
            <legend className="text-xs font-extrabold text-slate-600 px-3 uppercase tracking-wider bg-slate-100 rounded-lg border border-slate-200 py-1">
              Contexto y Solicitud Médica
            </legend>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Género</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="ekg-gen"
                    value="MASCULINO"
                    checked={genero === 'MASCULINO'}
                    onChange={() => setGenero('MASCULINO')}
                    className="h-4 w-4 text-cyan-600 mr-2"
                  />
                  Masculino
                </label>
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="ekg-gen"
                    value="FEMENINO"
                    checked={genero === 'FEMENINO'}
                    onChange={() => setGenero('FEMENINO')}
                    className="h-4 w-4 text-cyan-600 mr-2"
                  />
                  Femenino
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Enviado / Solicitado por
                </label>
                <input
                  type="text"
                  value={enviadoPor}
                  onChange={(e) => setEnviadoPor(e.target.value)}
                  placeholder="Ej: Dr. Roberto Gómez"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Motivo / Indicación
                </label>
                <input
                  type="text"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ej: Dolor torácico, Prequirúrgico, Arritmia"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
            </div>

            <DerechoDeberSelect value={derechoDeber} onChange={setDerechoDeber} />
          </fieldset>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-xl shadow-lg text-white bg-cyan-600 hover:bg-cyan-700 font-extrabold text-sm tracking-wide transition cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>GENERAR NOTA DE ENFERMERÍA</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="sm:w-auto py-3.5 px-6 border border-slate-300 rounded-xl text-slate-700 bg-white hover:bg-slate-50 font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>LIMPIAR NOTA DE ENFERMERÍA</span>
            </button>
          </div>
        </form>

        <div className="lg:col-span-5 h-full lg:sticky lg:top-4">
          <NotePreview
            noteText={noteOutput}
            onNoteChange={setNoteOutput}
            onClear={() => setNoteOutput('')}
            onAutoFillDemo={autoFillDemo}
            title="Vista Previa · Electrocardiograma"
            badgeLabel="TRAZOS DE 12 DERIVACIONES"
          />
        </div>
      </div>
    </div>
  );
};
