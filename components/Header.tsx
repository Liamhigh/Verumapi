import React from 'react';
import { APP_CONFIG } from '../config';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-[#0A192F]/80 backdrop-blur-sm border-b border-slate-700/50">
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-center flex-col">
        <div className="flex items-center">
          <img src={APP_CONFIG.LOGO_PATH} alt={`${APP_CONFIG.APP_NAME} Logo`} className="h-8 w-8 mr-3 object-contain" />
          <h1 className="text-xl font-bold tracking-wider text-slate-200">
            VERUM OMNIS
          </h1>
        </div>
        <p className="text-xs text-sky-400/70 tracking-widest mt-1">{APP_CONFIG.APP_TAGLINE.toUpperCase()}</p>
      </div>
    </header>
  );
};

export default Header;