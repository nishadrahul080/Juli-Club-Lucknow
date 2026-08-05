import React, { useState } from 'react';
import { FAQS } from '../data/mockData';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-16 bg-[#0a0a0a] text-[#e0e0e0] border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em]">
            <HelpCircle className="w-3.5 h-3.5 text-[#c5a059]" /> Questions & Answers
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif text-[#e0e0e0]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-white/60 font-sans">
            Everything you need to know about our cash-on-delivery Lucknow escort & companion agency.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#0f0f0f] border border-white/10 rounded overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-serif font-bold text-sm text-[#e0e0e0] hover:text-[#c5a059] flex items-center justify-between gap-3"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#c5a059] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-2 text-xs text-white/70 leading-relaxed border-t border-white/5 font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

