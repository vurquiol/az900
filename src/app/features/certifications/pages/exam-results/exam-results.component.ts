import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExamAttempt } from '../../../../core/models/exam.model';
import { CertificationDataService } from '../../../../core/services/certification-data.service';
import { ExamStorageService } from '../../../../core/services/exam-storage.service';
import { Certification, CertificationCategory } from '../../../../core/models/certification.model';

@Component({
  selector: 'app-exam-results',
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results.component.scss']
})
export class ExamResultsComponent implements OnInit, OnDestroy {

  attempt: ExamAttempt | null = null;
  certification: Certification | null = null;
  categories: CertificationCategory[] = [];
  isLoading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private certDataService: CertificationDataService,
    private storageService: ExamStorageService
  ) {}

  ngOnInit(): void {
    const certId = this.route.snapshot.paramMap.get('certificationId');
    const attemptId = this.route.snapshot.paramMap.get('attemptId');

    if (certId && attemptId) {
      this.attempt = this.storageService.getAttempt(attemptId);

      this.certDataService.getCertificationData(certId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          ({ certification, categories }: { certification: Certification; categories: CertificationCategory[]; questions: any[] }) => {
            this.certification = certification;
            this.categories = categories;
            this.isLoading = false;
          },
          (err: any) => {
            this.error = typeof err === 'string' ? err : 'Error al cargar.';
            this.isLoading = false;
          }
        );
    }
  }

  reviewAnswers(): void {
    if (this.certification && this.attempt) {
      this.router.navigate([
        '/certifications', this.certification.id, 'review', this.attempt.id
      ]);
    }
  }

  retry(): void {
    if (this.certification) {
      this.router.navigate(['/certifications', this.certification.id, 'exam'], {
        queryParams: { mode: 'full', count: 0, shuffle: true }
      });
    }
  }

  goToCertification(): void {
    if (this.certification) {
      this.router.navigate(['/certifications', this.certification.id]);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
