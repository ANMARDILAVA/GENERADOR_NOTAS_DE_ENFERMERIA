import React, { useState } from 'react';
import { AdminConfig, CustomTemplate, ModuleId, ModuleMetadata } from '../../types/clinical';
import { MODULES_CONFIG } from '../../constants/clinicalOptions';
import {
  Bandage,
  Pill,
  FileCheck,
  Baby,
  BedDouble,
  Activity,
  Syringe,
  Scissors,
  Stethoscope,
  Scan,
  Disc,
  Droplet,
  Search,
  Sparkles,
  ShieldCheck,
  FileCode2,
} from 'lucide-react';

interface Props {
  onSelectModule: (id: ModuleId) => void;
  adminConfig: AdminConfig;
  onOpenAdmin: () => void;
}

export const ModuleMenu: React.FC<Props> = ({
  onSelectModule,
  adminConfig,
  onOpenAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');

  const categories = [
    'TODAS',
    'Procedimientos y Curaciones',
    'Inyectología y Especiales',
    'Urgencias y Prioritaria',
    'Imágenes Diagnósticas',
  ];

  // Convert active custom templates to ModuleMetadata
  const customModuleItems: ModuleMetadata[] = adminConfig.customTemplates
    .filter((t) => t.enabled)
    .map((t) => ({
      id: t.id,
      title: t.title,
      shortTitle: t.shortTitle,
      description: t.description,
      category: t.category,
      color: 'blue',
      bgLight: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700',
      badge: 'PERSONALIZADA',
      iconName: 'FileCode2',
      isCustom: true,
    }));

  // Combine active base modules + active custom templates
  const allActiveModules: ModuleMetadata[] = [
    ...MODULES_CONFIG
      .filter(
        (m) =>
          !adminConfig.disabledModuleIds.includes(m.id) &&
          !adminConfig.deletedTemplateIds.includes(m.id)
      )
      .map((m) => {
        const override = adminConfig.templateOverrides?.[m.id];
        if (override) {
          return {
            ...m,
            title: override.title || m.title,
            shortTitle: override.shortTitle || m.shortTitle,
            description: override.description || m.description,
            category: override.category || m.category,
          };
        }
        return m;
      }),
    ...customModuleItems,
  ];

  const filteredModules = allActiveModules.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.shortTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'TODAS' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const renderIcon = (name: string, colorClass: string) => {
    const props = { className: `w-6 h-6 ${colorClass}` };
    switch (name) {
      case 'Bandage':
        return <Bandage {...props} />;
      case 'Pill':
        return <Pill {...props} />;
      case 'FileCheck':
        return <FileCheck {...props} />;
      case 'Baby':
        return <Baby {...props} />;
      case 'BedDouble':
        return <BedDouble {...props} />;
      case 'Activity':
        return <Activity {...props} />;
      case 'Syringe':
        return <Syringe {...props} />;
      case 'Scissors':
        return <Scissors {...props} />;
      case 'Stethoscope':
        return <Stethoscope {...props} />;
      case 'Scan':
        return <Scan {...props} />;
      case 'Disc':
        return <Disc {...props} />;
      case 'Droplet':
        return <Droplet {...props} />;
      case 'FileCode2':
        return <FileCode2 {...props} />;
      default:
        return <Activity {...props} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner / Guide */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Plantillas Estructuradas · Sin Base de Datos</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Seleccione el módulo clínico a diligenciar
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Genere notas de enfermería estructuradas, precisas y listas para copiar en el software de
            historia clínica. Incluye 12 protocolos asistenciales parametrizados y derechos y deberes institucionales.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAdmin}
          className="relative z-10 whitespace-nowrap px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition backdrop-blur-xs self-start md:self-center"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Panel de Administrador</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar módulo (ej: Curación, TAC, Penicilina, Glucometría)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs font-medium"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 12 Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredModules.map((m: ModuleMetadata) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelectModule(m.id)}
            className="text-left p-6 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 group flex flex-col justify-between h-full cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={`p-3 rounded-2xl ${m.bgLight} border ${m.borderColor} shadow-xs group-hover:scale-105 transition-transform`}
                >
                  {renderIcon(m.iconName, m.textColor)}
                </div>
                {m.badge && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200">
                    {m.badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed line-clamp-2">
                  {m.description}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-blue-600">
              <span className="text-[11px] text-slate-400 font-normal">{m.category}</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Abrir módulo →
              </span>
            </div>
          </button>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          <p className="font-semibold text-sm">No se encontraron módulos con el término "{searchTerm}".</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('TODAS');
            }}
            className="mt-2 text-xs font-bold text-blue-600 hover:underline"
          >
            Restablecer búsqueda
          </button>
        </div>
      )}
    </div>
  );
};
