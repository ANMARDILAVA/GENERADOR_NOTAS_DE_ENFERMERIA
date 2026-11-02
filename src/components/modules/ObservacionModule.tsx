import React, { useState } from 'react';
import { Gender, SavedNote, VitalSigns } from '../../types/clinical';
import { DERECHOS_Y_DEBERES, POSICIONES_PACIENTE } from '../../constants/clinicalOptions';
import { DerechoDeberSelect } from '../common/DerechoDeberSelect';
import { VitalSignsModal } from '../common/VitalSignsModal';
import { NotePreview } from '../common/NotePreview';
import {
  BedDouble,
  Sparkles,
  RefreshCw,
  PlusCircle,
  LogIn,
  LogOut,
  Droplet,
  Activity,
} from 'lucide-react';

interface Props {
  onSaveToHistory: (noteText: string, summary: string) => SavedNote;
}

export const ObservacionModule: React.FC<Props> = ({ onSaveToHistory }) => {
  // 1. Ingreso
  const [genero, setGenero] = useState<Gender>('MASCULINO');
  const [medicoRefiere, setMedicoRefiere] = useState('DR. ANDRES TORRES');
  const [motivo, setMotivo] = useState('GASTROENTERITIS AGUDA CON DESHIDRATACIÓN LEVE');
  const [med1, setMed1] = useState('METOCLOPRAMIDA 10 MG');
  const [dil1, setDil1] = useState('250');

  const [tieneMed2, setTieneMed2] = useState(false);
  const [med2, setMed2] = useState('OMEPRAZOL 40 MG');
  const [dil2, setDil2] = useState('100');

  const [tieneAlergias, setTieneAlergias] = useState(false);
  const [alergiaEsp, setAlergiaEsp] = useState('');
  const [derechoDeber, setDerechoDeber] = useState(DERECHOS_Y_DEBERES[2].fullString);

  const [svIniTipo, setSvIniTipo] = useState<'NORMALES' | 'ALTERADOS'>('NORMALES');
  const [svIniValues, setSvIniValues] = useState<VitalSigns>({});
  const [isSvIniModalOpen, setIsSvIniModalOpen] = useState(false);

  const [sintomas, setSintomas] = useState('EPIGASTRALGIA, NÁUSEAS Y EPISODIOS EMÉTICOS');
  const [posicionIngreso, setPosicionIngreso] = useState<string>('DECÚBITO SUPINO (O DORSAL)');
  const [posicionIngresoOtro, setPosicionIngresoOtro] = useState('');
  const [riesgoCaida, setRiesgoCaida] = useState('RIESGO BAJO');
  const [riesgoPiel, setRiesgoPiel] = useState('RIESGO BAJO');
  const [dolor, setDolor] = useState('DOLOR 6/10');

  const [miembro, setMiembro] = useState<'DERECHO' | 'IZQUIERDO'>('DERECHO');
  const [vena, setVena] = useState('CEFÁLICA');
  const [yelco, setYelco] = useState('20');
  const [punciones, setPunciones] = useState('ÚNICA PUNCIÓN');

  // 2. Nota adicional
  const [medAdi, setMedAdi] = useState('SOLUCIÓN SALINA AL 0.9%');
  const [dilAdi, setDilAdi] = useState('500');
  const [posicionAdi, setPosicionAdi] = useState<string>('DECÚBITO SUPINO (O DORSAL)');
  const [posicionAdiOtro, setPosicionAdiOtro] = useState('');
  const [cubiculoAdi, setCubiculoAdi] = useState('1');

  // 3. Egreso
  const [medicoEgreso, setMedicoEgreso] = useState('DR. ANDRES TORRES');
  const [svFinTipo, setSvFinTipo] = useState<'NORMALES' | 'ALTERADOS'>('NORMALES');
  const [svFinValues, setSvFinValues] = useState<VitalSigns>({});
  const [isSvFinModalOpen, setIsSvFinModalOpen] = useState(false);
  const [retiroYelco, setRetiroYelco] = useState<'SIN NOVEDAD' | 'SANGRADO'>('SIN NOVEDAD');

  // Fluid accumulator and output
  const [liquidosTotales, setLiquidosTotales] = useState<number>(0);
  const [noteOutput, setNoteOutput] = useState('');

  const parseDD = (full: string) => {
    const parts = full.split('|');
    const d = parts[0]?.replace('Derecho:', '').trim() || '-';
    const b = parts[1]?.replace('Deber:', '').trim() || '-';
    return { d, b };
  };

  const formatSvString = (tipo: 'NORMALES' | 'ALTERADOS', vals: VitalSigns) => {
    if (tipo === 'NORMALES') return 'NORMALES';
    const details: string[] = [];
    if (vals.ta) details.push(`TA: ${vals.ta}`);
    if (vals.fc) details.push(`FC: ${vals.fc}`);
    if (vals.fr) details.push(`FR: ${vals.fr}`);
    if (vals.temp) details.push(`T: ${vals.temp}`);
    if (vals.spo2) details.push(`SPO2: ${vals.spo2}`);
    return details.length > 0 ? `ALTERADOS (${details.join(', ')})` : 'ALTERADOS';
  };

  // 1. Generate Ingreso
  const handleGenerarIngreso = () => {
    const e = genero === 'MASCULINO' ? 'O' : 'A';
    const { d, b } = parseDD(derechoDeber);
    const alerStr = tieneAlergias
      ? `SE INDAGAN ALERGIAS, REFIERE ALERGIAS A ${alergiaEsp.trim().toUpperCase() || 'NO ESPECIFICADAS'}`
      : 'SE INDAGAN ALERGIAS, NIEGA ALERGIAS';

    const d1Num = parseInt(dil1, 10) || 0;
    const d2Num = tieneMed2 ? parseInt(dil2, 10) || 0 : 0;
    const initialLiq = d1Num + d2Num;
    setLiquidosTotales(initialLiq);

    let ord = med1.trim();
    if (tieneMed2 && med2.trim()) ord += ` Y ${med2.trim()}`;

    let adm = `SE INICIA ${med1.trim()} DILUIDO EN ${d1Num} ML DE SOL. SALINA.`;
    if (tieneMed2 && med2.trim()) {
      adm += ` POSTERIORMENTE ${med2.trim()} DILUIDO EN ${d2Num} ML.`;
    }

    const posFinal =
      posicionIngreso === 'OTRO'
        ? posicionIngresoOtro.trim().toUpperCase() || 'ESPECÍFICA'
        : posicionIngreso;

    const svStr = formatSvString(svIniTipo, svIniValues);

    const text = `INGRESA PACIENTE A SALA DE ENFERMERÍA, ALERTA, ORIENTAD${e}, EN COMPAÑÍA DE ${medicoRefiere.trim().toUpperCase()} CON ORDEN PARA CANALIZAR Y ADMINISTRAR ${ord} COMO TRATAMIENTO PARA ${motivo.trim().toUpperCase()}.

${alerStr}. SE FIRMA CONSENTIMIENTO. SE SOCIALIZA DERECHO Y DEBER: (DERECHO: ${d}. DEBER: ${b}).

SE TOMAN SIGNOS VITALES LOS CUALES ESTÁN ${svStr}. PACIENTE PRESENTA: ${sintomas.trim().toUpperCase()}. RIESGOS: CAÍDA (${riesgoCaida}), PIEL (${riesgoPiel}), DOLOR (${dolor.trim().toUpperCase()}).

PREVIO LAVADO DE MANOS Y BAJO TÉCNICA ASÉPTICA SE CANALIZA VENA ${vena.trim().toUpperCase()} EN MIEMBRO ${miembro} CON YELCO NRO ${yelco}, ${punciones}. SE FIJA ACCESO. ${adm} SE DEJA PACIENTE EN CAMILLA, EN POSICIÓN ${posFinal}, BARANDAS ARRIBA.`.toUpperCase();

    setNoteOutput(text);
    onSaveToHistory(text, `Obs. Ingreso: ${motivo}`);
  };

  // 2. Append Additional Evolution Note
  const handleAddNotaAdicional = () => {
    if (!medAdi.trim()) return;
    const dilNum = parseInt(dilAdi, 10) || 0;
    const newTotal = liquidosTotales + dilNum;
    setLiquidosTotales(newTotal);

    const posFinal =
      posicionAdi === 'OTRO'
        ? posicionAdiOtro.trim().toUpperCase() || 'ESPECÍFICA'
        : posicionAdi;

    const additionalText = `\n\nCONTINÚA PACIENTE EN CAMILLA (CUBÍCULO ${cubiculoAdi}), POSICIÓN ${posFinal}. FINALIZA MEDICAMENTO ANTERIOR Y SE INICIA ${medAdi.trim().toUpperCase()} DILUIDO EN ${dilNum} ML. CONTINÚA EN OBSERVACIÓN.`.toUpperCase();

    const updated = noteOutput + additionalText;
    setNoteOutput(updated);
    onSaveToHistory(updated, `Obs. Evolución: ${medAdi}`);
  };

  // 3. Append Discharge Note
  const handleGenerarEgreso = () => {
    const e = genero === 'MASCULINO' ? 'O' : 'A';
    const svStr = formatSvString(svFinTipo, svFinValues);

    const egresoText = `\n\nFINALIZA ADMINISTRACIÓN, ${medicoEgreso.trim().toUpperCase()} VALORA PACIENTE Y DA ORDEN DE SALIDA. SIGNOS VITALES: ${svStr}. SE RETIRA ACCESO VENOSO ${retiroYelco}.\nLÍQUIDOS TOTALES: ${liquidosTotales} ML.\nSALE PACIENTE, ALERTA, ORIENTAD${e}, CON RECOMENDACIONES.`.toUpperCase();

    const updated = noteOutput + egresoText;
    setNoteOutput(updated);
    onSaveToHistory(updated, `Obs. Egreso: Líquidos ${liquidosTotales} ml`);
  };

  const handleClearAll = () => {
    setLiquidosTotales(0);
    setNoteOutput('');
    setMed1('');
    setMed2('');
    setTieneMed2(false);
    setTieneAlergias(false);
    setAlergiaEsp('');
    setSvIniTipo('NORMALES');
    setSvIniValues({});
    setSvFinTipo('NORMALES');
    setSvFinValues({});
  };

  const autoFillDemo = () => {
    setGenero('FEMENINO');
    setMedicoRefiere('DRA. LAURA PATIÑO');
    setMotivo('CÓLICO BILIAR EN ESTUDIO');
    setMed1('HIOSCINA 20 MG + METAMIZOL 2 G');
    setDil1('250');
    setTieneMed2(false);
    setTieneAlergias(false);
    setSintomas('DOLOR CÓLICO EN HIPOCONDRIO DERECHO Y NÁUSEAS');
    setDolor('DOLOR 7/10');
    setVena('RADIAL');
    setYelco('20');
    setMiembro('IZQUIERDO');
    setPunciones('ÚNICA PUNCIÓN');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-red-100 text-red-700 rounded-xl">
            <BedDouble className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                Sala de Observación Clínica
              </h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-red-100 text-red-700">
                LÍQUIDOS TOTALES: {liquidosTotales} ML
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Secuencia progresiva: Ingreso y canalización, notas de evolución y egreso con balance hídrico
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={autoFillDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autollenar Ejemplo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3 Progressive Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* Form 1: Ingreso y Canalización */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerarIngreso();
            }}
            className="border border-slate-200 p-5 rounded-2xl bg-white shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-extrabold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                <LogIn className="w-4 h-4 text-red-600" />
                1. Ingreso y Canalización Venosa
              </h3>
              <span className="text-[11px] font-bold text-slate-400">Paso 1</span>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="obs-gen"
                  value="MASCULINO"
                  checked={genero === 'MASCULINO'}
                  onChange={() => setGenero('MASCULINO')}
                  className="h-4 w-4 text-red-600 mr-2"
                />
                Masculino
              </label>
              <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="obs-gen"
                  value="FEMENINO"
                  checked={genero === 'FEMENINO'}
                  onChange={() => setGenero('FEMENINO')}
                  className="h-4 w-4 text-red-600 mr-2"
                />
                Femenino
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Médico que refiere / indica
                </label>
                <input
                  type="text"
                  value={medicoRefiere}
                  onChange={(e) => setMedicoRefiere(e.target.value)}
                  placeholder="Ej: Dr. Carlos Pérez"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Tratamiento para / Motivo
                </label>
                <input
                  type="text"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ej: Crisis migrañosa, Deshidratación"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                  required
                />
              </div>
            </div>

            {/* Meds al ingreso */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Med 1 a Administrar
                  </label>
                  <input
                    type="text"
                    value={med1}
                    onChange={(e) => setMed1(e.target.value)}
                    placeholder="Ej: Metoclopramida 10 mg"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs sm:text-sm font-semibold bg-white"
                    required
                  />
                </div>
                <div className="w-28 sm:w-32">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Dilución (ml)
                  </label>
                  <input
                    type="number"
                    value={dil1}
                    onChange={(e) => setDil1(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs sm:text-sm font-semibold bg-white"
                    required
                  />
                </div>
              </div>

              {/* Med 2 toggle */}
              <div>
                <label className="flex items-center text-xs font-bold text-red-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tieneMed2}
                    onChange={(e) => setTieneMed2(e.target.checked)}
                    className="h-4 w-4 text-red-600 rounded mr-2"
                  />
                  Añadir 2do medicamento concomitante al ingreso
                </label>
                {tieneMed2 && (
                  <div className="flex gap-3 mt-2 pt-2 border-t border-slate-200">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={med2}
                        onChange={(e) => setMed2(e.target.value)}
                        placeholder="Nombre Med 2"
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs sm:text-sm font-semibold bg-white"
                      />
                    </div>
                    <div className="w-28 sm:w-32">
                      <input
                        type="number"
                        value={dil2}
                        onChange={(e) => setDil2(e.target.value)}
                        placeholder="ml"
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs sm:text-sm font-semibold bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Allergies */}
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
              <label className="flex items-center font-bold text-amber-900 text-xs sm:text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={tieneAlergias}
                  onChange={(e) => setTieneAlergias(e.target.checked)}
                  className="h-4 w-4 text-amber-600 rounded mr-2"
                />
                Refiere antecedentes alérgicos
              </label>
              {tieneAlergias && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={alergiaEsp}
                    onChange={(e) => setAlergiaEsp(e.target.value)}
                    placeholder="Especifique alergias..."
                    className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs"
                  />
                </div>
              )}
            </div>

            <DerechoDeberSelect value={derechoDeber} onChange={setDerechoDeber} />

            {/* Vitals and Symptoms */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Signos Vitales Iniciales
                </label>
                <div className="flex gap-2">
                  <select
                    value={svIniTipo}
                    onChange={(e) =>
                      setSvIniTipo(e.target.value as 'NORMALES' | 'ALTERADOS')
                    }
                    className="flex-1 p-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                  >
                    <option value="NORMALES">S.V. Iniciales NORMALES</option>
                    <option value="ALTERADOS">ALTERADOS (Registrar valores)</option>
                  </select>
                  {svIniTipo === 'ALTERADOS' && (
                    <button
                      type="button"
                      onClick={() => setIsSvIniModalOpen(true)}
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Diligenciar SV
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Escala de Dolor
                </label>
                <input
                  type="text"
                  value={dolor}
                  onChange={(e) => setDolor(e.target.value)}
                  placeholder="Ej: Dolor 4/10"
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Síntomas Presentados al Ingreso
                </label>
                <input
                  type="text"
                  value={sintomas}
                  onChange={(e) => setSintomas(e.target.value)}
                  placeholder="Ej: Emesis persistente, cefalea holocraneana"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Posición del Paciente en Camilla
                </label>
                <select
                  value={posicionIngreso}
                  onChange={(e) => setPosicionIngreso(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                >
                  {POSICIONES_PACIENTE.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Riesgo Caída
                </label>
                <select
                  value={riesgoCaida}
                  onChange={(e) => setRiesgoCaida(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                >
                  <option value="RIESGO BAJO">BAJO</option>
                  <option value="RIESGO MEDIO">MEDIO</option>
                  <option value="RIESGO ALTO">ALTO</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Riesgo Piel
                </label>
                <select
                  value={riesgoPiel}
                  onChange={(e) => setRiesgoPiel(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                >
                  <option value="RIESGO BAJO">BAJO</option>
                  <option value="RIESGO MEDIO">MEDIO</option>
                  <option value="RIESGO ALTO">ALTO</option>
                </select>
              </div>
            </div>

            {/* Canalización */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Miembro
                </label>
                <select
                  value={miembro}
                  onChange={(e) => setMiembro(e.target.value as 'DERECHO' | 'IZQUIERDO')}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                >
                  <option value="DERECHO">M.S. DERECHO</option>
                  <option value="IZQUIERDO">M.S. IZQUIERDO</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Vena
                </label>
                <input
                  type="text"
                  value={vena}
                  onChange={(e) => setVena(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Calibre Yelco
                </label>
                <select
                  value={yelco}
                  onChange={(e) => setYelco(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                >
                  <option value="18">Yelco 18</option>
                  <option value="20">Yelco 20</option>
                  <option value="22">Yelco 22</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Intentos
                </label>
                <select
                  value={punciones}
                  onChange={(e) => setPunciones(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                >
                  <option value="ÚNICA PUNCIÓN">ÚNICA PUNCIÓN</option>
                  <option value="MÚLTIPLES">MÚLTIPLES</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl shadow-md text-white bg-red-600 hover:bg-red-700 font-extrabold text-xs sm:text-sm tracking-wide transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>GENERAR INGRESO Y CANALIZACIÓN</span>
            </button>
          </form>

          {/* Form 2: Nota Adicional / Evolución */}
          <div className="border border-indigo-200 p-5 rounded-2xl bg-indigo-50/40 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
              <h3 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                2. Nota de Evolución / Siguiente Medicamento
              </h3>
              <span className="text-[11px] font-bold text-indigo-500">Opcional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Siguiente Medicamento / Infusión
                </label>
                <input
                  type="text"
                  value={medAdi}
                  onChange={(e) => setMedAdi(e.target.value)}
                  placeholder="Ej: Solución Salina, Dipirona 1 g"
                  className="w-full p-2.5 border border-indigo-200 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Dilución (ml)
                </label>
                <input
                  type="number"
                  value={dilAdi}
                  onChange={(e) => setDilAdi(e.target.value)}
                  className="w-full p-2.5 border border-indigo-200 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Posición del Paciente
                </label>
                <select
                  value={posicionAdi}
                  onChange={(e) => setPosicionAdi(e.target.value)}
                  className="w-full p-2 border border-indigo-200 rounded-xl text-xs font-semibold bg-white"
                >
                  {POSICIONES_PACIENTE.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Cubículo
                </label>
                <input
                  type="number"
                  value={cubiculoAdi}
                  onChange={(e) => setCubiculoAdi(e.target.value)}
                  className="w-full p-2 border border-indigo-200 rounded-xl text-xs font-semibold bg-white"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddNotaAdicional}
              disabled={!noteOutput}
              className="w-full py-3 px-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs sm:text-sm tracking-wide transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircle className="w-4 h-4" />
              <span>AÑADIR NOTA DE EVOLUCIÓN (+{dilAdi || 0} ML)</span>
            </button>
          </div>

          {/* Form 3: Egreso */}
          <div className="border border-emerald-200 p-5 rounded-2xl bg-emerald-50/40 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <h3 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <LogOut className="w-4 h-4 text-emerald-600" />
                3. Egreso / Cierre de Observación
              </h3>
              <span className="text-[11px] font-bold text-emerald-600">Alta Clínica</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Médico que da Salida
                </label>
                <input
                  type="text"
                  value={medicoEgreso}
                  onChange={(e) => setMedicoEgreso(e.target.value)}
                  placeholder="Ej: Dra. María López"
                  className="w-full p-2.5 border border-emerald-200 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Retiro de Acceso Venoso (Yelco)
                </label>
                <select
                  value={retiroYelco}
                  onChange={(e) =>
                    setRetiroYelco(e.target.value as 'SIN NOVEDAD' | 'SANGRADO')
                  }
                  className="w-full p-2.5 border border-emerald-200 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                >
                  <option value="SIN NOVEDAD">Retiro Yelco: SIN NOVEDAD</option>
                  <option value="SANGRADO">Con Sangrado / Hematoma leve</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Signos Vitales al Egreso
                </label>
                <div className="flex gap-2">
                  <select
                    value={svFinTipo}
                    onChange={(e) =>
                      setSvFinTipo(e.target.value as 'NORMALES' | 'ALTERADOS')
                    }
                    className="flex-1 p-2 border border-emerald-200 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                  >
                    <option value="NORMALES">S.V. Finales NORMALES</option>
                    <option value="ALTERADOS">ALTERADOS (Registrar valores)</option>
                  </select>
                  {svFinTipo === 'ALTERADOS' && (
                    <button
                      type="button"
                      onClick={() => setIsSvFinModalOpen(true)}
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Diligenciar SV
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerarEgreso}
              disabled={!noteOutput}
              className="w-full py-3 px-4 rounded-xl shadow-md text-white bg-emerald-600 hover:bg-emerald-700 font-extrabold text-xs sm:text-sm tracking-wide transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4" />
              <span>REGISTRAR EGRESO Y BALANCE ({liquidosTotales} ML)</span>
            </button>
          </div>

          {/* Action buttons at the end of the module */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleGenerarIngreso}
              className="flex-1 py-3.5 px-6 rounded-xl shadow-lg text-white bg-red-600 hover:bg-red-700 font-extrabold text-sm tracking-wide transition cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>GENERAR NOTA DE ENFERMERÍA</span>
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="sm:w-auto py-3.5 px-6 border border-slate-300 rounded-xl text-slate-700 bg-white hover:bg-slate-50 font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>LIMPIAR NOTA DE ENFERMERÍA</span>
            </button>
          </div>
        </div>

        {/* Right Column: Note Preview */}
        <div className="lg:col-span-5 h-full lg:sticky lg:top-4 space-y-4">
          <NotePreview
            noteText={noteOutput}
            onNoteChange={setNoteOutput}
            onClear={handleClearAll}
            onAutoFillDemo={autoFillDemo}
            title="Evolución Continua · Observación"
            badgeLabel={`LÍQUIDOS: ${liquidosTotales} ML`}
            rows={28}
          />
        </div>
      </div>

      {/* Vital Signs Modals */}
      <VitalSignsModal
        isOpen={isSvIniModalOpen}
        onClose={() => setIsSvIniModalOpen(false)}
        onSave={setSvIniValues}
        initialValues={svIniValues}
        title="Signos Vitales Alterados (Ingreso)"
      />

      <VitalSignsModal
        isOpen={isSvFinModalOpen}
        onClose={() => setIsSvFinModalOpen(false)}
        onSave={setSvFinValues}
        initialValues={svFinValues}
        title="Signos Vitales Alterados (Egreso)"
      />
    </div>
  );
};
