import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { QuestionOption, QuestionType } from '../../../core/models/question.model';

@Component({
  selector: 'app-question-option',
  templateUrl: './question-option.component.html',
  styleUrls: ['./question-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionOptionComponent {
  @Input() option: QuestionOption;
  @Input() index: number = 0;
  @Input() type: QuestionType = 'single';
  @Input() selected: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showResult: boolean = false;
  @Input() isCorrect: boolean = false;
  @Output() toggle = new EventEmitter<string>();

  get label(): string {
    return String.fromCharCode(65 + this.index); // A, B, C, D...
  }

  onSelect(): void {
    if (!this.disabled) {
      this.toggle.emit(this.option.id);
    }
  }
}
