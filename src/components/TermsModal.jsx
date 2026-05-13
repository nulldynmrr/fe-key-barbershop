"use client";

import React from "react";
import { X, Scale, ShieldCheck, Check } from "lucide-react";
import Link from "next/link";

export default function TermsModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#2B1D19]/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-[#FDFBF9] rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E6D1C7]/30 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4A1A1A] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#4A1A1A]/10">
              <Scale size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2B1D19]" style={{ fontFamily: "var(--font-playfair)" }}>Legal Agreement</h3>
              <p className="text-[10px] text-[#8B6F66] uppercase tracking-widest font-bold" style={{ fontFamily: "var(--font-be-vietnam)" }}>Terms & Privacy Policy</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#F7F1EA] rounded-full transition-colors text-[#8B6F66] hover:text-[#4A1A1A]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-6">
            <div className="p-4 bg-[#F7F1EA]/50 rounded-xl border border-[#E6D1C7]/30">
              <h4 className="text-xs font-bold text-[#4A1A1A] uppercase tracking-wider mb-2 flex items-center gap-2">
                <ShieldCheck size={14} />
                User Consent
              </h4>
              <p className="text-xs text-[#524342] leading-relaxed" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                By clicking "Agree & Continue", you confirm that you have read and agreed to our 
                <Link href="/terms" target="_blank" className="text-[#4A1A1A] underline mx-1 font-bold">Terms of Service</Link> 
                and 
                <Link href="/terms#privacy" target="_blank" className="text-[#4A1A1A] underline mx-1 font-bold">Privacy Policy</Link>.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-[11px] font-bold text-[#8B6F66] uppercase tracking-widest">Key Points:</p>
              <ul className="space-y-3">
                {[
                  "Consent for AI photo processing and facial analysis.",
                  "Agreement to the coin-based system and no-refund policy.",
                  "Personal responsibility for uploaded content and result accuracy.",
                  "Data protection according to our privacy standards."
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <div className="w-4 h-4 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={10} className="text-green-600" />
                    </div>
                    <span className="text-xs text-[#524342]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-[#E6D1C7]/30 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-xs font-bold text-[#8B6F66] uppercase tracking-widest hover:bg-[#F7F1EA] rounded-lg transition-all"
            style={{ fontFamily: "var(--font-be-vietnam)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-[2] bg-[#4A1A1A] hover:bg-[#2B1D19] text-[#FDFBF9] py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all shadow-lg shadow-[#4A1A1A]/20 flex items-center justify-center gap-2"
            style={{ fontFamily: "var(--font-be-vietnam)" }}
          >
            Agree & Continue
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F7F1EA;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E6D1C7;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
