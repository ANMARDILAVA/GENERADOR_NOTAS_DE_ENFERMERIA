import { AdminConfig, CustomTemplate } from '../types/clinical';
import { MODULES_CONFIG } from '../constants/clinicalOptions';

const ADMIN_STORAGE_KEY = 'enfermeria_admin_config_v1';

export const ALL_BASE_TEMPLATES: CustomTemplate[] = [
  {
    id: 'curacion',
    title: 'Curación de Heridas',
    shortTitle: 'Curación',
    description: 'Valoración integral de heridas, exudado, asepsia y apósitos según protocolo.',
    category: 'Procedimientos y Curaciones',
    templateFormat: `INGRESA PACIENTE A SALA DE ENFERMERÍA, ALERTA, ORIENTAD{GENERO_EO}, CONSCIENTE, CAMINANDO POR SUS PROPIOS MEDIOS, TRAE ORDEN PARA REALIZAR CURACIÓN DE LESIÓN EN {AREA_LESION} SECUNDARIO A {CAUSA}.

SE REVISA ORDEN MÉDICA, SE CONFIRMA PRESCRIPCIÓN. {ALERGIAS}. SE OBTIENE FIRMA DE CONSENTIMIENTO. SE SOCIALIZA DERECHO Y DEBER: ({DERECHO_DEBER}).

SE UBICA {GENERO_ALA} PACIENTE EN CAMILLA, POSICIÓN {POSICION}. SE VALORA HERIDA:
LOCALIZACIÓN: {LOCALIZACION}
TAMAÑO: {TAMANO}
EXUDADO: {EXUDADO}
ORIGEN: {ORIGEN}
INFECCIÓN: {INFECCION}
PIEL PERILESIONAL: {PIEL_PERILESIONAL}

PREVIO LAVADO DE MANOS Y BAJO TÉCNICA ASÉPTICA SE LAVA LESIÓN CON {LAVADO_CON}, SE SECA Y SE COLOCA {SE_COLOCA}, CUBRIENDO CON {CUBRE_CON} Y FIJANDO CON {FIJA_CON}.

SE DAN INDICACIONES Y SIGNOS DE ALARMA. PRÓXIMA CURACIÓN EN {DIAS_PROXIMA} DÍAS. SALE PACIENTE ALERTA, ORIENTAD{GENERO_EO}, CON RECOMENDACIONES DE CUIDADO.`,
    fields: [
      { id: 'AREA_LESION', label: 'Área de la Lesión', type: 'text', defaultValue: 'REGIÓN SACRA' },
      { id: 'CAUSA', label: 'Causa / Diagnóstico', type: 'text', defaultValue: 'ÚLCERA POR PRESIÓN GRADO II' },
      { id: 'TAMANO', label: 'Tamaño', type: 'text', defaultValue: '4X3 CM' },
      { id: 'LOCALIZACION', label: 'Localización', type: 'text', defaultValue: 'REGIÓN SACRA' },
      { id: 'EXUDADO', label: 'Exudado', type: 'text', defaultValue: 'SEROSO ESCASO' },
      { id: 'INFECCION', label: 'Signos de Infección', type: 'select', options: ['AUSENTES', 'PRESENTES (ERITEMA Y CALOR)'], defaultValue: 'AUSENTES' },
      { id: 'PIEL_PERILESIONAL', label: 'Piel Perilesional', type: 'text', defaultValue: 'Íntegra, sin maceración ni signos de flogosis' },
      { id: 'LAVADO_CON', label: 'Lavado con', type: 'text', defaultValue: 'Jabón quirúrgico y Solución Salina al 0.9%' },
      { id: 'SE_COLOCA', label: 'Se coloca', type: 'text', defaultValue: 'Parche hidrocoloide' },
      { id: 'CUBRE_CON', label: 'Cubre con', type: 'text', defaultValue: 'Gasa estéril' },
      { id: 'FIJA_CON', label: 'Fija con', type: 'text', defaultValue: 'FIXOMULL' },
      { id: 'DIAS_PROXIMA', label: 'Próxima Curación (días)', type: 'number', defaultValue: '2' },
    ],
    enabled: true,
    createdAt: 1710000000000,
  },
  {
    id: 'medicamentos-no-programada',
    title: 'Medicamentos (No Programada / Prioritaria)',
    shortTitle: 'Meds NP',
    description: 'Administración prioritaria y no programada con lista de 13 correctos.',
    category: 'Inyectología y Especiales',
    templateFormat: `INGRESA PACIENTE A SALA DE ENFERMERÍA, ALERTA, ORIENTAD{GENERO_EO}, CONSCIENTE, CAMINANDO POR SUS PROPIOS MEDIOS, TRAE ORDEN PARA ADMINISTRAR {FARMACO_1} {DOSIS_1} {VIA_1} COMO TRATAMIENTO PARA {MOTIVO}.

SE REVISA ORDEN MÉDICA, SE CONFIRMA PRESCRIPCIÓN, SE REVISA DISPONIBILIDAD DE LOS INSUMOS. SE REALIZA LISTA DE CHEQUEO PARA ADMINISTRACIÓN DE MEDICAMENTOS, SE INDAGAN ALERGIAS: {ALERGIAS}.

SE OBTIENE FIRMA DE CONSENTIMIENTO DE ENFERMERÍA. SE REALIZA VERIFICACIÓN DE LOS 13 CORRECTOS EN LA ADMINISTRACIÓN DE MEDICAMENTOS. SE EXPLICA EL PROCEDIMIENTO, PACIENTE REFIERE ENTENDER Y ACEPTAR.

SE SOCIALIZA EL DERECHO Y DEBER: ({DERECHO_DEBER}).

SE REALIZA LAVADO DE MANOS. SE UBICA AL PACIENTE EN EL CUBÍCULO NÚMERO {CUBICULO}, EN CAMILLA, EN POSICIÓN {POSICION}. SE VALORAN ESCALAS DE RIESGO: CAÍDA ({RIESGO_CAIDA}), LESIÓN DE PIEL ({RIESGO_PIEL}).

SE REALIZA DESINFECCIÓN DEL {SITIO_1}, SE ADMINISTRA {FARMACO_1} {DOSIS_1} DE FORMA {VIA_1} SIN PRESENTARSE NINGUNA REACCIÓN ADVERSA.

SE INDICA AL PACIENTE PERMANECER 10 MINUTOS EN EL CUBÍCULO COMO TIEMPO DE OBSERVACIÓN POST-ADMINISTRACIÓN DE MEDICAMENTOS. TRANSCURRIDOS LOS 10 MINUTOS, SALE PACIENTE DEL ÁREA DE ENFERMERÍA, ALERTA, ORIENTAD{GENERO_EO}, CONSCIENTE, CON EL MEDICAMENTO ADMINISTRADO. SE BRINDAN RECOMENDACIONES Y EDUCACIÓN EN TORNO AL MEDICAMENTO ADMINISTRADO. PACIENTE REFIERE ENTENDER Y ACEPTAR.`,
    fields: [
      { id: 'MOTIVO', label: 'Motivo', type: 'text', defaultValue: 'DOLOR LUMBAR AGUDO' },
      { id: 'FARMACO_1', label: 'Fármaco', type: 'text', defaultValue: 'DICLOFENACO' },
      { id: 'DOSIS_1', label: 'Dosis', type: 'text', defaultValue: '75 MG' },
      { id: 'VIA_1', label: 'Vía', type: 'text', defaultValue: 'INTRAMUSCULAR' },
      { id: 'SITIO_1', label: 'Sitio', type: 'text', defaultValue: 'CUADRANTE SUPERIOR EXTERNO DEL GLUTEO DERECHO' },
      { id: 'CUBICULO', label: 'Cubículo', type: 'number', defaultValue: '1' },
      { id: 'RIESGO_CAIDA', label: 'Riesgo Caída', type: 'select', options: ['RIESGO BAJO', 'RIESGO MEDIO', 'RIESGO ALTO'], defaultValue: 'RIESGO BAJO' },
      { id: 'RIESGO_PIEL', label: 'Riesgo Piel', type: 'select', options: ['RIESGO BAJO', 'RIESGO MEDIO', 'RIESGO ALTO'], defaultValue: 'RIESGO BAJO' },
    ],
    enabled: true,
    createdAt: 1710000000001,
  },
  {
    id: 'medicamentos-ce',
    title: 'Medicamentos (Consulta Externa / INVIMA)',
    shortTitle: 'Meds CE (INVIMA)',
    description: 'Medicamento aportado por el paciente con trazabilidad INVIMA, lote y FV.',
    category: 'Inyectología y Especiales',
    templateFormat: `INGRESA PACIENTE A SALA DE ENFERMERÍA, ALERTA, ORIENTAD{GENERO_EO}, CONSCIENTE, CAMINANDO POR SUS PROPIOS MEDIOS, TRAE ORDEN PARA ADMINISTRAR {FARMACO_1} {DOSIS_1} {VIA_1} COMO TRATAMIENTO PARA {MOTIVO}.

SE REVISA ORDEN MÉDICA, SE CONFIRMA PRESCRIPCIÓN, SE REVISA DISPONIBILIDAD DE LOS INSUMOS. SE REALIZA LISTA DE CHEQUEO PARA ADMINISTRACIÓN DE MEDICAMENTOS, SE INDAGAN ALERGIAS: {ALERGIAS}.

SE OBTIENE FIRMA DE CONSENTIMIENTO DE ENFERMERÍA. SE REALIZA VERIFICACIÓN DE LOS 13 CORRECTOS EN LA ADMINISTRACIÓN DE MEDICAMENTOS. SE EXPLICA EL PROCEDIMIENTO, PACIENTE REFIERE ENTENDER Y ACEPTAR.

SE SOCIALIZA EL DERECHO Y DEBER: ({DERECHO_DEBER}).

PACIENTE TRAE EL MEDICAMENTO, LOS DATOS DE SEGURIDAD SON LOS SIGUIENTES:
MEDICAMENTO 1 ({FARMACO_1}):
DOSIS: {DOSIS_1}
LOTE: {LOTE_1}
FECHA VENCIMIENTO: {FECHA_VENC_1}
INVIMA: {INVIMA_1}

SE REALIZA LAVADO DE MANOS. SE UBICA AL PACIENTE EN EL CUBÍCULO NÚMERO {CUBICULO}, EN CAMILLA, EN POSICIÓN {POSICION}. SE VALORAN ESCALAS DE RIESGO: CAÍDA ({RIESGO_CAIDA}), LESIÓN DE PIEL ({RIESGO_PIEL}).

SE REALIZA DESINFECCIÓN DEL {SITIO_1}, SE ADMINISTRA {FARMACO_1} {DOSIS_1} DE FORMA {VIA_1} SIN PRESENTARSE NINGUNA REACCIÓN ADVERSA.

SE INDICA AL PACIENTE PERMANECER 10 MINUTOS EN EL CUBÍCULO COMO TIEMPO DE OBSERVACIÓN POST-ADMINISTRACIÓN DE MEDICAMENTOS. TRANSCURRIDOS LOS 10 MINUTOS, SALE PACIENTE DEL ÁREA DE ENFERMERÍA, ALERTA, ORIENTAD{GENERO_EO}, CONSCIENTE, CON EL MEDICAMENTO ADMINISTRADO. SE BRINDAN RECOMENDACIONES Y EDUCACIÓN EN TORNO AL MEDICAMENTO ADMINISTRADO. PACIENTE REFIERE ENTENDER Y ACEPTAR.`,
    fields: [
      { id: 'MOTIVO', label: 'Motivo', type: 'text', defaultValue: 'TRATAMIENTO HORMONAL DE REEMPLAZO' },
      { id: 'FARMACO_1', label: 'Fármaco', type: 'text', defaultValue: 'NEBIDO (UNDECANOATO DE TESTOSTERONA)' },
      { id: 'DOSIS_1', label: 'Dosis', type: 'text', defaultValue: '1000 MG / 4 ML' },
      { id: 'VIA_1', label: 'Vía', type: 'text', defaultValue: 'INTRAMUSCULAR' },
      { id: 'SITIO_1', label: 'Sitio', type: 'text', defaultValue: 'CUADRANTE SUPERIOR EXTERNO DEL GLUTEO DERECHO' },
      { id: 'LOTE_1', label: 'Lote', type: 'text', defaultValue: 'LT-98241B' },
      { id: 'FECHA_VENC_1', label: 'Fecha Vencimiento', type: 'text', defaultValue: '2027-08-30' },
      { id: 'INVIMA_1', label: 'INVIMA', type: 'text', defaultValue: 'INVIMA 2019M-0014522' },
      { id: 'CUBICULO', label: 'Cubículo', type: 'number', defaultValue: '1' },
    ],
    enabled: true,
    createdAt: 1710000000002,
  },
  {
    id: 'meds-pediatricos',
    title: 'Medicamentos Pediátricos',
    shortTitle: 'Meds Pediátricos',
    description: 'Administración a pacientes pediátricos con registro de acompañante y contención.',
    category: 'Inyectología y Especiales',
    templateFormat: `INGRESA PACIENTE PEDIÁTRICO A SALA DE ENFERMERÍA, SE OBSERVA ALERTA, ACTIVO, EN COMPAÑÍA DE SU {ACOMPANANTE}. PRESENTA ORDEN PARA ADMINISTRAR {FARMACO_1} {DOSIS_1} {VIA_1} COMO TRATAMIENTO PARA {MOTIVO}.

SE REVISA ORDEN MÉDICA, SE INDAGAN ALERGIAS, ACUDIENTE {ALERGIAS}. SE OBTIENE FIRMA DE CONSENTIMIENTO INFORMADO POR PARTE DEL ADULTO RESPONSABLE. SE REALIZA LA VERIFICACIÓN DE LOS 13 CORRECTOS PARA LA ADMINISTRACIÓN SEGURA. SE EXPLICA EL PROCEDIMIENTO AL MENOR Y A SU ACOMPAÑANTE, Y SE BRINDA EDUCACIÓN SOBRE EL MEDICAMENTO A ADMINISTRAR. SE SOCIALIZA DERECHO Y DEBER: ({DERECHO_DEBER}).

PREVIO LAVADO DE MANOS, SE UBICA AL PACIENTE EN EL CUBÍCULO N.º {CUBICULO}, EN CAMILLA, EN POSICIÓN {POSICION}, CON APOYO Y CONTENCIÓN POR PARTE DE SU {ACOMPANANTE}. SE VALORAN ESCALAS DE RIESGO: CAÍDA ({RIESGO_CAIDA}), LESIÓN DE PIEL ({RIESGO_PIEL}). SE REALIZA DESINFECCIÓN DEL {SITIO_1} Y SE ADMINISTRA {FARMACO_1} {DOSIS_1} DE FORMA {VIA_1} SIN PRESENTARSE REACCIÓN ADVERSA INMEDIATA.

SE INDICA AL ACUDIENTE PERMANECER CON EL MENOR 10 MINUTOS EN OBSERVACIÓN. TRANSCURRIDO EL TIEMPO, EL PACIENTE PEDIÁTRICO EGRESA EN COMPAÑÍA DE SU FAMILIAR, ALERTA Y TRANQUILO. SE BRINDAN RECOMENDACIONES DE CUIDADO.`,
    fields: [
      { id: 'ACOMPANANTE', label: 'Acompañante', type: 'select', options: ['MADRE', 'PADRE', 'ABUELO/A', 'TUTOR LEGAL'], defaultValue: 'MADRE' },
      { id: 'MOTIVO', label: 'Motivo', type: 'text', defaultValue: 'AMIGDALITIS AGUDA BACTERIANA' },
      { id: 'FARMACO_1', label: 'Fármaco', type: 'text', defaultValue: 'CEFTRIAXONA' },
      { id: 'DOSIS_1', label: 'Dosis', type: 'text', defaultValue: '500 MG' },
      { id: 'VIA_1', label: 'Vía', type: 'text', defaultValue: 'INTRAMUSCULAR' },
      { id: 'SITIO_1', label: 'Sitio Pediátrico', type: 'text', defaultValue: 'CARA ANTEROLATERAL TERCIO MEDIO DEL MUSLO DERECHO' },
      { id: 'CUBICULO', label: 'Cubículo', type: 'number', defaultValue: '1' },
    ],
    enabled: true,
    createdAt: 1710000000003,
  },
  {
    id: 'observacion',
    title: 'Sala de Observación Clínica',
    shortTitle: 'Observación',
    description: 'Ingreso, canalización venosa, notas de evolución y egreso con cálculo de líquidos.',
    category: 'Urgencias y Prioritaria',
    templateFormat: `INGRESA PACIENTE A SALA DE ENFERMERÍA, ALERTA, ORIENTAD{GENERO_EO}, EN COMPAÑÍA DE {MEDICO_REFIERE} CON ORDEN PARA CANALIZAR Y ADMINISTRAR {FARMACO_1} COMO TRATAMIENTO PARA {MOTIVO}.

{ALERGIAS}. SE FIRMA CONSENTIMIENTO. SE SOCIALIZA DERECHO Y DEBER: ({DERECHO_DEBER}).

SE TOMAN SIGNOS VITALES LOS CUALES ESTÁN {SIGNOS_VITALES}. PACIENTE PRESENTA: {SINTOMAS}. RIESGOS: CAÍDA ({RIESGO_CAIDA}), PIEL ({RIESGO_PIEL}), DOLOR ({DOLOR}).

PREVIO LAVADO DE MANOS Y BAJO TÉCNICA ASÉPTICA SE CANALIZA VENA {VENA} EN MIEMBRO {MIEMBRO} CON YELCO NRO {YELCO}, {PUNCIONES}. SE FIJA ACCESO. SE INICIA {FARMACO_1} DILUIDO EN {DILUCION_ML} ML DE SOL. SALINA. SE DEJA PACIENTE EN CAMILLA, EN POSICIÓN {POSICION}, BARANDAS ARRIBA.`,
    fields: [
      { id: 'MEDICO_REFIERE', label: 'Médico que refiere', type: 'text', defaultValue: 'DR. ANDRES TORRES' },
      { id: 'MOTIVO', label: 'Motivo', type: 'text', defaultValue: 'GASTROENTERITIS AGUDA' },
      { id: 'FARMACO_1', label: 'Fármaco', type: 'text', defaultValue: 'METOCLOPRAMIDA 10 MG' },
      { id: 'DILUCION_ML', label: 'Dilución (ml)', type: 'number', defaultValue: '250' },
      { id: 'SINTOMAS', label: 'Síntomas', type: 'text', defaultValue: 'EPIGASTRALGIA Y NÁUSEAS' },
      { id: 'VENA', label: 'Vena', type: 'text', defaultValue: 'CEFÁLICA' },
      { id: 'YELCO', label: 'Calibre Yelco', type: 'select', options: ['18', '20', '22'], defaultValue: '20' },
    ],
    enabled: true,
    createdAt: 1710000000004,
  },
  {
    id: 'ekg',
    title: 'Electrocardiograma (EKG)',
    shortTitle: 'EKG',
    description: 'Registro técnico de toma de EKG de 12 derivaciones y retiro de metales.',
    category: 'Urgencias y Prioritaria',
    templateFormat: `INGRESA PACIENTE A SALA DE ENFERMERÍA, ALERTA, ORIENTAD{GENERO_EO}, CONSCIENTE, CAMINANDO, TRAE ORDEN MÉDICA PARA ELECTROCARDIOGRAMA, ENVIADO POR {ENVIADO_POR} AL PRESENTAR {MOTIVO}.

SE SOCIALIZA DERECHO Y DEBER: ({DERECHO_DEBER}).

SE EXPLICA EL PROCEDIMIENTO {GENERO_ALA} PACIENTE, REFIERE ENTENDER Y ACEPTAR. SE LE INDICA RETIRAR OBJETOS METÁLICOS. SE UBICA EN CAMILLA DECÚBITO SUPINO, SE TOMAN TRAZOS SIN NOVEDAD.

FINALIZADO EL EXAMEN, SE LE INDICA ESPERAR RESULTADOS. SALE PACIENTE DE SALA DE ENFERMERÍA, ALERTA, ORIENTAD{GENERO_EO}.`,
    fields: [
      { id: 'ENVIADO_POR', label: 'Enviado por', type: 'text', defaultValue: 'DR. MARCO A. RIVERA' },
      { id: 'MOTIVO', label: 'Motivo', type: 'text', defaultValue: 'DOLOR PRECORDIAL OPRESIVO EN REPOSO' },
    ],
    enabled: true,
    createdAt: 1710000000005,
  },
  {
    id: 'penicilina',
    title: 'Prueba y Administración de Penicilina',
    shortTitle: 'Penicilina',
    description: 'Prueba intradérmica de sensibilidad, lectura a los 20 min y terapia intramuscular.',
    category: 'Inyectología y Especiales',
    templateFormat: `INGRESA PACIENTE A SALA, ALERTA, ORIENTAD{GENERO_EO}, TRAE ORDEN PARA ADMINISTRAR PENICILINA BENZATÍNICA 2.400.000 UI IM COMO TRATAMIENTO PARA {MOTIVO}.

SE REVISA ORDEN Y APLICA LISTA DE CHEQUEO. {ALERGIAS} (DIF A PENICILINA). SE SOCIALIZA DERECHO Y DEBER: ({DERECHO_DEBER}). SE FIRMA CONSENTIMIENTO.

SE REALIZA PRUEBA DE SENSIBILIDAD EN {SITIO_PRUEBA} CON 0.1 ML DE PENICILINA SÓDICA. PASADOS 20 MINUTOS RESULTADO NEGATIVO.

SE UBICA {GENERO_ALA} PACIENTE EN CUBÍCULO {CUBICULO}. SE ADMINISTRA PENICILINA EN {SITIO_TERAPIA} SIN REACCIONES. SE DEJA 10 MINUTOS EN OBSERVACIÓN. SALE PACIENTE ALERTA CON RECOMENDACIONES.`,
    fields: [
      { id: 'MOTIVO', label: 'Motivo', type: 'text', defaultValue: 'INFECCIÓN BACTERIANA / FARINGOAMIGDALITIS' },
      { id: 'SITIO_PRUEBA', label: 'Sitio Prueba', type: 'select', options: ['MIEMBRO SUPERIOR DERECHO', 'MIEMBRO SUPERIOR IZQUIERDO'], defaultValue: 'MIEMBRO SUPERIOR DERECHO' },
      { id: 'SITIO_TERAPIA', label: 'Sitio Terapia', type: 'select', options: ['GLUTEO DERECHO', 'GLUTEO IZQUIERDO'], defaultValue: 'GLUTEO DERECHO' },
      { id: 'CUBICULO', label: 'Cubículo', type: 'number', defaultValue: '1' },
    ],
    enabled: true,
    createdAt: 1710000000006,
  },
  {
    id: 'retiro-puntos',
    title: 'Retiro de Puntos de Sutura',
    shortTitle: 'Retiro de Puntos',
    description: 'Procedimiento de extracción completa de sutura, asepsia y revisión de bordes.',
    category: 'Procedimientos y Curaciones',
    templateFormat: `INGRESA PACIENTE A SALA DE ENFERMERÍA, ALERTA Y ORIENTAD{GENERO_EO}, TRAE ORDEN PARA RETIRO DE PUNTOS. SE VERIFICA ORDEN Y SE FIRMA CONSENTIMIENTO.

SE SOCIALIZA DERECHO Y DEBER: ({DERECHO_DEBER}).

SE UBICA EN CUBÍCULO {CUBICULO}, POSICIÓN {POSICION}. SE REALIZA LIMPIEZA Y DESINFECCIÓN EN ZONA DE SUTURA ({ZONA}). SE RETIRAN {CANTIDAD_PUNTOS} PUNTOS VERIFICANDO QUE SE HAYAN EXTRAÍDO EN SU TOTALIDAD. NO SE PRESENTAN COMPLICACIONES.

SALE PACIENTE ALERTA Y ORIENTAD{GENERO_EO}, CON RECOMENDACIONES DE CUIDADO EN CASA.`,
    fields: [
      { id: 'ZONA', label: 'Zona Anatómica', type: 'text', defaultValue: 'REGIÓN SUPERCILIAR DERECHA' },
      { id: 'CANTIDAD_PUNTOS', label: 'Cantidad de Puntos', type: 'number', defaultValue: '4' },
      { id: 'CUBICULO', label: 'Cubículo', type: 'number', defaultValue: '1' },
    ],
    enabled: true,
    createdAt: 1710000000007,
  },
  {
    id: 'procedimientos',
    title: 'Dermatología y Procedimientos Menores',
    shortTitle: 'Dermatología',
    description: 'Biopsias, resecciones, nasolaringoscopia e infiltración con generador en vivo.',
    category: 'Procedimientos y Curaciones',
    templateFormat: `INGRESA PACIENTE A SALA DE PROCEDIMIENTOS MENORES, ALERTA, ORIENTAD{GENERO_EO}, CONSCIENTE, CAMINANDO POR SUS PROPIOS MEDIOS. PACIENTE ES VALORADO POR {PROFESIONAL}. {ALERGIAS}. SE VALORA RIESGO DE CAÍDA Y RIESGO DE LESIÓN DE PIEL: RIESGO DE CAÍDA: {RIESGO_CAIDA}. RIESGO DE LESIÓN DE PIEL: {RIESGO_PIEL}.

SE DILIGENCIA CONSENTIMIENTO INFORMADO. SE SOCIALIZA DERECHO Y DEBER: ({DERECHO_DEBER}).

SE UBICA AL PACIENTE EN CAMILLA EN POSICIÓN {POSICION}, EMPLEANDO TÉCNICA ASÉPTICA, SE REALIZA LIMPIEZA EN {ZONA}. BAJO ANESTESIA LOCAL CON {ANESTESIA}, {PROFESIONAL} REALIZA {PROCEDIMIENTO}. SE REALIZA CAUTERIZACIÓN. SIN COMPLICACIONES.

SE HACE RECUENTO DE MATERIAL Y GASAS COMPLETO Y CONFORME. SE REALIZA SUTURA CON {SUTURA}, PUNTOS: {PUNTOS}. SE DEJA CUBIERTA LA LESIÓN CON {CURACION_EGRESO}.

REGISTRADO EN SEGUIMIENTO PREMIUM. SALE PACIENTE EN ÓPTIMAS CONDICIONES.`,
    fields: [
      { id: 'PROFESIONAL', label: 'Profesional Especialista', type: 'text', defaultValue: 'DRA DAYANA ARENAS' },
      { id: 'PROCEDIMIENTO', label: 'Procedimiento', type: 'text', defaultValue: 'BIOPSIA DE LESIÓN CON PUNCH DE 4 MM' },
      { id: 'ZONA', label: 'Zona Anatómica', type: 'text', defaultValue: 'REGIÓN MALAR DERECHA' },
      { id: 'ANESTESIA', label: 'Anestesia', type: 'text', defaultValue: 'ROXICAINA 1% S/E Y BUPIVACAÍNA' },
      { id: 'SUTURA', label: 'Sutura', type: 'text', defaultValue: 'NYLON 5-0' },
      { id: 'PUNTOS', label: 'Puntos', type: 'number', defaultValue: '2' },
      { id: 'CURACION_EGRESO', label: 'Curación Egreso', type: 'text', defaultValue: 'ÁCIDO FUSÍDICO Y MICROPORE' },
    ],
    enabled: true,
    createdAt: 1710000000008,
  },
  {
    id: 'resonancia',
    title: 'Resonancia Magnética (RM)',
    shortTitle: 'Resonancia',
    description: 'Protocolos RM Simple, Con Contraste endovenoso y B. Hioscina IM.',
    category: 'Imágenes Diagnósticas',
    templateFormat: `INGRESA PACIENTE CONSCIENTE, ALERTA Y ORIENTAD{GENERO_EO}, {MOVILIZACION}. ASISTE DE FORMA AMBULATORIA PARA LA TOMA DE EXAMEN DIAGNÓSTICO INDICADO DEBIDO A {MOTIVO}.

ANTECEDENTES PERSONALES:
- TRAUMÁTICOS: {TRAUMAS}.
- QUIRÚRGICOS: {QUIRURGICOS}.
- ALÉRGICOS: {ALERGIAS}.

SE EXPLICA DETALLADAMENTE EL PROCEDIMIENTO, OBTENIENDO LA ACEPTACIÓN Y FIRMA DEL CONSENTIMIENTO INFORMADO PARA LA EXPOSICIÓN A CAMPOS ELECTROMAGNÉTICOS. ASIMISMO, SE SOCIALIZAN LOS DEBERES Y DERECHOS INSTITUCIONALES. ({DERECHO_DEBER}).

PREVIO CUMPLIMIENTO DEL PROTOCOLO INSTITUCIONAL DE ANTISEPSIA Y DESINFECCIÓN CON MELISEPTOL DE LA ZONA CORRESPONDIENTE, SE INGRESA PACIENTE AL ÁREA DE RESONADOR. SE COLOCA PROTECCIÓN AUDITIVA, SE ENTREGA BOTÓN DE LLAMADO Y SE EXPLICA CÓMO ACCIONARLO. SE UBICA AL PACIENTE EN LA MESA Y SE COLOCA LA ANTENA CORRESPONDIENTE. EL ESTUDIO TRANSCURRE SIN COMPLICACIONES NI EVENTUALIDADES.

SE BRINDAN RECOMENDACIONES CLARAS AL EGRESO Y SE ORIENTA AL PACIENTE SOBRE LOS CANALES Y TIEMPOS PARA LA ENTREGA DE RESULTADOS. EGRESA DE LA INSTITUCIÓN {MOVILIZACION}, EN ADECUADAS CONDICIONES GENERALES, ESTABLE Y SIN ALTERACIONES APARENTES.`,
    fields: [
      { id: 'MOTIVO', label: 'Motivo', type: 'text', defaultValue: 'CEFALEA CRÓNICA DE FRECUENTE APARICIÓN' },
      { id: 'MOVILIZACION', label: 'Movilización', type: 'text', defaultValue: 'CAMINANDO POR SUS PROPIOS MEDIOS' },
      { id: 'TRAUMAS', label: 'Traumas', type: 'text', defaultValue: 'NIEGA TRAUMAS' },
      { id: 'QUIRURGICOS', label: 'Quirúrgicos', type: 'text', defaultValue: 'NIEGA ANTECEDENTES QUIRÚRGICOS' },
    ],
    enabled: true,
    createdAt: 1710000000009,
  },
  {
    id: 'tac',
    title: 'Tomografía Computarizada (TAC)',
    shortTitle: 'Tomografía (TAC)',
    description: 'Protocolos TAC Adulto, Pediátrico con chaleco plomado y Con Contraste 37°C.',
    category: 'Imágenes Diagnósticas',
    templateFormat: `INGRESA PACIENTE ALERTA, ORIENTAD{GENERO_EO} EN LAS TRES ESFERAS, CONSCIENTE, AMBULANDO POR SUS PROPIOS MEDIOS. ASISTE DE FORMA AMBULATORIA PARA LA REALIZACIÓN DE ESTUDIO DIAGNÓSTICO POR IMAGEN INDICADO DEBIDO A {MOTIVO}.

ANTECEDENTES PERSONALES:
- TRAUMÁTICOS: {TRAUMAS}.
- QUIRÚRGICOS: {QUIRURGICOS}.
- ALÉRGICOS: {ALERGIAS}.

SE EXPLICA DETALLADAMENTE EL PROCEDIMIENTO, OBTENIENDO LA ACEPTACIÓN Y FIRMA DEL CONSENTIMIENTO INFORMADO PARA LA EXPOSICIÓN A RADIACIONES IONIZANTES. ASIMISMO, SE SOCIALIZAN LOS DERECHOS Y DEBERES DEL PACIENTE. ({DERECHO_DEBER}).

PREVIO CUMPLIMIENTO DEL PROTOCOLO INSTITUCIONAL DE ANTISEPSIA Y DESINFECCIÓN CON MELISEPTOL DE LA ZONA CORRESPONDIENTE, SE COLABORA EN LA TOMA DEL ESTUDIO RADIOLÓGICO, EL CUAL TRANSCURRE SIN COMPLICACIONES NI EVENTUALIDADES.

SE BRINDAN RECOMENDACIONES CLARAS AL EGRESO Y SE ORIENTA AL PACIENTE SOBRE LOS CANALES Y TIEMPOS PARA LA ENTREGA DE RESULTADOS. EGRESA DE LA INSTITUCIÓN AMBULANDO POR SUS PROPIOS MEDIOS, EN ADECUADAS CONDICIONES GENERALES, ESTABLE Y SIN ALTERACIONES APARENTES.`,
    fields: [
      { id: 'MOTIVO', label: 'Motivo', type: 'text', defaultValue: 'CUADRO DE CEFALEA CRÓNICA' },
      { id: 'TRAUMAS', label: 'Traumas', type: 'text', defaultValue: 'NIEGA TRAUMAS' },
      { id: 'QUIRURGICOS', label: 'Quirúrgicos', type: 'text', defaultValue: 'NIEGA ANTECEDENTES QUIRÚRGICOS' },
    ],
    enabled: true,
    createdAt: 1710000000010,
  },
  {
    id: 'glucometria',
    title: 'Toma de Glucometría (Glicemia Capilar)',
    shortTitle: 'Glucometría',
    description: 'Toma de glicemia capilar, calibración de glucómetro y hemostasia.',
    category: 'Urgencias y Prioritaria',
    templateFormat: `INGRESA PACIENTE A SALA DE ENFERMERÍA, ALERTA, ORIENTAD{GENERO_EO}, CONSCIENTE, CAMINANDO POR SUS PROPIOS MEDIOS, TRAE ORDEN MÉDICA PARA TOMA DE GLUCOMETRÍA ({MOTIVO}).

SE REVISA ORDEN MÉDICA. {ALERGIAS}. SE SOCIALIZA DERECHO Y DEBER: ({DERECHO_DEBER}).

PREVIO LAVADO DE MANOS Y BAJO TÉCNICA ASÉPTICA, SE EXPLICA EL PROCEDIMIENTO {GENERO_ALA} PACIENTE, QUIEN REFIERE ENTENDER Y ACEPTAR. SE REALIZA ASEPSIA EN ZONA LATERAL DE {DEDO} DE MANO {MANO}, SE REALIZA PUNCIÓN CON LANCETA ESTÉRIL, SE OBTIENE MUESTRA DE SANGRE CAPILAR Y SE COLOCA EN TIRA REACTIVA DE GLUCOMETRO PREVIAMENTE CALIBRADO. SE OBTIENE RESULTADO DE {VALOR_GLICEMIA} MG/DL. SE EJERCE HEMOSTASIA LEVE CON TÓRULA SECA.

SE BRINDAN RECOMENDACIONES CLÍNICAS Y SE INFORMA EL VALOR OBTENIDO. SALE PACIENTE DE SALA DE ENFERMERÍA, ALERTA Y ORIENTAD{GENERO_EO}, EN ESTABLES Y ÓPTIMAS CONDICIONES.`,
    fields: [
      { id: 'MOTIVO', label: 'Motivo', type: 'text', defaultValue: 'CONTROL METABÓLICO EN AYUNAS' },
      { id: 'DEDO', label: 'Dedo punzado', type: 'select', options: ['DEDO 1 (PULGAR)', 'DEDO 2 (ÍNDICE)', 'DEDO 3 (MEDIO)', 'DEDO 4 (ANULAR)', 'DEDO 5 (MEÑIQUE)'], defaultValue: 'DEDO 2 (ÍNDICE)' },
      { id: 'MANO', label: 'Mano', type: 'select', options: ['DERECHA', 'IZQUIERDA'], defaultValue: 'DERECHA' },
      { id: 'VALOR_GLICEMIA', label: 'Resultado (mg/dL)', type: 'number', defaultValue: '105' },
    ],
    enabled: true,
    createdAt: 1710000000011,
  },
  {
    id: 'custom-sondaje-vesical',
    title: 'Paso de Sonda Vesical (Foley)',
    shortTitle: 'Sondaje Vesical',
    description: 'Inserción de catéter vesical permanente o evacuante bajo estricta técnica estéril.',
    category: 'Procedimientos y Curaciones',
    templateFormat: `INGRESA PACIENTE A SALA DE ENFERMERÍA, ALERTA, ORIENTAD{GENERO_EO}, CONSCIENTE, EN CAMILLA. TRAE ORDEN MÉDICA PARA SONDAJE VESICAL DEBIDO A {MOTIVO}.

SE REVISA ORDEN MÉDICA Y SE OBTIENE FIRMA DE CONSENTIMIENTO INFORMADO. SE SOCIALIZA DERECHO Y DEBER INSTITUCIONAL: ({DERECHO_DEBER}).

PREVIO LAVADO QUIRÚRGICO DE MANOS, COLOCACIÓN DE GUANTES ESTÉRILES Y ASEPSIA DEL MEATO URINARIO CON SOLUCIÓN ANTISÉPTICA, SE PROCEDE A INSERTAR SONDA FOLEY CALIBRE {CALIBRE_SONDA} Fr BAJO TÉCNICA ASÉPTICA.

SE INSUFLA BALÓN CON {INSUFLACION_ML} ML DE AGUA DESTILADA. SE OBTIENE RETORNO DE ORINA DE ASPECTO {ASPECTO_ORINA}, DRENANDO INICIALMENTE {VOLUMEN_INICIAL} ML. SE CONECTA A SISTEMA DE RECOLECCIÓN CERRADO (CYSTOFLO) Y SE FIJA SONDA EN {SITIO_FIJACION}.

PROCEDIMIENTO CULMINA SIN COMPLICACIONES. SE BRINDA EDUCACIÓN AL PACIENTE Y FAMILIA SOBRE EL CUIDADO DE LA SONDA Y PREVENCIÓN DE INFECCIONES URINARIAS ASOCIADAS A LA ATENCIÓN EN SALUD. SALE EN CONDICIONES ESTABLES.`,
    fields: [
      { id: 'MOTIVO', label: 'Motivo', type: 'text', defaultValue: 'RETENCIÓN URINARIA AGUDA' },
      { id: 'CALIBRE_SONDA', label: 'Calibre Sonda Foley', type: 'select', options: ['14', '16', '18', '20'], defaultValue: '16' },
      { id: 'INSUFLACION_ML', label: 'Insuflación (ml)', type: 'number', defaultValue: '10' },
      { id: 'ASPECTO_ORINA', label: 'Aspecto Orina', type: 'select', options: ['COLÚRICA', 'CLARA / AMBARINA', 'HEMATÚRICA', 'TURBIA'], defaultValue: 'CLARA / AMBARINA' },
      { id: 'VOLUMEN_INICIAL', label: 'Volumen Drenado (ml)', type: 'number', defaultValue: '450' },
      { id: 'SITIO_FIJACION', label: 'Sitio Fijación', type: 'text', defaultValue: 'CARA ANTERIOR DEL MUSLO' },
    ],
    enabled: true,
    createdAt: 1710000000012,
  },
  {
    id: 'custom-cateter-central',
    title: 'Curación de Catéter Venoso Central (CVC)',
    shortTitle: 'Curación CVC',
    description: 'Mantenimiento, curación estéril y cambio de apósito transparente de catéter venoso central.',
    category: 'Procedimientos y Curaciones',
    templateFormat: `PACIENTE SE ENCUENTRA EN SALA DE ENFERMERÍA, ALERTA Y CONSCIENTE. SE PROCEDE A REALIZAR CURACIÓN Y MANTENIMIENTO DE CATÉTER VENOSO CENTRAL ({LOCALIZACION_CVC}).

SE INDAGAN ANTECEDENTES ALÉRGICOS A ANTISÉPTICOS Y ADHESIVOS: {ALERGIAS}. SE SOCIALIZA DERECHO Y DEBER: ({DERECHO_DEBER}).

PREVIO LAVADO DE MANOS Y CON TÉCNICA DE MÁXIMA BARRERA (GORRO, MASCARILLA Y GUANTES ESTÉRILES), SE RETIRA APÓSITO ANTERIOR DESCARTANDO SIGNOS DE INFECCIÓN EN SITIO DE INSERCIÓN ({ESTADO_SITIO}). SE REALIZA ANTISEPSIA CON CLORHEXIDINA AL 2% CON MOVIMIENTOS CIRCULARES DE ADENTRO HACIA AFUERA.

SE DEJA SECAR POR COMPLETO Y SE COLOCA PARCHE TRANSPARENTE CON ALMOHADILLA DE CLORHEXIDINA ({TIPO_APOSITO}). SE VERIFICA PERMEABILIDAD Y RETORNO VENOSO DE LOS LÚMENES ({LUMENES}), SE HEPARINIZA / SELLA CON SOLUCIÓN SALINA Y SE CAMBIAN CONECTORES LIBRES DE AGUJA.

SE ROTULA CON FECHA, HORA Y FIRMA DE ENFERMERÍA RESPONSABLE. PACIENTE TOLERA EL PROCEDIMIENTO SIN INCIDENTES.`,
    fields: [
      { id: 'LOCALIZACION_CVC', label: 'Localización Catéter', type: 'select', options: ['YUGULAR INTERNA DERECHA', 'SUBCLAVIA DERECHA', 'SUBCLAVIA IZQUIERDA', 'FEMORAL DERECHA'], defaultValue: 'YUGULAR INTERNA DERECHA' },
      { id: 'ESTADO_SITIO', label: 'Estado del Sitio', type: 'text', defaultValue: 'SANO, SIN ERITEMA, SIN SECRECIÓN NI SIGNOS DE INFECCIÓN' },
      { id: 'TIPO_APOSITO', label: 'Apósito Utilizado', type: 'text', defaultValue: 'TEGADERM CON CLORHEXIDINA (CHG)' },
      { id: 'LUMENES', label: 'Lúmenes', type: 'select', options: ['BILUMEN', 'TRILUMEN', 'UNILUMEN'], defaultValue: 'BILUMEN' },
    ],
    enabled: true,
    createdAt: 1710000000013,
  },
];

