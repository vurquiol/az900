import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ExamAnswer } from '../../../core/models/exam.model';

@Component({
  selector: 'app-question-navigation',
  templateUrl: './question-navigation.component.html',
  styleUrls: ['./question-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionNavigationComponent {
  @Input() questionIds: string[] = [];
  @Input() answers: { [questionId: string]: ExamAnswer } = {};
  @Input() currentIndex: number = 0;
  @Output() navigate = new EventEmitter<number>();

  goTo(index: number): void {
    this.navigate.emit(index);
  }

  isAnswered(questionId: string): boolean {
    const answer = this.answers[questionId];
    return answer != null && answer.selectedOptionIds.length > 0;
  }

  trackById(index: number, id: string): string {
    return id;
  }
}
