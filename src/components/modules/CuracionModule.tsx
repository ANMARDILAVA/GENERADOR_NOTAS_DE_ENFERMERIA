import React, { useState } from 'react';
import { Gender, SavedNote } from '../../types/clinical';
import { DERECHOS_Y_DEBERES, POSICIONES_PACIENTE } from '../../constants/clinicalOptions';
import { DerechoDeberSelect } from '../common/DerechoDeberSelect';
import { NotePreview } from '../common/NotePreview';
import { Bandage, Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  onSaveToHistory: (noteText: string, summary: string) => SavedNote;
}

export const CuracionModule: React.FC<Props> = ({ onSaveToHistory }) => {
  const [genero, setGenero] = useState<Gender>('MASCULINO');
  const [areaLesion, setAreaLesion] = useState('REGIÓN SACRA');
  const [causa, setCausa] = useState('ÚLCERA POR PRESIÓN GRADO II');
  const [tieneAlergias, setTieneAlergias] = useState(false);
  const [alergiaEsp, setAlergiaEsp] = useState('');
  const [derechoDeber, setDerechoDeber] = useState(DERECHOS_Y_DEBERES[2].fullString);

  const [posicion, setPosicion] = useState<string>('DECÚBITO PRONO (O VENTRAL)');
  const [posicionOtro, setPosicionOtro] = useState('');
  const [tamano, setTamano] = useState('4X3 CM');
  const [localizacion, setLocalizacion] = useState('REGIÓN SACRA');
  const [origen, setOrigen] = useState('PRESIÓN PROLONGADA');
  const [exudado, setExudado] = useState('SEROSO ESCASO');
  const [infeccion, setInfeccion] = useState<'Ausentes' | 'Presentes'>('Ausentes');
  const [infeccionDetalle, setInfeccionDetalle] = useState('');
  const [pielPerilesional, setPielPerilesional] = useState('Íntegra, sin maceración ni signos de flogosis');
  const [lavadoCon, setLavadoCon] = useState('Jabón quirúrgico y Solución Salina al 0.9%');
  const [seColoca, setSeColoca] = useState('Parche hidrocoloide');
  const [cubreCon, setCubreCon] = useState('Gasa estéril');
  const [fijaCon, setFijaCon] = useState('FIXOMULL');
  const [proximaCuracionDias, setProximaCuracionDias] = useState('2');

  const [noteOutput, setNoteOutput] = useState('');

  const parseDD = (full: string) => {
    const parts = full.split('|');
    const d = parts[0]?.replace('Derecho:', '').trim() || '-';
    const b = parts[1]?.replace('Deber:', '').trim() || '-';
    return { d, b };
  };

  const handleAreaChange = (val: string) => {
    setAreaLesion(val);
    setLocalizacion(val);
  };

  const handleCausaChange = (val: string) => {
    setCausa(val);
    setOrigen(val);
  };

  const generateNote = () => {
    const e = genero === 'MASCULINO' ? 'O' : 'A';
    const al = genero === 'MASCULINO' ? 'AL' : 'A LA';
    const { d, b } = parseDD(derechoDeber);

    const alerStr = tieneAlergias
      ? `SE INDAGAN ALERGIAS, REFIERE ALERGIAS A ${alergiaEsp.trim().toUpperCase() || 'NO ESPECIFICADAS'}`
      : 'SE INDAGAN ALERGIAS, NO REFIERE ALERGIAS';

    const infStr =
      infeccion === 'Presentes'
        ? `PRESENTES (${infeccionDetalle.trim().toUpperCase() || 'ERITEMA Y CALOR LOCAL'})`
        : 'AUSENTES';

    const finalPos = posicion === 'OTRO' ? posicionOtro.trim().toUpperCase() || 'ESPECÍFICA' : posicion;

    const text = `INGRESA PACIENTE A SALA DE ENFERMERÍA, ALERTA, ORIENTAD${e}, CONSCIENTE, CAMINANDO POR SUS PROPIOS MEDIOS, TRAE ORDEN PARA REALIZAR CURACIÓN DE LESIÓN EN ${areaLesion.toUpperCase()} SECUNDARIO A ${causa.toUpperCase()}.

SE REVISA ORDEN MÉDICA, SE CONFIRMA PRESCRIPCIÓN. ${alerStr}. SE OBTIENE FIRMA DE CONSENTIMIENTO. SE SOCIALIZA DERECHO Y DEBER: (DERECHO: ${d}. DEBER: ${b}).

SE UBICA ${al} PACIENTE EN CAMILLA, POSICIÓN ${finalPos}. SE VALORA HERIDA:
LOCALIZACIÓN: ${localizacion.toUpperCase()}
TAMAÑO: ${tamano.toUpperCase()}
EXUDADO: ${exudado.toUpperCase()}
ORIGEN: ${origen.toUpperCase()}
INFECCIÓN: ${infStr}
PIEL PERILESIONAL: ${pielPerilesional.toUpperCase()}

PREVIO LAVADO DE MANOS Y BAJO TÉCNICA ASÉPTICA SE LAVA LESIÓN CON ${lavadoCon.toUpperCase()}, SE SECA Y SE COLOCA ${seColoca.toUpperCase()}, CUBRIENDO CON ${cubreCon.toUpperCase()} Y FIJANDO CON ${fijaCon.toUpperCase()}.

SE DAN INDICACIONES Y SIGNOS DE ALARMA. PRÓXIMA CURACIÓN EN ${proximaCuracionDias} DÍAS. SALE PACIENTE ALERTA, ORIENTAD${e}, CON RECOMENDACIONES DE CUIDADO.`.toUpperCase();

    setNoteOutput(text);
    onSaveToHistory(text, `Curación: ${areaLesion} (${causa})`);
  };

  const handleClear = () => {
    setGenero('MASCULINO');
    setAreaLesion('');
    setCausa('');
    setTieneAlergias(false);
    setAlergiaEsp('');
    setPosicion('DECÚBITO PRONO (O VENTRAL)');
    setPosicionOtro('');
    setTamano('');
    setLocalizacion('');
    setOrigen('');
    setExudado('');
    setInfeccion('Ausentes');
    setInfeccionDetalle('');
    setPielPerilesional('Íntegra, sin maceración');
    setLavadoCon('Jabón quirúrgico y Solución Salina');
    setSeColoca('');
    setCubreCon('Gasa estéril');
    setFijaCon('FIXOMULL');
    setProximaCuracionDias('2');
    setNoteOutput('');
  };

  const autoFillDemo = () => {
    setGenero('FEMENINO');
    setAreaLesion('MALEOLO EXTERNO DERECHO');
    setCausa('ÚLCERA VENOSA CRÓNICA');
    setTieneAlergias(true);
    setAlergiaEsp('PENICILINA Y YODO');
    setPosicion('DECÚBITO SUPINO (O DORSAL)');
    setTamano('3X2 CM');
    setLocalizacion('MALEOLO EXTERNO DERECHO');
    setOrigen('INSUFICIENCIA VENOSA');
    setExudado('SEROSO MODERADO');
    setInfeccion('Ausentes');
    setPielPerilesional('Eritema perilesional leve, sin calor');
    setLavadoCon('Solución Salina al 0.9% y Clorhexidina');
    setSeColoca('Apósito de alginato de calcio con plata');
    setCubreCon('Gasa estéril');
    setFijaCon('FIXOMULL');
    setProximaCuracionDias('3');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
            <Bandage className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Nota de Curación de Heridas</h2>
            <p className="text-xs text-slate-500">
              Valoración clínica de lesión, asepsia, tipo de apósito y plan de seguimiento
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={autoFillDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autollenar Ejemplo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
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
                    name="cur-gen"
                    value="MASCULINO"
                    checked={genero === 'MASCULINO'}
                    onChange={() => setGenero('MASCULINO')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  Masculino
                </label>
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="cur-gen"
                    value="FEMENINO"
                    checked={genero === 'FEMENINO'}
                    onChange={() => setGenero('FEMENINO')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  Femenino
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Área de la Lesión
                </label>
                <input
                  type="text"
                  value={areaLesion}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  placeholder="Ej: Región sacra, Talón izquierdo"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Causa / Diagnóstico
                </label>
                <input
                  type="text"
                  value={causa}
                  onChange={(e) => handleCausaChange(e.target.value)}
                  placeholder="Ej: Úlcera por presión, Dehiscencia"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500"
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
                Refiere antecedentes alérgicos
              </label>
              {tieneAlergias && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    value={alergiaEsp}
                    onChange={(e) => setAlergiaEsp(e.target.value)}
                    placeholder="Especifique alergias (Ej: Látex, Yodopovidona, Cintas adhesivas)..."
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>

            <DerechoDeberSelect value={derechoDeber} onChange={setDerechoDeber} />
          </fieldset>

          {/* Section 2: Valoración y Procedimiento */}
          <fieldset className="border border-slate-200 p-5 rounded-2xl bg-white shadow-xs space-y-4">
            <legend className="text-xs font-extrabold text-slate-600 px-3 uppercase tracking-wider bg-slate-100 rounded-lg border border-slate-200 py-1">
              2. Valoración de la Herida y Técnica Aséptica
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
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
                    className="w-full mt-2 p-2.5 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Dimensiones / Tamaño
                </label>
                <input
                  type="text"
                  value={tamano}
                  onChange={(e) => setTamano(e.target.value)}
                  placeholder="Ej: 5x3 cm, Diámetro 2 cm"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Localización Anatómica
                </label>
                <input
                  type="text"
                  value={localizacion}
                  onChange={(e) => setLocalizacion(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Origen / Etiología
                </label>
                <input
                  type="text"
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Tipo de Exudado
                </label>
                <input
                  type="text"
                  value={exudado}
                  onChange={(e) => setExudado(e.target.value)}
                  placeholder="Ej: Seroso escaso, Serohemático, Purulento"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Signos de Infección
                </label>
                <select
                  value={infeccion}
                  onChange={(e) => setInfeccion(e.target.value as 'Ausentes' | 'Presentes')}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold bg-white"
                >
                  <option value="Ausentes">Ausentes</option>
                  <option value="Presentes">Presentes (Eritema, calor, dolor)</option>
                </select>
              </div>

              {infeccion === 'Presentes' && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-rose-700 uppercase mb-1">
                    Detalle de Signos Infecciosos
                  </label>
                  <input
                    type="text"
                    value={infeccionDetalle}
                    onChange={(e) => setInfeccionDetalle(e.target.value)}
                    placeholder="Ej: Eritema perilesional mayor a 2 cm, calor local y dolor a la palpación"
                    className="w-full p-2.5 border border-rose-300 rounded-xl text-sm bg-rose-50/50"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Estado de la Piel Perilesional
                </label>
                <input
                  type="text"
                  value={pielPerilesional}
                  onChange={(e) => setPielPerilesional(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                />
              </div>

              {/* Protocolo de limpieza y apósitos */}
              <div className="md:col-span-2 border-t border-slate-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Lavado / Irrigación con
                  </label>
                  <input
                    type="text"
                    value={lavadoCon}
                    onChange={(e) => setLavadoCon(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Apósito / Producto aplicado
                  </label>
                  <input
                    type="text"
                    value={seColoca}
                    onChange={(e) => setSeColoca(e.target.value)}
                    placeholder="Ej: Parche hidrocoloide, Hidrogel, Sulfadiazina"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Cobertura con
                  </label>
                  <input
                    type="text"
                    value={cubreCon}
                    onChange={(e) => setCubreCon(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Fijación con
                  </label>
                  <input
                    type="text"
                    value={fijaCon}
                    onChange={(e) => setFijaCon(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Próxima curación programada en (días)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={proximaCuracionDias}
                    onChange={(e) => setProximaCuracionDias(e.target.value)}
                    className="w-32 p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-xl shadow-lg text-white bg-blue-600 hover:bg-blue-700 font-extrabold text-sm tracking-wide transition cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
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

        {/* Note Preview Column */}
        <div className="lg:col-span-5 h-full lg:sticky lg:top-4">
          <NotePreview
            noteText={noteOutput}
            onNoteChange={setNoteOutput}
            onClear={() => setNoteOutput('')}
            onAutoFillDemo={autoFillDemo}
            title="Vista Previa · Curación"
            badgeLabel="PROCESADA"
          />
        </div>
      </div>
    </div>
  );
};
