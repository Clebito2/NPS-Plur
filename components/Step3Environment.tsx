import React from 'react';
import { StepProps } from '../types';
import { GlassCard, RadioGroup, StarRating } from './UIComponents';

export const Step3Environment: React.FC<StepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <GlassCard>
        <h2 className="text-xl font-serif font-bold mb-6 border-b border-white/10 pb-4">Ambiente</h2>
        
        {/* 9. Music Atmosphere */}
        <RadioGroup
          label="9. Atmosfera Musical"
          selectedValue={data.musicAtmosphere}
          onChange={(val) => updateData('musicAtmosphere', val)}
          options={[
            { value: 'Não gosto', label: 'Não gosto' },
            { value: 'Regular', label: 'Regular' },
            { value: 'Gosto muito', label: 'Gosto muito' },
          ]}
        />

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sugestão Musical <span className="text-gray-500 text-xs">(Opcional)</span>
          </label>
          <input
            type="text"
            value={data.musicSuggestion}
            onChange={(e) => updateData('musicSuggestion', e.target.value)}
            className="w-full bg-[#06192a]/50 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-live-green focus:ring-1 focus:ring-live-green"
            placeholder="Artista, Gênero ou Playlist..."
          />
        </div>

        {/* 10. Structure and Cleanliness */}
        <StarRating 
          label="10. Estrutura e Limpeza" 
          value={data.cleanliness} 
          onChange={(val) => updateData('cleanliness', val)} 
        />
      </GlassCard>
    </div>
  );
};