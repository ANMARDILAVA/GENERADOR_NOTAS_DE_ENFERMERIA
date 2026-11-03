import React, { useState } from 'react';
import { Gender, SavedNote } from '../../types/clinical';
import { DERECHOS_Y_DEBERES, ANTICOAGULANTES_COMUNES } from '../../constants/clinicalOptions';
import { DerechoDeberSelect } from '../common/DerechoDeberSelect';
import { NotePreview } from '../common/NotePreview';
import { Scissors, Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  onSaveToHistory: (noteText: string, summary: string) => SavedNote;
}

export const RetiroPuntosModule: React.FC<Props> = ({ onSaveToHistory }) => {
  const [genero, setGenero] = useState<Gender>('MASCULINO');
  const [zona, setZona] = useState('REGIÓN SUPERCILIAR DERECHA');
  const [cantidadPuntos, setCantidadPuntos] = useState('4');
  const [anticoagulado, setAnticoagulado] = useState<'NO' | 'SI'>('NO');
  const [medAnticoagulante, setMedAnticoagulante] = useState('');
  const [posicion, setPosicion] = useState('SENTADO');
  const [cubiculo, setCubiculo] = useState('1');
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
    const { d, b } = parseDD(derechoDeber);

    const antiStr = anticoagulado === 'SI'
      ? ` PACIENTE REFIERE ESTAR ANTICOAGULADO CON ${medAnticoagulante.trim().toUpperCase() || 'MEDICAMENTO NO ESPECIFICADO'}.`
      : '';

    const text = `INGRESA PACIENTE A SALA DE ENFERMERÍA, ALERTA Y ORIENTAD${e}, TRAE ORDEN PARA RETIRO DE PUNTOS. SE VERIFICA ORDEN Y SE FIRMA CONSENTIMIENTO.${antiStr}

SE SOCIALIZA DERECHO Y DEBER: (DERECHO: ${d}. DEBER: ${b}).

SE UBICA EN CUBÍCULO ${cubiculo}, POSICIÓN ${posicion}. SE REALIZA LIMPIEZA Y DESINFECCIÓN EN ZONA DE SUTURA (${zona.trim().toUpperCase()}). SE RETIRAN ${cantidadPuntos.trim()} PUNTOS VERIFICANDO QUE SE HAYAN EXTRAÍDO EN SU TOTALIDAD. NO SE PRESENTAN COMPLICACIONES.

SALE PACIENTE ALERTA Y ORIENTAD${e}, CON RECOMENDACIONES DE CUIDADO EN CASA.`.toUpperCase();

    setNoteOutput(text);
    onSaveToHistory(text, `Retiro de Puntos: ${cantidadPuntos} en ${zona}`);
  };

  const handleClear = () => {
    setGenero('MASCULINO');
    setZona('');
    setCantidadPuntos('');
    setAnticoagulado('NO');
    setMedAnticoagulante('');
    setPosicion('SENTADO');
    setCubiculo('1');
    setNoteOutput('');
  };

  const autoFillDemo = () => {
    setGenero('FEMENINO');
    setZona('MENTÓN');
    setCantidadPuntos('5');
    setAnticoagulado('NO');
    setMedAnticoagulante('');
    setPosicion('SUPINO');
    setCubiculo('1');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-slate-200 text-slate-800 rounded-xl">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Retiro de Puntos de Sutura
            </h2>
            <p className="text-xs text-slate-500">
              Procedimiento de asepsia, conteo y extracción de suturas dérmicas, verificación de afrontamiento y cicatrización
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={autoFillDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition"
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
              Contexto y Zona Anatómica
            </legend>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Género</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="ret-gen"
                    value="MASCULINO"
                    checked={genero === 'MASCULINO'}
                    onChange={() => setGenero('MASCULINO')}
                    className="h-4 w-4 text-slate-700 mr-2"
                  />
                  Masculino
                </label>
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="ret-gen"
                    value="FEMENINO"
                    checked={genero === 'FEMENINO'}
                    onChange={() => setGenero('FEMENINO')}
                    className="h-4 w-4 text-slate-700 mr-2"
                  />
                  Femenino
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Zona Anatómica de la Sutura
                </label>
                <input
                  type="text"
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  placeholder="Ej: Mentón, Antebrazo derecho, Rodilla"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Cantidad de Puntos a Retirar
                </label>
                <input
                  type="number"
                  min="1"
                  value={cantidadPuntos}
                  onChange={(e) => setCantidadPuntos(e.target.value)}
                  placeholder="Ej: 5"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Posición del Paciente
                </label>
                <select
                  value={posicion}
                  onChange={(e) => setPosicion(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                >
                  <option value="SENTADO">SENTADO</option>
                  <option value="SUPINO">DECÚBITO SUPINO</option>
                  <option value="PRONO">DECÚBITO PRONO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Cubículo
                </label>
                <input
                  type="number"
                  min="1"
                  value={cubiculo}
                  onChange={(e) => setCubiculo(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  ¿Paciente Anticoagulado?
                </label>
                <select
                  value={anticoagulado}
                  onChange={(e) => {
                    const val = e.target.value as 'NO' | 'SI';
                    setAnticoagulado(val);
                    if (val === 'NO') setMedAnticoagulante('');
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold bg-white"
                >
                  <option value="NO">No Anticoagulado</option>
                  <option value="SI">Sí Anticoagulado (Precaución hemostasia / sangrado al retirar sutura)</option>
                </select>

                {anticoagulado === 'SI' && (
                  <div className="mt-2.5 animate-in fade-in duration-150">
                    <label className="block text-[11px] font-bold text-red-700 uppercase mb-1">
                      Medicamento Anticoagulante que Toma:
                    </label>
                    <input
                      type="text"
                      list="anticoagulantes-ret-list"
                      value={medAnticoagulante}
                      onChange={(e) => setMedAnticoagulante(e.target.value)}
                      placeholder="Ej: Warfarina, Rivaroxabán, Apixabán, Dabigatrán, ASA..."
                      className="w-full p-2.5 bg-red-50/70 border border-red-300 rounded-xl text-xs sm:text-sm font-semibold text-red-950 focus:ring-2 focus:ring-red-500"
                      autoFocus
                    />
                    <datalist id="anticoagulantes-ret-list">
                      {ANTICOAGULANTES_COMUNES.map((med) => (
                        <option key={med} value={med} />
                      ))}
                    </datalist>
                  </div>
                )}
              </div>
            </div>

            <DerechoDeberSelect value={derechoDeber} onChange={setDerechoDeber} />
          </fieldset>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-xl shadow-lg text-white bg-slate-700 hover:bg-slate-800 font-extrabold text-sm tracking-wide transition cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
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
            title="Vista Previa · Retiro de Puntos"
            badgeLabel="EXTRACCIÓN COMPLETA"
          />
        </div>
      </div>
    </div>
  );
};
