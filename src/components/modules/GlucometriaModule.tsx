import React, { useState } from 'react';
import { Gender, SavedNote } from '../../types/clinical';
import { DERECHOS_Y_DEBERES } from '../../constants/clinicalOptions';
import { DerechoDeberSelect } from '../common/DerechoDeberSelect';
import { NotePreview } from '../common/NotePreview';
import { Droplet, Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  onSaveToHistory: (noteText: string, summary: string) => SavedNote;
}

export const GlucometriaModule: React.FC<Props> = ({ onSaveToHistory }) => {
  const [genero, setGenero] = useState<Gender>('MASCULINO');
  const [motivo, setMotivo] = useState('CONTROL METABÓLICO EN AYUNAS');
  const [tieneAlergias, setTieneAlergias] = useState(false);
  const [alergiaEsp, setAlergiaEsp] = useState('');
  const [dedo, setDedo] = useState('DEDO 2 (ÍNDICE)');
  const [mano, setMano] = useState('DERECHA');
  const [valorGlucemia, setValorGlucemia] = useState('105');
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
    const alerStr = tieneAlergias
      ? `SE INDAGAN ALERGIAS, REFIERE ALERGIAS A ${alergiaEsp.trim().toUpperCase() || 'NO ESPECIFICADAS'}`
      : 'SE INDAGAN ALERGIAS, NIEGA ALERGIAS';

    const valStr = valorGlucemia.trim() || '___';
    const mot = motivo.trim().toUpperCase() || 'CONTROL RUTINARIO';

    const text = `INGRESA PACIENTE A SALA DE ENFERMERÍA, ALERTA, ORIENTAD${e}, CONSCIENTE, CAMINANDO POR SUS PROPIOS MEDIOS, TRAE ORDEN MÉDICA PARA TOMA DE GLUCOMETRÍA (${mot}).

SE REVISA ORDEN MÉDICA. ${alerStr}. SE SOCIALIZA DERECHO Y DEBER: (DERECHO: ${d}. DEBER: ${b}).

PREVIO LAVADO DE MANOS Y BAJO TÉCNICA ASÉPTICA, SE EXPLICA EL PROCEDIMIENTO ${al} PACIENTE, QUIEN REFIERE ENTENDER Y ACEPTAR. SE REALIZA ASEPSIA EN ZONA LATERAL DE ${dedo} DE MANO ${mano}, SE REALIZA PUNCIÓN CON LANCETA ESTÉRIL, SE OBTIENE MUESTRA DE SANGRE CAPILAR Y SE COLOCA EN TIRA REACTIVA DE GLUCOMETRO PREVIAMENTE CALIBRADO. SE OBTIENE RESULTADO DE ${valStr} MG/DL. SE EJERCE HEMOSTASIA LEVE CON TÓRULA SECA.

SE BRINDAN RECOMENDACIONES CLÍNICAS Y SE INFORMA EL VALOR OBTENIDO. SALE PACIENTE DE SALA DE ENFERMERÍA, ALERTA Y ORIENTAD${e}, EN ESTABLES Y ÓPTIMAS CONDICIONES.`.toUpperCase();

    setNoteOutput(text);
    onSaveToHistory(text, `Glucometría: ${valStr} mg/dL (${mot})`);
  };

  const handleClear = () => {
    setGenero('MASCULINO');
    setMotivo('');
    setTieneAlergias(false);
    setAlergiaEsp('');
    setValorGlucemia('');
    setNoteOutput('');
  };

  const autoFillDemo = () => {
    setGenero('FEMENINO');
    setMotivo('DIABETES MELLITUS TIPO 2 / CONTROL POSTPRANDIAL');
    setTieneAlergias(false);
    setDedo('DEDO 3 (MEDIO)');
    setMano('IZQUIERDA');
    setValorGlucemia('134');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Toma de Glucometría (Glicemia Capilar)
            </h2>
            <p className="text-xs text-slate-500">
              Punción estéril de pulpejo lateral, calibración de glucómetro, registro del valor y hemostasia
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={autoFillDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition"
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
              Contexto y Toma de Muestra
            </legend>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Género</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="glu-gen"
                    value="MASCULINO"
                    checked={genero === 'MASCULINO'}
                    onChange={() => setGenero('MASCULINO')}
                    className="h-4 w-4 text-emerald-600 mr-2"
                  />
                  Masculino
                </label>
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="glu-gen"
                    value="FEMENINO"
                    checked={genero === 'FEMENINO'}
                    onChange={() => setGenero('FEMENINO')}
                    className="h-4 w-4 text-emerald-600 mr-2"
                  />
                  Femenino
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Motivo / Tipo de Control
              </label>
              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej: Control en ayunas, Hipoglicemia, Curva"
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
              <label className="flex items-center font-bold text-amber-900 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={tieneAlergias}
                  onChange={(e) => setTieneAlergias(e.target.checked)}
                  className="h-4 w-4 text-amber-600 rounded mr-2"
                />
                Refiere antecedentes alérgicos
              </label>
              {tieneAlergias && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    value={alergiaEsp}
                    onChange={(e) => setAlergiaEsp(e.target.value)}
                    placeholder="Especifique alergias..."
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-sm font-medium"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Dedo a Punzar
                </label>
                <select
                  value={dedo}
                  onChange={(e) => setDedo(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                >
                  <option value="DEDO 1 (PULGAR)">Dedo 1 (Pulgar)</option>
                  <option value="DEDO 2 (ÍNDICE)">Dedo 2 (Índice)</option>
                  <option value="DEDO 3 (MEDIO)">Dedo 3 (Medio)</option>
                  <option value="DEDO 4 (ANULAR)">Dedo 4 (Anular)</option>
                  <option value="DEDO 5 (MEÑIQUE)">Dedo 5 (Meñique)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Mano
                </label>
                <select
                  value={mano}
                  onChange={(e) => setMano(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                >
                  <option value="DERECHA">Mano Derecha</option>
                  <option value="IZQUIERDA">Mano Izquierda</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">
                Resultado de Glucemia Capilar (mg/dL)
              </label>
              <input
                type="number"
                value={valorGlucemia}
                onChange={(e) => setValorGlucemia(e.target.value)}
                placeholder="Ej: 110"
                className="w-full p-3 border-2 border-emerald-300 rounded-xl text-base font-extrabold focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <DerechoDeberSelect value={derechoDeber} onChange={setDerechoDeber} />
          </fieldset>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-xl shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 font-extrabold text-sm tracking-wide transition cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
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
            title="Vista Previa · Glucometría"
            badgeLabel={valorGlucemia ? `${valorGlucemia} MG/DL` : 'PENDIENTE'}
          />
        </div>
      </div>
    </div>
  );
};
