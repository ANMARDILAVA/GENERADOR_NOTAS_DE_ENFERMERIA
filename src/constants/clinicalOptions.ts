import { DerechoDeberOption, ModuleMetadata } from '../types/clinical';

export const DERECHOS_Y_DEBERES: DerechoDeberOption[] = [
  {
    id: 1,
    label: '1. Comunicación / Identificación',
    derecho: 'A una comunicación plena y clara con el equipo de salud.',
    deber: 'Identificarse verazmente y no ocultar información importante para la atención médica.',
    fullString: 'Derecho: A una comunicación plena y clara con el equipo de salud. | Deber: Identificarse verazmente y no ocultar información importante para la atención médica.',
  },
  {
    id: 2,
    label: '2. Confidencialidad / Respeto',
    derecho: 'A la confidencialidad de la historia clínica.',
    deber: 'Respetar la dignidad de otros pacientes y sus familiares.',
    fullString: 'Derecho: A la confidencialidad de la historia clínica. | Deber: Respetar la dignidad de otros pacientes y sus familiares.',
  },
  {
    id: 3,
    label: '3. Trato digno / Firmar consentimiento',
    derecho: 'A un trato digno y respetuoso por sus creencias.',
    deber: 'Firmar la historia clínica o el consentimiento informado en caso de negativa o aceptación.',
    fullString: 'Derecho: A un trato digno y respetuoso por sus creencias. | Deber: Firmar la historia clínica o el consentimiento informado en caso de negativa o aceptación.',
  },
  {
    id: 4,
    label: '4. Prestación de servicio / Respetar al personal',
    derecho: 'A la prestación del servicio de salud según complejidad.',
    deber: 'Respetar al personal que presta servicios en la institución.',
    fullString: 'Derecho: A la prestación del servicio de salud según complejidad. | Deber: Respetar al personal que presta servicios en la institución.',
  },
  {
    id: 5,
    label: '5. Información de costos / Autocuidado',
    derecho: 'A recibir información total y completa sobre los costos del servicio prestado.',
    deber: 'Responsabilizarse de su propia salud a través del autocuidado.',
    fullString: 'Derecho: A recibir información total y completa sobre los costos del servicio prestado. | Deber: Responsabilizarse de su propia salud a través del autocuidado.',
  },
  {
    id: 6,
    label: '6. Reclamar / Firmar rechazo',
    derecho: 'A reclamar y sugerir mejoras en el servicio.',
    deber: 'Firmar en la historia clínica su deseo de rechazar la información.',
    fullString: 'Derecho: A reclamar y sugerir mejoras en el servicio. | Deber: Firmar en la historia clínica su deseo de rechazar la información.',
  },
  {
    id: 7,
    label: '7. Apoyo espiritual / Alta voluntaria',
    derecho: 'A recibir o rehusar apoyo espiritual o moral.',
    deber: 'Firmar el documento de alta voluntaria cuando así lo desee.',
    fullString: 'Derecho: A recibir o rehusar apoyo espiritual o moral. | Deber: Firmar el documento de alta voluntaria cuando así lo desee.',
  },
  {
    id: 8,
    label: '8. Investigaciones / Seguir tratamiento',
    derecho: 'A decidir si participa o no en investigaciones científicas.',
    deber: 'Seguir el plan de tratamiento e indicaciones del equipo de salud.',
    fullString: 'Derecho: A decidir si participa o no en investigaciones científicas. | Deber: Seguir el plan de tratamiento e indicaciones del equipo de salud.',
  },
  {
    id: 9,
    label: '9. Donación de órganos / Usar recursos',
    derecho: 'A aceptar o renunciar a la donación de órganos.',
    deber: 'Usar correctamente los recursos de la institución de salud.',
    fullString: 'Derecho: A aceptar o renunciar a la donación de órganos. | Deber: Usar correctamente los recursos de la institución de salud.',
  },
  {
    id: 10,
    label: '10. Morir con dignidad / Elegir profesional',
    derecho: 'A morir con dignidad.',
    deber: 'Elegir libremente al profesional de la salud, según disponibilidad.',
    fullString: 'Derecho: A morir con dignidad. | Deber: Elegir libremente al profesional de la salud, según disponibilidad.',
  },
];

export const POSICIONES_PACIENTE = [
  'DECÚBITO SUPINO (O DORSAL)',
  'DECÚBITO PRONO (O VENTRAL)',
  'DECÚBITO LATERAL IZQUIERDO',
  'DECÚBITO LATERAL DERECHO',
  'POSICIÓN DE FOWLER',
  'POSICIÓN SEMI-FOWLER',
  'POSICIÓN GINECOLÓGICA (O DE LITOTOMÍA)',
  'POSICIÓN DE SIMS',
  'SENTADO',
  'OTRO',
] as const;

export function isOtroOption(optionValue: string): boolean {
  if (!optionValue) return false;
  const upper = optionValue.trim().toUpperCase();
  return (
    upper === 'OTRO' ||
    upper === 'OTRA' ||
    upper === 'OTROS' ||
    upper.startsWith('OTRO') ||
    upper.startsWith('OTRA') ||
    upper.includes('ESPECIFICAR')
  );
}

