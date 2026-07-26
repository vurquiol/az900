import { Injectable } from '@angular/core';
import { Question, QuestionOption } from '../models/question.model';
import { ExamConfiguration, ExamAnswer, ExamResult, CategoryResult } from '../models/exam.model';
import { CertificationCategory } from '../models/certification.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  /** Fisher-Yates shuffle algorithm */
  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  filterQuestions(questions: Question[], config: ExamConfiguration): Question[] {
    let filtered = questions.filter(q => q.certificationId === config.certificationId);

    if (config.mode === 'category' && config.categoryIds.length > 0) {
      filtered = filtered.filter(q => config.categoryIds.includes(q.categoryId));
    }

    if (config.shuffle) {
      filtered = this.shuffle(filtered);
    }

    const count = config.questionCount === 0 ? filtered.length : config.questionCount;
    return filtered.slice(0, count);
  }

  shuffleOptions(question: Question): Question {
    return {
      ...question,
      options: this.shuffle(question.options)
    };
  }

  validateAnswer(question: Question, selectedOptionIds: string[]): boolean {
    if (question.type === 'single') {
      return (
        selectedOptionIds.length === 1 &&
        question.correctOptionIds.includes(selectedOptionIds[0])
      );
    }
    // Multiple: exactly matching correct options
    const correctSet = new Set(question.correctOptionIds);
    const selectedSet = new Set(selectedOptionIds);
    if (correctSet.size !== selectedSet.size) { return false; }
    for (const id of Array.from(correctSet)) {
      if (!selectedSet.has(id)) { return false; }
    }
    return true;
  }

  calculateResult(
    questions: Question[],
    answers: { [questionId: string]: ExamAnswer },
    categories: CertificationCategory[]
  ): ExamResult {
    const categoryMap: { [catId: string]: CategoryResult } = {};

    categories.forEach(cat => {
      categoryMap[cat.id] = {
        categoryId: cat.id,
        categoryName: cat.name,
        total: 0,
        correct: 0,
        incorrect: 0,
        percentage: 0
      };
    });

    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    questions.forEach(q => {
      const answer = answers[q.id];
      const catResult = categoryMap[q.categoryId];

      if (!answer || answer.selectedOptionIds.length === 0) {
        unanswered++;
        if (catResult) { catResult.total++; catResult.incorrect++; }
        return;
      }

      if (catResult) { catResult.total++; }

      if (answer.isCorrect) {
        correct++;
        if (catResult) { catResult.correct++; }
      } else {
        incorrect++;
        if (catResult) { catResult.incorrect++; }
      }
    });

    const total = questions.length;
    const scorePercentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    const categoryResults = Object.values(categoryMap)
      .filter(cr => cr.total > 0)
      .map(cr => ({
        ...cr,
        percentage: cr.total > 0 ? Math.round((cr.correct / cr.total) * 100) : 0
      }));

    return {
      totalQuestions: total,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      unanswered,
      scorePercentage,
      categoryResults,
      passed: scorePercentage >= 70
    };
  }

  getOptionLabel(option: QuestionOption, index: number): string {
    const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
    return labels[index] || String(index + 1);
  }
}
