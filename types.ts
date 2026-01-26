export interface TeacherEvaluation {
  professor: string;
  toneRespect: string; // 1, 3, 5
  professionalPosture: number; // 1-5 stars
  attention: string; // 1, 3, 5
  correctionQuality: string; // 1, 3, 5
  didactic: number; // 1-5 stars
  adaptation: string; // 1, 3, 5
}

export interface SurveyData {
  // Module 1: NPS Global
  npsScore: number | null;
  npsReason: string;

  // Module 2: The Method (Multi-teacher)
  evaluations: TeacherEvaluation[];

  // Module 3: Environment
  musicAtmosphere: string; // Radio
  musicSuggestion: string;
  cleanliness: number; // 1-5 stars

  // Module 4: Ecosystem
  ecosystem: string[]; // Checkboxes
}

export interface SurveyResponse extends SurveyData {
  id: string;
  submittedAt: any; // Firebase Timestamp
  platform?: string;
  userAgent?: string;
}

export type SurveyField = keyof SurveyData;

export interface StepProps {
  data: SurveyData;
  updateData: (field: keyof SurveyData, value: any) => void;
  // Specific for Step 2
  currentEvaluation?: TeacherEvaluation;
  updateEvaluation?: (field: keyof TeacherEvaluation, value: any) => void;
  addEvaluation?: () => void;
  removeEvaluation?: (index: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  isSubmitting?: boolean;
}