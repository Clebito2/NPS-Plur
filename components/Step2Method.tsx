import React from 'react';
import { StepProps } from '../types';
import { GlassCard, RadioGroup, StarRating } from './UIComponents';

export const Step2Method: React.FC<StepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <GlassCard>
        <h2 className="text-xl font-serif font-bold mb-6 border-b border-white/10 pb-4">O Método</h2>
        
        {/* Professor Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-live-green mb-2">Professor Responsável</label>
          <select
            value={data.professor}
            onChange={(e) => updateData('professor', e.target.value)}
            className="w-full bg-[#06192a]/80 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-live-green appearance-none"
          >
            <option value="" disabled>Selecione um professor</option>
            <option value="Átila">Átila</option>
            <option value="Rama">Rama</option>
            <option value="Luiz">Luiz</option>
            <option value="Pedro Paulo">Pedro Paulo</option>
          </select>
        </div>

        {/* 3. Tone and Respect */}
        <RadioGroup
          label="3. Tom e Respeito (Inegociável)"
          selectedValue={data.toneRespect}
          onChange={(val) => updateData('toneRespect', val)}
          options={[
            { value: '1', label: 'Invasivo (1)' },
            { value: '3', label: 'Regular (3)' },
            { value: '5', label: 'Acolhedor (5)' },
          ]}
        />

        {/* 4. Professional Posture */}
        <StarRating 
          label="4. Postura Profissional" 
          value={data.professionalPosture} 
          onChange={(val) => updateData('professionalPosture', val)} 
        />

        {/* 5. Full Attention */}
        <RadioGroup
          label="5. Atenção Plena"
          selectedValue={data.attention}
          onChange={(val) => updateData('attention', val)}
          options={[
            { value: '1', label: 'Distraído (1)' },
            { value: '3', label: 'Médio (3)' },
            { value: '5', label: 'Foco Total (5)' },
          ]}
        />

        {/* 6. Correction Quality */}
        <RadioGroup
          label="6. Qualidade das Correções"
          selectedValue={data.correctionQuality}
          onChange={(val) => updateData('correctionQuality', val)}
          options={[
            { value: '1', label: 'Não corrige (1)' },
            { value: '3', label: 'Básico (3)' },
            { value: '5', label: 'Excelente (5)' },
          ]}
        />

        {/* 7. Didactics */}
        <StarRating 
          label="7. Didática de Ensino" 
          value={data.didactic} 
          onChange={(val) => updateData('didactic', val)} 
        />

        {/* 8. Adaptation Capacity */}
        <RadioGroup
          label="8. Capacidade de Adaptação"
          selectedValue={data.adaptation}
          onChange={(val) => updateData('adaptation', val)}
          options={[
            { value: '1', label: 'Não adapta (1)' },
            { value: '3', label: 'Adapta se pedir (3)' },
            { value: '5', label: 'Proativo (5)' },
          ]}
        />
      </GlassCard>
    </div>
  );
};