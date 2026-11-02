import React, { useState, useEffect } from 'react';
import { AdminConfig, CustomTemplate, ModuleId, SavedNote } from './types/clinical';
import { MODULES_CONFIG } from './constants/clinicalOptions';
import {
  getAdminConfig,
  saveAdminConfig,
  ALL_BASE_TEMPLATES,
} from './config/templatesConfig';
import {
  getSavedNotes,
  saveNoteToHistory,
} from './utils/history';

import { Header } from './components/common/Header';
import { ModuleMenu } from './components/modules/ModuleMenu';
import { AdminPanel } from './components/admin/AdminPanel';
import { CustomTemplateModule } from './components/modules/CustomTemplateModule';

import { CuracionModule } from './components/modules/CuracionModule';
import { MedsNoProgramadaModule } from './components/modules/MedsNoProgramadaModule';
import { MedsCEModule } from './components/modules/MedsCEModule';
import { MedsPediatricosModule } from './components/modules/MedsPediatricosModule';
import { ObservacionModule } from './components/modules/ObservacionModule';
import { EkgModule } from './components/modules/EkgModule';
import { PenicilinaModule } from './components/modules/PenicilinaModule';
import { RetiroPuntosModule } from './components/modules/RetiroPuntosModule';
import { DermatologiaModule } from './components/modules/DermatologiaModule';
import { ResonanciaModule } from './components/modules/ResonanciaModule';
import { TacModule } from './components/modules/TacModule';
import { GlucometriaModule } from './components/modules/GlucometriaModule';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('menu');
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(getAdminConfig());

  useEffect(() => {
    setSavedNotes(getSavedNotes());
    setAdminConfig(getAdminConfig());
  }, []);

  const handleUpdateAdminConfig = (newConfig: AdminConfig) => {
    setAdminConfig(newConfig);
    saveAdminConfig(newConfig);
  };

  const handleSaveToHistory = (
    moduleId: string,
    noteText: string,
    summary: string
  ): SavedNote => {
    const meta = MODULES_CONFIG.find((m) => m.id === moduleId);
    const customTmpl = adminConfig.customTemplates.find((t) => t.id === moduleId);
    const modTitle =
      meta?.shortTitle || meta?.title || customTmpl?.shortTitle || customTmpl?.title || moduleId;
    const note = saveNoteToHistory(moduleId, modTitle, noteText, summary);
    setSavedNotes(getSavedNotes());
    return note;
  };



  const renderActiveModule = () => {
    // 1. Admin Panel
    if (activeModule === 'admin') {
      return (
        <AdminPanel
          adminConfig={adminConfig}
          onUpdateAdminConfig={handleUpdateAdminConfig}
          onExitAdmin={() => {
            setActiveModule('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      );
    }

    // 2. Custom Templates or Overridden Base Templates
    const customTmpl = adminConfig.customTemplates.find((t) => t.id === activeModule);
    if (customTmpl) {
      return (
        <CustomTemplateModule
          template={customTmpl}
          onSaveToHistory={(text, summary) =>
            handleSaveToHistory(customTmpl.id, text, summary)
          }
        />
      );
    }

    const baseOverride = adminConfig.templateOverrides?.[activeModule];
    if (baseOverride) {
      const baseTmpl = ALL_BASE_TEMPLATES.find((b) => b.id === activeModule);
      if (baseTmpl) {
        const merged: CustomTemplate = {
          ...baseTmpl,
          ...baseOverride,
          fields: baseOverride.fields || baseTmpl.fields,
        };
        return (
          <CustomTemplateModule
            template={merged}
            onSaveToHistory={(text, summary) =>
              handleSaveToHistory(merged.id, text, summary)
            }
          />
        );
      }
    }

    // 3. Native Modules
    switch (activeModule) {
      case 'curacion':
        return (
          <CuracionModule
            onSaveToHistory={(text, summary) =>
              handleSaveToHistory('curacion', text, summary)
            }
          />
        );
      case 'medicamentos-no-programada':
        return (
          <MedsNoProgramadaModule
            onSaveToHistory={(text, summary) =>
              handleSaveToHistory('medicamentos-no-programada', text, summary)
            }
          />
        );
      case 'medicamentos-ce':
        return (
          <MedsCEModule
            onSaveToHistory={(text, summary) =>
              handleSaveToHistory('medicamentos-ce', text, summary)
            }
          />
        );
      case 'meds-pediatricos':
        return (
          <MedsPediatricosModule
            onSaveToHistory={(text, summary) =>
              handleSaveToHistory('meds-pediatricos', text, summary)
            }
          />
        );
      case 'observacion':
        return (
          <ObservacionModule
            onSaveToHistory={(text, summary) =>
              handleSaveToHistory('observacion', text, summary)
            }
          />
        );
      case 'ekg':
        return (
          <EkgModule
            onSaveToHistory={(text, summary) =>
              handleSaveToHistory('ekg', text, summary)
            }
          />
        );
      case 'penicilina':
        return (
          <PenicilinaModule
            onSaveToHistory={(text, summary) =>
              handleSaveToHistory('penicilina', text, summary)
            }
          />
        );
      case 'retiro-puntos':
        return (
          <RetiroPuntosModule
            onSaveToHistory={(text, summary) =>
              handleSaveToHistory('retiro-puntos', text, summary)
            }
          />
        );
      case 'procedimientos':
        return (
          <DermatologiaModule
            onSaveToHistory={(text, summary) =>
              handleSaveToHistory('procedimientos', text, summary)
            }
          />
        );
      case 'resonancia':
        return (
          <ResonanciaModule
            onSaveToHistory={(text, summary) =>
              handleSaveToHistory('resonancia', text, summary)
            }
          />
        );
      case 'tac':
        return (
          <TacModule
            onSaveToHistory={(text, summary) =>
              handleSaveToHistory('tac', text, summary)
            }
          />
        );
      case 'glucometria':
        return (
          <GlucometriaModule
            onSaveToHistory={(text, summary) =>
              handleSaveToHistory('glucometria', text, summary)
            }
          />
        );
      case 'menu':
      default:
        return (
          <ModuleMenu
            onSelectModule={(id) => {
              setActiveModule(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            adminConfig={adminConfig}
            onOpenAdmin={() => {
              setActiveModule('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-6 lg:p-8 text-slate-800 flex flex-col justify-between">
      <div className="max-w-[96%] xl:max-w-7xl mx-auto w-full bg-white p-5 sm:p-8 rounded-3xl shadow-xl border border-slate-200">
        {/* Header Bar */}
        <Header
          activeModule={activeModule}
          onNavigateMenu={() => {
            setActiveModule('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAdmin={() => {
            setActiveModule('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Main Body */}
        <main className="min-h-[600px]">{renderActiveModule()}</main>

        {/* Institutional Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div>
            <span className="font-bold text-slate-700">Sistema Central de Notas de Enfermería</span> ·
            Versión para despliegue GitHub · 100% Client-Side
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Sin almacenamiento en servidores externos</span>
            <span aria-hidden="true">·</span>
            <span>Uso asistencial hospitalario y ambulatorio</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
