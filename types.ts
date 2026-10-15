
export enum Category {
  MEERVOUDE = 'Meervoude',
  VERKLEINWOORDE = 'Verkleinwoorde',
  GESLAG = 'Geslag'
}

export type QuestionType = 'mcq' | 'text';

export interface Question {
  id: string;
  category: Category;
  word: string;
  answer: string;
  prompt: string;
  type: QuestionType;
  options?: string[];
}

export interface GameState {
  currentQuestionIndex: number;
  score: number;
  learnedCount: number;
  isFinished: boolean;
  status: 'idle' | 'playing' | 'finished';
  questions: Question[];
}
