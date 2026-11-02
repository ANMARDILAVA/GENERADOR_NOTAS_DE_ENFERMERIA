export type Gender = 'MASCULINO' | 'FEMENINO';

export type ModuleId =
  | 'menu'
  | 'admin'
  | 'curacion'
  | 'medicamentos-no-programada'
  | 'medicamentos-ce'
  | 'meds-pediatricos'
  | 'observacion'
  | 'ekg'
  | 'penicilina'
  | 'retiro-puntos'
  | 'procedimientos'
  | 'resonancia'
  | 'tac'
  | 'glucometria'
  | string;

export interface ModuleMetadata {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  category: 'Urgencias y Prioritaria' | 'Procedimientos y Curaciones' | 'Imágenes Diagnósticas' | 'Inyectología y Especiales' | string;
  color: string;
  bgLight: string;
  borderColor: string;
  textColor: string;
  badge?: string;
  iconName: string;
  enabled?: boolean;
  isCustom?: boolean;
}

export interface CustomField {
  id: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  options?: string[];
}

export interface CustomTemplate {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  category: string;
  templateFormat: string;
  fields: CustomField[];
  enabled: boolean;
  createdAt: number;
}

export interface AdminConfig {
  adminPin: string;
  institutionName: string;
  disabledModuleIds: string[];
  deletedTemplateIds: string[];
  templateOverrides: Record<string, Partial<CustomTemplate>>;
  customTemplates: CustomTemplate[];
}

export interface DerechoDeberOption {
  id: number;
  label: string;
  derecho: string;
  deber: string;
  fullString: string;
}

export interface VitalSigns {
  ta?: string;
  fc?: string;
  fr?: string;
  temp?: string;
  spo2?: string;
}

export interface SavedNote {
  id: string;
  moduleId: string;
  moduleName: string;
  timestamp: number;
  noteText: string;
  summary: string;
}