export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  adminPin: '1234',
  institutionName: 'Institución de Salud',
  disabledModuleIds: [],
  deletedTemplateIds: [],
  templateOverrides: {},
  customTemplates: [],
};

export function getAdminConfig(): AdminConfig {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return DEFAULT_ADMIN_CONFIG;
    const parsed = JSON.parse(raw);
    const overrides = parsed.templateOverrides && typeof parsed.templateOverrides === 'object' ? { ...parsed.templateOverrides } : {};
    delete overrides['medicamentos-no-programada'];
    delete overrides['medicamentos-ce'];

    const rawCustom = Array.isArray(parsed.customTemplates) ? parsed.customTemplates : [];
    const cleanCustom = rawCustom.filter((t: CustomTemplate) => t.id !== 'medicamentos-no-programada' && t.id !== 'medicamentos-ce');

    return {
      adminPin: parsed.adminPin || DEFAULT_ADMIN_CONFIG.adminPin,
      institutionName: parsed.institutionName || DEFAULT_ADMIN_CONFIG.institutionName,
      disabledModuleIds: Array.isArray(parsed.disabledModuleIds) ? parsed.disabledModuleIds : [],
      deletedTemplateIds: Array.isArray(parsed.deletedTemplateIds) ? parsed.deletedTemplateIds : [],
      templateOverrides: overrides,
      customTemplates: cleanCustom,
    };
  } catch (err) {
    console.error('Error reading admin config from localStorage:', err);
    return DEFAULT_ADMIN_CONFIG;
  }
}

