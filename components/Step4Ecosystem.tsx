import React from 'react';
import { StepProps } from '../types';
import { GlassCard, CheckboxItem } from './UIComponents';

export const Step4Ecosystem: React.FC<StepProps> = ({ data, updateData }) => {
  const toggleEcosystem = (value: string) => {
    const current = data.ecosystem;
    if (current.includes(value)) {
      updateData('ecosystem', current.filter(item => item !== value));
    } else {
      updateData('ecosystem', [...current, value]);
    }
  };

  const options = [
    "Já fiz sessão de Recovery",
    "Sei que existe, mas nunca fiz",
    "Já participei da Capoeira",
    "Não sabia da Capoeira"
  ];

  return (
    <div className="space-y-6">
      <GlassCard>
        <h2 className="text-xl font-serif font-bold mb-6 border-b border-white/10 pb-4">Ecossistema</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-live-green mb-4">11. Você conhece nossos outros serviços?</label>
          {options.map((option) => (
            <CheckboxItem
              key={option}
              label={option}
              checked={data.ecosystem.includes(option)}
              onChange={() => toggleEcosystem(option)}
            />
          ))}
        </div>
      </GlassCard>
    </div>
  );
};