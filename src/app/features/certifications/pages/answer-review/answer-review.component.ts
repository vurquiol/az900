import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Certification, CertificationCategory } from '../../../../core/models/certification.model';
import { Question } from '../../../../core/models/question.model';
import { ExamAttempt } from '../../../../core/models/exam.model';
import { CertificationDataService } from '../../../../core/services/certification-data.service';
import { ExamStorageService } from '../../../../core/services/exam-storage.service';

@Component({
  selector: 'app-answer-review',
  templateUrl: './answer-review.component.html',
  styleUrls: ['./answer-review.component.scss']
})
export class AnswerReviewComponent implements OnInit, OnDestroy {

  attempt: ExamAttempt | null = null;
  certification: Certification | null = null;
  categories: CertificationCategory[] = [];
  questions: Question[] = [];
  currentIndex = 0;
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
          ({ certification, categories, questions }: { certification: Certification; categories: CertificationCategory[]; questions: Question[] }) => {
            this.certification = certification;
            this.categories = categories;
            // Restore question order from attempt
            if (this.attempt) {
              this.questions = this.attempt.questionIds
                .map((id: string) => questions.find((q: Question) => q.id === id))
                .filter((q): q is Question => q !== undefined);
            } else {
              this.questions = questions;
            }
            this.isLoading = false;
          },
          (err: any) => {
            this.error = typeof err === 'string' ? err : 'Error al cargar.';
            this.isLoading = false;
          }
        );
    }
  }

  get currentQuestion(): Question | null {
    return this.questions[this.currentIndex] || null;
  }

  get currentCategory(): CertificationCategory | null {
    if (!this.currentQuestion) { return null; }
    return this.categories.find(c => c.id === this.currentQuestion!.categoryId) || null;
  }

  get selectedOptionIds(): string[] {
    if (!this.attempt || !this.currentQuestion) { return []; }
    const answer = this.attempt.answers[this.currentQuestion.id];
    return answer ? answer.selectedOptionIds : [];
  }

  isCorrectOption(optionId: string): boolean {
    return this.currentQuestion ? this.currentQuestion.correctOptionIds.includes(optionId) : false;
  }

  isSelectedOption(optionId: string): boolean {
    return this.selectedOptionIds.includes(optionId);
  }

  isCurrentAnswerCorrect(): boolean {
    if (!this.attempt || !this.currentQuestion) { return false; }
    const answer = this.attempt.answers[this.currentQuestion.id];
    return answer ? answer.isCorrect : false;
  }

  nextQuestion(): void {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  goToResults(): void {
    if (this.certification && this.attempt) {
      this.router.navigate([
        '/certifications', this.certification.id, 'results', this.attempt.id
      ]);
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
