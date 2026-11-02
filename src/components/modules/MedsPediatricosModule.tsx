import React, { useState } from 'react';
import { SavedNote } from '../../types/clinical';
import { DERECHOS_Y_DEBERES, POSICIONES_PACIENTE, SITIOS_PEDIATRICOS } from '../../constants/clinicalOptions';
import { DerechoDeberSelect } from '../common/DerechoDeberSelect';
import { NotePreview } from '../common/NotePreview';
import { Baby, Sparkles, RefreshCw, PlusCircle, Users } from 'lucide-react';

interface Props {
  onSaveToHistory: (noteText: string, summary: string) => SavedNote;
}

export const MedsPediatricosModule: React.FC<Props> = ({ onSaveToHistory }) => {
  const [acomp, setAcomp] = useState('MADRE');
  const [acompOtro, setAcompOtro] = useState('');
  const [motivo, setMotivo] = useState('AMIGDALITIS AGUDA BACTERIANA');
  const [tieneAlergias, setTieneAlergias] = useState(false);
  const [alergiaEsp, setAlergiaEsp] = useState('');
  const [derechoDeber, setDerechoDeber] = useState(DERECHOS_Y_DEBERES[2].fullString);

  // Med 1
  const [med1, setMed1] = useState('CEFTRIAXONA');
  const [dosis1, setDosis1] = useState('500 MG');
  const [via1, setVia1] = useState('INTRAMUSCULAR');
  const [sitio1, setSitio1] = useState(SITIOS_PEDIATRICOS[0].value);
  const [sitio1Otro, setSitio1Otro] = useState('');

  // Med 2
  const [tieneMed2, setTieneMed2] = useState(false);
  const [med2, setMed2] = useState('');
  const [dosis2, setDosis2] = useState('');
  const [via2, setVia2] = useState('INTRAMUSCULAR');
  const [sitio2, setSitio2] = useState(SITIOS_PEDIATRICOS[1].value);
  const [sitio2Otro, setSitio2Otro] = useState('');

  const [cubiculo, setCubiculo] = useState('1');
  const [posicion, setPosicion] = useState<string>('DECÚBITO SUPINO (O DORSAL)');
  const [posicionOtro, setPosicionOtro] = useState('');
  const [riesgoCaida, setRiesgoCaida] = useState('RIESGO MEDIO');
  const [riesgoPiel, setRiesgoPiel] = useState('RIESGO BAJO');

  const [noteOutput, setNoteOutput] = useState('');

  const parseDD = (full: string) => {
    const parts = full.split('|');
    const d = parts[0]?.replace('Derecho:', '').trim() || '-';
    const b = parts[1]?.replace('Deber:', '').trim() || '-';
    return { d, b };
  };

  const generateNote = () => {
    const { d, b } = parseDD(derechoDeber);
    const finalAcomp = acomp === 'OTRO' ? acompOtro.trim().toUpperCase() || 'ACOMPAÑANTE' : acomp;
    const alerStr = tieneAlergias
      ? `REFIERE ALERGIA A ${alergiaEsp.trim().toUpperCase() || 'NO ESPECIFICADAS'}`
      : 'NIEGA ALERGIAS';

    const s1Final = sitio1 === 'OTRO' ? sitio1Otro.trim().toUpperCase() || 'SITIO ESPECIFICADO' : sitio1;
    const s2Final = sitio2 === 'OTRO' ? sitio2Otro.trim().toUpperCase() || 'SITIO ESPECIFICADO' : sitio2;

    const ord = tieneMed2 && med2.trim()
      ? `${med1.trim()} ${dosis1.trim()} ${via1.trim()} Y ${med2.trim()} ${dosis2.trim()} ${via2.trim()}`
      : `${med1.trim()} ${dosis1.trim()} ${via1.trim()} DOSIS ÚNICA`;

    let adm = `SE REALIZA DESINFECCIÓN DEL ${s1Final} Y SE ADMINISTRA ${med1.trim()} ${dosis1.trim()} DE FORMA ${via1.trim()}`;
    if (tieneMed2 && med2.trim()) {
      adm += `. POSTERIORMENTE SE REALIZA DESINFECCIÓN DEL ${s2Final} Y SE ADMINISTRA ${med2.trim()} ${dosis2.trim()} DE FORMA ${via2.trim()}`;
    }
    adm += ' SIN PRESENTARSE REACCIÓN ADVERSA INMEDIATA.';

    const finalPos = posicion === 'OTRO' ? posicionOtro.trim().toUpperCase() || 'ESPECÍFICA' : posicion;

    const text = `INGRESA PACIENTE PEDIÁTRICO A SALA DE ENFERMERÍA, SE OBSERVA ALERTA, ACTIVO, EN COMPAÑÍA DE SU ${finalAcomp}. PRESENTA ORDEN PARA ADMINISTRAR ${ord} COMO TRATAMIENTO PARA ${motivo.trim().toUpperCase()}.

SE REVISA ORDEN MÉDICA, SE INDAGAN ALERGIAS, ACUDIENTE ${alerStr}. SE OBTIENE FIRMA DE CONSENTIMIENTO INFORMADO POR PARTE DEL ADULTO RESPONSABLE. SE REALIZA LA VERIFICACIÓN DE LOS 13 CORRECTOS PARA LA ADMINISTRACIÓN SEGURA. SE EXPLICA EL PROCEDIMIENTO AL MENOR Y A SU ACOMPAÑANTE, Y SE BRINDA EDUCACIÓN SOBRE EL MEDICAMENTO A ADMINISTRAR. SE SOCIALIZA DERECHO Y DEBER: (DERECHO: ${d}. DEBER: ${b}).

PREVIO LAVADO DE MANOS, SE UBICA AL PACIENTE EN EL CUBÍCULO N.º ${cubiculo}, EN CAMILLA, EN POSICIÓN ${finalPos}, CON APOYO Y CONTENCIÓN POR PARTE DE SU ${finalAcomp}. SE VALORAN ESCALAS DE RIESGO: CAÍDA (${riesgoCaida}), LESIÓN DE PIEL (${riesgoPiel}). ${adm}

SE INDICA AL ACUDIENTE PERMANECER CON EL MENOR 10 MINUTOS EN OBSERVACIÓN. TRANSCURRIDO EL TIEMPO, EL PACIENTE PEDIÁTRICO EGRESA EN COMPAÑÍA DE SU FAMILIAR, ALERTA Y TRANQUILO. SE BRINDAN RECOMENDACIONES DE CUIDADO.`.toUpperCase();

    setNoteOutput(text);
    onSaveToHistory(text, `Meds Pediatría: ${ord} (Acompañante: ${finalAcomp})`);
  };

  const handleClear = () => {
    setAcomp('MADRE');
    setAcompOtro('');
    setMotivo('');
    setTieneAlergias(false);
    setAlergiaEsp('');
    setMed1('');
    setDosis1('');
    setVia1('INTRAMUSCULAR');
    setSitio1(SITIOS_PEDIATRICOS[0].value);
    setSitio1Otro('');
    setTieneMed2(false);
    setMed2('');
    setDosis2('');
    setVia2('INTRAMUSCULAR');
    setSitio2(SITIOS_PEDIATRICOS[1].value);
    setSitio2Otro('');
    setCubiculo('1');
    setPosicion('DECÚBITO SUPINO (O DORSAL)');
    setPosicionOtro('');
    setRiesgoCaida('RIESGO MEDIO');
    setRiesgoPiel('RIESGO BAJO');
    setNoteOutput('');
  };

  const autoFillDemo = () => {
    setAcomp('MADRE');
    setMotivo('CRISIS ASMATIFORME / BRONCOESPASMO');
    setTieneAlergias(false);
    setMed1('BETAMETASONA');
    setDosis1('4 MG');
    setVia1('INTRAMUSCULAR');
    setSitio1('CARA ANTEROLATERAL TERCIO MEDIO DEL MUSLO DERECHO');
    setCubiculo('1');
    setPosicion('DECÚBITO SUPINO (O DORSAL)');
    setRiesgoCaida('RIESGO MEDIO');
    setRiesgoPiel('RIESGO BAJO');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-pink-100 text-pink-700 rounded-xl">
            <Baby className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Medicamentos Pediátricos
            </h2>
            <p className="text-xs text-slate-500">
              Administración pediátrica segura, registro del acudiente/tutor, contención y sitios anatómicos pediátricos
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={autoFillDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-xl border border-pink-200 transition"
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
          {/* Section 1: Contexto */}
          <fieldset className="border border-slate-200 p-5 rounded-2xl bg-white shadow-xs space-y-4">
            <legend className="text-xs font-extrabold text-slate-600 px-3 uppercase tracking-wider bg-slate-100 rounded-lg border border-slate-200 py-1">
              1. Acompañante y Contexto Clínico
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Acompañante / Tutor
                </label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <select
                    value={acomp}
                    onChange={(e) => setAcomp(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                  >
                    <option value="MADRE">MADRE</option>
                    <option value="PADRE">PADRE</option>
                    <option value="ABUELO/A">ABUELO/A</option>
                    <option value="TUTOR LEGAL">TUTOR LEGAL</option>
                    <option value="OTRO">OTRO...</option>
                  </select>
                </div>
                {acomp === 'OTRO' && (
                  <input
                    type="text"
                    value={acompOtro}
                    onChange={(e) => setAcompOtro(e.target.value)}
                    placeholder="Especifique parentesco..."
                    className="w-full mt-2 p-2 border border-slate-300 rounded-xl text-xs"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Motivo de Consulta / Indicación
                </label>
                <input
                  type="text"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ej: Faringoamigdalitis, Otitis media"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
            </div>

            {/* Allergies */}
            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
              <label className="flex items-center font-bold text-amber-900 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={tieneAlergias}
                  onChange={(e) => setTieneAlergias(e.target.checked)}
                  className="h-4 w-4 text-amber-600 rounded mr-2"
                />
                Acudiente refiere antecedentes alérgicos del menor
              </label>
              {tieneAlergias && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    value={alergiaEsp}
                    onChange={(e) => setAlergiaEsp(e.target.value)}
                    placeholder="Especifique medicamento o sustancia alérgica..."
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>

            <DerechoDeberSelect value={derechoDeber} onChange={setDerechoDeber} />
          </fieldset>

          {/* Section 2: Meds y Contención */}
          <fieldset className="border border-slate-200 p-5 rounded-2xl bg-white shadow-xs space-y-4">
            <legend className="text-xs font-extrabold text-slate-600 px-3 uppercase tracking-wider bg-slate-100 rounded-lg border border-slate-200 py-1">
              2. Medicamentos y Parámetros Pediátricos
            </legend>

            {/* Med 1 */}
            <div className="p-4 bg-pink-50/50 border border-pink-200 rounded-2xl space-y-3">
              <h4 className="text-xs font-extrabold text-pink-800 uppercase tracking-wide">
                Medicamento Pediátrico 1
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Fármaco
                  </label>
                  <input
                    type="text"
                    value={med1}
                    onChange={(e) => setMed1(e.target.value)}
                    placeholder="Ej: Ceftriaxona"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Dosis
                  </label>
                  <input
                    type="text"
                    value={dosis1}
                    onChange={(e) => setDosis1(e.target.value)}
                    placeholder="Ej: 500 mg"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Vía
                  </label>
                  <input
                    type="text"
                    value={via1}
                    onChange={(e) => setVia1(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Sitio Anatómico Pediátrico
                </label>
                <select
                  value={sitio1}
                  onChange={(e) => setSitio1(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                >
                  {SITIOS_PEDIATRICOS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {sitio1 === 'OTRO' && (
                  <input
                    type="text"
                    value={sitio1Otro}
                    onChange={(e) => setSitio1Otro(e.target.value)}
                    placeholder="Especifique sitio..."
                    className="w-full mt-2 p-2 border border-slate-300 rounded-xl text-xs"
                  />
                )}
              </div>
            </div>

            {/* Med 2 Toggle */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <label className="flex items-center justify-between font-bold text-slate-800 text-sm cursor-pointer">
                <span className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-pink-600" />
                  ¿Añadir 2do medicamento pediátrico?
                </span>
                <input
                  type="checkbox"
                  checked={tieneMed2}
                  onChange={(e) => setTieneMed2(e.target.checked)}
                  className="h-4 w-4 text-pink-600 rounded"
                />
              </label>

              {tieneMed2 && (
                <div className="mt-3 p-3.5 bg-white border border-pink-200 rounded-xl space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Fármaco 2
                      </label>
                      <input
                        type="text"
                        value={med2}
                        onChange={(e) => setMed2(e.target.value)}
                        placeholder="Nombre Med 2"
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Dosis 2
                      </label>
                      <input
                        type="text"
                        value={dosis2}
                        onChange={(e) => setDosis2(e.target.value)}
                        placeholder="Dosis"
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Vía 2
                      </label>
                      <input
                        type="text"
                        value={via2}
                        onChange={(e) => setVia2(e.target.value)}
                        placeholder="Vía"
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Sitio Punción 2
                    </label>
                    <select
                      value={sitio2}
                      onChange={(e) => setSitio2(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                    >
                      {SITIOS_PEDIATRICOS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Position and Risk */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
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

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Posición del Menor en Camilla
                </label>
                <select
                  value={posicion}
                  onChange={(e) => setPosicion(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                >
                  {POSICIONES_PACIENTE.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                {posicion === 'OTRO' && (
                  <input
                    type="text"
                    value={posicionOtro}
                    onChange={(e) => setPosicionOtro(e.target.value)}
                    placeholder="Especifique posición"
                    className="w-full mt-2 p-2 border border-slate-300 rounded-xl text-xs"
                  />
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Riesgo Caída (Escala Pediátrica)
                </label>
                <select
                  value={riesgoCaida}
                  onChange={(e) => setRiesgoCaida(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                >
                  <option value="RIESGO BAJO">BAJO</option>
                  <option value="RIESGO MEDIO">MEDIO</option>
                  <option value="RIESGO ALTO">ALTO</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Riesgo Lesión Piel
                </label>
                <select
                  value={riesgoPiel}
                  onChange={(e) => setRiesgoPiel(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                >
                  <option value="RIESGO BAJO">BAJO</option>
                  <option value="RIESGO MEDIO">MEDIO</option>
                  <option value="RIESGO ALTO">ALTO</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-xl shadow-lg text-white bg-pink-600 hover:bg-pink-700 font-extrabold text-sm tracking-wide transition cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
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
            title="Vista Previa · Meds Pediátricos"
            badgeLabel="ACOMPAÑAMIENTO FAMILIAR"
          />
        </div>
      </div>
    </div>
  );
};
