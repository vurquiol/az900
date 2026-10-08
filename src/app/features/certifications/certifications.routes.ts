import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CertificationDetailComponent } from './pages/certification-detail/certification-detail.component';
import { ExamComponent } from './pages/exam/exam.component';
import { ExamResultsComponent } from './pages/exam-results/exam-results.component';
import { AnswerReviewComponent } from './pages/answer-review/answer-review.component';
import { StudyComponent } from './pages/study/study.component';

export const CERTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'certifications/:certificationId',
    component: CertificationDetailComponent
  },
  {
    path: 'certifications/:certificationId/study',
    component: StudyComponent
  },
  {
    path: 'certifications/:certificationId/exam',
    component: ExamComponent
  },
  {
    path: 'certifications/:certificationId/results/:attemptId',
    component: ExamResultsComponent
  },
  {
    path: 'certifications/:certificationId/review/:attemptId',
    component: AnswerReviewComponent
  }
];
