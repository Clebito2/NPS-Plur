import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { SurveyData, TeacherEvaluation } from './types';
import { submitSurvey } from './services/firebase';

// Components
import { Step1NPS } from './components/Step1NPS';
import { Step2Method } from './components/Step2Method';
import { Step3Environment } from './components/Step3Environment';
import { Step4Ecosystem } from './components/Step4Ecosystem';
import { GlassCard } from './components/UIComponents';
import { AdminDashboard } from './components/AdminDashboard';

const App: React.FC = () => {
  // --- STATE ---
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin State
  const [showAdmin, setShowAdmin] = useState(false);
  const [secretClickCount, setSecretClickCount] = useState(0);

  const initialEvaluation: TeacherEvaluation = {
    professor: '',
    toneRespect: '',
    professionalPosture: 0,
    attention: '',
    correctionQuality: '',
    didactic: 0,
    adaptation: '',
    compliment: ''
  };

  const [currentEvaluation, setCurrentEvaluation] = useState<TeacherEvaluation>(initialEvaluation);

  const [formData, setFormData] = useState<SurveyData>({
    npsScore: null,
    npsReason: '',
    evaluations: [],
    musicAtmosphere: '',
    musicSuggestion: '',
    cleanliness: 0,
    ecosystem: []
  });

  // --- ACTIONS ---
  const updateData = (field: keyof SurveyData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateCurrentEvaluation = (field: keyof TeacherEvaluation, value: any) => {
    setCurrentEvaluation(prev => ({ ...prev, [field]: value }));
  };

  const handleAddEvaluation = () => {
    // Only add if at least professor is selected
    if (!currentEvaluation.professor) return;

    setFormData(prev => ({
      ...prev,
      evaluations: [...prev.evaluations, currentEvaluation]
    }));
    setCurrentEvaluation(initialEvaluation);
  };

  const handleRemoveEvaluation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      evaluations: prev.evaluations.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    // Basic validation for Step 1
    if (currentStep === 1 && formData.npsScore === null) return;

    // Validation for Step 2
    if (currentStep === 2) {
      // If there's pending data in the form, add it automatically
      if (currentEvaluation.professor) {
        handleAddEvaluation();
      } else if (formData.evaluations.length === 0) {
        // If no evaluations added and form is empty, prevent next
        return;
      }
      // If we added the evaluation, we're good to go. The state update is async but logic holds for next render or effect, 
      // strict sequential logic here might need useEffect or simply checking logic:
      // However since React state updates are batched/async, the safest way is:

      // Check: either we have items in the list OR we have a valid current entry to push
      const hasItems = formData.evaluations.length > 0;
      const hasCurrent = !!currentEvaluation.professor;

      if (!hasItems && !hasCurrent) return;

      // If we have current, it will be added. But handleAddEvaluation relies on state.
      // Let's modify handleNext to handle this explicitly for safety
      if (hasCurrent) {
        setFormData(prev => ({
          ...prev,
          evaluations: [...prev.evaluations, currentEvaluation]
        }));
        setCurrentEvaluation(initialEvaluation);
      }
    }

    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await submitSurvey(formData);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Submission Error:", err);
      setError("Houve um erro ao enviar suas respostas. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSecretClick = () => {
    setSecretClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 5) {
        setShowAdmin(true);
        return 0;
      }
      return newCount;
    });

    // Reset counter if user stops clicking
    setTimeout(() => setSecretClickCount(0), 2000);
  };

  // --- VALIDATION HELPERS ---
  const isStep1Valid = formData.npsScore !== null;
  // Step 2 is valid if we have saved evaluations OR the current form is filled (professor selected)
  const isStep2Valid = formData.evaluations.length > 0 || !!currentEvaluation.professor;

  // --- RENDER ---

  if (showAdmin) {
    return (
      <div className="min-h-screen relative font-sans text-white p-4">
        {/* Background reused */}
        <div className="fixed inset-0 z-[-1]">
          <img
            src="https://raw.githubusercontent.com/Clebito2/Plur/main/PLUR%20Movimento-06.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#06192a]/95 mix-blend-multiply" />
        </div>
        <div className="max-w-4xl mx-auto">
          <AdminDashboard onBack={() => setShowAdmin(false)} />
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        {/* Background */}
        <div className="fixed inset-0 z-[-1]">
          <img
            src="https://raw.githubusercontent.com/Clebito2/Plur/main/PLUR%20Movimento-06.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#06192a]/80 mix-blend-multiply" />
        </div>

        <GlassCard className="max-w-md w-full text-center py-12 animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <img
              src="https://raw.githubusercontent.com/Clebito2/Plur/main/PLUR%20Movimento-03.png"
              alt="PLUR Logo"
              className="h-16 object-contain"
            />
          </div>
          <h2 className="text-3xl font-serif font-bold text-live-green mb-4">Obrigado!</h2>
          <p className="text-lg text-white/90">
            Sua voz fortalece o nosso movimento.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 text-sm text-live-green hover:underline"
          >
            Voltar ao início
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative font-sans text-white pb-20">
      {/* Background */}
      <div className="fixed inset-0 z-[-1]">
        <img
          src="https://raw.githubusercontent.com/Clebito2/Plur/main/PLUR%20Movimento-06.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#06192a]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06192a] via-transparent to-transparent opacity-90" />
      </div>

      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-2xl mx-auto">
        <div onClick={handleSecretClick} className="cursor-pointer transition-opacity hover:opacity-100 opacity-80 select-none">
          <img src="https://raw.githubusercontent.com/Clebito2/layout/main/Logo live oficial-36.png" alt="Live Logo" className="h-8 md:h-10" />
        </div>
        <img src="https://raw.githubusercontent.com/Clebito2/Plur/main/PLUR%20Movimento-03.png" alt="PLUR Logo" className="h-10 md:h-12" />
      </header>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto px-6 mb-8">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-live-green transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium tracking-wide">
          <span>AVALIAÇÃO</span>
          <span>PASSO {currentStep} DE 4</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 relative z-10">

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-xl mb-6 backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="transition-all duration-300 ease-in-out">
          {currentStep === 1 && <Step1NPS data={formData} updateData={updateData} />}
          {currentStep === 2 && (
            <Step2Method
              data={formData}
              updateData={updateData}
              currentEvaluation={currentEvaluation}
              updateEvaluation={updateCurrentEvaluation}
              addEvaluation={handleAddEvaluation}
              removeEvaluation={handleRemoveEvaluation}
            />
          )}
          {currentStep === 3 && <Step3Environment data={formData} updateData={updateData} />}
          {currentStep === 4 && <Step4Ecosystem data={formData} updateData={updateData} />}
        </div>
      </main>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#06192a]/90 backdrop-blur-lg border-t border-white/5 p-4 z-50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">

          {/* Back Button */}
          <button
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
            className={`
              flex items-center text-gray-400 font-medium px-4 py-2 rounded-lg transition-colors
              ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'hover:text-white'}
            `}
          >
            <ChevronLeft size={20} className="mr-1" />
            Voltar
          </button>

          {/* Next/Submit Button */}
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={(currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)}
              className={`
                flex items-center bg-live-green text-[#06192a] px-6 py-3 rounded-xl font-bold transition-all
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00c200] active:scale-95 shadow-[0_0_20px_rgba(0,232,0,0.2)]
              `}
            >
              Próximo
              <ChevronRight size={20} className="ml-1" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`
                flex items-center justify-center bg-live-green text-[#06192a] px-8 py-3 rounded-xl font-bold transition-all min-w-[140px]
                hover:bg-[#00c200] active:scale-95 shadow-[0_0_20px_rgba(0,232,0,0.3)]
              `}
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Enviar'}
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default App;