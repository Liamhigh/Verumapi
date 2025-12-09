import React from 'react';
import { VerumOmnisLogo } from './Icons';

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptClick }) => {
  return (
    <div className="text-center py-16 px-4">
      <div className="flex justify-center items-center mb-6">
        <VerumOmnisLogo className="h-20 w-20 text-slate-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">Verum Omnis</h1>
      <p className="text-slate-400 mb-10">The World's First Legally-Validated Forensic AI</p>
    </div>
  );
};

export default WelcomeScreen;