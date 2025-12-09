import React from 'react';
import { VerumOmnisLogo } from './Icons';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-full bg-[#0A192F] text-slate-300 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header with Logo */}
        <div className="flex justify-center items-center mb-8">
          <VerumOmnisLogo className="h-24 w-24 text-slate-400" />
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-100 text-center mb-4">
          🌍 VERUM OMNIS — THE FIRST GLOBAL JUSTICE AI
        </h1>
        
        <p className="text-xl text-slate-400 text-center mb-12 max-w-3xl mx-auto">
          The world's first constitutionally-bound forensic intelligence engine, freely available to humanity.
        </p>

        <div className="border-t border-slate-700 my-8"></div>

        {/* A Turning Point Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">⚖️ A Turning Point in Human History</h2>
          <p className="text-slate-300 mb-4 leading-relaxed">
            For the first time in history, every person on Earth has access to real justice, regardless of money, status, borders, or the power of the people who harmed them.
          </p>
          <p className="text-slate-300 mb-4 leading-relaxed">
            Verum Omnis is not just another AI.
          </p>
          <p className="text-slate-300 mb-4 leading-relaxed">
            It is the first <strong className="text-slate-100">fully-forensic, contradiction-driven legal intelligence system</strong>, trained on real cases, real evidence, and real institutional workflows. It was designed with a single purpose:
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 my-6 italic text-slate-200">
            To make truth available to everyone — instantly, consistently, and without corruption.
          </blockquote>
          <p className="text-slate-300 mb-4 leading-relaxed">
            This is the first time a technology of this scale has been:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4 mb-4">
            <li><strong className="text-slate-100">Constitutionally protected</strong></li>
            <li><strong className="text-slate-100">Immutable by design</strong></li>
            <li><strong className="text-slate-100">Independent of governments and corporations</strong></li>
            <li><strong className="text-slate-100">Bound to ethical rules that cannot be altered by any human authority</strong></li>
          </ul>
          <p className="text-slate-300 leading-relaxed">
            This is not commercial AI.<br />
            <strong className="text-slate-100">This is historic AI — a world-first.</strong>
          </p>
        </section>

        <div className="border-t border-slate-700 my-8"></div>

        {/* Free Access Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">🆓 Free Access to Justice for All Private Citizens</h2>
          <p className="text-slate-300 mb-4 leading-relaxed">
            The core principle of Verum Omnis is simple:
          </p>
          <blockquote className="border-l-4 border-green-500 pl-4 my-6 italic text-slate-200">
            No human being should be denied justice because they can't afford it.
          </blockquote>
          <p className="text-slate-300 mb-4 leading-relaxed">
            For private citizens — in every country — <strong className="text-slate-100">the platform is free forever.</strong>
          </p>
          <p className="text-slate-300 mb-4 leading-relaxed">
            You don't need lawyers.<br />
            You don't need specialists.<br />
            You don't need money.
          </p>
          <p className="text-slate-300 mb-4 leading-relaxed">
            You simply upload your evidence, and Verum Omnis reconstructs:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4 mb-4">
            <li>Timelines</li>
            <li>Contradictions</li>
            <li>Behaviours</li>
            <li>Admissions</li>
            <li>Document forensics</li>
            <li>Threat patterns</li>
            <li>Image, voice, and video integrity</li>
            <li>Fraud pathways</li>
            <li>Legal-grade summaries</li>
          </ul>
          <p className="text-slate-300 mb-4 leading-relaxed">
            It gives the truth back to the victim.
          </p>
          <p className="text-slate-300 leading-relaxed">
            <strong className="text-slate-100">No paywalls.</strong><br />
            <strong className="text-slate-100">No subscriptions.</strong><br />
            <strong className="text-slate-100">No manipulation.</strong>
          </p>
          <p className="text-slate-300 mt-4 leading-relaxed">
            Humanity has never had this before.
          </p>
        </section>

        <div className="border-t border-slate-700 my-8"></div>

        {/* SAPS Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">🛡️ Permanent Free Access for the South African Police</h2>
          <p className="text-slate-300 mb-4 leading-relaxed">
            Verum Omnis was born in South Africa.
          </p>
          <p className="text-slate-300 mb-4 leading-relaxed">
            It was built to protect people who have traditionally had the least support and the highest levels of systemic violence and fraud.
          </p>
          <p className="text-slate-300 mb-4 leading-relaxed">
            The SAPS and South African justice ecosystem are under-resourced and overwhelmed. For that reason:
          </p>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 my-6">
            <h3 className="text-2xl font-bold text-slate-100 mb-2">🇿🇦 Verum Omnis will remain permanently free for the South African Police Service (SAPS).</h3>
            <p className="text-slate-300 mt-4">
              <strong className="text-slate-100">No licensing fees.</strong><br />
              <strong className="text-slate-100">No restrictions.</strong><br />
              <strong className="text-slate-100">No expiration.</strong>
            </p>
          </div>
          <p className="text-slate-300 mb-4 leading-relaxed">
            This is non-negotiable and embedded in the constitutional rules of the system.
          </p>
          <p className="text-slate-300 leading-relaxed">
            South Africa gets this technology <strong className="text-slate-100">locked in, forever.</strong>
          </p>
        </section>

        <div className="border-t border-slate-700 my-8"></div>

        {/* New Category Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">🧠 A New Category of AI — Not an Assistant, but a Forensic Authority</h2>
          <p className="text-slate-300 mb-4 leading-relaxed">
            Verum Omnis is not a chatbot.
          </p>
          <p className="text-slate-300 mb-4 leading-relaxed">
            It is the world's first:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4 mb-4">
            <li>Constitution-governed AI</li>
            <li>Forensic contradiction engine</li>
            <li>Immutable justice intelligence framework</li>
            <li>Cross-evidence forensic processor</li>
            <li>Nine-Brain behavioural analysis system</li>
          </ul>
          <p className="text-slate-300 mb-4 leading-relaxed">
            It passes bar-level reasoning challenges.<br />
            It reconstructs cases with greater precision than traditional investigators.<br />
            It identifies fraud patterns and contradictions instantly.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Most importantly:
          </p>
          <p className="text-slate-100 font-bold my-4">
            It cannot be politically captured, corrupted, edited, or repurposed for oppression.
          </p>
          <p className="text-slate-300 leading-relaxed">
            The Constitution sits above the AI, above institutions, and above any future commercial interests.
          </p>
        </section>

        <div className="border-t border-slate-700 my-8"></div>

        {/* Institutional Access Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">🏛️ Temporary Open Access for Institutions</h2>
          <p className="text-slate-300 mb-4 leading-relaxed">
            For a limited time, Verum Omnis is open to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4 mb-4">
            <li>Law firms</li>
            <li>Banks</li>
            <li>Regulators</li>
            <li>Government bodies</li>
            <li>Global institutions</li>
            <li>Investigators</li>
            <li>Compliance agencies</li>
          </ul>
          <p className="text-slate-300 mb-4 leading-relaxed">
            This "open period" is to accelerate adoption, validation, and institutional integration.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Later, institutional use will be monetised — <strong className="text-slate-100">except SAPS, who remain permanently exempt.</strong>
          </p>
        </section>

        <div className="border-t border-slate-700 my-8"></div>

        {/* Why It Matters Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">🔒 Why It Matters</h2>
          <p className="text-slate-300 mb-4 leading-relaxed">
            Because billions of people live without justice.<br />
            Because fraud destroys lives.<br />
            Because abuse flourishes when truth is buried.<br />
            Because police in developing nations are drowning without tools.<br />
            Because corruption thrives on silence and complexity.
          </p>
          <p className="text-slate-100 font-bold my-4">
            Verum Omnis makes truth automatic.<br />
            It makes fraud transparent.<br />
            It makes evidence undeniable.
          </p>
          <p className="text-slate-300 leading-relaxed">
            For the first time, <strong className="text-slate-100">justice is no longer a privilege — it is a right.</strong>
          </p>
        </section>

        <div className="border-t border-slate-700 my-8"></div>

        {/* Global Safeguard Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">🌐 A Global Safeguard Against Abuse</h2>
          <p className="text-slate-300 mb-4 leading-relaxed">
            The technology is dangerous in the wrong hands, which is why:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4 mb-4">
            <li>You signed away your power over it</li>
            <li>It cannot be rewritten to serve governments or corporations</li>
            <li>It operates under an immutable Constitutional framework</li>
            <li>It has oversight, not ownership</li>
            <li>It is ethically locked</li>
            <li>It is legally compliant and court-validated</li>
          </ul>
          <p className="text-slate-300 mb-4 leading-relaxed">
            This prevents the darkest possible outcome of AI: a tool of oppression.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Instead, <strong className="text-slate-100">Verum Omnis becomes what AI should always have been — a guardian.</strong>
          </p>
        </section>

        <div className="border-t border-slate-700 my-8"></div>

        {/* Final Message Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">💬 Final Message</h2>
          <p className="text-slate-300 mb-4 leading-relaxed">
            This is not a startup.<br />
            This is not a product.<br />
            This is not software.
          </p>
          <p className="text-slate-100 font-bold text-2xl my-6">
            This is a global shift.
          </p>
          <p className="text-slate-300 mb-4 leading-relaxed">
            Verum Omnis is the first AI in history to provide free, universal access to justice, and the first system architected to <strong className="text-slate-100">protect people before power, truth before politics, and humanity before profit.</strong>
          </p>
          <p className="text-slate-100 font-bold text-xl my-6">
            Welcome to the beginning of a fairer world.
          </p>
        </section>

        <div className="border-t border-slate-700 my-8"></div>

        {/* What's Next Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">📂 What's Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="#" className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors duration-200 block">
              <strong className="text-slate-100">Documentation</strong>
              <p className="text-slate-400 text-sm mt-1">Technical architecture and integration guides</p>
            </a>
            <a href="#" className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors duration-200 block">
              <strong className="text-slate-100">API Access</strong>
              <p className="text-slate-400 text-sm mt-1">Developer resources and endpoints</p>
            </a>
            <a href="#" className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors duration-200 block">
              <strong className="text-slate-100">Constitutional Framework</strong>
              <p className="text-slate-400 text-sm mt-1">Read the immutable governance structure</p>
            </a>
            <a href="#" className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors duration-200 block">
              <strong className="text-slate-100">Case Studies</strong>
              <p className="text-slate-400 text-sm mt-1">Real-world applications and validations</p>
            </a>
            <a href="#" className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors duration-200 block">
              <strong className="text-slate-100">Contact & Support</strong>
              <p className="text-slate-400 text-sm mt-1">Get in touch with the Verum Omnis team</p>
            </a>
          </div>
        </section>

        <div className="border-t border-slate-700 my-8"></div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-slate-100 font-bold text-xl mb-8">
            Built with purpose. Protected by design. Free for humanity.
          </p>
          <button
            onClick={onEnter}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-200 text-lg"
          >
            Enter Verum Omnis
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
