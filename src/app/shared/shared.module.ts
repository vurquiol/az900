import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CertificationCardComponent } from './components/certification-card/certification-card.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { ExamProgressComponent } from './components/exam-progress/exam-progress.component';
import { QuestionNavigationComponent } from './components/question-navigation/question-navigation.component';
import { QuestionOptionComponent } from './components/question-option/question-option.component';
import { ExamSummaryComponent } from './components/exam-summary/exam-summary.component';
import { ResultScoreCardComponent } from './components/result-score-card/result-score-card.component';
import { CategoryResultChartComponent } from './components/category-result-chart/category-result-chart.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';

const COMPONENTS = [
  CertificationCardComponent,
  CategoryCardComponent,
  ExamProgressComponent,
  QuestionNavigationComponent,
  QuestionOptionComponent,
  ExamSummaryComponent,
  ResultScoreCardComponent,
  CategoryResultChartComponent,
  EmptyStateComponent,
  ConfirmationModalComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ...COMPONENTS,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {}
