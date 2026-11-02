import React, { useState } from 'react';
import { Gender, SavedNote } from '../../types/clinical';
import { DERECHOS_Y_DEBERES } from '../../constants/clinicalOptions';
import { DerechoDeberSelect } from '../common/DerechoDeberSelect';
import { NotePreview } from '../common/NotePreview';
import { Disc, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  onSaveToHistory: (noteText: string, summary: string) => SavedNote;
}

type TacTipo = 'ADULTO' | 'PEDIATRICO' | 'CONTRASTE';

export const TacModule: React.FC<Props> = ({ onSaveToHistory }) => {
  const [tipo, setTipo] = useState<TacTipo>('ADULTO');
  const [genero, setGenero] = useState<Gender>('MASCULINO');
  const [motivo, setMotivo] = useState('CUADRO DE CEFALEA CRÓNICA');

  // Pediatric specific
  const [acomp, setAcomp] = useState('MADRE');
  const [estadoPed, setEstadoPed] = useState('TRANQUILO');
  const [salidaPed, setSalidaPed] = useState('EN BRAZOS DE MADRE');

  // Adult specific movilization
  const [movilizacion, setMovilizacion] = useState('CAMINANDO POR SUS PROPIOS MEDIOS');

  // Antecedentes
  const [tieneTrauma, setTieneTrauma] = useState(false);
  const [traumaEsp, setTraumaEsp] = useState('');
  const [tieneQx, setTieneQx] = useState(false);
  const [qxEsp, setQxEsp] = useState('');
  const [tieneAlergias, setTieneAlergias] = useState(false);
  const [alergiaEsp, setAlergiaEsp] = useState('');

  const [derechoDeber, setDerechoDeber] = useState(DERECHOS_Y_DEBERES[2].fullString);

  // Contrast specific
  const [miembro, setMiembro] = useState('DERECHO');
  const [vena, setVena] = useState('CEFÁLICA');
  const [yelco, setYelco] = useState('20');
  const [punciones, setPunciones] = useState('ÚNICA PUNCIÓN');
  const [medioContraste, setMedioContraste] = useState('ULTRAVIST');
  const [dosisCc, setDosisCc] = useState('80');
  const [huboComplicacion, setHuboComplicacion] = useState(false);

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
    const mot = motivo.trim().toUpperCase() || 'CUADRO CLÍNICO EN ESTUDIO';

    const trauText = tieneTrauma
      ? `ANTECEDENTE DE ${traumaEsp.trim().toUpperCase() || 'TRAUMA'}`
      : 'NIEGA TRAUMAS';

    const qxText = tieneQx
      ? `${qxEsp.trim().toUpperCase() || 'ANTECEDENTES QUIRÚRGICOS'}`
      : 'NIEGA ANTECEDENTES QUIRÚRGICOS';

    const alerText = tieneAlergias
      ? `REFIERE ALERGIA A ${alergiaEsp.trim().toUpperCase() || 'NO ESPECIFICADA'}`
      : 'NIEGA ALERGIAS';

    let txt = '';
    if (tipo === 'ADULTO') {
      txt = `INGRESA PACIENTE ${
        genero === 'MASCULINO' ? 'MASCULINO' : 'FEMENINO'
      }, ALERTA, ORIENTAD${e} EN LAS TRES ESFERAS, CONSCIENTE, AMBULANDO POR SUS PROPIOS MEDIOS. ASISTE DE FORMA AMBULATORIA PARA LA REALIZACIÓN DE ESTUDIO DIAGNÓSTICO POR IMAGEN INDICADO DEBIDO A ${mot}.

ANTECEDENTES PERSONALES:
- TRAUMÁTICOS: ${trauText}.
- QUIRÚRGICOS: ${qxText}.
- ALÉRGICOS: ${alerText}.

SE EXPLICA DETALLADAMENTE EL PROCEDIMIENTO, OBTENIENDO LA ACEPTACIÓN Y FIRMA DEL CONSENTIMIENTO INFORMADO PARA LA EXPOSICIÓN A RADIACIONES IONIZANTES. ASIMISMO, SE SOCIALIZAN LOS DERECHOS Y DEBERES DEL PACIENTE. (DERECHO: ${d}. DEBER: ${b}).

PREVIO CUMPLIMIENTO DEL PROTOCOLO INSTITUCIONAL DE ANTISEPSIA Y DESINFECCIÓN CON MELISEPTOL DE LA ZONA CORRESPONDIENTE, SE COLABORA EN LA TOMA DEL ESTUDIO RADIOLÓGICO, EL CUAL TRANSCURRE SIN COMPLICACIONES NI EVENTUALIDADES.

SE BRINDAN RECOMENDACIONES CLARAS AL EGRESO Y SE ORIENTA AL PACIENTE SOBRE LOS CANALES Y TIEMPOS PARA LA ENTREGA DE RESULTADOS. EGRESA DE LA INSTITUCIÓN AMBULANDO POR SUS PROPIOS MEDIOS, EN ADECUADAS CONDICIONES GENERALES, ESTABLE Y SIN ALTERACIONES APARENTES.`;
    } else if (tipo === 'PEDIATRICO') {
      txt = `INGRESA PACIENTE PEDIÁTRIC${e} EN COMPAÑÍA DE SU ${acomp}, SE OBSERVA ${estadoPed}, ALERTA Y CONSCIENTE. ASISTE DE FORMA AMBULATORIA PARA LA REALIZACIÓN DE ESTUDIO DIAGNÓSTICO POR IMAGEN INDICADO DEBIDO A ${mot}.

ANTECEDENTES PERSONALES:
- TRAUMÁTICOS: ${trauText}.
- QUIRÚRGICOS: ${qxText}.
- ALÉRGICOS: ${alerText}.

SE EXPLICA DETALLADAMENTE EL PROCEDIMIENTO A LOS PADRES O ACOMPAÑANTE, OBTENIENDO LA ACEPTACIÓN Y FIRMA DEL CONSENTIMIENTO INFORMADO POR PARTE DE ${acomp} PARA LA EXPOSICIÓN A RADIACIONES IONIZANTES. SE SOCIALIZAN LOS DERECHOS Y DEBERES DEL PACIENTE. (DERECHO: ${d}. DEBER: ${b}).

PREVIO CUMPLIMIENTO DEL PROTOCOLO INSTITUCIONAL DE ANTISEPSIA Y DESINFECCIÓN CON MELISEPTOL DE LA ZONA CORRESPONDIENTE, SE PROVEE CHALECO PLOMADO Y SE COLABORA EN LA TOMA DEL ESTUDIO RADIOLÓGICO, EL CUAL TRANSCURRE SIN COMPLICACIONES NI EVENTUALIDADES.

SE BRINDAN RECOMENDACIONES CLARAS AL EGRESO Y SE ORIENTA SOBRE LOS CANALES Y TIEMPOS PARA LA ENTREGA DE RESULTADOS. EGRESA ${salidaPed}, EN ADECUADAS CONDICIONES GENERALES, ESTABLE Y SIN ALTERACIONES APARENTES.`;
    } else {
      const compText = huboComplicacion
        ? ', EXCEPTO PRESENTACIÓN DE REACCIÓN ALÉRGICA AL MEDIO DE CONTRASTE, SE TRASLADA USUARIO A SALA DE ENFERMERÍA PARA MONITORIZACIÓN Y VALORACIÓN MÉDICA'
        : '';

      const retText = huboComplicacion
        ? ''
        : ', SE RETIRA EL ACCESO VENOSO PERIFÉRICO Y SE VIGILA AL PACIENTE, DESCARTANDO REACCIONES ALÉRGICAS INMEDIATAS O SIGNOS DE EXTRAVASACIÓN';

      txt = `INGRESA PACIENTE CONSCIENTE, ALERTA Y ORIENTAD${e}, AMBULANDO POR SUS PROPIOS MEDIOS. ASISTE DE FORMA AMBULATORIA PARA LA TOMA DE EXAMEN DIAGNÓSTICO CON MEDIO DE CONTRASTE INDICADO POR ${mot}.

ANTECEDENTES PERSONALES:
- TRAUMÁTICOS: ${trauText}.
- QUIRÚRGICOS: ${qxText}.
- ALÉRGICOS: ${alerText}.

SE EXPLICA DETALLADAMENTE EL PROCEDIMIENTO, LOS RIESGOS ASOCIADOS A LA CANALIZACIÓN VENOSA (COMO HEMATOMA O EXTRAVASACIÓN DEL MEDIO DE CONTRASTE) Y LOS SIGNOS Y SÍNTOMAS DE ALARMA. SE RESUELVEN DUDAS Y SE OBTIENE LA ACEPTACIÓN Y FIRMA DE LOS CONSENTIMIENTOS INFORMADOS PARA LA ADMINISTRACIÓN DE CONTRASTE ENDOVENOSO. ASIMISMO, SE SOCIALIZAN LOS DEBERES Y DERECHOS INSTITUCIONALES. (DERECHO: ${d}. DEBER: ${b}).

PREVIO LAVADO DE MANOS Y BAJO RIGUROSA TÉCNICA ASÉPTICA, SE REALIZA CANALIZACIÓN DE VENA ${vena.trim().toUpperCase()} ${miembro} CON CATÉTER VENOSO PERIFÉRICO (YELCO) CALIBRE ${yelco} EN ${punciones}. SE COMPRUEBA RETORNO VENOSO Y SE VERIFICA PERMEABILIDAD SIN COMPLICACIONES.

SE INGRESA AL PACIENTE AL ÁREA DEL TOMÓGRAFO, CUYA CAMILLA HA SIDO PREVIAMENTE DESINFECTADA CON MELISEPTOL SEGÚN PROTOCOLO INSTITUCIONAL. SE POSICIONA ADECUADAMENTE Y SE CONECTA AL INYECTOR AUTOMÁTICO. SE ENTREGA AL PACIENTE AL TECNÓLOGO DE TURNO, QUIEN REALIZA EL POSICIONAMIENTO FINAL E INICIA EL ESTUDIO. PREVIO CALENTAMIENTO DEL MEDIO DE CONTRASTE ${medioContraste.trim().toUpperCase()} A 37 °C, SE ADMINISTRAN ${dosisCc} CC POR VÍA INTRAVENOSA MEDIANTE EL INYECTOR, EL PROCEDIMIENTO TRANSCURRE SIN INCIDENTES NI COMPLICACIONES${compText}.

FINALIZADO EL ESTUDIO${retText}. SE BRINDAN RECOMENDACIONES DE EGRESO, EDUCACIÓN SOBRE ADECUADA HIDRATACIÓN Y PAUTAS DIETÉTICAS, Y SE ORIENTA SOBRE LOS CANALES Y TIEMPOS PARA LA ENTREGA DE RESULTADOS. EGRESA DE LA INSTITUCIÓN AMBULANDO POR SUS PROPIOS MEDIOS, EN ADECUADAS CONDICIONES GENERALES, ESTABLE Y SIN ALTERACIONES APARENTES.`;
    }

    const upper = txt.toUpperCase();
    setNoteOutput(upper);
    onSaveToHistory(upper, `TAC (${tipo}): ${mot}`);
  };

  const handleClear = () => {
    setTipo('ADULTO');
    setGenero('MASCULINO');
    setMotivo('');
    setTieneTrauma(false);
    setTraumaEsp('');
    setTieneQx(false);
    setQxEsp('');
    setTieneAlergias(false);
    setAlergiaEsp('');
    setHuboComplicacion(false);
    setNoteOutput('');
  };

  const autoFillDemo = () => {
    setTipo('CONTRASTE');
    setGenero('MASCULINO');
    setMotivo('DOLOR ABDOMINAL AGUDO / SOSPECHA APENDICITIS');
    setTieneTrauma(false);
    setTieneQx(false);
    setTieneAlergias(false);
    setVena('CEFÁLICA ANTECUBITAL');
    setMiembro('DERECHO');
    setYelco('18');
    setMedioContraste('ULTRAVIST 370');
    setDosisCc('90');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-sky-100 text-sky-800 rounded-xl">
            <Disc className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Tomografía Computarizada (TAC)
            </h2>
            <p className="text-xs text-slate-500">
              Protocolos para TAC Simple Adulto, TAC Pediátrico con protección radiológica y TAC con Contraste a 37°C
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={autoFillDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200 transition"
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
          {/* Card 1: Modalidad y Contexto */}
          <fieldset className="border border-slate-200 p-5 rounded-2xl bg-white shadow-xs space-y-4">
            <legend className="text-xs font-extrabold text-slate-600 px-3 uppercase tracking-wider bg-slate-100 rounded-lg border border-slate-200 py-1">
              1. Modalidad del Estudio y Paciente
            </legend>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Modalidad de Tomografía
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TacTipo)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-extrabold text-slate-900 focus:ring-2 focus:ring-sky-500"
              >
                <option value="ADULTO">TAC SIMPLE ADULTO</option>
                <option value="PEDIATRICO">TAC SIMPLE PEDIÁTRICO (CHALECO PLOMADO)</option>
                <option value="CONTRASTE">TAC CON MEDIO DE CONTRASTE ENDOVENOSO</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Género</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="tac-gen"
                    value="MASCULINO"
                    checked={genero === 'MASCULINO'}
                    onChange={() => setGenero('MASCULINO')}
                    className="h-4 w-4 text-sky-600 mr-2"
                  />
                  Masculino
                </label>
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="tac-gen"
                    value="FEMENINO"
                    checked={genero === 'FEMENINO'}
                    onChange={() => setGenero('FEMENINO')}
                    className="h-4 w-4 text-sky-600 mr-2"
                  />
                  Femenino
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Motivo / Indicación del TAC
              </label>
              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej: Sospecha de ACV, Apendicitis, Traumatismo"
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            {/* Pediatric specific options */}
            {tipo === 'PEDIATRICO' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-pink-50/70 border border-pink-200 rounded-xl">
                <div>
                  <label className="block text-[10px] font-bold text-pink-800 uppercase mb-1">
                    Acompañante
                  </label>
                  <select
                    value={acomp}
                    onChange={(e) => setAcomp(e.target.value)}
                    className="w-full p-2 border border-pink-300 rounded-lg text-xs font-semibold bg-white"
                  >
                    <option value="MADRE">MADRE</option>
                    <option value="PADRE">PADRE</option>
                    <option value="TUTOR LEGAL">TUTOR LEGAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-pink-800 uppercase mb-1">
                    Estado al Ingreso
                  </label>
                  <select
                    value={estadoPed}
                    onChange={(e) => setEstadoPed(e.target.value)}
                    className="w-full p-2 border border-pink-300 rounded-lg text-xs font-semibold bg-white"
                  >
                    <option value="TRANQUILO">TRANQUILO</option>
                    <option value="DORMIDO">DORMIDO</option>
                    <option value="LLOROSO">LLOROSO CONSOLABLE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-pink-800 uppercase mb-1">
                    Modo de Salida
                  </label>
                  <select
                    value={salidaPed}
                    onChange={(e) => setSalidaPed(e.target.value)}
                    className="w-full p-2 border border-pink-300 rounded-lg text-xs font-semibold bg-white"
                  >
                    <option value="EN BRAZOS DE MADRE">EN BRAZOS</option>
                    <option value="CAMINANDO">CAMINANDO</option>
                    <option value="EN SILLA">EN SILLA</option>
                  </select>
                </div>
              </div>
            )}

            {/* Adult specific movilization */}
            {tipo !== 'PEDIATRICO' && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Movilización del Paciente
                </label>
                <select
                  value={movilizacion}
                  onChange={(e) => setMovilizacion(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold bg-white"
                >
                  <option value="CAMINANDO POR SUS PROPIOS MEDIOS">Caminando por sus propios medios</option>
                  <option value="EN SILLA DE RUEDAS">En silla de ruedas</option>
                  <option value="EN CAMILLA">En camilla</option>
                </select>
              </div>
            )}

            {/* Triad Antecedents */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-red-50/70 p-3 rounded-xl border border-red-200">
                <label className="flex items-center font-bold text-red-900 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tieneTrauma}
                    onChange={(e) => setTieneTrauma(e.target.checked)}
                    className="h-3.5 w-3.5 text-red-600 rounded mr-1.5"
                  />
                  Ant. Traumáticos
                </label>
                {tieneTrauma && (
                  <input
                    type="text"
                    value={traumaEsp}
                    onChange={(e) => setTraumaEsp(e.target.value)}
                    placeholder="Especifique trauma..."
                    className="w-full mt-2 p-1.5 bg-white border border-red-300 rounded text-xs font-medium"
                  />
                )}
              </div>

              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200">
                <label className="flex items-center font-bold text-blue-900 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tieneQx}
                    onChange={(e) => setTieneQx(e.target.checked)}
                    className="h-3.5 w-3.5 text-blue-600 rounded mr-1.5"
                  />
                  Ant. Quirúrgicos
                </label>
                {tieneQx && (
                  <input
                    type="text"
                    value={qxEsp}
                    onChange={(e) => setQxEsp(e.target.value)}
                    placeholder="Especifique cirugía..."
                    className="w-full mt-2 p-1.5 bg-white border border-blue-300 rounded text-xs font-medium"
                  />
                )}
              </div>

              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                <label className="flex items-center font-bold text-amber-900 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tieneAlergias}
                    onChange={(e) => setTieneAlergias(e.target.checked)}
                    className="h-3.5 w-3.5 text-amber-600 rounded mr-1.5"
                  />
                  Alergias
                </label>
                {tieneAlergias && (
                  <input
                    type="text"
                    value={alergiaEsp}
                    onChange={(e) => setAlergiaEsp(e.target.value)}
                    placeholder="Especifique alergia..."
                    className="w-full mt-2 p-1.5 bg-white border border-amber-300 rounded text-xs font-medium"
                  />
                )}
              </div>
            </div>

            <DerechoDeberSelect value={derechoDeber} onChange={setDerechoDeber} />
          </fieldset>

          {/* Card 2: Contraste TAC (Conditional) */}
          {tipo === 'CONTRASTE' && (
            <fieldset className="border border-slate-200 p-5 rounded-2xl bg-white shadow-xs space-y-4 animate-in fade-in duration-200">
              <legend className="text-xs font-extrabold text-slate-600 px-3 uppercase tracking-wider bg-slate-100 rounded-lg border border-slate-200 py-1">
                2. Canalización e Inyector de Contraste (37°C)
              </legend>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Miembro
                  </label>
                  <select
                    value={miembro}
                    onChange={(e) => setMiembro(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                  >
                    <option value="DERECHO">DERECHO</option>
                    <option value="IZQUIERDO">IZQUIERDO</option>
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
                    <option value="18">18</option>
                    <option value="20">20</option>
                    <option value="22">22</option>
                    <option value="24">24</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Intentos Punción
                  </label>
                  <select
                    value={punciones}
                    onChange={(e) => setPunciones(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                  >
                    <option value="ÚNICA PUNCIÓN">ÚNICA</option>
                    <option value="MÚLTIPLES PUNCIONES">MÚLTIPLES</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl">
                <div>
                  <label className="block text-[10px] font-bold text-sky-900 uppercase mb-1">
                    Medio de Contraste
                  </label>
                  <input
                    type="text"
                    value={medioContraste}
                    onChange={(e) => setMedioContraste(e.target.value)}
                    className="w-full p-2 bg-white border border-sky-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-sky-900 uppercase mb-1">
                    Dosis Administrada (cc)
                  </label>
                  <input
                    type="text"
                    value={dosisCc}
                    onChange={(e) => setDosisCc(e.target.value)}
                    className="w-full p-2 bg-white border border-sky-300 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="bg-red-50/70 p-3 rounded-xl border border-red-200">
                <label className="flex items-center font-bold text-red-900 text-xs sm:text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={huboComplicacion}
                    onChange={(e) => setHuboComplicacion(e.target.checked)}
                    className="h-4 w-4 text-red-600 rounded mr-2"
                  />
                  ¿Se presentó complicación / reacción alérgica al medio de contraste?
                </label>
                {huboComplicacion && (
                  <p className="text-[11px] text-red-700 mt-1 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    Se incluirá reporte de traslado a sala de enfermería para monitorización y valoración médica.
                  </p>
                )}
              </div>
            </fieldset>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-xl shadow-lg text-white bg-slate-800 hover:bg-slate-900 font-extrabold text-sm tracking-wide transition cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
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
            title="Vista Previa · Tomografía (TAC)"
            badgeLabel={tipo}
            rows={28}
          />
        </div>
      </div>
    </div>
  );
};
