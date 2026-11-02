import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, Share2, Globe, Github, MessageSquareShare, Info } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use current window origin or href
      setAppUrl(window.location.origin || window.location.href);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const success = await copyToClipboard(appUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenNewTab = () => {
    if (typeof window !== 'undefined' && appUrl) {
      window.open(appUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hola colega, te comparto el Sistema Central de Notas de Enfermería para agilizar el registro clínico durante el turno:\n${appUrl}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Compartir Aplicación & Enlaces
              </h3>
              <p className="text-xs text-slate-500">
                Enlaces para el equipo asistencial y repositorio de código
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Card 1: Link for Nurses */}
          <div className="p-5 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-700" />
                <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider">
                  1. Enlace para Enfermeros (Para usar en el turno)
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                LISTO PARA USAR
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Este es el enlace web que debes enviar a los auxiliares y enfermeros. Funciona en <strong>cualquier celular, tablet o computador</strong> de la clínica sin pedir contraseñas ni registrarse en GitHub.
            </p>

            {/* URL Box & Copy */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 select-all overflow-x-auto whitespace-nowrap shadow-inner flex items-center">
                {appUrl || 'Cargando enlace...'}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Enlace</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleOpenNewTab}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Abrir en pestaña nueva</span>
              </button>

              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
              >
                <MessageSquareShare className="w-3.5 h-3.5" />
                <span>Compartir por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 2: GitHub Repository Link & Instructions */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-slate-800" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  2. ¿Dónde está tu enlace de GitHub? (Código Fuente)
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                DESARROLLADOR
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              GitHub es la plataforma donde se guarda el código fuente del proyecto. Si no encuentras el enlace directo, puedes acceder de dos formas muy rápidas:
            </p>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center shrink-0 text-[11px]">
                  A
                </span>
                <div>
                  <strong className="text-slate-900">Desde tu cuenta de GitHub.com:</strong>
                  <p className="text-slate-500 mt-0.5">
                    Entra a <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">github.com</a>, inicia sesión, haz clic en tu foto de perfil (arriba a la derecha) y selecciona <strong>"Your repositories"</strong>. El primer repositorio que verás es este proyecto.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center shrink-0 text-[11px]">
                  B
                </span>
                <div>
                  <strong className="text-slate-900">Desde la barra de Google AI Studio:</strong>
                  <p className="text-slate-500 mt-0.5">
                    En la esquina superior derecha de la pantalla de Google AI Studio, haz clic en el botón <strong>"Export"</strong> o el ícono de <strong>GitHub</strong>. Como ya se corrigió el error de permisos, ahora se sincronizará y te mostrará el enlace directo.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Ir a mis repositorios en GitHub.com</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Clinical Reminder */}
          <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Recomendación para el servicio:</strong> Para que los auxiliares de enfermería accedan inmediatamente, solo debes enviarles el <strong>Enlace #1</strong> (por WhatsApp o guardarlo como favorito en el navegador de los puestos de enfermería).
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
