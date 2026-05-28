interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function ProgressBar({ currentStep, totalSteps, labels }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      {/* Step labels — desktop */}
      <div className="hidden sm:flex items-start justify-between mb-3">
        {labels.map((label, i) => {
          const stepNum = i + 1;
          const isComplete = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          return (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5"
              style={{ width: `${100 / totalSteps}%` }}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isComplete
                    ? "bg-[#1F5E95] text-white"
                    : isActive
                    ? "bg-[#0E2F54] text-white ring-2 ring-[#60B8F0] ring-offset-2"
                    : "bg-[#D7E1EA] text-[#4B5B6B]"
                }`}
              >
                {isComplete ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-[11px] font-medium text-center leading-tight ${
                  isActive ? "text-[#0E2F54]" : isComplete ? "text-[#1F5E95]" : "text-[#4B5B6B]"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar track */}
      <div className="relative h-1.5 bg-[#D7E1EA] rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-[#1F5E95] rounded-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>

      {/* Step label — mobile */}
      <div className="flex sm:hidden justify-between items-center mt-2">
        <span className="text-xs text-[#4B5B6B]">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs font-semibold text-[#0E2F54]">
          {labels[currentStep - 1]}
        </span>
      </div>
    </div>
  );
}
