import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Certification, CertificationCategory } from '../../../../core/models/certification.model';
import { Question } from '../../../../core/models/question.model';
import { ExamAttempt, ExamConfiguration, ExamMode } from '../../../../core/models/exam.model';
import { CertificationDataService } from '../../../../core/services/certification-data.service';
import { ExamStateService, ExamState } from '../../../../core/services/exam-state.service';
import { ExamStorageService } from '../../../../core/services/exam-storage.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit, OnDestroy {

  state: ExamState | null = null;
  certification: Certification | null = null;
  showConfirmFinish = false;
  showSidebar = false;
  isLoading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private certDataService: CertificationDataService,
    private examStateService: ExamStateService,
    private storageService: ExamStorageService
  ) {}

  ngOnInit(): void {
    this.examStateService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(s => this.state = s);

    const certId = this.route.snapshot.paramMap.get('certificationId');
    const attemptId = this.route.snapshot.queryParamMap.get('attemptId');
    const mode = (this.route.snapshot.queryParamMap.get('mode') || 'full') as ExamMode;
    const categoryId = this.route.snapshot.queryParamMap.get('categoryId');
    const countParam = this.route.snapshot.queryParamMap.get('count');
    const count = countParam ? parseInt(countParam, 10) : 0;

    if (certId) {
      this.loadExam(certId, attemptId, mode, categoryId, count);
    }
  }

  private loadExam(
    certId: string,
    attemptId: string | null,
    mode: ExamMode,
    categoryId: string | null,
    count: number
  ): void {
    this.isLoading = true;
    this.certDataService.getCertificationData(certId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ({ certification, categories, questions }: { certification: Certification; categories: CertificationCategory[]; questions: Question[] }) => {
          this.certification = certification;

          if (attemptId) {
            // Resume existing attempt
            const attempt = this.storageService.getAttempt(attemptId);
            if (attempt && !attempt.isCompleted) {
              this.examStateService.resumeAttempt(attempt, questions, categories);
              this.isLoading = false;
              return;
            }
          }

          // Start new exam
          const config: ExamConfiguration = {
            certificationId: certId,
            mode,
            categoryIds: categoryId ? [categoryId] : [],
            questionCount: count,
            shuffle: true
          };
          this.examStateService.startExam(config, questions, categories);
          this.isLoading = false;
        },
        (err: any) => {
          this.error = typeof err === 'string' ? err : 'Error al cargar el examen.';
          this.isLoading = false;
        }
      );
  }

  get currentQuestion(): Question | null {
    if (!this.state || this.state.questions.length === 0) { return null; }
    return this.state.questions[this.state.currentIndex];
  }

  get currentCategory(): CertificationCategory | null {
    if (!this.state || !this.currentQuestion) { return null; }
    return this.state.categories.find(c => c.id === this.currentQuestion.categoryId) || null;
  }

  get selectedOptionIds(): string[] {
    if (!this.state || !this.currentQuestion) { return []; }
    const answer = this.state.attempt?.answers[this.currentQuestion.id];
    return answer ? answer.selectedOptionIds : [];
  }

  get answeredCount(): number {
    if (!this.state || !this.state.attempt) { return 0; }
    return Object.values(this.state.attempt.answers)
      .filter(a => a.selectedOptionIds.length > 0).length;
  }

  onOptionToggle(optionId: string): void {
    if (!this.currentQuestion) { return; }
    const current = [...this.selectedOptionIds];

    if (this.currentQuestion.type === 'single') {
      this.examStateService.saveAnswer(this.currentQuestion.id, [optionId]);
    } else {
      const idx = current.indexOf(optionId);
      if (idx >= 0) {
        current.splice(idx, 1);
      } else {
        current.push(optionId);
      }
      this.examStateService.saveAnswer(this.currentQuestion.id, current);
    }
  }

  isOptionSelected(optionId: string): boolean {
    return this.selectedOptionIds.includes(optionId);
  }

  goToQuestion(index: number): void {
    this.examStateService.goToQuestion(index);
    this.showSidebar = false;
  }

  nextQuestion(): void {
    this.examStateService.nextQuestion();
  }

  previousQuestion(): void {
    this.examStateService.previousQuestion();
  }

  requestFinish(): void {
    this.showConfirmFinish = true;
  }

  confirmFinish(): void {
    this.showConfirmFinish = false;
    const attempt = this.examStateService.finishExam();
    if (attempt && this.certification) {
      this.router.navigate([
        '/certifications', this.certification.id, 'results', attempt.id
      ]);
    }
  }

  cancelFinish(): void {
    this.showConfirmFinish = false;
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  goBack(): void {
    if (this.certification) {
      this.router.navigate(['/certifications', this.certification.id]);
    } else {
      this.router.navigate(['/']);
    }
  }

  trackByOption(index: number, option: { id: string }): string {
    return option.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
