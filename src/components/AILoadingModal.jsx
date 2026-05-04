"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Sparkles, Check, Circle } from "lucide-react";

const analysisSteps = [
  {
    id: 1,
    label: "Image Quality Verified",
    duration: 2000,
  },
  {
    id: 2,
    label: "Mapping Facial Structure",
    duration: 3000,
  },
  {
    id: 3,
    label: "Matching Artisanal Styles",
    duration: 2000,
  },
];

export default function AILoadingModal({ isOpen, onClose, onComplete, disableAutoProgress = false, previewStep = 1 }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    if (disableAutoProgress) {
      const safeStep = Math.max(0, Math.min(previewStep, analysisSteps.length - 1));
      setCurrentStep(safeStep);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    let stepIndex = 0;
    const timeoutIds = [];

    const processStep = () => {
      if (stepIndex < analysisSteps.length) {
        const currentDuration = analysisSteps[stepIndex].duration;
        const timeoutId = setTimeout(() => {
          setCurrentStep(stepIndex + 1);
          stepIndex++;
          processStep();
        }, currentDuration);
        timeoutIds.push(timeoutId);
      } else {
        // All steps completed
        setIsAnimating(false);
        const completeTimeoutId = setTimeout(() => {
          onComplete?.();
        }, 500);
        timeoutIds.push(completeTimeoutId);
      }
    };

    processStep();

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
      setCurrentStep(0);
      setIsAnimating(false);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md border border-[#d8c8bc] bg-[#F8F3EE] p-8 pt-4 shadow-2xl">
        <div className="w-full border-b-1 border-[#D7C2C0]/20">
          {/* Close Button */}
          <button onClick={onClose} className="absolute right-6 top-3 flex h-8 w-8 items-center justify-center rounded text-[#8b6f66] transition hover:bg-[#ede8e0]" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>

          {/* Title */}
          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-[#c57e7b]" />
            <h2 className="text-md uppercase  text-[#4a1a1a]" style={{ fontFamily: "var(--font-noto-serif)" }}>
              AI Stylist Analysis
            </h2>
          </div>
        </div>

        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative m-5">
            {/* blurred glow behind the box - keeps border visible */}
            <div className="absolute -inset-2 rounded-3xl blur-2xl bg-[#934B19]/10" aria-hidden="true" />

            <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl border-4 border-[#422522] bg-[#934B19]/5 shadow-[#934B19] shadow-2xl/10 z-10">
              <Image src="/images/key.png" alt="Key illustration" width={30} height={30} className="object-contain" />
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className="mb-8 text-center">
          <h3 className="text-xl text-[#2b1d19]" style={{ fontFamily: "var(--font-noto-serif)" }}>
            Analyzing your face shape...
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#6e5851]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            Our artisanal algorithm is mapping 128 key facial landmarks to determine your ideal proportions.
          </p>
        </div>

        {/* Analysis Steps */}
        <div className="mb-8 space-y-4">
          {analysisSteps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep && isAnimating;

            return (
              <div key={step.id} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center">
                  {isCompleted ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c57e7b]">
                      <Check className="h-4 w-4 text-white" strokeWidth={3} />
                    </div>
                  ) : isCurrent ? (
                    <div className="animate-pulse">
                      <Circle className="h-6 w-6 fill-[#4a1a1a] text-[#4a1a1a]" />
                    </div>
                  ) : (
                    <Circle className="h-6 w-6 text-[#d8c8bc]" />
                  )}
                </div>
                <span className={`text-xs uppercase tracking-[0.25em] ${isCompleted || isCurrent ? "text-[#4a1a1a]" : "text-[#c0b5ad]"}`} style={{ fontFamily: "var(--font-be-vietnam)" }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Indicator Dots */}
        <div className="flex justify-center gap-2">
          {analysisSteps.map((_, index) => (
            <div key={index} className={`h-2 w-2 rounded-full transition-all ${index < currentStep ? "bg-[#c57e7b]" : index === currentStep && isAnimating ? "bg-[#4a1a1a]" : "bg-[#d8c8bc]"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
