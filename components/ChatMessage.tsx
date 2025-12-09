
import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { ChatMessage as Message } from '../types';
import { UserIcon, VerumOmnisLogo, PaperclipIcon, ShieldCheckIcon, DownloadIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
  onActionClick: (actionText: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onActionClick }) => {
  const isModel = message.role === 'model';
  const pdfContentRef = React.useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!message.seal) return;
    
    const source = pdfContentRef.current;
    if (!source) {
      console.error('PDF content not available');
      return;
    }

    const qrCodeDataUrl = await QRCode.toDataURL(message.seal, { width: 120, margin: 1 });

    html2canvas(source, {
      scale: 2,
      backgroundColor: '#0A192F',
      useCORS: true,
      windowWidth: source.scrollWidth,
      windowHeight: source.scrollHeight,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasAspectRatio = canvas.width / canvas.height;
      
      const imgWidth = pdfWidth;
      const imgHeight = pdfWidth / canvasAspectRatio;
      
      const addFooter = () => {
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageWidth = pdf.internal.pageSize.getWidth();
        
        pdf.setFontSize(7);
        pdf.setTextColor('#94a3b8'); // slate-400
        
        const watermarkText = "Verum Omnis patent Pending ✓";
        const partialHash = message.seal ? `${message.seal.substring(0, 16)}...` : '';
        
        pdf.text(`${watermarkText} | ${partialHash}`, 15, pageHeight - 10);
        
        // QR Code is 30x30, padding 15
        pdf.addImage(qrCodeDataUrl, 'PNG', pageWidth - 15 - 30, pageHeight - 15 - 30, 30, 30);
      };

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      addFooter();
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        addFooter();
        heightLeft -= pdfHeight;
      }
      pdf.save('Verum_Omnis_Report.pdf');
    });
  };

  const renderPdfContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.JSX.Element[] = [];
    let inTable = false;
    let tableRows: React.JSX.Element[] = [];
    let tableHeader: React.JSX.Element | null = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('|') && line.endsWith('|')) {
            if (!inTable) {
                inTable = true;
            }
            const cells = line.split('|').slice(1, -1).map(c => c.trim());
            
            if (lines[i+1] && lines[i+1].match(/^\|\s*:-/)) {
                 tableHeader = <thead key={`th-${i}`}><tr>{cells.map((cell, c_idx) => <th key={`th-cell-${i}-${c_idx}`} style={{border: '1px solid #475569', padding: '10px', textAlign: 'left', backgroundColor: '#1e293b', fontWeight: 'bold', fontSize: '14px' }}>{cell}</th>)}</tr></thead>;
            } else if (!line.match(/^\|\s*:-/)) { 
                tableRows.push(<tr key={`tr-${i}`}>{cells.map((cell, c_idx) => <td key={`td-${i}-${c_idx}`} style={{border: '1px solid #475569', padding: '10px', fontSize: '13px', lineHeight: '1.6'}}>{cell}</td>)}</tr>);
            }
        } else {
            if (inTable) {
                elements.push(
                    <table key={`table-${i - 1}`} style={{borderCollapse: 'collapse', width: '100%', margin: '1em 0', border: '1px solid #475569', fontSize: '14px'}}>
                        {tableHeader}
                        <tbody>{tableRows}</tbody>
                    </table>
                );
                tableRows = [];
                tableHeader = null;
                inTable = false;
            }

            if (line.match(/^#\s/)) elements.push(<h1 key={i} style={{color: '#e2e8f0', fontSize: '28px', fontWeight: 'bold', margin: '24px 0 16px 0', paddingBottom: '8px', borderBottom: '2px solid #475569'}}>{line.substring(2)}</h1>);
            else if (line.match(/^##\s/)) elements.push(<h2 key={i} style={{color: '#cbd5e1', fontSize: '22px', fontWeight: 'bold', margin: '20px 0 12px 0'}}>{line.substring(3)}</h2>);
            else if (line.match(/^###\s/)) elements.push(<h3 key={i} style={{color: '#cbd5e1', fontSize: '18px', fontWeight: '600', margin: '16px 0 10px 0'}}>{line.substring(4)}</h3>);
            else if (line.trim() === '---') elements.push(<hr key={i} style={{borderTop: '2px solid #475569', margin: '20px 0'}} />);
            else elements.push(<p key={i} style={{ margin: '8px 0', lineHeight: '1.8', fontSize: '14px', whiteSpace: 'pre-wrap' }}>{line || '\u00A0'}</p>);
        }
    }

    if (inTable) {
        elements.push(
            <table key="table-end" style={{borderCollapse: 'collapse', width: '100%', margin: '1em 0', border: '1px solid #475569'}}>
                {tableHeader}
                <tbody>{tableRows}</tbody>
            </table>
        );
    }
    return elements;
  };


  const TypingIndicator = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
    </div>
  );

  return (
    <div className={`flex items-start gap-4 my-6 ${!isModel ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isModel ? 'bg-slate-700' : 'bg-sky-800'}`}>
        {isModel ? <VerumOmnisLogo className="h-5 w-5 text-slate-300" /> : <UserIcon className="h-5 w-5 text-sky-200" />}
      </div>
      <div className={`prose prose-invert prose-p:text-slate-300 prose-p:my-0 max-w-full rounded-xl p-4 break-words ${isModel ? 'bg-slate-800' : 'bg-sky-900/50'}`}>
        {message.text === '' && isModel ? <TypingIndicator /> : <p className="whitespace-pre-wrap break-words">{message.text}</p>}
        {message.file && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-600/70 bg-slate-700/50 p-2 text-xs text-slate-400">
                <PaperclipIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate font-mono">{message.file.name}</span>
            </div>
        )}
        {message.seal && (
            <div className="mt-4 border-t border-slate-700 pt-3">
                <h4 className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-sky-400/80">
                    <ShieldCheckIcon className="h-4 w-4" />
                    Forensic Seal
                </h4>
                <p className="mt-1 font-mono text-xs text-slate-500 break-words">{message.seal}</p>
                <button
                    onClick={handleDownloadPdf}
                    className="mt-3 flex items-center justify-center gap-2 w-full text-center p-2 text-xs bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sky-300"
                >
                    <DownloadIcon className="h-4 w-4" />
                    Print Sealed Report
                </button>
            </div>
        )}
        {message.actions && message.actions.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                {message.actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => onActionClick(action)}
                        className="w-full text-left p-3 text-sm bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors duration-200 text-slate-200"
                    >
                        {action}
                    </button>
                ))}
            </div>
        )}
        {message.isPdfContent && message.pdfContent && (
            <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '800px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <div ref={pdfContentRef} style={{ padding: '48px', backgroundColor: '#0A192F', color: '#cbd5e1' }}>
                  {renderPdfContent(message.pdfContent)}
              </div>
            </div>
        )}
        {message.seal && !message.isPdfContent && (
            <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '800px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <div ref={pdfContentRef} style={{ padding: '48px 60px', backgroundColor: '#0A192F', color: '#cbd5e1' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px', paddingBottom: '24px', borderBottom: '3px solid #475569' }}>
                  <h1 style={{color: '#38bdf8', fontSize: '32px', fontWeight: 'bold', margin: '0 0 12px 0', letterSpacing: '0.5px'}}>VERUM OMNIS</h1>
                  <p style={{color: '#94a3b8', fontSize: '14px', margin: '0', textTransform: 'uppercase', letterSpacing: '2px'}}>Forensic AI Analysis Report</p>
                  <p style={{color: '#64748b', fontSize: '11px', margin: '8px 0 0 0'}}>Patent Pending • Legally Validated</p>
                </div>
                <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#1e293b', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
                  <p style={{color: '#94a3b8', fontSize: '11px', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600'}}>Document Metadata</p>
                  <p style={{color: '#cbd5e1', fontSize: '12px', margin: '4px 0', lineHeight: '1.6'}}><strong>Report ID:</strong> {message.seal?.substring(0, 16)}</p>
                  <p style={{color: '#cbd5e1', fontSize: '12px', margin: '4px 0', lineHeight: '1.6'}}><strong>Generated:</strong> {new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</p>
                  <p style={{color: '#cbd5e1', fontSize: '12px', margin: '4px 0', lineHeight: '1.6'}}><strong>Seal Type:</strong> SHA-512 Forensic Hash</p>
                </div>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{color: '#e2e8f0', fontSize: '20px', fontWeight: 'bold', margin: '24px 0 16px 0', paddingBottom: '8px', borderBottom: '2px solid #334155'}}>Analysis Content</h2>
                  <div style={{ margin: '0', lineHeight: '1.8', fontSize: '14px', whiteSpace: 'pre-wrap', color: '#cbd5e1' }}>{message.text}</div>
                </div>
                <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#1e293b', borderRadius: '8px', borderTop: '3px solid #38bdf8' }}>
                  <p style={{color: '#94a3b8', fontSize: '11px', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600'}}>Forensic Seal (SHA-512)</p>
                  <p style={{color: '#64748b', fontSize: '9px', margin: '0', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: '1.4'}}>{message.seal}</p>
                  <p style={{color: '#64748b', fontSize: '10px', margin: '12px 0 0 0', fontStyle: 'italic'}}>This document is cryptographically sealed and validated by Verum Omnis AI forensic protocols.</p>
                </div>
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;