import React, { useState, useRef } from 'react';
import { AdminConfig, CustomTemplate, CustomField } from '../../types/clinical';
import {
  getAllInstitutionalTemplates,
  ALL_BASE_TEMPLATES,
} from '../../config/templatesConfig';
import {
  DERECHOS_Y_DEBERES,
  isOtroOption,
  ANTICOAGULANTES_COMUNES,
} from '../../constants/clinicalOptions';
import {
  ShieldAlert,
  Sliders,
  FilePlus,
  Trash2,
  Edit3,
  RotateCcw,
  KeyRound,
  CheckCircle2,
  XCircle,
  X,
  FileText,
  Search,
  Undo2,
  Eye,
  Settings2,
  Sparkles,
  Download,
  Upload,
} from 'lucide-react';

interface Props {
  adminConfig: AdminConfig;
  onUpdateAdminConfig: (newConfig: AdminConfig) => void;
  onExitAdmin: () => void;
}

export const AdminPanel: React.FC<Props> = ({
  adminConfig,
  onUpdateAdminConfig,
  onExitAdmin,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Change PIN state
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Template Creator/Editor state
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateShortTitle, setTemplateShortTitle] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState('Procedimientos y Curaciones');
  const [templateFormat, setTemplateFormat] = useState('');
  const [templateFields, setTemplateFields] = useState<CustomField[]>([]);

  // Inline deletion confirmation state (ID of template currently being confirmed for deletion)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  // Feedback notification
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [lastDeletedId, setLastDeletedId] = useState<string | null>(null);

  // Field editor state for creating new field
  const [newFieldId, setNewFieldId] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<CustomField['type']>('text');
  const [newFieldDefault, setNewFieldDefault] = useState('');
  const [newFieldOptions, setNewFieldOptions] = useState('');

  // Editing state for an existing variable inside the template
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editFieldLabel, setEditFieldLabel] = useState('');
  const [editFieldType, setEditFieldType] = useState<CustomField['type']>('text');
  const [editFieldDefault, setEditFieldDefault] = useState('');
  const [editFieldOptions, setEditFieldOptions] = useState('');

  // Active tab inside template editor: 'editor' (configure fields/text) | 'preview' (as nurse sees it)
  const [editorTab, setEditorTab] = useState<'editor' | 'preview'>('editor');

  // Simulation state for auxiliary nurse preview
  const [simGender, setSimGender] = useState<'MASCULINO' | 'FEMENINO'>('MASCULINO');
  const [simAnticoagulado, setSimAnticoagulado] = useState<'NO' | 'SI'>('NO');
  const [simMedAnticoagulante, setSimMedAnticoagulante] = useState('');
  const [simAllergies, setSimAllergies] = useState(false);
  const [simAllergyDetail, setSimAllergyDetail] = useState('');
  const [simDerechoDeber, setSimDerechoDeber] = useState(
    DERECHOS_Y_DEBERES[2]?.fullString || ''
  );
  const [simFieldValues, setSimFieldValues] = useState<Record<string, string>>({});
  const [simOtroValues, setSimOtroValues] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search/filter in templates list
  const [searchTerm, setSearchTerm] = useState('');

  // Unified list of ALL templates (base catalog + custom, minus deleted)
  const allTemplates = getAllInstitutionalTemplates(adminConfig);

  const filteredTemplates = allTemplates.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.title.toLowerCase().includes(term) ||
      t.shortTitle.toLowerCase().includes(term) ||
      t.category.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term)
    );
  });

  const totalTemplatesCount = allTemplates.length;
  const activeTemplatesCount = allTemplates.filter(
    (t) => !(adminConfig.disabledModuleIds || []).includes(t.id)
  ).length;

  const deletedCount = (adminConfig.deletedTemplateIds || []).length;

  // Check PIN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === (adminConfig.adminPin || '1234')) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleUpdatePin = () => {
    if (newPin.trim().length >= 4) {
      const updated: AdminConfig = { ...adminConfig, adminPin: newPin.trim() };
      onUpdateAdminConfig(updated);
      setIsChangingPin(false);
      setNewPin('');
      setPinSuccess(true);
      setTimeout(() => setPinSuccess(false), 2500);
    }
  };

  // Toggle Module/Template Enable/Disable
  const handleToggleTemplate = (templateId: string) => {
    const currentDisabled = adminConfig.disabledModuleIds || [];
    const isCurrentlyDisabled = currentDisabled.includes(templateId);
    const updatedDisabled = isCurrentlyDisabled
      ? currentDisabled.filter((id) => id !== templateId)
      : [...currentDisabled, templateId];

    // Also update enabled flag in customTemplates if custom
    const currentCustom = adminConfig.customTemplates || [];
    const updatedCustom = currentCustom.map((t) =>
      t.id === templateId ? { ...t, enabled: isCurrentlyDisabled } : t
    );

    onUpdateAdminConfig({
      ...adminConfig,
      disabledModuleIds: updatedDisabled,
      customTemplates: updatedCustom,
    });
  };

  // Execute deletion directly and safely (100% works without popups or iframe restrictions)
  const handleExecuteDelete = (targetId: string, title: string) => {
    const curDeleted = Array.isArray(adminConfig.deletedTemplateIds)
      ? adminConfig.deletedTemplateIds
      : [];
    const curDisabled = Array.isArray(adminConfig.disabledModuleIds)
      ? adminConfig.disabledModuleIds
      : [];
    const curCustom = Array.isArray(adminConfig.customTemplates)
      ? adminConfig.customTemplates
      : [];

    const updatedDeleted = Array.from(new Set([...curDeleted, targetId]));
    const updatedDisabled = Array.from(new Set([...curDisabled, targetId]));
    const updatedCustom = curCustom.filter((t) => t.id !== targetId);

    const newConfig: AdminConfig = {
      ...adminConfig,
      deletedTemplateIds: updatedDeleted,
      disabledModuleIds: updatedDisabled,
      customTemplates: updatedCustom,
    };

    onUpdateAdminConfig(newConfig);
    setConfirmingDeleteId(null);
    setLastDeletedId(targetId);
    setFeedbackMessage(`Plantilla "${title}" eliminada del sistema.`);
  };

  // Undo last deletion
  const handleUndoDelete = () => {
    if (!lastDeletedId) return;
    const curDeleted = adminConfig.deletedTemplateIds || [];
    const updatedDeleted = curDeleted.filter((id) => id !== lastDeletedId);

    onUpdateAdminConfig({
      ...adminConfig,
      deletedTemplateIds: updatedDeleted,
    });
    setLastDeletedId(null);
    setFeedbackMessage('✓ Plantilla restaurada con éxito.');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  // Restore all deleted templates
  const handleRestoreDeleted = () => {
    onUpdateAdminConfig({
      ...adminConfig,
      deletedTemplateIds: [],
    });
    setFeedbackMessage('✓ Todas las plantillas eliminadas han sido restauradas.');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  // Reset an overridden base template back to factory defaults
  const handleResetBaseTemplate = (templateId: string, title: string) => {
    const overrides = { ...(adminConfig.templateOverrides || {}) };
    delete overrides[templateId];
    onUpdateAdminConfig({
      ...adminConfig,
      templateOverrides: overrides,
    });
    setFeedbackMessage(`✓ Plantilla "${title}" restablecida a los valores base originales.`);
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  // Export JSON backup of all templates and settings
  const handleExportConfig = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(adminConfig, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `plantillas_enfermeria_backup_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setFeedbackMessage('✓ Copia de respaldo descargada en formato JSON.');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  // Import JSON backup of templates and settings
  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          onUpdateAdminConfig(parsed);
          setFeedbackMessage('✓ Plantillas restauradas exitosamente desde el archivo JSON.');
          setTimeout(() => setFeedbackMessage(''), 3500);
        }
      } catch (err) {
        setFeedbackMessage('❌ Error al procesar el archivo JSON de respaldo.');
        setTimeout(() => setFeedbackMessage(''), 3500);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Start Editing Template
  const handleStartEditTemplate = (tmpl: CustomTemplate) => {
    setEditingTemplateId(tmpl.id);
    setIsCreatingTemplate(true);
    setEditorTab('editor');
    setTemplateTitle(tmpl.title);
    setTemplateShortTitle(tmpl.shortTitle);
    setTemplateDescription(tmpl.description);
    setTemplateCategory(tmpl.category);
    setTemplateFormat(tmpl.templateFormat);
    setTemplateFields(tmpl.fields || []);

    // Initialize simulated auxiliary nurse values
    const initialSim: Record<string, string> = {};
    (tmpl.fields || []).forEach((f) => {
      initialSim[f.id] = f.defaultValue || (f.options && f.options[0]) || '';
    });
    setSimFieldValues(initialSim);
    setSimOtroValues({});
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Generate live preview of the note as the auxiliary nurse interacts with it
  const generateSimulatedNote = () => {
    let note = templateFormat || '';
    const e = simGender === 'MASCULINO' ? 'O' : 'A';
    const al = simGender === 'MASCULINO' ? 'AL' : 'A LA';

    const parts = (simDerechoDeber || '').split('|');
    const d = parts[0]?.replace('Derecho:', '').trim() || '-';
    const b = parts[1]?.replace('Deber:', '').trim() || '-';

    const alerStr = simAllergies
      ? `SE INDAGAN ALERGIAS, REFIERE ALERGIAS A ${simAllergyDetail.trim().toUpperCase() || 'NO ESPECIFICADAS'}`
      : 'SE INDAGAN ALERGIAS, NIEGA ALERGIAS';

    const antiStr =
      simAnticoagulado === 'SI'
        ? ` PACIENTE REFIERE ESTAR ANTICOAGULADO CON ${
            simMedAnticoagulante.trim().toUpperCase() || 'MEDICAMENTO NO ESPECIFICADO'
          }.`
        : '';

    note = note.replace(/\{GENERO_EO\}/g, e);
    note = note.replace(/\{GENERO_ALA\}/g, al);
    note = note.replace(/\{DERECHO_DEBER\}/g, `DERECHO: ${d}. DEBER: ${b}`);
    note = note.replace(/\{DERECHO\}/g, d);
    note = note.replace(/\{DEBER\}/g, b);

    if (note.includes('{ANTICOAGULADO}')) {
      note = note.replace(/\{ANTICOAGULADO\}/g, antiStr.trim());
      note = note.replace(/\{ALERGIAS\}/g, alerStr);
    } else {
      note = note.replace(/\{ALERGIAS\}/g, `${alerStr}.${antiStr}`);
    }

    templateFields.forEach((f) => {
      let val =
        simFieldValues[f.id] !== undefined
          ? simFieldValues[f.id]
          : (f.defaultValue || (f.options && f.options[0]) || `[${f.label.toUpperCase()}]`);

      // If option is OTRO, replace with custom value typed by auxiliary/admin
      if (f.type === 'select' && isOtroOption(val)) {
        const customOtro = (simOtroValues[f.id] || '').trim();
        val = customOtro || `[ESPECIFIQUE ${f.label.toUpperCase()}]`;
      }

      const regex = new RegExp(`\\{${f.id}\\}`, 'g');
      note = note.replace(regex, (val || `[${f.label}]`).toUpperCase());
    });

    return note;
  };

  // Save Created or Edited Template
  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateTitle.trim() || !templateFormat.trim()) return;

    if (editingTemplateId) {
      const isBaseTemplate = ALL_BASE_TEMPLATES.some((b) => b.id === editingTemplateId);

      if (isBaseTemplate) {
        // Store override for base template
        const overrides = { ...(adminConfig.templateOverrides || {}) };
        overrides[editingTemplateId] = {
          title: templateTitle.trim(),
          shortTitle: templateShortTitle.trim() || templateTitle.trim(),
          description: templateDescription.trim(),
          category: templateCategory,
          templateFormat: templateFormat.trim(),
          fields: templateFields,
        };
        onUpdateAdminConfig({ ...adminConfig, templateOverrides: overrides });
      } else {
        // Update custom template
        const curCustom = adminConfig.customTemplates || [];
        const updatedCustom = curCustom.map((t) =>
          t.id === editingTemplateId
            ? {
                ...t,
                title: templateTitle.trim(),
                shortTitle: templateShortTitle.trim() || templateTitle.trim(),
                description: templateDescription.trim(),
                category: templateCategory,
                templateFormat: templateFormat.trim(),
                fields: templateFields,
              }
            : t
        );
        onUpdateAdminConfig({ ...adminConfig, customTemplates: updatedCustom });
      }
      setFeedbackMessage(`✓ Plantilla "${templateShortTitle || templateTitle}" guardada.`);
    } else {
      // Create new template
      const newTmpl: CustomTemplate = {
        id: `custom-${Date.now()}`,
        title: templateTitle.trim(),
        shortTitle: templateShortTitle.trim() || templateTitle.trim(),
        description: templateDescription.trim(),
        category: templateCategory,
        templateFormat: templateFormat.trim(),
        fields: templateFields,
        enabled: true,
        createdAt: Date.now(),
      };
      const curCustom = adminConfig.customTemplates || [];
      onUpdateAdminConfig({
        ...adminConfig,
        customTemplates: [...curCustom, newTmpl],
      });
      setFeedbackMessage(`✓ Nueva plantilla "${newTmpl.shortTitle}" creada con éxito.`);
    }

    // Reset form
    setIsCreatingTemplate(false);
    setEditingTemplateId(null);
    setTemplateTitle('');
    setTemplateShortTitle('');
    setTemplateDescription('');
    setTemplateFormat('');
    setTemplateFields([]);
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  // Add field to template in creation
  const handleAddField = () => {
    if (!newFieldId.trim() || !newFieldLabel.trim()) return;
    const cleanId = newFieldId.trim().toUpperCase().replace(/\s+/g, '_');
    const field: CustomField = {
      id: cleanId,
      label: newFieldLabel.trim(),
      type: newFieldType,
      defaultValue: newFieldDefault.trim(),
      options:
        newFieldType === 'select'
          ? newFieldOptions
              .split(',')
              .map((o) => o.trim())
              .filter(Boolean)
          : undefined,
    };
    setTemplateFields([...templateFields, field]);
    setNewFieldId('');
    setNewFieldLabel('');
    setNewFieldDefault('');
    setNewFieldOptions('');
  };

  const handleRemoveField = (fieldId: string) => {
    setTemplateFields(templateFields.filter((f) => f.id !== fieldId));
    if (editingFieldId === fieldId) {
      setEditingFieldId(null);
    }
  };

  // Start editing an existing variable
  const handleStartEditField = (field: CustomField) => {
    setEditingFieldId(field.id);
    setEditFieldLabel(field.label);
    setEditFieldType(field.type);
    setEditFieldDefault(field.defaultValue || '');
    setEditFieldOptions(field.options && field.options.length > 0 ? field.options.join(', ') : '');
  };

  // Save the modified variable
  const handleSaveEditedField = (fieldId: string) => {
    const cleanOptions =
      editFieldType === 'select'
        ? editFieldOptions
            .split(',')
            .map((o) => o.trim())
            .filter(Boolean)
        : undefined;

    setTemplateFields(
      templateFields.map((f) =>
        f.id === fieldId
          ? {
              ...f,
              label: editFieldLabel.trim() || f.label,
              type: editFieldType,
              defaultValue: editFieldDefault.trim(),
              options:
                cleanOptions && cleanOptions.length > 0
                  ? cleanOptions
                  : editFieldType === 'select'
                  ? (f.options && f.options.length > 0 ? f.options : ['OPCIÓN 1', 'OPCIÓN 2'])
                  : undefined,
            }
          : f
      )
    );
    setEditingFieldId(null);
  };

  // Cancel editing the variable
  const handleCancelEditField = () => {
    setEditingFieldId(null);
  };

  // Quick switch of variable type (text, number, select)
  const handleQuickChangeType = (fieldId: string, newType: CustomField['type']) => {
    setTemplateFields(
      templateFields.map((f) => {
        if (f.id !== fieldId) return f;
        let opts = f.options;
        if (newType === 'select' && (!opts || opts.length === 0)) {
          opts = ['OPCIÓN 1', 'OPCIÓN 2'];
        }
        return {
          ...f,
          type: newType,
          options: newType === 'select' ? opts : undefined,
        };
      })
    );
  };

  // 1. PIN Authentication Gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Acceso Administrador
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Ingrese el PIN de seguridad para gestionar, activar, desactivar o eliminar plantillas del sistema.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength={8}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder=""
              className={`w-full p-3.5 text-center text-xl font-mono tracking-widest rounded-2xl border ${
                pinError
                  ? 'border-rose-400 bg-rose-50 text-rose-900 focus:ring-rose-400'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
              }`}
              autoFocus
            />
            {pinError && (
              <p className="text-xs font-bold text-rose-600 mt-2 flex items-center justify-center gap-1">
                <XCircle className="w-3.5 h-3.5" />
                <span>PIN incorrecto. Intente nuevamente.</span>
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onExitAdmin}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Volver al Menú
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                Panel de Administrador de Plantillas
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ADMIN ACTIVO
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Gestione el catálogo de notas de enfermería: active, desactive, modifique o elimine plantillas.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportConfig}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            type="button"
            onClick={handleExportConfig}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            title="Descargar copia de seguridad de todas las plantillas y modificaciones"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Respaldar JSON</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            title="Restaurar plantillas desde un archivo JSON previamente respaldado"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cargar JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setIsChangingPin(!isChangingPin)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
            <span>Cambiar PIN</span>
          </button>

          <button
            type="button"
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-xs transition cursor-pointer"
          >
            <span>Salir al Menú</span>
          </button>
        </div>
      </div>

      {/* Change PIN Box */}
      {isChangingPin && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 animate-in fade-in duration-150">
          <h4 className="text-xs font-bold text-amber-900 uppercase">Cambiar PIN de Administrador</h4>
          <div className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Nuevo PIN (mínimo 4 dígitos)"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              className="p-2 text-sm border border-amber-300 rounded-xl bg-white font-semibold flex-1"
            />
            <button
              type="button"
              onClick={handleUpdatePin}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Guardar PIN
            </button>
          </div>
        </div>
      )}

      {pinSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>PIN de administrador actualizado correctamente.</span>
        </div>
      )}

      {/* Toast Feedback Notification (with Undo) */}
      {feedbackMessage && (
        <div className="p-3.5 bg-slate-900 text-white rounded-2xl shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <span className="text-xs font-bold">{feedbackMessage}</span>
          <div className="flex items-center gap-2">
            {lastDeletedId && (
              <button
                type="button"
                onClick={handleUndoDelete}
                className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Deshacer</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setFeedbackMessage('')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Catalog View */}
      <div className="space-y-6">
        {/* Actions bar & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Catálogo de Todas las Plantillas ({filteredTemplates.length} de {totalTemplatesCount})
            </h3>
            <p className="text-xs text-slate-500">
              {activeTemplatesCount} activas · {totalTemplatesCount - activeTemplatesCount} inactivas
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {deletedCount > 0 && (
              <button
                type="button"
                onClick={handleRestoreDeleted}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold rounded-xl transition cursor-pointer"
                title="Restaurar todas las plantillas que fueron eliminadas"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Eliminadas ({deletedCount})</span>
              </button>
            )}

            {!isCreatingTemplate && (
              <button
                type="button"
                onClick={() => {
                  setEditingTemplateId(null);
                  setTemplateTitle('');
                  setTemplateShortTitle('');
                  setTemplateDescription('');
                  setTemplateFormat('');
                  setTemplateFields([]);
                  setIsCreatingTemplate(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                <FilePlus className="w-4 h-4" />
                <span>Crear Nueva Plantilla</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar plantilla en el catálogo (ej: Curación, EKG, TAC, Sonda)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Form to Create / Edit */}
        {isCreatingTemplate && (
          <form
            onSubmit={handleSaveTemplate}
            className="bg-white p-6 rounded-2xl border-2 border-blue-400 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <h4 className="font-extrabold text-sm text-blue-900 uppercase">
                  {editingTemplateId
                    ? `Editando Plantilla: ${templateShortTitle || templateTitle}`
                    : 'Diseñar Nueva Plantilla de Enfermería'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingTemplate(false);
                  setEditingTemplateId(null);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editor vs Auxiliary Nurse Preview Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 flex-wrap">
              <button
                type="button"
                onClick={() => setEditorTab('editor')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  editorTab === 'editor'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Settings2 className="w-4 h-4" />
                <span>1. Formato y Variables ({templateFields.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const sim = { ...simFieldValues };
                  templateFields.forEach((f) => {
                    if (sim[f.id] === undefined) {
                      sim[f.id] = f.defaultValue || (f.options && f.options[0]) || '';
                    }
                  });
                  setSimFieldValues(sim);
                  setEditorTab('preview');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  editorTab === 'preview'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                }`}
              >
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>2. Vista del Auxiliar (Verificación en Vivo)</span>
              </button>
            </div>

            {/* TAB 1: EDIT FORMAT & VARIABLES */}
            {editorTab === 'editor' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Título Completo del Procedimiento
                </label>
                <input
                  type="text"
                  value={templateTitle}
                  onChange={(e) => setTemplateTitle(e.target.value)}
                  placeholder="Ej: Curación de Heridas, Sondaje Vesical"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Título Corto para Menú
                </label>
                <input
                  type="text"
                  value={templateShortTitle}
                  onChange={(e) => setTemplateShortTitle(e.target.value)}
                  placeholder="Ej: Curación"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Categoría
                </label>
                <select
                  value={templateCategory}
                  onChange={(e) => setTemplateCategory(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold bg-white"
                >
                  <option value="Procedimientos y Curaciones">Procedimientos y Curaciones</option>
                  <option value="Inyectología y Especiales">Inyectología y Especiales</option>
                  <option value="Urgencias y Prioritaria">Urgencias y Prioritaria</option>
                  <option value="Imágenes Diagnósticas">Imágenes Diagnósticas</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Descripción Breve
                </label>
                <input
                  type="text"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Descripción del procedimiento para el personal asistencial"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                />
              </div>
            </div>

            {/* Template Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Texto Modelo de la Nota (Formato estandarizado)
              </label>
              <div className="text-[11px] text-slate-500 mb-1.5 flex flex-wrap gap-2">
                <span>Variables institucionales:</span>
                <span className="font-mono text-blue-600 font-semibold">{'{GENERO_EO}'}</span>
                <span className="font-mono text-blue-600 font-semibold">{'{GENERO_ALA}'}</span>
                <span className="font-mono text-blue-600 font-semibold">{'{DERECHO_DEBER}'}</span>
                <span className="font-mono text-blue-600 font-semibold">{'{ALERGIAS}'}</span>
                <span className="font-mono text-blue-600 font-semibold">{'{ANTICOAGULADO}'}</span>
                {templateFields.map((f) => (
                  <span key={f.id} className="font-mono text-emerald-600 font-semibold">{`{${f.id}}`}</span>
                ))}
              </div>
              <textarea
                rows={9}
                value={templateFormat}
                onChange={(e) => setTemplateFormat(e.target.value)}
                placeholder="INGRESA PACIENTE A SALA DE ENFERMERÍA..."
                className="w-full p-3.5 text-xs font-mono uppercase bg-slate-950 text-emerald-400 border border-slate-800 rounded-xl resize-none custom-scrollbar focus:ring-2 focus:ring-blue-500 leading-relaxed"
                required
              />
            </div>

            {/* Dynamic Variables / Fields Builder */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Variables Personalizadas de esta Plantilla ({templateFields.length})
                </span>
                <span className="text-[11px] text-slate-500">
                  Cada variable crea un campo en el formulario asistencial
                </span>
              </div>

              {templateFields.length > 0 && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {templateFields.map((f) => {
                      const isEditingThisField = editingFieldId === f.id;

                      if (isEditingThisField) {
                        return (
                          <div
                            key={f.id}
                            className="md:col-span-2 p-4 bg-blue-50/90 rounded-2xl border-2 border-blue-400 space-y-3 shadow-md animate-in fade-in duration-150"
                          >
                            <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                              <div className="flex items-center gap-2">
                                <Edit3 className="w-4 h-4 text-blue-700" />
                                <span className="text-xs font-extrabold text-blue-900 uppercase">
                                  Modificando Variable: <span className="font-mono text-blue-800">{`{${f.id}}`}</span>
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={handleCancelEditField}
                                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                                title="Cerrar edición"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                  Nombre / Etiqueta del Campo
                                </label>
                                <input
                                  type="text"
                                  value={editFieldLabel}
                                  onChange={(e) => setEditFieldLabel(e.target.value)}
                                  placeholder="Ej: Área de la lesión"
                                  className="w-full p-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                  Tipo de Entrada
                                </label>
                                <select
                                  value={editFieldType}
                                  onChange={(e) =>
                                    setEditFieldType(e.target.value as 'text' | 'number' | 'select')
                                  }
                                  className="w-full p-2 border border-blue-400 rounded-xl text-xs font-extrabold bg-white text-blue-900"
                                >
                                  <option value="text">📝 TEXTO LIBRE</option>
                                  <option value="number">🔢 NÚMERO</option>
                                  <option value="select">📋 LISTA DE SELECCIÓN (DESPLEGABLE)</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                  Valor Inicial / Por Defecto
                                </label>
                                <input
                                  type="text"
                                  value={editFieldDefault}
                                  onChange={(e) => setEditFieldDefault(e.target.value)}
                                  placeholder="Ej: REGIÓN SACRA"
                                  className="w-full p-2 border border-slate-300 rounded-xl text-xs bg-white"
                                />
                              </div>
                            </div>

                            {editFieldType === 'select' && (
                              <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-1.5">
                                <label className="block text-[11px] font-extrabold text-blue-900 uppercase">
                                  Opciones de la Lista Desplegable (separadas por comas)
                                </label>
                                <input
                                  type="text"
                                  value={editFieldOptions}
                                  onChange={(e) => setEditFieldOptions(e.target.value)}
                                  placeholder="Ej: NORMAL, ANORMAL (ERITEMA Y CALOR), PENDIENTE DE REVISIÓN"
                                  className="w-full p-2.5 border border-blue-300 rounded-xl text-xs font-medium"
                                />
                                <p className="text-[10px] text-slate-500">
                                  La enfermera verá un menú desplegable con estas opciones al diligenciar la nota.
                                </p>
                              </div>
                            )}

                            <div className="flex items-center justify-end gap-2 pt-1 border-t border-blue-200/60">
                              <button
                                type="button"
                                onClick={handleCancelEditField}
                                className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEditedField(f.id)}
                                className="px-4 py-1.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Guardar Cambios de la Variable</span>
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={f.id}
                          className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs space-y-2 transition"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono font-bold text-blue-700 text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                  {`{${f.id}}`}
                                </span>
                                <span className="font-bold text-slate-800 text-xs">{f.label}</span>
                              </div>
                              {f.defaultValue && (
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  Defecto: <span className="font-medium text-slate-600">"{f.defaultValue}"</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleStartEditField(f)}
                                className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition cursor-pointer"
                                title="Modificar tipo de campo, etiqueta o lista de opciones"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Modificar</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveField(f.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Eliminar variable"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Quick selector for field type */}
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Tipo:</span>
                              <select
                                value={f.type}
                                onChange={(e) =>
                                  handleQuickChangeType(
                                    f.id,
                                    e.target.value as 'text' | 'number' | 'select'
                                  )
                                }
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-md border cursor-pointer ${
                                  f.type === 'select'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : f.type === 'number'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : 'bg-blue-50 text-blue-800 border-blue-300'
                                }`}
                              >
                                <option value="text">📝 TEXTO</option>
                                <option value="number">🔢 NÚMERO</option>
                                <option value="select">📋 LISTA SELECCIÓN</option>
                              </select>
                            </div>

                            {f.type === 'select' && (
                              <button
                                type="button"
                                onClick={() => handleStartEditField(f)}
                                className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                              >
                                {f.options?.length || 0} opciones (editar)
                              </button>
                            )}
                          </div>

                          {/* Preview of options if select */}
                          {f.type === 'select' && f.options && f.options.length > 0 && (
                            <div className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-100 font-mono truncate">
                              Opciones: {f.options.join(', ')}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add New Field Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  placeholder="ID Variable (ej: MOTIVO)"
                  value={newFieldId}
                  onChange={(e) => setNewFieldId(e.target.value)}
                  className="p-2 border border-slate-300 rounded-lg text-xs font-mono uppercase"
                />
                <input
                  type="text"
                  placeholder="Etiqueta (ej: Motivo de consulta)"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  className="p-2 border border-slate-300 rounded-lg text-xs"
                />
                <select
                  value={newFieldType}
                  onChange={(e) =>
                    setNewFieldType(e.target.value as 'text' | 'number' | 'select')
                  }
                  className="p-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="text">Texto</option>
                  <option value="number">Número</option>
                  <option value="select">Lista de Selección</option>
                </select>
                <input
                  type="text"
                  placeholder={
                    newFieldType === 'select' ? 'Opciones (sep. coma)' : 'Valor por defecto'
                  }
                  value={newFieldType === 'select' ? newFieldOptions : newFieldDefault}
                  onChange={(e) =>
                    newFieldType === 'select'
                      ? setNewFieldOptions(e.target.value)
                      : setNewFieldDefault(e.target.value)
                  }
                  className="p-2 border border-slate-300 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddField}
                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                >
                  + Agregar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUXILIARY NURSE LIVE PREVIEW & VERIFICATION */}
        {editorTab === 'preview' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Banner guide */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                    <span>Vista Previa en Vivo: Formulario del Auxiliar de Enfermería</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  </h4>
                  <p className="text-[11px] text-emerald-700">
                    Así es exactamente como el auxiliar interactuará con este procedimiento. Pruebe los desplegables y valores para confirmar que la nota se genera correctamente.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditorTab('editor')}
                className="px-3.5 py-1.5 bg-white text-emerald-800 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer"
              >
                ← Modificar Variables o Formato
              </button>
            </div>

            {/* Patient Context Simulation */}
            <fieldset className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-3">
              <legend className="text-[11px] font-extrabold text-slate-600 px-2.5 uppercase tracking-wider bg-slate-100 rounded-lg py-0.5">
                Contexto del Paciente (Simulado)
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Género
                  </label>
                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="sim-gender"
                        value="MASCULINO"
                        checked={simGender === 'MASCULINO'}
                        onChange={() => setSimGender('MASCULINO')}
                        className="h-4 w-4 text-blue-600 mr-2"
                      />
                      Masculino ({'{GENERO_EO}'} = O)
                    </label>
                    <label className="flex items-center text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="sim-gender"
                        value="FEMENINO"
                        checked={simGender === 'FEMENINO'}
                        onChange={() => setSimGender('FEMENINO')}
                        className="h-4 w-4 text-blue-600 mr-2"
                      />
                      Femenino ({'{GENERO_EO}'} = A)
                    </label>
                  </div>
                </div>

                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                  <label className="flex items-center font-bold text-amber-900 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simAllergies}
                      onChange={(e) => setSimAllergies(e.target.checked)}
                      className="h-4 w-4 text-amber-600 rounded mr-2"
                    />
                    Refiere antecedentes alérgicos
                  </label>
                  {simAllergies && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={simAllergyDetail}
                        onChange={(e) => setSimAllergyDetail(e.target.value)}
                        placeholder="Ej: DIPIRONA, PENICILINA"
                        className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs uppercase font-semibold"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    ¿Paciente Anticoagulado?
                  </label>
                  <select
                    value={simAnticoagulado}
                    onChange={(e) => {
                      const val = e.target.value as 'NO' | 'SI';
                      setSimAnticoagulado(val);
                      if (val === 'NO') setSimMedAnticoagulante('');
                    }}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="NO">No Anticoagulado</option>
                    <option value="SI">Sí Anticoagulado</option>
                  </select>

                  {simAnticoagulado === 'SI' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        list="sim-anticoag-list"
                        value={simMedAnticoagulante}
                        onChange={(e) => setSimMedAnticoagulante(e.target.value)}
                        placeholder="Ej: Warfarina, Enoxaparina, Rivaroxabán..."
                        className="w-full p-2 bg-white border border-blue-300 rounded-lg text-xs uppercase font-semibold"
                      />
                      <datalist id="sim-anticoag-list">
                        {ANTICOAGULANTES_COMUNES.map((med) => (
                          <option key={med} value={med} />
                        ))}
                      </datalist>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Derecho y Deber Socializado
                </label>
                <select
                  value={simDerechoDeber}
                  onChange={(e) => setSimDerechoDeber(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                >
                  {DERECHOS_Y_DEBERES.map((d) => (
                    <option key={d.id} value={d.fullString}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </fieldset>

            {/* Procedure Dynamic Fields */}
            <fieldset className="border border-slate-200 p-4 rounded-2xl bg-white space-y-3">
              <legend className="text-[11px] font-extrabold text-blue-700 px-2.5 uppercase tracking-wider bg-blue-50 rounded-lg py-0.5 border border-blue-200">
                Campos del Procedimiento ({templateFields.length} variables)
              </legend>

              {templateFields.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  Esta plantilla no tiene variables dinámicas configuradas aún.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {templateFields.map((field) => (
                    <div key={field.id} className="space-y-1 p-3 bg-slate-50/70 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-extrabold text-slate-800 uppercase">
                          {field.label}
                        </label>
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                            field.type === 'select'
                              ? 'bg-emerald-100 text-emerald-800'
                              : field.type === 'number'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {field.type === 'select'
                            ? 'DESPLEGABLE'
                            : field.type === 'number'
                            ? 'NÚMERO'
                            : 'TEXTO'}
                        </span>
                      </div>

                      {field.type === 'select' && field.options && field.options.length > 0 ? (
                        <div className="space-y-2">
                          <select
                            value={simFieldValues[field.id] || ''}
                            onChange={(e) =>
                              setSimFieldValues({
                                ...simFieldValues,
                                [field.id]: e.target.value,
                              })
                            }
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                          >
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          {isOtroOption(simFieldValues[field.id] || '') && (
                            <div className="p-2.5 bg-amber-50/90 border border-amber-300 rounded-xl space-y-1 animate-in fade-in duration-150">
                              <label className="block text-[10px] font-bold text-amber-900 uppercase">
                                Especifique {field.label}:
                              </label>
                              <input
                                type="text"
                                value={simOtroValues[field.id] || ''}
                                onChange={(e) =>
                                  setSimOtroValues({
                                    ...simOtroValues,
                                    [field.id]: e.target.value,
                                  })
                                }
                                placeholder={`Escriba ${field.label.toLowerCase()} personalizado...`}
                                className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-slate-900 uppercase focus:ring-2 focus:ring-amber-500"
                              />
                              <p className="text-[10px] text-amber-700">
                                * Se sustituirá en la nota final en lugar de "{simFieldValues[field.id]}".
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <input
                          type={field.type === 'number' ? 'number' : 'text'}
                          value={simFieldValues[field.id] || ''}
                          onChange={(e) =>
                            setSimFieldValues({
                              ...simFieldValues,
                              [field.id]: e.target.value,
                            })
                          }
                          placeholder={field.defaultValue || ''}
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </fieldset>

            {/* Real-time Generated Note Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                  Resultado en Tiempo Real de la Nota de Enfermería
                </label>
                <span className="text-[11px] font-bold text-slate-500">
                  {generateSimulatedNote().split(/\s+/).filter(Boolean).length} palabras
                </span>
              </div>
              <div className="relative">
                <textarea
                  readOnly
                  rows={10}
                  value={generateSimulatedNote()}
                  className="w-full p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl border border-slate-800 leading-relaxed uppercase resize-none custom-scrollbar shadow-inner select-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions for Form */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200">
          <span className="text-xs text-slate-500 hidden sm:inline">
            {editorTab === 'editor'
              ? 'Revise la pestaña "Vista del Auxiliar" para verificar antes de guardar.'
              : 'Si todo luce correcto, guarde los cambios en la plantilla.'}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsCreatingTemplate(false);
                setEditingTemplateId(null);
              }}
              className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md transition cursor-pointer"
            >
              {editingTemplateId ? 'Guardar Cambios de la Plantilla' : 'Publicar Plantilla'}
            </button>
          </div>
        </div>
          </form>
        )}

        {/* List of ALL Templates */}
        <div className="space-y-3">
          {filteredTemplates.map((t) => {
            const isDisabled = (adminConfig.disabledModuleIds || []).includes(t.id);
            const isBase = ALL_BASE_TEMPLATES.some((b) => b.id === t.id);
            const isOverridden = Boolean((adminConfig.templateOverrides || {})[t.id]);
            const isConfirmingThis = confirmingDeleteId === t.id;

            return (
              <div
                key={t.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isDisabled
                    ? 'bg-slate-50/70 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 hover:border-blue-300 shadow-xs'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-base">{t.title}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        !isDisabled
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {!isDisabled ? 'ACTIVA' : 'INACTIVA'}
                    </span>
                    {isBase ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {isOverridden ? 'BASE (EDITADA)' : 'BASE'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        CREADA POR ADMIN
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{t.description}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                    <span>{t.category}</span>
                    <span>·</span>
                    <span>{t.fields?.length || 0} variables</span>
                  </div>
                </div>

                {/* Actions / Inline Deletion State */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  {isConfirmingThis ? (
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-300 p-1.5 px-3 rounded-xl animate-in fade-in duration-150">
                      <span className="text-xs font-extrabold text-rose-700">
                        ¿Eliminar esta plantilla?
                      </span>
                      <button
                        type="button"
                        onClick={() => handleExecuteDelete(t.id, t.title)}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-lg shadow-xs transition cursor-pointer"
                      >
                        Sí, Eliminar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingDeleteId(null)}
                        className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleToggleTemplate(t.id)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                          !isDisabled
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {!isDisabled ? 'Desactivar' : 'Activar'}
                      </button>

                      {isBase && isOverridden && (
                        <button
                          type="button"
                          onClick={() => handleResetBaseTemplate(t.id, t.title)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition cursor-pointer"
                          title="Restablecer plantilla a los valores predeterminados de fábrica"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                          <span>Restablecer</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleStartEditTemplate(t)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition cursor-pointer"
                        title="Editar plantilla y texto modelo"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmingDeleteId(t.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition cursor-pointer"
                        title="Eliminar plantilla"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Eliminar</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {filteredTemplates.length === 0 && (
            <div className="py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 space-y-2">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-600">
                No se encontraron plantillas con el filtro actual.
              </p>
              {deletedCount > 0 && (
                <button
                  type="button"
                  onClick={handleRestoreDeleted}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Restaurar plantillas eliminadas ({deletedCount})
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