export function saveAdminConfig(config: AdminConfig): void {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving admin config to localStorage:', err);
  }
}

export function resetAdminConfigToDefaults(): AdminConfig {
  try {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  } catch (err) {
    console.error('Error resetting admin config:', err);
  }
  return DEFAULT_ADMIN_CONFIG;
}

/**
 * Returns ALL templates available for the institution:
 * base catalog (with overrides applied) + custom templates, excluding deleted ones.
 */
export function getAllInstitutionalTemplates(config: AdminConfig): CustomTemplate[] {
  const deletedSet = new Set(Array.isArray(config?.deletedTemplateIds) ? config.deletedTemplateIds : []);
  const overrides = config?.templateOverrides || {};
  const customTemplates = Array.isArray(config?.customTemplates) ? config.customTemplates : [];

  const baseWithOverrides = ALL_BASE_TEMPLATES.map((tmpl) => {
    const override = overrides[tmpl.id];
    if (override) {
      return {
        ...tmpl,
        ...override,
        fields: override.fields || tmpl.fields,
      };
    }
    return tmpl;
  });

  const map = new Map<string, CustomTemplate>();
  for (const t of baseWithOverrides) {
    if (!deletedSet.has(t.id)) {
      map.set(t.id, t);
    }
  }
  for (const t of customTemplates) {
    if (!deletedSet.has(t.id)) {
      map.set(t.id, t);
    }
  }

  return Array.from(map.values());
}
