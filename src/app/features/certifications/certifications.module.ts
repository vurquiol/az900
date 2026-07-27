import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CertificationsRoutingModule } from './certifications-routing.module';

import { HomeComponent } from './pages/home/home.component';
import { CertificationDetailComponent } from './pages/certification-detail/certification-detail.component';
import { ExamComponent } from './pages/exam/exam.component';
import { ExamResultsComponent } from './pages/exam-results/exam-results.component';
import { AnswerReviewComponent } from './pages/answer-review/answer-review.component';
import { StudyComponent } from './pages/study/study.component';

@NgModule({
  declarations: [
    HomeComponent,
    CertificationDetailComponent,
    ExamComponent,
    ExamResultsComponent,
    AnswerReviewComponent,
    StudyComponent
  ],
  imports: [
    SharedModule,
    CertificationsRoutingModule
  ]
})
export class CertificationsModule {}
