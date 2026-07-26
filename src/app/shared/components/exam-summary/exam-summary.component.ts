import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ExamAttempt } from '../../../core/models/exam.model';
import { Question } from '../../../core/models/question.model';
import { CertificationCategory } from '../../../core/models/certification.model';

@Component({
  selector: 'app-exam-summary',
  templateUrl: './exam-summary.component.html',
  styleUrls: ['./exam-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamSummaryComponent {
  @Input() attempt: ExamAttempt;
  @Input() questions: Question[] = [];
  @Input() categories: CertificationCategory[] = [];

  get answeredCount(): number {
    if (!this.attempt) { return 0; }
    return Object.values(this.attempt.answers)
      .filter(a => a.selectedOptionIds.length > 0).length;
  }

  get unansweredCount(): number {
    return this.questions.length - this.answeredCount;
  }

  getCategoryName(categoryId: string): string {
    const cat = this.categories.find(c => c.id === categoryId);
    return cat ? cat.name : categoryId;
  }
}
