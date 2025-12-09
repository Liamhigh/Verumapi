
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
    const source = pdfContentRef.current;
    if (!source || !message.seal) return;

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
                 tableHeader = <thead key={`th-${i}`}><tr>{cells.map((cell, c_idx) => <th key={`th-cell-${i}-${c_idx}`} style={{border: '1px solid #475569', padding: '8px', textAlign: 'left', backgroundColor: '#1e293b' }}>{cell}</th>)}</tr></thead>;
            } else if (!line.match(/^\|\s*:-/)) { 
                tableRows.push(<tr key={`tr-${i}`}>{cells.map((cell, c_idx) => <td key={`td-${i}-${c_idx}`} style={{border: '1px solid #475569', padding: '8px'}}>{cell}</td>)}</tr>);
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

            if (line.match(/^#\s/)) elements.push(<h1 key={i} style={{color: '#cbd5e1', fontSize: '2em', margin: '0.67em 0'}}>{line.substring(2)}</h1>);
            else if (line.match(/^##\s/)) elements.push(<h2 key={i} style={{color: '#cbd5e1', fontSize: '1.5em', margin: '0.83em 0'}}>{line.substring(3)}</h2>);
            else if (line.match(/^###\s/)) elements.push(<h3 key={i} style={{color: '#cbd5e1', fontSize: '1.17em', margin: '1em 0'}}>{line.substring(4)}</h3>);
            else if (line.trim() === '---') elements.push(<hr key={i} style={{borderTop: '1px solid #475569', margin: '1em 0'}} />);
            else elements.push(<p key={i} style={{ margin: '0.5em 0', whiteSpace: 'pre-wrap' }}>{line || '\u00A0'}</p>);
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
            <>
                <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '800px', fontFamily: 'sans-serif' }}>
                  <div ref={pdfContentRef} className="p-8 bg-[#0A192F] text-slate-300">
                      {renderPdfContent(message.pdfContent)}
                  </div>
                </div>

                <div className="mt-4">
                    <button
                        onClick={handleDownloadPdf}
                        className="flex items-center justify-center gap-2 w-full text-center p-3 text-sm bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sky-300"
                    >
                        <DownloadIcon className="h-5 w-5" />
                        Download Forensic Report as PDF
                    </button>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;