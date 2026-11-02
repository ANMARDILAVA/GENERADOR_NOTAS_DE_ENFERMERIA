import React, { useState } from 'react';
import { Gender, SavedNote } from '../../types/clinical';
import { DERECHOS_Y_DEBERES, POSICIONES_PACIENTE, SITIOS_INTRAMUSCULAR } from '../../constants/clinicalOptions';
import { DerechoDeberSelect } from '../common/DerechoDeberSelect';
import { NotePreview } from '../common/NotePreview';
import { FileCheck, Sparkles, RefreshCw, PlusCircle, ShieldCheck } from 'lucide-react';

interface Props {
  onSaveToHistory: (noteText: string, summary: string) => SavedNote;
}

export const MedsCEModule: React.FC<Props> = ({ onSaveToHistory }) => {
  const [genero, setGenero] = useState<Gender>('MASCULINO');
  const [motivo, setMotivo] = useState('TRATAMIENTO HORMONAL DE REEMPLAZO');
  const [anticoagulado, setAnticoagulado] = useState<'NO' | 'SI'>('NO');
  const [tieneAlergias, setTieneAlergias] = useState(false);
  const [alergiaEsp, setAlergiaEsp] = useState('');
  const [derechoDeber, setDerechoDeber] = useState(DERECHOS_Y_DEBERES[2].fullString);

  // Med 1 + INVIMA
  const [med1, setMed1] = useState('NEBIDO (UNDECANOATO DE TESTOSTERONA)');
  const [dosis1, setDosis1] = useState('1000 MG / 4 ML');
  const [via1, setVia1] = useState('INTRAMUSCULAR');
  const [sitio1, setSitio1] = useState(SITIOS_INTRAMUSCULAR[0].value);
  const [sitio1Otro, setSitio1Otro] = useState('');
  const [lote1, setLote1] = useState('LT-98241B');
  const [fechaVenc1, setFechaVenc1] = useState('2027-08-30');
  const [invima1, setInvima1] = useState('INVIMA 2019M-0014522');

  // Med 2
  const [tieneMed2, setTieneMed2] = useState(false);
  const [med2, setMed2] = useState('');
  const [dosis2, setDosis2] = useState('');
  const [via2, setVia2] = useState('INTRAMUSCULAR');
  const [sitio2, setSitio2] = useState(SITIOS_INTRAMUSCULAR[1].value);
  const [sitio2Otro, setSitio2Otro] = useState('');
  const [lote2, setLote2] = useState('');
  const [fechaVenc2, setFechaVenc2] = useState('');
  const [invima2, setInvima2] = useState('');

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

  const generateNote = () => {
    const e = genero === 'MASCULINO' ? 'O' : 'A';
    const { d, b } = parseDD(derechoDeber);

    const alerStr = tieneAlergias
      ? `PACIENTE REFIERE ALERGIAS A ${alergiaEsp.trim().toUpperCase() || 'NO ESPECIFICADAS'}.`
      : 'PACIENTE NO REFIERE ALERGIAS.';

    const antiStr = anticoagulado === 'SI' ? ' PACIENTE REFIERE ESTAR ANTICOAGULADO.' : '';

    const s1Final = sitio1 === 'OTRO' ? sitio1Otro.trim().toUpperCase() || 'SITIO ESPECIFICADO' : sitio1;
    const s2Final = sitio2 === 'OTRO' ? sitio2Otro.trim().toUpperCase() || 'SITIO ESPECIFICADO' : sitio2;

    const ord = tieneMed2 && med2.trim()
      ? `${med1.trim()} ${dosis1.trim()} ${via1.trim()} Y ${med2.trim()} ${dosis2.trim()} ${via2.trim()}`
      : `${med1.trim()} ${dosis1.trim()} ${via1.trim()} DOSIS ÚNICA`;

    let seg = `MEDICAMENTO 1 (${med1.trim()}):\nDOSIS: ${dosis1.trim()}\nLOTE: ${lote1.trim()}\nFECHA VENCIMIENTO: ${fechaVenc1}\nINVIMA: ${invima1.trim()}`;
    if (tieneMed2 && med2.trim()) {
      seg += `\n\nMEDICAMENTO 2 (${med2.trim()}):\nDOSIS: ${dosis2.trim()}\nLOTE: ${lote2.trim()}\nFECHA VENCIMIENTO: ${fechaVenc2}\nINVIMA: ${invima2.trim()}`;
    }

    let adm = `SE REALIZA DESINFECCIÓN DEL ${s1Final}, SE ADMINISTRA ${med1.trim()} ${dosis1.trim()} DE FORMA ${via1.trim()}.`;
    if (tieneMed2 && med2.trim()) {
      adm = `SE REALIZA DESINFECCIÓN DEL ${s1Final}, SE ADMINISTRA ${med1.trim()} ${dosis1.trim()} DE FORMA ${via1.trim()}. POSTERIORMENTE SE REALIZA DESINFECCIÓN DEL ${s2Final}, SE ADMINISTRA ${med2.trim()} ${dosis2.trim()} DE FORMA ${via2.trim()} SIN PRESENTARSE NINGUNA REACCIÓN ADVERSA.`;
    } else {
      adm = `SE REALIZA DESINFECCIÓN DEL ${s1Final}, SE ADMINISTRA ${med1.trim()} ${dosis1.trim()} DE FORMA ${via1.trim()} SIN PRESENTARSE NINGUNA REACCIÓN ADVERSA.`;
    }

    const posFinal = posicion === 'OTRO' ? posicionOtro.trim().toUpperCase() || 'ESPECÍFICA' : posicion;

    const text = `INGRESA PACIENTE A SALA DE ENFERMERÍA, ALERTA, ORIENTAD${e}, CONSCIENTE, CAMINANDO POR SUS PROPIOS MEDIOS, TRAE ORDEN PARA ADMINISTRAR ${ord} COMO TRATAMIENTO PARA ${motivo.trim().toUpperCase()}.

SE REVISA ORDEN MÉDICA, SE CONFIRMA PRESCRIPCIÓN, SE REVISA DISPONIBILIDAD DE LOS INSUMOS. SE REALIZA LISTA DE CHEQUEO PARA ADMINISTRACIÓN DE MEDICAMENTOS, SE INDAGAN ALERGIAS: ${alerStr}${antiStr}

SE OBTIENE FIRMA DE CONSENTIMIENTO DE ENFERMERÍA. SE REALIZA VERIFICACIÓN DE LOS 13 CORRECTOS EN LA ADMINISTRACIÓN DE MEDICAMENTOS. SE EXPLICA EL PROCEDIMIENTO, PACIENTE REFIERE ENTENDER Y ACEPTAR.

SE SOCIALIZA EL DERECHO Y DEBER: (DERECHO: ${d}. DEBER: ${b}).

PACIENTE TRAE EL MEDICAMENTO, LOS DATOS DE SEGURIDAD SON LOS SIGUIENTES:
${seg}

SE REALIZA LAVADO DE MANOS. SE UBICA AL PACIENTE EN EL CUBÍCULO NÚMERO ${cubiculo}, EN CAMILLA, EN POSICIÓN ${posFinal}. SE VALORAN ESCALAS DE RIESGO: CAÍDA (${riesgoCaida}), LESIÓN DE PIEL (${riesgoPiel}).

${adm}

SE INDICA AL PACIENTE PERMANECER 10 MINUTOS EN EL CUBÍCULO COMO TIEMPO DE OBSERVACIÓN POST-ADMINISTRACIÓN DE MEDICAMENTOS. TRANSCURRIDOS LOS 10 MINUTOS, SALE PACIENTE DEL ÁREA DE ENFERMERÍA, ALERTA, ORIENTAD${e}, CONSCIENTE, CON EL MEDICAMENTO ADMINISTRADO. SE BRINDAN RECOMENDACIONES Y EDUCACIÓN EN TORNO AL MEDICAMENTO ADMINISTRADO. PACIENTE REFIERE ENTENDER Y ACEPTAR.`.toUpperCase();

    setNoteOutput(text);
    onSaveToHistory(text, `Meds CE (INVIMA): ${ord} (${motivo})`);
  };

  const handleClear = () => {
    setGenero('MASCULINO');
    setMotivo('');
    setAnticoagulado('NO');
    setTieneAlergias(false);
    setAlergiaEsp('');
    setMed1('');
    setDosis1('');
    setVia1('INTRAMUSCULAR');
    setSitio1(SITIOS_INTRAMUSCULAR[0].value);
    setSitio1Otro('');
    setLote1('');
    setFechaVenc1('');
    setInvima1('');
    setTieneMed2(false);
    setMed2('');
    setDosis2('');
    setVia2('INTRAMUSCULAR');
    setSitio2(SITIOS_INTRAMUSCULAR[1].value);
    setSitio2Otro('');
    setLote2('');
    setFechaVenc2('');
    setInvima2('');
    setCubiculo('1');
    setPosicion('DECÚBITO PRONO (O VENTRAL)');
    setPosicionOtro('');
    setRiesgoCaida('RIESGO BAJO');
    setRiesgoPiel('RIESGO BAJO');
    setNoteOutput('');
  };

  const autoFillDemo = () => {
    setGenero('FEMENINO');
    setMotivo('ANEMIA FERROPÉNICA / TRATAMIENTO CON HIERRO');
    setAnticoagulado('NO');
    setTieneAlergias(false);
    setMed1('HIERRO POLIMALTOSTA (FERINJECT)');
    setDosis1('500 MG');
    setVia1('INTRAMUSCULAR PROFUNDA EN Z');
    setSitio1('CUADRANTE SUPERIOR EXTERNO DEL GLUTEO DERECHO');
    setLote1('L-40912X');
    setFechaVenc1('2027-11-20');
    setInvima1('INVIMA 2018M-0008921-R1');
    setCubiculo('1');
    setPosicion('DECÚBITO PRONO (O VENTRAL)');
    setRiesgoCaida('RIESGO BAJO');
    setRiesgoPiel('RIESGO BAJO');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-teal-100 text-teal-700 rounded-xl">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Medicamentos (Consulta Externa / INVIMA)
            </h2>
            <p className="text-xs text-slate-500">
              Medicamento aportado por usuario con registro de Registro Sanitario INVIMA, lote y fecha de vencimiento
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={autoFillDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition"
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
              1. Contexto del Paciente
            </legend>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Género</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="ce-gen"
                    value="MASCULINO"
                    checked={genero === 'MASCULINO'}
                    onChange={() => setGenero('MASCULINO')}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 mr-2"
                  />
                  Masculino
                </label>
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="ce-gen"
                    value="FEMENINO"
                    checked={genero === 'FEMENINO'}
                    onChange={() => setGenero('FEMENINO')}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 mr-2"
                  />
                  Femenino
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Motivo / Tratamiento
                </label>
                <input
                  type="text"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ej: Inmunoterapia, Anticoncepción, Hormonal"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  ¿Paciente Anticoagulado?
                </label>
                <select
                  value={anticoagulado}
                  onChange={(e) => setAnticoagulado(e.target.value as 'NO' | 'SI')}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold bg-white"
                >
                  <option value="NO">No Anticoagulado</option>
                  <option value="SI">Sí Anticoagulado</option>
                </select>
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
                    placeholder="Especifique alergias..."
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>

            <DerechoDeberSelect value={derechoDeber} onChange={setDerechoDeber} />
          </fieldset>

          {/* Section 2: Meds + Trazabilidad INVIMA */}
          <fieldset className="border border-slate-200 p-5 rounded-2xl bg-white shadow-xs space-y-4">
            <legend className="text-xs font-extrabold text-slate-600 px-3 uppercase tracking-wider bg-slate-100 rounded-lg border border-slate-200 py-1">
              2. Datos de Seguridad y Trazabilidad (INVIMA)
            </legend>

            {/* Med 1 */}
            <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-teal-800 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Medicamento 1 (Aportado por Usuario)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Fármaco
                  </label>
                  <input
                    type="text"
                    value={med1}
                    onChange={(e) => setMed1(e.target.value)}
                    placeholder="Ej: Nebido"
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
                    placeholder="Ej: 1000 mg"
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
                  Sitio de Punción
                </label>
                <select
                  value={sitio1}
                  onChange={(e) => setSitio1(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold bg-white"
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
                    placeholder="Especifique sitio..."
                    className="w-full mt-2 p-2 border border-slate-300 rounded-xl text-xs"
                  />
                )}
              </div>

              {/* Trazabilidad fields Med 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-teal-200/60">
                <div>
                  <label className="block text-[10px] font-bold text-teal-800 uppercase mb-1">
                    Lote
                  </label>
                  <input
                    type="text"
                    value={lote1}
                    onChange={(e) => setLote1(e.target.value)}
                    placeholder="Ej: LT-4821"
                    className="w-full p-2 border border-teal-300 rounded-lg text-xs font-semibold bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-teal-800 uppercase mb-1">
                    Fecha Vencimiento
                  </label>
                  <input
                    type="date"
                    value={fechaVenc1}
                    onChange={(e) => setFechaVenc1(e.target.value)}
                    className="w-full p-2 border border-teal-300 rounded-lg text-xs font-semibold bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-teal-800 uppercase mb-1">
                    Reg. Sanitario INVIMA
                  </label>
                  <input
                    type="text"
                    value={invima1}
                    onChange={(e) => setInvima1(e.target.value)}
                    placeholder="Ej: INVIMA 2020M-..."
                    className="w-full p-2 border border-teal-300 rounded-lg text-xs font-semibold bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Med 2 Toggle */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <label className="flex items-center justify-between font-bold text-slate-800 text-sm cursor-pointer">
                <span className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-teal-600" />
                  ¿Añadir 2do medicamento traído por el usuario?
                </span>
                <input
                  type="checkbox"
                  checked={tieneMed2}
                  onChange={(e) => setTieneMed2(e.target.checked)}
                  className="h-4 w-4 text-teal-600 rounded"
                />
              </label>

              {tieneMed2 && (
                <div className="mt-3 p-3.5 bg-white border border-teal-200 rounded-xl space-y-3">
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
                      {SITIOS_INTRAMUSCULAR.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-[10px] font-bold text-teal-800 uppercase mb-1">
                        Lote 2
                      </label>
                      <input
                        type="text"
                        value={lote2}
                        onChange={(e) => setLote2(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-teal-800 uppercase mb-1">
                        Vencimiento 2
                      </label>
                      <input
                        type="date"
                        value={fechaVenc2}
                        onChange={(e) => setFechaVenc2(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-teal-800 uppercase mb-1">
                        INVIMA 2
                      </label>
                      <input
                        type="text"
                        value={invima2}
                        onChange={(e) => setInvima2(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                  Posición del Paciente
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
              className="flex-1 py-3.5 px-6 rounded-xl shadow-lg text-white bg-teal-600 hover:bg-teal-700 font-extrabold text-sm tracking-wide transition cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
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
            title="Vista Previa · Meds CE (INVIMA)"
            badgeLabel="TRAZABILIDAD FARMACOVIGILANCIA"
          />
        </div>
      </div>
    </div>
  );
};
