import React, { useState } from 'react';
import { generateSecurePassword } from '../services/passwordService';
import { KeyIcon, ClipboardIcon, CheckIcon } from './Icons';

interface PasswordGeneratorProps {
  onClose?: () => void;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ onClose }) => {
  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [length, setLength] = useState<number>(68);

  const handleGenerate = () => {
    const newPassword = generateSecurePassword(length);
    setPassword(newPassword);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy secret to clipboard:', err);
        // Fallback: user can still manually copy the secret
        alert('Failed to copy to clipboard. Please copy the secret manually.');
      }
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <KeyIcon className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-slate-200">Base64 Secret Generator</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="length" className="block text-sm text-slate-400 mb-2">
            Secret Length: {length} characters
          </label>
          <input
            id="length"
            type="range"
            min="16"
            max="128"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>16</span>
            <span>128</span>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Generate Base64 Secret
        </button>

        {password && (
          <div className="space-y-2">
            <div className="bg-slate-900/50 border border-slate-700 rounded p-3 font-mono text-sm break-all text-slate-300">
              {password}
            </div>
            <button
              onClick={handleCopy}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardIcon className="w-4 h-4" />
                  Copy to Clipboard
                </>
              )}
            </button>
            <p className="text-xs text-slate-500 text-center">
              Base64-encoded secret generated using cryptographically secure random values
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordGenerator;
