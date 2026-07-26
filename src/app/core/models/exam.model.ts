export type ExamMode = 'full' | 'category' | 'random';

export interface ExamConfiguration {
  certificationId: string;
  mode: ExamMode;
  categoryIds: string[];
  questionCount: number;
  shuffle: boolean;
}

export interface ExamAnswer {
  questionId: string;
  selectedOptionIds: string[];
  isCorrect: boolean;
  answeredAt: string;
}

export interface CategoryResult {
  categoryId: string;
  categoryName: string;
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
}

export interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  scorePercentage: number;
  categoryResults: CategoryResult[];
  passed: boolean;
}

export interface ExamAttempt {
  id: string;
  certificationId: string;
  configuration: ExamConfiguration;
  questionIds: string[];
  answers: { [questionId: string]: ExamAnswer };
  startedAt: string;
  finishedAt: string | null;
  isCompleted: boolean;
  result: ExamResult | null;
}

export interface StoredProgress {
  certificationId: string;
  lastAttemptId: string | null;
  completedAttempts: number;
  bestScore: number;
  lastActivityAt: string;
}
