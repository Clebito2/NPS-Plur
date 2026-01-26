import React from 'react';
import { Star, Check } from 'lucide-react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', ...props }) => (
  <div className={`bg-[#0a243d]/70 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-6 md:p-8 ${className}`} {...props}>
    {children}
  </div>
);

interface StarRatingProps {
  value: number;
  onChange: (val: number) => void;
  label: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ value, onChange, label }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              size={32}
              fill={star <= value ? '#00e800' : 'none'}
              className={star <= value ? 'text-live-green' : 'text-gray-500'}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (val: string) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, options, selectedValue, onChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-3">{label}</label>
      <div className="flex flex-col space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              relative flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200
              ${selectedValue === option.value 
                ? 'bg-live-green/20 border-live-green shadow-[0_0_10px_rgba(0,232,0,0.3)]' 
                : 'bg-white/5 border-white/10 hover:bg-white/10'}
            `}
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${selectedValue === option.value ? 'border-live-green' : 'border-gray-400'}`}>
              {selectedValue === option.value && <div className="w-2.5 h-2.5 rounded-full bg-live-green" />}
            </div>
            <span className={selectedValue === option.value ? 'text-white font-medium' : 'text-gray-300'}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export const CheckboxItem: React.FC<{ 
  label: string; 
  checked: boolean; 
  onChange: () => void; 
}> = ({ label, checked, onChange }) => (
  <label className={`
    flex items-center p-4 rounded-xl border cursor-pointer transition-all mb-3
    ${checked 
      ? 'bg-live-green/10 border-live-green' 
      : 'bg-white/5 border-white/10 hover:bg-white/10'}
  `}>
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    <div className={`
      w-6 h-6 rounded-md border flex items-center justify-center mr-3 transition-colors
      ${checked ? 'bg-live-green border-live-green' : 'border-gray-500 bg-transparent'}
    `}>
      {checked && <Check size={16} className="text-black" />}
    </div>
    <span className="text-gray-200">{label}</span>
  </label>
);