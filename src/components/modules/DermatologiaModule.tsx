import React, { useState, useEffect } from 'react';
import { Gender, SavedNote } from '../../types/clinical';
import {
  DERMATOLOGOS,
  DERECHOS_Y_DEBERES,
  RECOMENDACIONES_DERMATOLOGIA,
} from '../../constants/clinicalOptions';
import { DerechoDeberSelect } from '../common/DerechoDeberSelect';
import { NotePreview } from '../common/NotePreview';
import { Stethoscope, Sparkles, RefreshCw, Radio } from 'lucide-react';

interface Props {
  onSaveToHistory: (noteText: string, summary: string) => SavedNote;
}

type ProcType =
  | 'BIOPSIA'
  | 'RESECCION'
  | 'INFILTRACION'
  | 'CRIOTERAPIA'
  | 'NASOLARINGOSCOPIA'
  | 'OTRO_PROC';

export const DermatologiaModule: React.FC<Props> = ({ onSaveToHistory }) => {
  const [genero, setGenero] = useState<Gender>('MASCULINO');
  const [profesional, setProfesional] = useState(DERMATOLOGOS[0]);
  const [derechoDeber, setDerechoDeber] = useState(DERECHOS_Y_DEBERES[2].fullString);
  const [riesgoCaida, setRiesgoCaida] = useState('BAJO');
  const [riesgoPiel, setRiesgoPiel] = useState('BAJO');
  const [tieneAlergias, setTieneAlergias] = useState(false);
  const [alergiaEsp, setAlergiaEsp] = useState('');

  // Procedure Selection
  const [selectedProc, setSelectedProc] = useState<ProcType>('BIOPSIA');
  const [nombreProc, setNombreProc] = useState('BIOPSIA DE LESIÓN');
  const [zonaAnatomica, setZonaAnatomica] = useState('REGIÓN MALAR DERECHA');
  const [posicion, setPosicion] = useState('SUPINO');

  // Specific dynamic fields
  const [anestesia, setAnestesia] = useState('ROXICAINA 1% S/E Y BUPIVACAÍNA');
  const [instrumental, setInstrumental] = useState('PUNCH DE 4 MM');
  const [tieneCauterizacion, setTieneCauterizacion] = useState(true);
  const [metodoCauterizacion, setMetodoCauterizacion] = useState('ELECTROFULGURACIÓN');
  const [farmacoInfiltracion, setFarmacoInfiltracion] = useState('KENACORT');

  // Suture and material count
  const [tieneSutura, setTieneSutura] = useState(true);
  const [materialSutura, setMaterialSutura] = useState('NYLON 5-0');
  const [puntosSutura, setPuntosSutura] = useState('2');
  const [recuentoMaterial, setRecuentoMaterial] = useState(true);

  // Discharge and pathology
  const [curacionEgreso, setCuracionEgreso] = useState('ÁCIDO FUSÍDICO Y MICROPORE');
  const [selectedRecoms, setSelectedRecoms] = useState<string[]>([
    'MANTENER LA ZONA LIMPIA Y SECA POR 24 HORAS',
    'EVITAR LA EXPOSICIÓN DIRECTA AL SOL',
    'NO MANIPULAR LA CURACIÓN',
    'ACUDIR A URGENCIAS ANTE SIGNOS DE ALARMA',
  ]);
  const [medicoRetiraPuntos, setMedicoRetiraPuntos] = useState('');
  const [seguimientoPremium, setSeguimientoPremium] = useState(true);

  // Pathology sample
  const [tienePatologia, setTienePatologia] = useState(true);
  const [frascosPatologia, setFrascosPatologia] = useState('1');
  const [fijadorPatologia, setFijadorPatologia] = useState('FORMOL AL 10%');
  const [labPatologia, setLabPatologia] = useState('COLSANITAS');

  const [noteOutput, setNoteOutput] = useState('');

  const parseDD = (full: string) => {
    const parts = full.split('|');
    const d = parts[0]?.replace('Derecho:', '').trim() || '-';
    const b = parts[1]?.replace('Deber:', '').trim() || '-';
    return { d, b };
  };

  // Switch procedure helper
  const handleSelectProcedure = (proc: ProcType) => {
    setSelectedProc(proc);
    switch (proc) {
      case 'BIOPSIA':
        setNombreProc('BIOPSIA DE LESIÓN');
        setInstrumental('PUNCH DE 4 MM');
        setTieneCauterizacion(true);
        setTieneSutura(true);
        setTienePatologia(true);
        break;
      case 'RESECCION':
        setNombreProc('RESECCIÓN DE LESIÓN');
        setInstrumental('BISTURÍ HOJA NRO 15');
        setTieneCauterizacion(true);
        setTieneSutura(true);
        setTienePatologia(true);
        break;
      case 'INFILTRACION':
        setNombreProc('INFILTRACIÓN INTRALESIONAL');
        setFarmacoInfiltracion('KENACORT 10 MG/ML');
        setTieneCauterizacion(false);
        setTieneSutura(false);
        setTienePatologia(false);
        break;
      case 'CRIOTERAPIA':
        setNombreProc('CRIOTERAPIA');
        setTieneCauterizacion(false);
        setTieneSutura(false);
        setTienePatologia(false);
        break;
      case 'NASOLARINGOSCOPIA':
        setNombreProc('NASOLARINGOSCOPIA');
        setTieneCauterizacion(false);
        setTieneSutura(false);
        setTienePatologia(false);
        break;
      case 'OTRO_PROC':
        setNombreProc('PROCEDIMIENTO MENOR');
        setInstrumental('');
        setTieneCauterizacion(false);
        setTieneSutura(false);
        break;
    }
  };

  // Re-compute note on ANY state change (Real-Time Live Generator!)
  useEffect(() => {
    const e = genero === 'MASCULINO' ? 'O' : 'A';
    const { d, b } = parseDD(derechoDeber);
    const dr = profesional || '[PROFESIONAL NO SELECCIONADO]';
    const alerStr = tieneAlergias
      ? `SE INDAGAN ALERGIAS, PACIENTE REFIERE ALERGIAS A ${alergiaEsp.trim().toUpperCase() || 'NO ESPECIFICADAS'}`
      : 'SE INDAGAN ALERGIAS, PACIENTE NIEGA ALERGIAS';

    let txt = '';

    if (selectedProc === 'NASOLARINGOSCOPIA') {
      if (dr === 'DR JULIO TORRES' || dr === 'DRA JULIANA ANGULO') {
        txt = `INGRESA PACIENTE A SALA DE PROCEDIMIENTOS MENORES, ALERTA, ORIENTAD${e}, CONSCIENTE, CAMINANDO POR SUS PROPIOS MEDIOS. PACIENTE ES VALORADO POR ${dr}. ${alerStr}. SE VALORA RIESGO DE CAÍDA Y RIESGO DE LESIÓN DE PIEL: RIESGO DE CAÍDA: ${riesgoCaida}. RIESGO DE LESIÓN DE PIEL: ${riesgoPiel}.

SE DILIGENCIA CONSENTIMIENTO INFORMADO. SE SOCIALIZA DERECHO Y DEBER: (DERECHO: ${d}. DEBER: ${b}).

SE UBICA AL PACIENTE EN LA CAMILLA EN POSICIÓN FOWLER. EL ESPECIALISTA REALIZA SEDACIÓN LOCAL MEDIANTE LA APLICACIÓN DE ANESTESIA TÓPICA (ROXICAÍNA EN ATOMIZADOR) Y DESCONGESTIONANTE NASAL (OXIMETAZOLINA AL 0.05%). POSTERIORMENTE, SE LLEVA A CABO NASOLARINGOSCOPIA, LA CUAL FINALIZA SIN COMPLICACIONES. SE HACE ENTREGA DE LA FÓRMULA MÉDICA Y SE BRINDAN LAS RECOMENDACIONES POST-PROCEDIMIENTO.

SE REALIZA LA LIMPIEZA Y DESINFECCIÓN DEL EQUIPO BIOMÉDICO DE ACUERDO CON EL PROTOCOLO INSTITUCIONAL. EL PACIENTE EGRESA DE LA SALA POR SUS PROPIOS MEDIOS, EN CONDICIONES ÓPTIMAS: CONSCIENTE, ALERTA Y ORIENTAD${e}.`;
      } else if (dr === 'DR JORGE HERRERA') {
        txt = `INGRESA PACIENTE A SALA DE PROCEDIMIENTOS MENORES, ALERTA, ORIENTAD${e}, CONSCIENTE, CAMINANDO POR SUS PROPIOS MEDIOS. PACIENTE ES VALORADO POR ${dr}. ${alerStr}. SE VALORA RIESGO DE CAÍDA Y RIESGO DE LESIÓN DE PIEL: RIESGO DE CAÍDA: ${riesgoCaida}. RIESGO DE LESIÓN DE PIEL: ${riesgoPiel}.

SE DILIGENCIA CONSENTIMIENTO INFORMADO. SE SOCIALIZA DERECHO Y DEBER: (DERECHO: ${d}. DEBER: ${b}).

SE UBICA AL PACIENTE EN LA CAMILLA EN POSICIÓN FOWLER. EL DR. HERRERA REALIZA PROCEDIMIENTO DE NASOLARINGOSCOPIA, EL CUAL FINALIZA SIN COMPLICACIONES. POSTERIORMENTE, SE HACE ENTREGA DE LA FÓRMULA MÉDICA Y SE BRINDAN LAS RECOMENDACIONES POST-PROCEDIMIENTO.

SE REALIZA LA LIMPIEZA Y DESINFECCIÓN DEL EQUIPO BIOMÉDICO DE ACUERDO CON EL PROTOCOLO INSTITUCIONAL. EL PACIENTE EGRESA DE LA SALA DE PROCEDIMIENTOS POR SUS PROPIOS MEDIOS, EN CONDICIONES ÓPTIMAS: CONSCIENTE, ALERTA Y ORIENTAD${e}.`;
      } else {
        txt = `INGRESA PACIENTE A SALA DE PROCEDIMIENTOS MENORES, ALERTA, ORIENTAD${e}, CONSCIENTE, CAMINANDO POR SUS PROPIOS MEDIOS. PACIENTE ES VALORADO POR ${dr}. ${alerStr}. SE VALORA RIESGO DE CAÍDA Y RIESGO DE LESIÓN DE PIEL: RIESGO DE CAÍDA: ${riesgoCaida}. RIESGO DE LESIÓN DE PIEL: ${riesgoPiel}.

SE DILIGENCIA CONSENTIMIENTO INFORMADO. SE SOCIALIZA DERECHO Y DEBER: (DERECHO: ${d}. DEBER: ${b}).

SE UBICA EN POSICIÓN FOWLER. ${dr} REALIZA NASOLARINGOSCOPIA, FINALIZANDO SIN COMPLICACIONES. SE ENTREGA FÓRMULA MÉDICA Y SE BRINDAN RECOMENDACIONES DE CUIDADO.`;
      }
    } else {
      txt = `INGRESA PACIENTE A SALA DE PROCEDIMIENTOS MENORES, ALERTA, ORIENTAD${e}, CONSCIENTE, CAMINANDO POR SUS PROPIOS MEDIOS. PACIENTE ES VALORADO POR ${dr}. ${alerStr}. SE VALORA RIESGO DE CAÍDA Y RIESGO DE LESIÓN DE PIEL: RIESGO DE CAÍDA: ${riesgoCaida}. RIESGO DE LESIÓN DE PIEL: ${riesgoPiel}.\n\nSE DILIGENCIA CONSENTIMIENTO INFORMADO. SE SOCIALIZA DERECHO Y DEBER: (DERECHO: ${d}. DEBER: ${b}).\n\n`;

      txt += `SE UBICA AL PACIENTE EN CAMILLA EN POSICIÓN ${posicion}, EMPLEANDO TÉCNICA ASÉPTICA, SE REALIZA LIMPIEZA EN ${zonaAnatomica.trim().toUpperCase()}.\n`;

      if (
        selectedProc === 'BIOPSIA' ||
        selectedProc === 'RESECCION' ||
        selectedProc === 'OTRO_PROC'
      ) {
        const insStr = instrumental.trim() ? ` CON ${instrumental.trim().toUpperCase()}` : '';
        const cauStr = tieneCauterizacion
          ? ` SE REALIZA CAUTERIZACIÓN ${metodoCauterizacion.trim().toUpperCase()}.`
          : '';
        txt += `BAJO ANESTESIA LOCAL CON ${anestesia.trim().toUpperCase()}, ${dr} REALIZA ${nombreProc.trim().toUpperCase()}${insStr}.${cauStr} SIN COMPLICACIONES.\n`;
      } else if (selectedProc === 'INFILTRACION') {
        txt += `SE REALIZA ${nombreProc.trim().toUpperCase()} CON ${farmacoInfiltracion.trim().toUpperCase()} EN ${zonaAnatomica.trim().toUpperCase()}. SIN COMPLICACIONES.\n`;
      } else {
        txt += `${dr} REALIZA ${nombreProc.trim().toUpperCase()} EN ${zonaAnatomica.trim().toUpperCase()}. SIN COMPLICACIONES.\n`;
      }

      if (recuentoMaterial) {
        txt += 'SE HACE RECUENTO DE MATERIAL Y GASAS COMPLETO Y CONFORME.\n';
      }

      if (tieneSutura) {
        txt += `SE REALIZA SUTURA CON ${materialSutura.trim().toUpperCase()}, PUNTOS: ${puntosSutura.trim()}.\n`;
      }

      const recsFormatted = selectedRecoms.map((r) =>
        r === 'RETIRO DE PUNTOS POR MÉDICO' && medicoRetiraPuntos.trim()
          ? `RETIRO PUNTOS DR/A: ${medicoRetiraPuntos.trim().toUpperCase()}`
          : r
      );

      txt += `SE DEJA CUBIERTA LA LESIÓN CON ${curacionEgreso.trim().toUpperCase()}. INDICACIONES DE EGRESO: ${
        recsFormatted.length ? recsFormatted.join(', ') : 'GENERALES'
      }.\n`;

      if (tienePatologia) {
        txt += `SE TOMAN ${frascosPatologia.trim()} FRASCOS PARA PATOLOGÍA, SE ENVIAN MUESTRAS AL LABORATORIO DE ${labPatologia.trim().toUpperCase()}.\n`;
      }
    }

    if (seguimientoPremium) {
      txt += 'REGISTRADO EN SEGUIMIENTO PREMIUM.\n';
    }

    if (selectedProc !== 'NASOLARINGOSCOPIA') {
      txt += 'SALE PACIENTE EN ÓPTIMAS CONDICIONES.';
    }

    setNoteOutput(txt.toUpperCase());
  }, [
    genero,
    profesional,
    derechoDeber,
    riesgoCaida,
    riesgoPiel,
    tieneAlergias,
    alergiaEsp,
    selectedProc,
    nombreProc,
    zonaAnatomica,
    posicion,
    anestesia,
    instrumental,
    tieneCauterizacion,
    metodoCauterizacion,
    farmacoInfiltracion,
    tieneSutura,
    materialSutura,
    puntosSutura,
    recuentoMaterial,
    curacionEgreso,
    selectedRecoms,
    medicoRetiraPuntos,
    seguimientoPremium,
    tienePatologia,
    frascosPatologia,
    labPatologia,
  ]);

  const toggleRecom = (recom: string) => {
    setSelectedRecoms((prev) =>
      prev.includes(recom) ? prev.filter((r) => r !== recom) : [...prev, recom]
    );
  };

  const handleClear = () => {
    setGenero('MASCULINO');
    setZonaAnatomica('');
    setTieneAlergias(false);
    setAlergiaEsp('');
    setSelectedRecoms([]);
    setNoteOutput('');
  };

  const autoFillDemo = () => {
    setGenero('FEMENINO');
    setProfesional(DERMATOLOGOS[0]);
    handleSelectProcedure('BIOPSIA');
    setZonaAnatomica('ALA NASAL DERECHA');
    setInstrumental('PUNCH DE 3 MM');
    setAnestesia('LIDOCAÍNA CON EPINEFRINA AL 2%');
    setTieneCauterizacion(true);
    setMetodoCauterizacion('ELECTROFULGURACIÓN PUNTUAL');
    setTieneSutura(true);
    setMaterialSutura('PROLENE 6-0');
    setPuntosSutura('1');
    setTienePatologia(true);
    setFrascosPatologia('1');
    setLabPatologia('COLSANITAS');
  };

  const isNaso = selectedProc === 'NASOLARINGOSCOPIA';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                Dermatología y Procedimientos Menores
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                EN TIEMPO REAL (LIVE)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Generador sincronizado en vivo para biopsias, resecciones, nasolaringoscopia, crioterapia e infiltraciones
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={autoFillDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autollenar Ejemplo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Ingreso y Profesional */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              1. Ingreso y Especialista Responsable
            </h3>

            <div className="flex items-center gap-6">
              <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="der-gen"
                  value="MASCULINO"
                  checked={genero === 'MASCULINO'}
                  onChange={() => setGenero('MASCULINO')}
                  className="h-4 w-4 text-indigo-600 mr-2"
                />
                Masculino
              </label>
              <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="der-gen"
                  value="FEMENINO"
                  checked={genero === 'FEMENINO'}
                  onChange={() => setGenero('FEMENINO')}
                  className="h-4 w-4 text-indigo-600 mr-2"
                />
                Femenino
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Especialista que Realiza el Procedimiento:
              </label>
              <select
                value={profesional}
                onChange={(e) => setProfesional(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
              >
                {DERMATOLOGOS.map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
            </div>

            <DerechoDeberSelect value={derechoDeber} onChange={setDerechoDeber} />

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Riesgo Caída
                </label>
                <select
                  value={riesgoCaida}
                  onChange={(e) => setRiesgoCaida(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs font-bold bg-white"
                >
                  <option value="BAJO">BAJO</option>
                  <option value="MEDIO">MEDIO</option>
                  <option value="ALTO">ALTO</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Riesgo Piel
                </label>
                <select
                  value={riesgoPiel}
                  onChange={(e) => setRiesgoPiel(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs font-bold bg-white"
                >
                  <option value="BAJO">BAJO</option>
                  <option value="MEDIO">MEDIO</option>
                  <option value="ALTO">ALTO</option>
                </select>
              </div>
            </div>

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
          </div>

          {/* Card 2: Selección de Procedimiento */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              2. Procedimiento Realizado
            </h3>

            {/* Quick buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectProcedure('BIOPSIA')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedProc === 'BIOPSIA'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 border-slate-200'
                }`}
              >
                🔬 Biopsia
              </button>
              <button
                type="button"
                onClick={() => handleSelectProcedure('RESECCION')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedProc === 'RESECCION'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 border-slate-200'
                }`}
              >
                🔪 Resección
              </button>
              <button
                type="button"
                onClick={() => handleSelectProcedure('INFILTRACION')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedProc === 'INFILTRACION'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 border-slate-200'
                }`}
              >
                💉 Infiltración
              </button>
              <button
                type="button"
                onClick={() => handleSelectProcedure('CRIOTERAPIA')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedProc === 'CRIOTERAPIA'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 border-slate-200'
                }`}
              >
                ❄️ Crioterapia
              </button>
              <button
                type="button"
                onClick={() => handleSelectProcedure('NASOLARINGOSCOPIA')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedProc === 'NASOLARINGOSCOPIA'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 border-slate-200'
                }`}
              >
                👃 Nasolaringo
              </button>
              <button
                type="button"
                onClick={() => handleSelectProcedure('OTRO_PROC')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedProc === 'OTRO_PROC'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 border-slate-200'
                }`}
              >
                ⚙️ Otro Proc.
              </button>
            </div>

            {/* Proc Details */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Denominación del Procedimiento
                </label>
                <input
                  type="text"
                  value={nombreProc}
                  onChange={(e) => setNombreProc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold"
                />
              </div>

              {!isNaso && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Zona Anatómica
                    </label>
                    <input
                      type="text"
                      value={zonaAnatomica}
                      onChange={(e) => setZonaAnatomica(e.target.value)}
                      placeholder="Ej: Región malar derecha"
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Posición
                    </label>
                    <select
                      value={posicion}
                      onChange={(e) => setPosicion(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                    >
                      <option value="SUPINO">SUPINO</option>
                      <option value="PRONO">PRONO</option>
                      <option value="FOWLER">FOWLER</option>
                      <option value="SEMI-FOWLER">SEMI-FOWLER</option>
                      <option value="DECÚBITO LATERAL IZQUIERDO">LATERAL IZQUIERDO</option>
                      <option value="DECÚBITO LATERAL DERECHO">LATERAL DERECHO</option>
                      <option value="SENTADO">SENTADO</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Dynamic inputs for Biopsy / Resection */}
              {(selectedProc === 'BIOPSIA' ||
                selectedProc === 'RESECCION' ||
                selectedProc === 'OTRO_PROC') && (
                <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-indigo-900 uppercase mb-1">
                        Instrumental
                      </label>
                      <input
                        type="text"
                        value={instrumental}
                        onChange={(e) => setInstrumental(e.target.value)}
                        placeholder="Ej: Punch 4 mm, Bisturí 15"
                        className="w-full p-2 bg-white border border-indigo-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-indigo-900 uppercase mb-1">
                        Anestesia Local
                      </label>
                      <input
                        type="text"
                        value={anestesia}
                        onChange={(e) => setAnestesia(e.target.value)}
                        className="w-full p-2 bg-white border border-indigo-200 rounded-lg text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="flex items-center text-xs font-bold text-indigo-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tieneCauterizacion}
                        onChange={(e) => setTieneCauterizacion(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 rounded mr-2"
                      />
                      Cauterización / Hemostasia
                    </label>
                    {tieneCauterizacion && (
                      <input
                        type="text"
                        value={metodoCauterizacion}
                        onChange={(e) => setMetodoCauterizacion(e.target.value)}
                        placeholder="Método (Ej: Electrofulguración, Ácido tricloroacético)"
                        className="w-full mt-2 p-2 bg-white border border-indigo-200 rounded-lg text-xs"
                      />
                    )}
                  </div>
                </div>
              )}

              {selectedProc === 'INFILTRACION' && (
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <label className="block text-[10px] font-bold text-indigo-900 uppercase mb-1">
                    Fármaco de Infiltración
                  </label>
                  <input
                    type="text"
                    value={farmacoInfiltracion}
                    onChange={(e) => setFarmacoInfiltracion(e.target.value)}
                    className="w-full p-2 bg-white border border-indigo-200 rounded-lg text-xs font-semibold"
                  />
                </div>
              )}

              {/* Suture section */}
              {!isNaso && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer">
                    <span>Sutura de la herida quirúrgica</span>
                    <input
                      type="checkbox"
                      checked={tieneSutura}
                      onChange={(e) => setTieneSutura(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 rounded"
                    />
                  </label>

                  {tieneSutura && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Material de Sutura
                        </label>
                        <input
                          type="text"
                          value={materialSutura}
                          onChange={(e) => setMaterialSutura(e.target.value)}
                          placeholder="Ej: Nylon 5-0, Seda 4-0"
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Cantidad de Puntos
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={puntosSutura}
                          onChange={(e) => setPuntosSutura(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!isNaso && (
                <label className="flex items-center text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recuentoMaterial}
                    onChange={(e) => setRecuentoMaterial(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 rounded mr-2"
                  />
                  Recuento de material y gasas completo y conforme
                </label>
              )}
            </div>
          </div>

          {/* Card 3: Egreso, Recomendaciones y Patología */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              3. Egreso, Recomendaciones y Muestras
            </h3>

            {!isNaso && (
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Curación y apósito de salida:
                </label>
                <input
                  type="text"
                  value={curacionEgreso}
                  onChange={(e) => setCuracionEgreso(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">
                Recomendaciones Seleccionadas al Egreso:
              </label>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-48 overflow-y-auto space-y-1.5 custom-scrollbar">
                {RECOMENDACIONES_DERMATOLOGIA.map((recom) => {
                  const isChecked = selectedRecoms.includes(recom);
                  return (
                    <label
                      key={recom}
                      className="flex items-center text-xs text-slate-700 p-1 rounded-lg hover:bg-white cursor-pointer font-medium"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleRecom(recom)}
                        className="h-3.5 w-3.5 text-indigo-600 rounded mr-2"
                      />
                      <span>{recom}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {selectedRecoms.includes('RETIRO DE PUNTOS POR MÉDICO') && (
              <div>
                <label className="block text-[10px] font-bold text-indigo-900 uppercase mb-1">
                  Médico Especialista para Retiro de Puntos:
                </label>
                <input
                  type="text"
                  value={medicoRetiraPuntos}
                  onChange={(e) => setMedicoRetiraPuntos(e.target.value)}
                  placeholder="Nombre del médico tratante"
                  className="w-full p-2 border border-indigo-300 rounded-xl text-xs"
                />
              </div>
            )}

            {/* Pathology */}
            {!isNaso && (
              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 space-y-2">
                <label className="flex items-center justify-between text-xs font-bold text-emerald-900 cursor-pointer">
                  <span>Envío de muestra para estudio de Patología</span>
                  <input
                    type="checkbox"
                    checked={tienePatologia}
                    onChange={(e) => setTienePatologia(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 rounded"
                  />
                </label>

                {tienePatologia && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-800 uppercase mb-1">
                        Frascos
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={frascosPatologia}
                        onChange={(e) => setFrascosPatologia(e.target.value)}
                        className="w-full p-2 bg-white border border-emerald-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-800 uppercase mb-1">
                        Fijador
                      </label>
                      <input
                        type="text"
                        value={fijadorPatologia}
                        onChange={(e) => setFijadorPatologia(e.target.value)}
                        className="w-full p-2 bg-white border border-emerald-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-800 uppercase mb-1">
                        Laboratorio
                      </label>
                      <input
                        type="text"
                        value={labPatologia}
                        onChange={(e) => setLabPatologia(e.target.value)}
                        className="w-full p-2 bg-white border border-emerald-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <label className="flex items-center text-xs font-bold text-indigo-900 cursor-pointer">
              <input
                type="checkbox"
                checked={seguimientoPremium}
                onChange={(e) => setSeguimientoPremium(e.target.checked)}
                className="h-4 w-4 text-indigo-600 rounded mr-2"
              />
              Registrado en programa de Seguimiento Premium
            </label>
          </div>

          {/* Action buttons at the end of the module */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                if (noteOutput.trim()) {
                  onSaveToHistory(noteOutput, `Dermatología (${nombreProc})`);
                }
              }}
              className="flex-1 py-3.5 px-6 rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 font-extrabold text-sm tracking-wide transition cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
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
        </div>

        {/* Note Preview Column (Live update) */}
        <div className="lg:col-span-5 h-full lg:sticky lg:top-4 space-y-3">
          <NotePreview
            noteText={noteOutput}
            onNoteChange={setNoteOutput}
            onClear={handleClear}
            onAutoFillDemo={autoFillDemo}
            title="Vista Previa en Vivo · Dermatología"
            badgeLabel="LIVE GENERATION"
            rows={28}
          />
        </div>
      </div>
    </div>
  );
};
