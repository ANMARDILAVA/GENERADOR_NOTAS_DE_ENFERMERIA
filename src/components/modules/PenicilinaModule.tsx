import React, { useState } from 'react';
import { Gender, SavedNote } from '../../types/clinical';
import { DERECHOS_Y_DEBERES, ANTICOAGULANTES_COMUNES } from '../../constants/clinicalOptions';
import { DerechoDeberSelect } from '../common/DerechoDeberSelect';
import { NotePreview } from '../common/NotePreview';
import { Syringe, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';

interface Props {
  onSaveToHistory: (noteText: string, summary: string) => SavedNote;
}

export const PenicilinaModule: React.FC<Props> = ({ onSaveToHistory }) => {
  const [genero, setGenero] = useState<Gender>('MASCULINO');
  const [motivo, setMotivo] = useState('INFECCIÓN BACTERIANA / FARINGOAMIGDALITIS');
  const [anticoagulado, setAnticoagulado] = useState<'NO' | 'SI'>('NO');
  const [medAnticoagulante, setMedAnticoagulante] = useState('');
  const [tieneAlergias, setTieneAlergias] = useState(false);
  const [alergiaEsp, setAlergiaEsp] = useState('');
  const [derechoDeber, setDerechoDeber] = useState(DERECHOS_Y_DEBERES[2].fullString);

  const [tieneSeguridad, setTieneSeguridad] = useState(true);
  const [lote, setLote] = useState('LT-23910A');
  const [fechaVenc, setFechaVenc] = useState('2027-10-31');
  const [invima, setInvima] = useState('INVIMA 2021M-0012984');

  const [sitioPrueba, setSitioPrueba] = useState('MIEMBRO SUPERIOR DERECHO');
  const [sitioTerapia, setSitioTerapia] = useState('GLUTEO DERECHO');
  const [cubiculo, setCubiculo] = useState('1');

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

    const antiStr = anticoagulado === 'SI'
      ? ` PACIENTE REFIERE ESTAR ANTICOAGULADO CON ${medAnticoagulante.trim().toUpperCase() || 'MEDICAMENTO NO ESPECIFICADO'}.`
      : '';

    let seg = '';
    if (tieneSeguridad) {
      seg = `\nDATOS SEGURIDAD: LOTE: ${lote.trim()}, FV: ${fechaVenc}, INVIMA: ${invima.trim()}`;
    }

    const text = `INGRESA PACIENTE A SALA, ALERTA, ORIENTAD${e}, TRAE ORDEN PARA ADMINISTRAR PENICILINA BENZATÍNICA 2.400.000 UI IM COMO TRATAMIENTO PARA ${motivo.trim().toUpperCase()}.

SE REVISA ORDEN Y APLICA LISTA DE CHEQUEO. ${alerStr} (DIF A PENICILINA).${antiStr}${seg} SE SOCIALIZA DERECHO Y DEBER: (DERECHO: ${d}. DEBER: ${b}). SE FIRMA CONSENTIMIENTO.

SE REALIZA PRUEBA DE SENSIBILIDAD EN ${sitioPrueba} CON 0.1 ML DE PENICILINA SÓDICA. PASADOS 20 MINUTOS RESULTADO NEGATIVO.

SE UBICA ${al} PACIENTE EN CUBÍCULO ${cubiculo}. SE ADMINISTRA PENICILINA EN ${sitioTerapia} SIN REACCIONES. SE DEJA 10 MINUTOS EN OBSERVACIÓN. SALE PACIENTE ALERTA CON RECOMENDACIONES.`.toUpperCase();

    setNoteOutput(text);
    onSaveToHistory(text, `Penicilina 2.4M UI IM (${motivo})`);
  };

  const handleClear = () => {
    setGenero('MASCULINO');
    setMotivo('');
    setAnticoagulado('NO');
    setMedAnticoagulante('');
    setTieneAlergias(false);
    setAlergiaEsp('');
    setTieneSeguridad(false);
    setLote('');
    setFechaVenc('');
    setInvima('');
    setCubiculo('1');
    setNoteOutput('');
  };

  const autoFillDemo = () => {
    setGenero('FEMENINO');
    setMotivo('SÍFILIS LATENTE TEMPRANA');
    setTieneAlergias(false);
    setTieneSeguridad(true);
    setLote('LT-89104');
    setFechaVenc('2028-04-15');
    setInvima('INVIMA 2022M-0019482');
    setSitioPrueba('MIEMBRO SUPERIOR IZQUIERDO');
    setSitioTerapia('GLUTEO IZQUIERDO');
    setCubiculo('2');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-orange-100 text-orange-700 rounded-xl">
            <Syringe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Prueba y Administración de Penicilina Benzatínica
            </h2>
            <p className="text-xs text-slate-500">
              Lectura a 20 minutos de prueba intradérmica con 0.1 ml de penicilina sódica y posterior administración IM
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={autoFillDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-xl border border-orange-200 transition"
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
              Contexto y Procedimiento
            </legend>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Género</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="pen-gen"
                    value="MASCULINO"
                    checked={genero === 'MASCULINO'}
                    onChange={() => setGenero('MASCULINO')}
                    className="h-4 w-4 text-orange-600 mr-2"
                  />
                  Masculino
                </label>
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="pen-gen"
                    value="FEMENINO"
                    checked={genero === 'FEMENINO'}
                    onChange={() => setGenero('FEMENINO')}
                    className="h-4 w-4 text-orange-600 mr-2"
                  />
                  Femenino
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Motivo / Diagnóstico
                </label>
                <input
                  type="text"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ej: Faringitis bacteriana, Lúes"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
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
                  <option value="SI">Sí Anticoagulado (Precaución hemostasia)</option>
                </select>

                {anticoagulado === 'SI' && (
                  <div className="mt-2.5 animate-in fade-in duration-150">
                    <label className="block text-[11px] font-bold text-red-700 uppercase mb-1">
                      Medicamento Anticoagulante que Toma:
                    </label>
                    <input
                      type="text"
                      list="anticoagulantes-pen-list"
                      value={medAnticoagulante}
                      onChange={(e) => setMedAnticoagulante(e.target.value)}
                      placeholder="Ej: Warfarina, Rivaroxabán, Apixabán, Dabigatrán, ASA..."
                      className="w-full p-2.5 bg-red-50/70 border border-red-300 rounded-xl text-xs sm:text-sm font-semibold text-red-950 focus:ring-2 focus:ring-orange-500"
                      autoFocus
                    />
                    <datalist id="anticoagulantes-pen-list">
                      {ANTICOAGULANTES_COMUNES.map((med) => (
                        <option key={med} value={med} />
                      ))}
                    </datalist>
                  </div>
                )}
              </div>
            </div>

            {/* Allergies diff from penicillin */}
            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
              <label className="flex items-center font-bold text-amber-900 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={tieneAlergias}
                  onChange={(e) => setTieneAlergias(e.target.checked)}
                  className="h-4 w-4 text-amber-600 rounded mr-2"
                />
                Refiere alergias conocidas (Diferentes a Penicilina)
              </label>
              {tieneAlergias && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    value={alergiaEsp}
                    onChange={(e) => setAlergiaEsp(e.target.value)}
                    placeholder="Especifique otras alergias..."
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-sm font-medium"
                  />
                </div>
              )}
            </div>

            {/* INVIMA Safety details */}
            <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200">
              <label className="flex items-center font-bold text-blue-900 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={tieneSeguridad}
                  onChange={(e) => setTieneSeguridad(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded mr-2"
                />
                Incluir datos de seguridad del medicamento (INVIMA / Lote / FV)
              </label>

              {tieneSeguridad && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-blue-800 uppercase mb-1">
                      Lote
                    </label>
                    <input
                      type="text"
                      value={lote}
                      onChange={(e) => setLote(e.target.value)}
                      placeholder="Lote"
                      className="w-full p-2 border border-blue-300 rounded-lg text-xs font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-blue-800 uppercase mb-1">
                      Vencimiento
                    </label>
                    <input
                      type="date"
                      value={fechaVenc}
                      onChange={(e) => setFechaVenc(e.target.value)}
                      className="w-full p-2 border border-blue-300 rounded-lg text-xs font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-blue-800 uppercase mb-1">
                      INVIMA
                    </label>
                    <input
                      type="text"
                      value={invima}
                      onChange={(e) => setInvima(e.target.value)}
                      placeholder="Registro INVIMA"
                      className="w-full p-2 border border-blue-300 rounded-lg text-xs font-semibold bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sites and cubicle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Sitio Prueba Intradérmica
                </label>
                <select
                  value={sitioPrueba}
                  onChange={(e) => setSitioPrueba(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                >
                  <option value="MIEMBRO SUPERIOR DERECHO">M.S. DERECHO</option>
                  <option value="MIEMBRO SUPERIOR IZQUIERDO">M.S. IZQUIERDO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Sitio Terapia Intramuscular
                </label>
                <select
                  value={sitioTerapia}
                  onChange={(e) => setSitioTerapia(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                >
                  <option value="GLUTEO DERECHO">GLÚTEO DERECHO</option>
                  <option value="GLUTEO IZQUIERDO">GLÚTEO IZQUIERDO</option>
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
            </div>

            <DerechoDeberSelect value={derechoDeber} onChange={setDerechoDeber} />
          </fieldset>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-xl shadow-lg text-white bg-orange-600 hover:bg-orange-700 font-extrabold text-sm tracking-wide transition cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
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
            title="Vista Previa · Penicilina"
            badgeLabel="LECTURA NEGATIVA 20 MIN"
          />
        </div>
      </div>
    </div>
  );
};
