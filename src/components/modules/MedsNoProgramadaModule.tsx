import React, { useState, useEffect } from 'react';
import { Gender, SavedNote } from '../../types/clinical';
import {
  DERECHOS_Y_DEBERES,
  POSICIONES_PACIENTE,
  SITIOS_INTRAMUSCULAR,
  MEDICAMENTOS_NO_PROGRAMADA,
  ANTICOAGULANTES_COMUNES,
  isOtroOption,
} from '../../constants/clinicalOptions';
import { DerechoDeberSelect } from '../common/DerechoDeberSelect';
import { NotePreview } from '../common/NotePreview';
import { Pill, Sparkles, RefreshCw, PlusCircle, Trash2, Radio } from 'lucide-react';

interface Props {
  onSaveToHistory: (noteText: string, summary: string) => SavedNote;
}

export const MedsNoProgramadaModule: React.FC<Props> = ({ onSaveToHistory }) => {
  const [genero, setGenero] = useState<Gender>('MASCULINO');
  const [motivo, setMotivo] = useState('DOLOR LUMBAR AGUDO');
  const [anticoagulado, setAnticoagulado] = useState<'NO' | 'SI'>('NO');
  const [medAnticoagulante, setMedAnticoagulante] = useState('');
  const [tieneAlergias, setTieneAlergias] = useState(false);
  const [alergiaEsp, setAlergiaEsp] = useState('');
  const [derechoDeber, setDerechoDeber] = useState(DERECHOS_Y_DEBERES[2].fullString);

  // Med 1 - Unificado Nombre del Medicamento y Dosis
  const [med1, setMed1] = useState('DICLOFENACO 75 MG');
  const [via1, setVia1] = useState<'INTRAMUSCULAR' | 'SUBCUTÁNEA' | 'OTRO'>('INTRAMUSCULAR');
  const [via1Otro, setVia1Otro] = useState('');
  const [sitio1, setSitio1] = useState(SITIOS_INTRAMUSCULAR[0].value);
  const [sitio1Otro, setSitio1Otro] = useState('');

  // Med 2 - Unificado Nombre del Medicamento y Dosis
  const [tieneMed2, setTieneMed2] = useState(false);
  const [med2, setMed2] = useState('DEXAMETASONA 8 MG');
  const [via2, setVia2] = useState<'INTRAMUSCULAR' | 'SUBCUTÁNEA' | 'OTRO'>('INTRAMUSCULAR');
  const [via2Otro, setVia2Otro] = useState('');
  const [sitio2, setSitio2] = useState(SITIOS_INTRAMUSCULAR[1].value);
  const [sitio2Otro, setSitio2Otro] = useState('');

  const [cubiculo, setCubiculo] = useState('1');
  const [posicion, setPosicion] = useState<string>('DECÚBITO PRONO (O VENTRAL)');
  const [posicionOtro, setPosicionOtro] = useState('');
  const [riesgoCaida, setRiesgoCaida] = useState('RIESGO BAJO');
  const [riesgoPiel, setRiesgoPiel] = useState('RIESGO BAJO');

  const [noteOutput, setNoteOutput] = useState('');

  const parseDD = (full: string) => {
    const parts = full.split('|');
    const d = parts[0]?.replace('Derecho:', '').trim() || '-';
    const b = parts[1]?.replace('Deber:', '').trim() || '-';
    return { d, b };
  };

  // Live real-time note generator
  useEffect(() => {
    const e = genero === 'MASCULINO' ? 'O' : 'A';
    const { d, b } = parseDD(derechoDeber);

    const alerStr = tieneAlergias
      ? `PACIENTE REFIERE ALERGIAS A ${alergiaEsp.trim().toUpperCase() || 'NO ESPECIFICADAS'}.`
      : 'PACIENTE NO REFIERE ALERGIAS.';

    const antiStr = anticoagulado === 'SI'
      ? ` PACIENTE REFIERE ESTAR ANTICOAGULADO CON ${medAnticoagulante.trim().toUpperCase() || 'MEDICAMENTO NO ESPECIFICADO'}.`
      : '';

    const s1Final = sitio1 === 'OTRO' ? sitio1Otro.trim().toUpperCase() || 'SITIO ESPECIFICADO' : sitio1;
    const s2Final = sitio2 === 'OTRO' ? sitio2Otro.trim().toUpperCase() || 'SITIO ESPECIFICADO' : sitio2;

    const v1Final = via1 === 'OTRO' ? (via1Otro.trim().toUpperCase() || 'VÍA ESPECIFICADA') : via1;
    const v2Final = via2 === 'OTRO' ? (via2Otro.trim().toUpperCase() || 'VÍA ESPECIFICADA') : via2;

    const m1Final = med1.trim().toUpperCase();
    const m2Final = med2.trim().toUpperCase();

    const ord = tieneMed2
      ? `${m1Final || '[MEDICAMENTO 1 Y DOSIS]'} ${v1Final} Y ${m2Final || '[MEDICAMENTO 2 Y DOSIS]'} ${v2Final}`
      : `${m1Final || '[MEDICAMENTO Y DOSIS]'} ${v1Final} DOSIS ÚNICA`;

    let adm = `SE REALIZA DESINFECCIÓN DEL ${s1Final}, SE ADMINISTRA ${m1Final || '[MEDICAMENTO Y DOSIS]'} DE FORMA ${v1Final}.`;
    if (tieneMed2) {
      adm = `SE REALIZA DESINFECCIÓN DEL ${s1Final}, SE ADMINISTRA ${m1Final || '[MEDICAMENTO 1 Y DOSIS]'} DE FORMA ${v1Final}. POSTERIORMENTE SE REALIZA DESINFECCIÓN DEL ${s2Final}, SE ADMINISTRA ${m2Final || '[MEDICAMENTO 2 Y DOSIS]'} DE FORMA ${v2Final} SIN PRESENTARSE NINGUNA REACCIÓN ADVERSA.`;
    } else {
      adm = `SE REALIZA DESINFECCIÓN DEL ${s1Final}, SE ADMINISTRA ${m1Final || '[MEDICAMENTO Y DOSIS]'} DE FORMA ${v1Final} SIN PRESENTARSE NINGUNA REACCIÓN ADVERSA.`;
    }

    const posFinal = posicion === 'OTRO' ? posicionOtro.trim().toUpperCase() || 'ESPECÍFICA' : posicion;

    const text = `INGRESA PACIENTE A SALA DE ENFERMERÍA, ALERTA, ORIENTAD${e}, CONSCIENTE, CAMINANDO POR SUS PROPIOS MEDIOS, TRAE ORDEN PARA ADMINISTRAR ${ord} COMO TRATAMIENTO PARA ${motivo.trim().toUpperCase() || '[MOTIVO / DIAGNÓSTICO]'}.

SE REVISA ORDEN MÉDICA, SE CONFIRMA PRESCRIPCIÓN, SE REVISA DISPONIBILIDAD DE LOS INSUMOS. SE REALIZA LISTA DE CHEQUEO PARA ADMINISTRACIÓN DE MEDICAMENTOS, SE INDAGAN ALERGIAS: ${alerStr}${antiStr}

SE OBTIENE FIRMA DE CONSENTIMIENTO DE ENFERMERÍA. SE REALIZA VERIFICACIÓN DE LOS 13 CORRECTOS EN LA ADMINISTRACIÓN DE MEDICAMENTOS. SE EXPLICA EL PROCEDIMIENTO, PACIENTE REFIERE ENTENDER Y ACEPTAR.

SE SOCIALIZA EL DERECHO Y DEBER: (DERECHO: ${d}. DEBER: ${b}).

SE REALIZA LAVADO DE MANOS. SE UBICA AL PACIENTE EN EL CUBÍCULO NÚMERO ${cubiculo}, EN CAMILLA, EN POSICIÓN ${posFinal}. SE VALORAN ESCALAS DE RIESGO: CAÍDA (${riesgoCaida}), LESIÓN DE PIEL (${riesgoPiel}).

${adm}

SE INDICA AL PACIENTE PERMANECER 10 MINUTOS EN EL CUBÍCULO COMO TIEMPO DE OBSERVACIÓN POST-ADMINISTRACIÓN DE MEDICAMENTOS. TRANSCURRIDOS LOS 10 MINUTOS, SALE PACIENTE DEL ÁREA DE ENFERMERÍA, ALERTA, ORIENTAD${e}, CONSCIENTE, CON EL MEDICAMENTO ADMINISTRADO. SE BRINDAN RECOMENDACIONES Y EDUCACIÓN EN TORNO AL MEDICAMENTO ADMINISTRADO. PACIENTE REFIERE ENTENDER Y ACEPTAR.`.toUpperCase();

    setNoteOutput(text);
  }, [
    genero,
    motivo,
    anticoagulado,
    medAnticoagulante,
    tieneAlergias,
    alergiaEsp,
    derechoDeber,
    med1,
    via1,
    via1Otro,
    sitio1,
    sitio1Otro,
    tieneMed2,
    med2,
    via2,
    via2Otro,
    sitio2,
    sitio2Otro,
    cubiculo,
    posicion,
    posicionOtro,
    riesgoCaida,
    riesgoPiel,
  ]);

  const handleSaveToHistoryClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteOutput.trim()) {
      const summary = tieneMed2
        ? `Meds NP (2 Medicamentos): ${med1} + ${med2} (${motivo})`
        : `Meds NP: ${med1} (${motivo})`;
      onSaveToHistory(noteOutput, summary);
    }
  };

  const handleClear = () => {
    setGenero('MASCULINO');
    setMotivo('');
    setAnticoagulado('NO');
    setMedAnticoagulante('');
    setTieneAlergias(false);
    setAlergiaEsp('');
    setMed1('');
    setVia1('INTRAMUSCULAR');
    setVia1Otro('');
    setSitio1(SITIOS_INTRAMUSCULAR[0].value);
    setSitio1Otro('');
    setTieneMed2(false);
    setMed2('');
    setVia2('INTRAMUSCULAR');
    setVia2Otro('');
    setSitio2(SITIOS_INTRAMUSCULAR[1].value);
    setSitio2Otro('');
    setCubiculo('1');
    setPosicion('DECÚBITO PRONO (O VENTRAL)');
    setPosicionOtro('');
    setRiesgoCaida('RIESGO BAJO');
    setRiesgoPiel('RIESGO BAJO');
    setNoteOutput('');
  };

  const autoFillDemo = () => {
    setGenero('FEMENINO');
    setMotivo('CÓLICO RENAL AGUDO');
    setAnticoagulado('NO');
    setTieneAlergias(false);
    setMed1('HIOSCINA N-BUTILBROMURO 20 MG');
    setVia1('INTRAMUSCULAR');
    setVia1Otro('');
    setSitio1('CUADRANTE SUPERIOR EXTERNO DEL GLUTEO DERECHO');
    setTieneMed2(true);
    setMed2('DIPIRONA 1 G');
    setVia2('INTRAMUSCULAR');
    setVia2Otro('');
    setSitio2('CUADRANTE SUPERIOR EXTERNO DEL GLUTEO IZQUIERDO');
    setCubiculo('2');
    setPosicion('DECÚBITO PRONO (O VENTRAL)');
    setRiesgoCaida('RIESGO BAJO');
    setRiesgoPiel('RIESGO BAJO');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                Medicamentos (No Programada / Consulta Prioritaria)
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                EN TIEMPO REAL (LIVE)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Verificación de 13 correctos, consentimiento, sitios anatómicos y tiempo de observación
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={autoFillDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autollenar Ejemplo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form
          onSubmit={handleSaveToHistoryClick}
          className="lg:col-span-7 space-y-6"
        >
          {/* Section 1: Contexto */}
          <fieldset className="border border-slate-200 p-5 rounded-2xl bg-white shadow-xs space-y-4">
            <legend className="text-xs font-extrabold text-slate-600 px-3 uppercase tracking-wider bg-slate-100 rounded-lg border border-slate-200 py-1">
              1. Contexto del Paciente
            </legend>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Género</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="np-gen"
                    value="MASCULINO"
                    checked={genero === 'MASCULINO'}
                    onChange={() => setGenero('MASCULINO')}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 mr-2"
                  />
                  Masculino
                </label>
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="np-gen"
                    value="FEMENINO"
                    checked={genero === 'FEMENINO'}
                    onChange={() => setGenero('FEMENINO')}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 mr-2"
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
                  placeholder="Ej: Cefalea tensional, Lumbago"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-purple-500"
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
                      list="anticoagulantes-list"
                      value={medAnticoagulante}
                      onChange={(e) => setMedAnticoagulante(e.target.value)}
                      placeholder="Ej: Warfarina, Rivaroxabán, Apixabán, Dabigatrán, ASA..."
                      className="w-full p-2.5 bg-red-50/70 border border-red-300 rounded-xl text-xs sm:text-sm font-semibold text-red-950 focus:ring-2 focus:ring-red-500"
                      autoFocus
                    />
                    <datalist id="anticoagulantes-list">
                      {ANTICOAGULANTES_COMUNES.map((med) => (
                        <option key={med} value={med} />
                      ))}
                    </datalist>
                  </div>
                )}
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
                Refiere antecedentes alérgicos
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

          {/* Section 2: Medicamentos y Riesgos */}
          <fieldset className="border border-slate-200 p-5 rounded-2xl bg-white shadow-xs space-y-4">
            <legend className="text-xs font-extrabold text-slate-600 px-3 uppercase tracking-wider bg-slate-100 rounded-lg border border-slate-200 py-1">
              2. Medicamentos y Parámetros Asistenciales
            </legend>

            {/* Checkbox Indicación para 2 Medicamentos */}
            <div
              className={`p-4 rounded-2xl border-2 transition-all ${
                tieneMed2
                  ? 'bg-purple-100/70 border-purple-400 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:border-purple-300 hover:bg-purple-50/30'
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl transition ${
                      tieneMed2 ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-slate-900">
                      ¿La indicación médica incluye dos (2) medicamentos?
                    </span>
                    <span className="block text-xs font-semibold text-purple-700">
                      Marque esta casilla si la orden prescribe 2 fármacos concomitantes. Al activarla se habilitará el registro del segundo medicamento y se incluirá en la nota.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={tieneMed2}
                  onChange={(e) => setTieneMed2(e.target.checked)}
                  className="h-5 w-5 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                />
              </label>
            </div>

            {/* Datalist for fast drug input */}
            <datalist id="meds-np-list">
              {MEDICAMENTOS_NO_PROGRAMADA.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>

            {/* Med 1 */}
            <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-purple-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-purple-700" />
                  <span>Medicamento 1 {tieneMed2 ? '(Primer Fármaco)' : ''}</span>
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
                  Principal
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Cuadro único para Nombre del Medicamento y Dosis */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Nombre del Medicamento y Dosis
                  </label>
                  <input
                    type="text"
                    list="meds-np-list"
                    value={med1}
                    onChange={(e) => setMed1(e.target.value)}
                    placeholder="Ej: DICLOFENACO 75 MG"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold bg-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <span className="block text-[11px] text-slate-400 mt-1">
                    Nombre y dosis estándar (ej: Diclofenaco 75 mg, Dipirona 1 g).
                  </span>
                </div>

                {/* Vía de administración con INTRAMUSCULAR, SUBCUTÁNEA, OTRO */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Vía de Administración
                  </label>
                  <select
                    value={via1}
                    onChange={(e) => setVia1(e.target.value as 'INTRAMUSCULAR' | 'SUBCUTÁNEA' | 'OTRO')}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="INTRAMUSCULAR">INTRAMUSCULAR</option>
                    <option value="SUBCUTÁNEA">SUBCUTÁNEA</option>
                    <option value="OTRO">OTRO (ESPECIFICAR)</option>
                  </select>

                  {via1 === 'OTRO' && (
                    <div className="mt-2 animate-in fade-in duration-150">
                      <input
                        type="text"
                        value={via1Otro}
                        onChange={(e) => setVia1Otro(e.target.value)}
                        placeholder="Especifique otra vía (ej: ENDOVENOSA, INTRADÉRMICA)..."
                        className="w-full p-2.5 border border-purple-300 rounded-xl text-xs sm:text-sm font-semibold bg-purple-50/50 focus:ring-2 focus:ring-purple-500"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Sitio Anatómico de Punción
                </label>
                <select
                  value={sitio1}
                  onChange={(e) => setSitio1(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold bg-white focus:ring-2 focus:ring-purple-500"
                >
                  {SITIOS_INTRAMUSCULAR.map((s) => (
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
                    placeholder="Especifique sitio anatómico..."
                    className="w-full mt-2 p-2 border border-slate-300 rounded-xl text-xs"
                  />
                )}
              </div>
            </div>

            {/* Med 2 Card (shown if tieneMed2 is checked) */}
            {tieneMed2 && (
              <div className="p-4 bg-purple-100/50 border-2 border-purple-300 rounded-2xl space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-purple-950 uppercase tracking-wide flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-purple-800" />
                    <span>Medicamento 2 (Segundo Fármaco Concomitante)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setTieneMed2(false)}
                    className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Quitar 2do med</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Cuadro único para Nombre del Medicamento y Dosis 2 */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Nombre del Medicamento y Dosis 2
                    </label>
                    <input
                      type="text"
                      list="meds-np-list"
                      value={med2}
                      onChange={(e) => setMed2(e.target.value)}
                      placeholder="Ej: DEXAMETASONA 8 MG"
                      className="w-full p-2.5 border border-purple-300 rounded-xl text-sm font-semibold bg-white focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="block text-[11px] text-purple-700 mt-1">
                      Segundo fármaco prescrito (ej: Dexametasona 8 mg).
                    </span>
                  </div>

                  {/* Vía 2 */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Vía de Administración 2
                    </label>
                    <select
                      value={via2}
                      onChange={(e) => setVia2(e.target.value as 'INTRAMUSCULAR' | 'SUBCUTÁNEA' | 'OTRO')}
                      className="w-full p-2.5 border border-purple-300 rounded-xl text-sm font-semibold bg-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="INTRAMUSCULAR">INTRAMUSCULAR</option>
                      <option value="SUBCUTÁNEA">SUBCUTÁNEA</option>
                      <option value="OTRO">OTRO (ESPECIFICAR)</option>
                    </select>

                    {via2 === 'OTRO' && (
                      <div className="mt-2 animate-in fade-in duration-150">
                        <input
                          type="text"
                          value={via2Otro}
                          onChange={(e) => setVia2Otro(e.target.value)}
                          placeholder="Especifique otra vía para medicamento 2..."
                          className="w-full p-2.5 border border-purple-300 rounded-xl text-xs sm:text-sm font-semibold bg-purple-50/50 focus:ring-2 focus:ring-purple-500"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Sitio Anatómico Punción 2
                  </label>
                  <select
                    value={sitio2}
                    onChange={(e) => setSitio2(e.target.value)}
                    className="w-full p-2.5 border border-purple-300 rounded-xl text-xs sm:text-sm font-semibold bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    {SITIOS_INTRAMUSCULAR.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {sitio2 === 'OTRO' && (
                    <input
                      type="text"
                      value={sitio2Otro}
                      onChange={(e) => setSitio2Otro(e.target.value)}
                      placeholder="Especifique sitio punción 2..."
                      className="w-full mt-2 p-2 border border-slate-300 rounded-xl text-xs"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Position and Risk assessment */}
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
                  Posición del Paciente en Camilla
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
                  Riesgo de Caída
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
                  Riesgo de Lesión en Piel
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
              className="flex-1 py-3.5 px-6 rounded-xl shadow-lg text-white bg-purple-600 hover:bg-purple-700 font-extrabold text-sm tracking-wide transition cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
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
            title="Vista Previa · Meds No Programada"
            badgeLabel="LISTA DE 13 CORRECTOS"
          />
        </div>
      </div>
    </div>
  );
};
