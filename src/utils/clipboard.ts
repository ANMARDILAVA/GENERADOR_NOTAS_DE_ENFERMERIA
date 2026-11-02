export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text || text.trim() === '') {
    return false;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard API error, trying fallback:', err);
  }

  // Fallback for older browsers or insecure contexts
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback clipboard error:', err);
    return false;
  }
}

export function downloadAsTxt(text: string, filename: string = 'nota-enfermeria.txt'): void {
  const element = document.createElement('a');
  const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function printNote(noteText: string, title: string = 'Nota de Enfermería'): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body {
            font-family: monospace;
            padding: 24px;
            color: #1e293b;
            line-height: 1.6;
            white-space: pre-wrap;
            font-size: 13px;
          }
          h2 {
            font-family: sans-serif;
            font-size: 16px;
            border-bottom: 2px solid #0284c7;
            padding-bottom: 8px;
            margin-bottom: 16px;
          }
          .footer {
            margin-top: 32px;
            font-family: sans-serif;
            font-size: 11px;
            color: #64748b;
            border-top: 1px solid #cbd5e1;
            padding-top: 8px;
          }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        <div>${noteText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        <div class="footer">
          Generado el ${new Date().toLocaleString('es-CO')} · Sistema Central de Notas de Enfermería
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}
