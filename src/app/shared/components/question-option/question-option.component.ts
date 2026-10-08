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
  @Input() index = 0;
  @Input() type: QuestionType = 'single';
  @Input() selected = false;
  @Input() disabled = false;
  @Input() showResult = false;
  @Input() isCorrect = false;
  @Output() optionToggle = new EventEmitter<string>();

  get label(): string {
    return String.fromCharCode(65 + this.index); // A, B, C, D...
  }

  onSelect(): void {
    if (!this.disabled) {
      this.optionToggle.emit(this.option.id);
    }
  }
}
