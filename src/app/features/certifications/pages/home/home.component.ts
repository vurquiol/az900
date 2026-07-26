import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Certification } from '../../../../core/models/certification.model';
import { Question } from '../../../../core/models/question.model';
import { CertificationDataService } from '../../../../core/services/certification-data.service';

interface CertificationWithCount {
  certification: Certification;
  questionCount: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  certifications: CertificationWithCount[] = [];
  isLoading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private certDataService: CertificationDataService) {}

  ngOnInit(): void {
    this.loadCertifications();
  }

  private loadCertifications(): void {
    this.isLoading = true;
    this.certDataService.getCertifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        certs => {
          // Load question counts for enabled certifications
          const enabled = certs.filter(c => c.enabled);
          const disabled = certs.filter(c => !c.enabled);

          if (enabled.length === 0) {
            this.certifications = disabled.map(c => ({ certification: c, questionCount: 0 }));
            this.isLoading = false;
            return;
          }

          let loaded = 0;
          const withCounts: CertificationWithCount[] = [];

          enabled.forEach(cert => {
            this.certDataService.getQuestions(cert)
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                (questions: Question[]) => {
                  withCounts.push({ certification: cert, questionCount: questions.length });
                  loaded++;
                  if (loaded === enabled.length) {
                    const all = [
                      ...withCounts.sort((a, b) => a.certification.code.localeCompare(b.certification.code)),
                      ...disabled.map(c => ({ certification: c, questionCount: 0 }))
                    ];
                    this.certifications = all;
                    this.isLoading = false;
                  }
                },
                () => {
                  withCounts.push({ certification: cert, questionCount: 0 });
                  loaded++;
                  if (loaded === enabled.length) {
                    this.certifications = [
                      ...withCounts,
                      ...disabled.map(c => ({ certification: c, questionCount: 0 }))
                    ];
                    this.isLoading = false;
                  }
                }
              );
          });
        },
        err => {
          this.error = err;
          this.isLoading = false;
        }
      );
  }

  trackByCertId(index: number, item: CertificationWithCount): string {
    return item.certification.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
