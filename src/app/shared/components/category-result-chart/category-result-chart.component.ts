import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CategoryResult } from '../../../core/models/exam.model';

@Component({
  selector: 'app-category-result-chart',
  templateUrl: './category-result-chart.component.html',
  styleUrls: ['./category-result-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryResultChartComponent {
  @Input() categoryResults: CategoryResult[] = [];

  trackByCategory(index: number, item: CategoryResult): string {
    return item.categoryId;
  }

  getBarColor(percentage: number): string {
    if (percentage >= 70) { return '#107c10'; }
    if (percentage >= 50) { return '#ffb900'; }
    return '#d13438';
  }
}
