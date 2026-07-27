import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Certification, CertificationCategory } from '../../../../core/models/certification.model';
import { Question } from '../../../../core/models/question.model';
import { ExamAttempt, StoredProgress } from '../../../../core/models/exam.model';
import { CertificationDataService } from '../../../../core/services/certification-data.service';
import { ExamStorageService } from '../../../../core/services/exam-storage.service';

@Component({
  selector: 'app-certification-detail',
  templateUrl: './certification-detail.component.html',
  styleUrls: ['./certification-detail.component.scss']
})
export class CertificationDetailComponent implements OnInit, OnDestroy {

  certification: Certification | null = null;
  categories: CertificationCategory[] = [];
  questions: Question[] = [];
  pendingAttempt: ExamAttempt | null = null;
  progress: StoredProgress | null = null;
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
    if (certId) {
      this.loadData(certId);
    }
  }

  private loadData(certId: string): void {
    this.isLoading = true;
    this.certDataService.getCertificationData(certId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ({ certification, categories, questions }: { certification: Certification; categories: CertificationCategory[]; questions: Question[] }) => {
          this.certification = certification;
          this.categories = categories;
          this.questions = questions;
          this.pendingAttempt = this.storageService.getPendingAttempt(certId);
          this.progress = this.storageService.getProgress(certId);
          this.isLoading = false;
        },
        (err: any) => {
          this.error = typeof err === 'string' ? err : 'Error al cargar los datos.';
          this.isLoading = false;
        }
      );
  }

  getQuestionCount(categoryId: string): number {
    return this.questions.filter(q => q.categoryId === categoryId).length;
  }

  goToStudy(): void {
    if (!this.certification) { return; }
    this.router.navigate(['/certifications', this.certification.id, 'study']);
  }

  startFullExam(): void {
    if (!this.certification) { return; }
    this.router.navigate(['/certifications', this.certification.id, 'exam'], {
      queryParams: { mode: 'full', count: 0, shuffle: true }
    });
  }

  startCategoryExam(categoryId: string): void {
    if (!this.certification) { return; }
    this.router.navigate(['/certifications', this.certification.id, 'exam'], {
      queryParams: { mode: 'category', categoryId, count: 0, shuffle: true }
    });
  }

  resumeAttempt(): void {
    if (!this.certification || !this.pendingAttempt) { return; }
    this.router.navigate(['/certifications', this.certification.id, 'exam'], {
      queryParams: { attemptId: this.pendingAttempt.id }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  trackByCategory(index: number, cat: CertificationCategory): string {
    return cat.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
