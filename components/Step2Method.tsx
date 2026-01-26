import React from 'react';
import { StepProps } from '../types';
import { GlassCard, RadioGroup, StarRating } from './UIComponents';
import { Trash2, UserPlus } from 'lucide-react';

export const Step2Method: React.FC<StepProps> = ({
  data,
  currentEvaluation,
  updateEvaluation,
  addEvaluation,
  removeEvaluation
}) => {
  // Safe default for currentEvaluation to prevent crashes if props are missing during dev
  const safeCurrent = currentEvaluation || {
    professor: '',
    toneRespect: '',
    professionalPosture: 0,
    attention: '',
    correctionQuality: '',
    didactic: 0,
    adaptation: ''
  };

  const hasEvaluations = data.evaluations && data.evaluations.length > 0;

  return (
    <div className="space-y-6">

      {/* List of completed evaluations */}
      {hasEvaluations && (
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-serif font-bold text-white/80">Avaliações Adicionadas:</h3>
          {data.evaluations.map((evaluation, index) => (
            <GlassCard key={index} className="flex justify-between items-center py-4 px-6 border-l-4 border-live-green">
              <div>
                <h4 className="font-bold text-live-green text-lg">{evaluation.professor}</h4>
                <p className="text-sm text-gray-300">Avaliação registrada</p>
              </div>
              <button
                onClick={() => removeEvaluation && removeEvaluation(index)}
                className="p-2 text-red-400 hover:text-red-300 transition-colors bg-red-500/10 rounded-full hover:bg-red-500/20"
              >
                <Trash2 size={20} />
              </button>
            </GlassCard>
          ))}
          <div className="w-full h-px bg-white/10 my-6" />
        </div>
      )}

      {/* Current Evaluation Form */}
      <GlassCard>
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className="text-xl font-serif font-bold">
            {hasEvaluations ? 'Adicionar Outro Professor' : 'O Método'}
          </h2>
        </div>

        {/* Professor Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-live-green mb-2">Professor Responsável</label>
          <select
            value={safeCurrent.professor}
            onChange={(e) => updateEvaluation && updateEvaluation('professor', e.target.value)}
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
          selectedValue={safeCurrent.toneRespect}
          onChange={(val) => updateEvaluation && updateEvaluation('toneRespect', val)}
          options={[
            { value: '1', label: 'Invasivo (1)' },
            { value: '3', label: 'Regular (3)' },
            { value: '5', label: 'Acolhedor (5)' },
          ]}
        />

        {/* 4. Professional Posture */}
        <StarRating
          label="4. Postura Profissional"
          value={safeCurrent.professionalPosture}
          onChange={(val) => updateEvaluation && updateEvaluation('professionalPosture', val)}
        />

        {/* 5. Full Attention */}
        <RadioGroup
          label="5. Atenção Plena"
          selectedValue={safeCurrent.attention}
          onChange={(val) => updateEvaluation && updateEvaluation('attention', val)}
          options={[
            { value: '1', label: 'Distraído (1)' },
            { value: '3', label: 'Médio (3)' },
            { value: '5', label: 'Foco Total (5)' },
          ]}
        />

        {/* 6. Correction Quality */}
        <RadioGroup
          label="6. Qualidade das Correções"
          selectedValue={safeCurrent.correctionQuality}
          onChange={(val) => updateEvaluation && updateEvaluation('correctionQuality', val)}
          options={[
            { value: '1', label: 'Não corrige (1)' },
            { value: '3', label: 'Básico (3)' },
            { value: '5', label: 'Excelente (5)' },
          ]}
        />

        {/* 7. Didactics */}
        <StarRating
          label="7. Didática de Ensino"
          value={safeCurrent.didactic}
          onChange={(val) => updateEvaluation && updateEvaluation('didactic', val)}
        />

        {/* 8. Adaptation Capacity */}
        <RadioGroup
          label="8. Capacidade de Adaptação"
          selectedValue={safeCurrent.adaptation}
          onChange={(val) => updateEvaluation && updateEvaluation('adaptation', val)}
          options={[
            { value: '1', label: 'Não adapta (1)' },
            { value: '3', label: 'Adapta se pedir (3)' },
            { value: '5', label: 'Proativo (5)' },
          ]}
        />

        {/* Add Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={addEvaluation}
            disabled={!safeCurrent.professor}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus size={18} />
            <span>Salvar Avaliação do Professor</span>
          </button>
        </div>

      </GlassCard>
    </div>
  );
};