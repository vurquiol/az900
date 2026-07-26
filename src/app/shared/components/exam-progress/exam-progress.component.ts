import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-exam-progress',
  templateUrl: './exam-progress.component.html',
  styleUrls: ['./exam-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamProgressComponent {
  @Input() current: number = 1;
  @Input() total: number = 1;
  @Input() answeredCount: number = 0;

  get percentage(): number {
    return this.total > 0 ? Math.round((this.current / this.total) * 100) : 0;
  }
}
