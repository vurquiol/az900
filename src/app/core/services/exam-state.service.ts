import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExamAttempt, ExamAnswer, ExamConfiguration } from '../models/exam.model';
import { Question } from '../models/question.model';
import { CertificationCategory } from '../models/certification.model';
import { ExamStorageService } from './exam-storage.service';
import { QuestionService } from './question.service';

export interface ExamState {
  attempt: ExamAttempt | null;
  questions: Question[];
  categories: CertificationCategory[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: ExamState = {
  attempt: null,
  questions: [],
  categories: [],
  currentIndex: 0,
  isLoading: false,
  error: null
};

@Injectable({
  providedIn: 'root'
})
export class ExamStateService {

  private stateSubject = new BehaviorSubject<ExamState>(INITIAL_STATE);
  state$: Observable<ExamState> = this.stateSubject.asObservable();

  constructor(
    private storageService: ExamStorageService,
    private questionService: QuestionService
  ) {}

  get currentState(): ExamState {
    return this.stateSubject.getValue();
  }

  startExam(
    config: ExamConfiguration,
    allQuestions: Question[],
    categories: CertificationCategory[]
  ): ExamAttempt {
    const questions = this.questionService.filterQuestions(allQuestions, config);
    const attemptId = this.storageService.generateAttemptId();

    const attempt: ExamAttempt = {
      id: attemptId,
      certificationId: config.certificationId,
      configuration: config,
      questionIds: questions.map(q => q.id),
      answers: {},
      startedAt: new Date().toISOString(),
      finishedAt: null,
      isCompleted: false,
      result: null
    };

    this.storageService.saveAttempt(attempt);

    this.stateSubject.next({
      attempt,
      questions,
      categories,
      currentIndex: 0,
      isLoading: false,
      error: null
    });

    return attempt;
  }

  resumeAttempt(
    attempt: ExamAttempt,
    allQuestions: Question[],
    categories: CertificationCategory[]
  ): void {
    const questions = allQuestions.filter(q => attempt.questionIds.includes(q.id));
    // Preserve original order
    questions.sort(
      (a, b) => attempt.questionIds.indexOf(a.id) - attempt.questionIds.indexOf(b.id)
    );

    this.stateSubject.next({
      attempt,
      questions,
      categories,
      currentIndex: 0,
      isLoading: false,
      error: null
    });
  }

  saveAnswer(questionId: string, selectedOptionIds: string[]): void {
    const state = this.currentState;
    if (!state.attempt) { return; }

    const question = state.questions.find(q => q.id === questionId);
    if (!question) { return; }

    const isCorrect = this.questionService.validateAnswer(question, selectedOptionIds);

    const answer: ExamAnswer = {
      questionId,
      selectedOptionIds,
      isCorrect,
      answeredAt: new Date().toISOString()
    };

    const updatedAttempt: ExamAttempt = {
      ...state.attempt,
      answers: { ...state.attempt.answers, [questionId]: answer }
    };

    this.storageService.saveAttempt(updatedAttempt);
    this.stateSubject.next({ ...state, attempt: updatedAttempt });
  }

  goToQuestion(index: number): void {
    const state = this.currentState;
    if (index >= 0 && index < state.questions.length) {
      this.stateSubject.next({ ...state, currentIndex: index });
    }
  }

  nextQuestion(): void {
    const state = this.currentState;
    this.goToQuestion(state.currentIndex + 1);
  }

  previousQuestion(): void {
    const state = this.currentState;
    this.goToQuestion(state.currentIndex - 1);
  }

  finishExam(): ExamAttempt | null {
    const state = this.currentState;
    if (!state.attempt) { return null; }

    const result = this.questionService.calculateResult(
      state.questions,
      state.attempt.answers,
      state.categories
    );

    const finishedAttempt: ExamAttempt = {
      ...state.attempt,
      finishedAt: new Date().toISOString(),
      isCompleted: true,
      result
    };

    this.storageService.saveAttempt(finishedAttempt);
    this.storageService.updateProgressAfterAttempt(
      finishedAttempt.certificationId,
      result.scorePercentage,
      finishedAttempt.id
    );
    this.storageService.addHistoryEntry(
      finishedAttempt.certificationId,
      finishedAttempt.id,
      result.scorePercentage
    );

    this.stateSubject.next({ ...state, attempt: finishedAttempt });
    return finishedAttempt;
  }

  setLoading(loading: boolean): void {
    this.stateSubject.next({ ...this.currentState, isLoading: loading });
  }

  setError(error: string | null): void {
    this.stateSubject.next({ ...this.currentState, error, isLoading: false });
  }

  reset(): void {
    this.stateSubject.next(INITIAL_STATE);
  }
}