export const MEDICAMENTOS_NO_PROGRAMADA = [
  'DICLOFENACO 75 MG',
  'DIPIRONA 1 G',
  'HIOSCINA N-BUTILBROMURO 20 MG',
  'HIOSCINA COMPUESTA',
  'DEXAMETASONA 8 MG',
  'BETAMETASONA 4 MG',
  'TRAMADOL 50 MG',
  'KETOROLACO 30 MG',
  'METOCLOPRAMIDA 10 MG',
  'ONDANSETRÓN 8 MG',
  'PENICILINA BENZATÍNICA 1.200.000 UI',
  'PENICILINA BENZATÍNICA 2.400.000 UI',
  'CEFTRIAXONA 1 G',
];

export const MEDICAMENTOS_CE = [
  'NEBIDO (UNDECANOATO DE TESTOSTERONA)',
  'HIERRO POLIMALTOSTA (FERINJECT)',
  'DEPO-PROVERA (MEDROXIPROGESTERONA)',
  'MESIGYNA',
  'CYCLOFEM',
  'METOTREXATO',
  'VITAMINA B12 (CIANOCOBALAMINA)',
  'ÁCIDO ZOLEDRÓNICO',
  'PROLIA (DENOSUMAB)',
  'OTRO',
];

export const MEDICAMENTOS_PEDIATRICOS = [
  'CEFTRIAXONA',
  'BETAMETASONA',
  'DIPIRONA',
  'HIOSCINA N-BUTILBROMURO',
  'AMIKACINA',
  'AMPICILINA',
  'ACETAMINOFÉN',
  'CLINDAMICINA',
  'CLORFENIRAMINA',
  'OTRO',
];

export const SITIOS_INTRAMUSCULAR = [
  { value: 'CUADRANTE SUPERIOR EXTERNO DEL GLUTEO DERECHO', label: 'Glúteo Derecho (CSE)' },
  { value: 'CUADRANTE SUPERIOR EXTERNO DEL GLUTEO IZQUIERDO', label: 'Glúteo Izquierdo (CSE)' },
  { value: 'DELTOIDES DERECHO', label: 'Deltoides Derecho' },
  { value: 'DELTOIDES IZQUIERDO', label: 'Deltoides Izquierdo' },
  { value: 'OTRO', label: 'Otro (especificar)...' },
];

export const SITIOS_PEDIATRICOS = [
  { value: 'CARA ANTEROLATERAL TERCIO MEDIO DEL MUSLO DERECHO', label: 'Muslo Derecho (Cara Anterolateral)' },
  { value: 'CARA ANTEROLATERAL TERCIO MEDIO DEL MUSLO IZQUIERDO', label: 'Muslo Izquierdo (Cara Anterolateral)' },
  { value: 'CUADRANTE SUPERIOR EXTERNO DEL GLUTEO DERECHO', label: 'Glúteo Derecho' },
  { value: 'CUADRANTE SUPERIOR EXTERNO DEL GLUTEO IZQUIERDO', label: 'Glúteo Izquierdo' },
  { value: 'DELTOIDES DERECHO', label: 'Deltoides Derecho' },
  { value: 'DELTOIDES IZQUIERDO', label: 'Deltoides Izquierdo' },
  { value: 'OTRO', label: 'Otro (especificar)...' },
];

export const DERMATOLOGOS = [
  'DRA DAYANA ARENAS',
  'DRA XIMENA BARRENECHE',
  'DRA MÓNICA ESPAÑA',
  'DRA JASBLEIDY GUZMÁN',
  'DRA JULIANA ORDOÑEZ',
  'DRA JIMENA PEÑA',
  'DRA ANA MARÍA PULIDO',
  'DRA MARTHA RANGEL',
  'DRA MARIA CLAUDIA RODRÍGUEZ',
  'DRA MARTHA RODRÍGUEZ',
  'DRA LILI RUEDA',
  'DR FRANCISCO PRADOS',
  'DR GERMÁN HERNÁNDEZ',
  'OTRO',
];

export const RECOMENDACIONES_DERMATOLOGIA = [
  'MANTENER LA ZONA LIMPIA Y SECA POR 24 HORAS',
  'EVITAR LA EXPOSICIÓN DIRECTA AL SOL',
  'NO REALIZAR EJERCICIO FÍSICO EXTENUANTE POR 48 HORAS',
  'TOMAR ANALGÉSICOS SI PRESENTA DOLOR',
  'NO MANIPULAR LA CURACIÓN',
  'ACUDIR A URGENCIAS ANTE SIGNOS DE ALARMA',
  'EVITAR MOJAR LA ZONA HASTA EL RETIRO DE PUNTOS',
  'RETIRO DE PUNTOS POR ENFERMERÍA',
  'RETIRO DE PUNTOS POR MÉDICO',
];

