import React from 'react';
import { StepProps } from '../types';
import { GlassCard } from './UIComponents';

export const Step1NPS: React.FC<StepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <GlassCard className="text-center">
        <h2 className="text-xl md:text-2xl font-serif font-bold mb-2">NPS Global</h2>
        <p className="text-gray-300 mb-8 text-sm md:text-base">
          De 0 a 10, qual a probabilidade de você recomendar a PLUR para um amigo?
        </p>

        <div className="grid grid-cols-6 md:grid-cols-11 gap-2 mb-8">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              onClick={() => updateData('npsScore', i)}
              className={`
                aspect-square rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300
                ${data.npsScore === i 
                  ? 'bg-live-green text-black scale-110 shadow-[0_0_15px_#00e800]' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-105'}
              `}
            >
              {i}
            </button>
          ))}
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-live-green mb-2">
            Qual o principal motivo da sua nota? <span className="text-gray-500 text-xs font-normal">(Opcional)</span>
          </label>
          <textarea
            value={data.npsReason}
            onChange={(e) => updateData('npsReason', e.target.value)}
            className="w-full bg-[#06192a]/50 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-live-green focus:ring-1 focus:ring-live-green transition-all"
            rows={3}
            placeholder="Conte-nos mais..."
          />
        </div>
      </GlassCard>
    </div>
  );
};