import React from 'react';
import { VerumOmnisLogo, TrashIcon } from './Icons';

interface HeaderProps {
  onClearChat: () => void;
  caseName?: string;
}

const Header: React.FC<HeaderProps> = ({ onClearChat, caseName }) => {
  return (
    <header className="sticky top-0 z-10 bg-[#0A192F]/80 backdrop-blur-sm border-b border-slate-700/50">
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center flex-col">
          <div className="flex items-center">
            <VerumOmnisLogo className="h-8 w-8 mr-3" />
            <h1 className="text-xl font-bold tracking-wider text-slate-200">
              VERUM OMNIS
            </h1>
          </div>
          <p className="text-xs text-sky-400/70 tracking-widest mt-1">AI FORENSICS FOR TRUTH</p>
          {caseName && (
            <p className="text-xs text-slate-500 mt-1">Case: {caseName}</p>
          )}
        </div>
        <button
          onClick={onClearChat}
          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-colors duration-200"
          aria-label="Clear chat"
          title="Clear chat and start new case"
        >
          <TrashIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>
    </header>
  );
};

export default Header;