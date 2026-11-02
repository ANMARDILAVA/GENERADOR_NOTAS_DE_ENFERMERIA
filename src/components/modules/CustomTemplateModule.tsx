import React, { useState, useEffect } from 'react';
import { CustomTemplate, Gender, SavedNote } from '../../types/clinical';
import { DERECHOS_Y_DEBERES, isOtroOption } from '../../constants/clinicalOptions';
import { DerechoDeberSelect } from '../common/DerechoDeberSelect';
import { NotePreview } from '../common/NotePreview';
import { FileCode2, RefreshCw } from 'lucide-react';

interface Props {
  template: CustomTemplate;
  onSaveToHistory: (noteText: string, summary: string) => SavedNote;
}

export const CustomTemplateModule: React.FC<Props> = ({
  template,
  onSaveToHistory,
}) => {
  const [genero, setGenero] = useState<Gender>('MASCULINO');
  const [derechoDeber, setDerechoDeber] = useState(DERECHOS_Y_DEBERES[2].fullString);
  const [tieneAlergias, setTieneAlergias] = useState(false);
  const [alergiaEsp, setAlergiaEsp] = useState('');

  // Dynamic values state
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    (template.fields || []).forEach((f) => {
      initial[f.id] = f.defaultValue || (f.options ? f.options[0] : '');
    });
    return initial;
  });

  // Custom text when 'OTRO' is selected in a dropdown
  const [fieldOtroValues, setFieldOtroValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const initial: Record<string, string> = {};
    (template.fields || []).forEach((f) => {
      initial[f.id] = f.defaultValue || (f.options ? f.options[0] : '');
    });
    setFieldValues(initial);
  }, [template]);

  const [noteOutput, setNoteOutput] = useState('');

  const parseDD = (full: string) => {
    const parts = full.split('|');
    const d = parts[0]?.replace('Derecho:', '').trim() || '-';
    const b = parts[1]?.replace('Deber:', '').trim() || '-';
    return { d, b };
  };

  const handleFieldChange = (fieldId: string, val: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: val }));
  };

  const generateNote = () => {
    const e = genero === 'MASCULINO' ? 'O' : 'A';
    const al = genero === 'MASCULINO' ? 'AL' : 'A LA';
    const { d, b } = parseDD(derechoDeber);

    const alerStr = tieneAlergias
      ? `SE INDAGAN ALERGIAS, REFIERE ALERGIAS A ${alergiaEsp.trim().toUpperCase() || 'NO ESPECIFICADAS'}`
      : 'SE INDAGAN ALERGIAS, NIEGA ALERGIAS';

    let result = template.templateFormat;

    // Replace standard placeholders
    result = result.replace(/\{GENERO_EO\}/g, e);
    result = result.replace(/\{GENERO_ALA\}/g, al);
    result = result.replace(/\{DERECHO_DEBER\}/g, `DERECHO: ${d}. DEBER: ${b}`);
    result = result.replace(/\{DERECHO\}/g, d);
    result = result.replace(/\{DEBER\}/g, b);
    result = result.replace(/\{ALERGIAS\}/g, alerStr);

    // Replace custom dynamic fields
    template.fields.forEach((f) => {
      const regex = new RegExp(`\\{${f.id}\\}`, 'g');
      let val = fieldValues[f.id] || '';
      if (f.type === 'select' && isOtroOption(val)) {
        const customOtro = (fieldOtroValues[f.id] || '').trim();
        val = customOtro || `[ESPECIFIQUE ${f.label.toUpperCase()}]`;
      }
      result = result.replace(regex, val.toUpperCase());
    });

    const upper = result.toUpperCase();
    setNoteOutput(upper);
    onSaveToHistory(upper, `${template.shortTitle}`);
  };

  const handleClear = () => {
    setGenero('MASCULINO');
    setTieneAlergias(false);
    setAlergiaEsp('');
    const resetVals: Record<string, string> = {};
    template.fields.forEach((f) => {
      resetVals[f.id] = f.defaultValue || (f.options ? f.options[0] : '');
    });
    setFieldValues(resetVals);
    setFieldOtroValues({});
    setNoteOutput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{template.title}</h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                PLANTILLA ADMINISTRADOR
              </span>
            </div>
            <p className="text-xs text-slate-500">{template.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateNote();
          }}
          className="lg:col-span-7 space-y-6"
        >
          <fieldset className="border border-slate-200 p-5 rounded-2xl bg-white shadow-xs space-y-4">
            <legend className="text-xs font-extrabold text-slate-600 px-3 uppercase tracking-wider bg-slate-100 rounded-lg border border-slate-200 py-1">
              Contexto del Paciente
            </legend>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Género</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name={`custom-gen-${template.id}`}
                    value="MASCULINO"
                    checked={genero === 'MASCULINO'}
                    onChange={() => setGenero('MASCULINO')}
                    className="h-4 w-4 text-blue-600 mr-2"
                  />
                  Masculino
                </label>
                <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name={`custom-gen-${template.id}`}
                    value="FEMENINO"
                    checked={genero === 'FEMENINO'}
                    onChange={() => setGenero('FEMENINO')}
                    className="h-4 w-4 text-blue-600 mr-2"
                  />
                  Femenino
                </label>
              </div>
            </div>

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
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-sm font-medium"
                  />
                </div>
              )}
            </div>

            <DerechoDeberSelect value={derechoDeber} onChange={setDerechoDeber} />
          </fieldset>

          {/* Dynamic fields */}
          {template.fields.length > 0 && (
            <fieldset className="border border-slate-200 p-5 rounded-2xl bg-white shadow-xs space-y-4">
              <legend className="text-xs font-extrabold text-slate-600 px-3 uppercase tracking-wider bg-slate-100 rounded-lg border border-slate-200 py-1">
                Parámetros del Procedimiento
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {template.fields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      {field.label}
                    </label>
                    {field.type === 'select' && field.options ? (
                      <div className="space-y-2">
                        <select
                          value={fieldValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold"
                        >
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        {isOtroOption(fieldValues[field.id] || '') && (
                          <div className="p-2.5 bg-amber-50/90 border border-amber-300 rounded-xl space-y-1 animate-in fade-in duration-150">
                            <label className="block text-[11px] font-bold text-amber-900 uppercase">
                              Especifique {field.label}:
                            </label>
                            <input
                              type="text"
                              value={fieldOtroValues[field.id] || ''}
                              onChange={(e) =>
                                setFieldOtroValues((prev) => ({
                                  ...prev,
                                  [field.id]: e.target.value,
                                }))
                              }
                              placeholder={`Escriba el nombre específico para ${field.label}...`}
                              className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-slate-800 uppercase focus:ring-2 focus:ring-amber-500"
                              required
                            />
                            <p className="text-[10px] text-amber-700">
                              * Este texto sustituye directamente a "{fieldValues[field.id]}" en la nota final.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        value={fieldValues[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder || ''}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold"
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
            </fieldset>
          )}

          {/* Action buttons with the exact requested wording */}
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

        <div className="lg:col-span-5 h-full lg:sticky lg:top-4">
          <NotePreview
            noteText={noteOutput}
            onNoteChange={setNoteOutput}
            onClear={() => setNoteOutput('')}
            title={`Vista Previa · ${template.shortTitle}`}
            badgeLabel="PERSONALIZADA"
          />
        </div>
      </div>
    </div>
  );
};
