export type QuestionType = 'single' | 'multiple';
export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  certificationId: string;
  categoryId: string;
  type: QuestionType;
  question: string;
  options: QuestionOption[];
  correctOptionIds: string[];
  explanation: string;
  difficulty: Difficulty;
  tags: string[];
}