export const ANTICOAGULANTES_COMUNES = [
  'WARFARINA',
  'RIVAROXABÁN',
  'APIXABÁN',
  'DABIGATRÁN',
  'ENOXAPARINA',
  'CLOPIDOGREL',
  'ÁCIDO ACETILSALICÍLICO (ASA)',
  'HEPARINA SÓDICA',
];

export const MODULES_CONFIG: ModuleMetadata[] = [
  {
    id: 'curacion',
    title: 'Curación de Heridas',
    shortTitle: 'Curación',
    description: 'Valoración integral de heridas, exudado, asepsia y apósitos según protocolo.',
    category: 'Procedimientos y Curaciones',
    color: 'blue',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    iconName: 'Bandage',
  },
  {
    id: 'medicamentos-no-programada',
    title: 'Medicamentos (No Programada)',
    shortTitle: 'Meds NP',
    description: 'Administración prioritaria y no programada con lista de 13 correctos.',
    category: 'Inyectología y Especiales',
    color: 'purple',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    iconName: 'Pill',
  },
  {
    id: 'medicamentos-ce',
    title: 'Medicamentos (Consulta Externa)',
    shortTitle: 'Meds CE (INVIMA)',
    description: 'Medicamento aportado por el paciente con trazabilidad INVIMA, lote y FV.',
    category: 'Inyectología y Especiales',
    color: 'teal',
    bgLight: 'bg-teal-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-700',
    iconName: 'FileCheck',
  },
  {
    id: 'meds-pediatricos',
    title: 'Medicamentos Pediátricos',
    shortTitle: 'Meds Pediátricos',
    description: 'Administración a pacientes pediátricos con registro de acompañante y contención.',
    category: 'Inyectología y Especiales',
    color: 'pink',
    bgLight: 'bg-pink-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-700',
    iconName: 'Baby',
  },
  {
    id: 'observacion',
    title: 'Sala de Observación Clínica',
    shortTitle: 'Observación',
    description: 'Ingreso, canalización venosa, notas de evolución y egreso con cálculo de líquidos.',
    category: 'Urgencias y Prioritaria',
    color: 'red',
    bgLight: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    badge: 'CON BALANCE HÍDRICO',
    iconName: 'BedDouble',
  },
  {
    id: 'ekg',
    title: 'Electrocardiograma (EKG)',
    shortTitle: 'EKG',
    description: 'Registro técnico de toma de EKG de 12 derivaciones y retiro de metales.',
    category: 'Urgencias y Prioritaria',
    color: 'cyan',
    bgLight: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-700',
    iconName: 'Activity',
  },
  {
    id: 'penicilina',
    title: 'Prueba y Administración de Penicilina',
    shortTitle: 'Penicilina',
    description: 'Prueba intradérmica de sensibilidad, lectura a los 20 min y terapia intramuscular.',
    category: 'Inyectología y Especiales',
    color: 'orange',
    bgLight: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    iconName: 'Syringe',
  },
  {
    id: 'retiro-puntos',
    title: 'Retiro de Puntos de Sutura',
    shortTitle: 'Retiro de Puntos',
    description: 'Procedimiento de extracción completa de sutura, asepsia y revisión de bordes.',
    category: 'Procedimientos y Curaciones',
    color: 'slate',
    bgLight: 'bg-slate-100',
    borderColor: 'border-slate-300',
    textColor: 'text-slate-800',
    iconName: 'Scissors',
  },
  {
    id: 'procedimientos',
    title: 'Dermatología y Procedimientos Menores',
    shortTitle: 'Dermatología',
    description: 'Biopsias, resecciones, nasolaringoscopia e infiltración con generador en vivo.',
    category: 'Procedimientos y Curaciones',
    color: 'indigo',
    bgLight: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    badge: 'EN TIEMPO REAL',
    iconName: 'Stethoscope',
  },
  {
    id: 'resonancia',
    title: 'Resonancia Magnética (RM)',
    shortTitle: 'Resonancia',
    description: 'Protocolos RM Simple, Con Contraste endovenoso y B. Hioscina IM.',
    category: 'Imágenes Diagnósticas',
    color: 'slate',
    bgLight: 'bg-slate-900/5',
    borderColor: 'border-slate-400',
    textColor: 'text-slate-900',
    iconName: 'Scan',
  },
  {
    id: 'tac',
    title: 'Tomografía Computarizada (TAC)',
    shortTitle: 'Tomografía (TAC)',
    description: 'Protocolos TAC Adulto, Pediátrico con chaleco plomado y Con Contraste 37°C.',
    category: 'Imágenes Diagnósticas',
    color: 'sky',
    bgLight: 'bg-sky-50',
    borderColor: 'border-sky-300',
    textColor: 'text-sky-800',
    iconName: 'Disc',
  },
  {
    id: 'glucometria',
    title: 'Toma de Glucometría',
    shortTitle: 'Glucometría',
    description: 'Toma de glicemia capilar, calibración de glucómetro y hemostasia.',
    category: 'Urgencias y Prioritaria',
    color: 'emerald',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    iconName: 'Droplet',
  },
];
