import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Certification } from '../../../../core/models/certification.model';
import { StudySection } from '../../../../core/models/study.model';
import { CertificationDataService } from '../../../../core/services/certification-data.service';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit, OnDestroy {

  certification: Certification | null = null;
  sections: StudySection[] = [];
  activeCategoryId: string | null = null;
  expandedTopicId: string | null = null;
  isLoading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private certDataService: CertificationDataService
  ) {}

  ngOnInit(): void {
    const certId = this.route.snapshot.paramMap.get('certificationId');
    if (certId) {
      this.loadData(certId);
    }
  }

  private loadData(certId: string): void {
    this.isLoading = true;
    this.certDataService.getStudyData(certId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ({ certification, sections }: { certification: Certification; sections: StudySection[] }) => {
          this.certification = certification;
          this.sections = sections;
          this.activeCategoryId = sections.length > 0 ? sections[0].categoryId : null;
          this.isLoading = false;
        },
        (err: any) => {
          this.error = typeof err === 'string' ? err : 'Error al cargar el material de estudio.';
          this.isLoading = false;
        }
      );
  }

  get activeSection(): StudySection | null {
    return this.sections.find(s => s.categoryId === this.activeCategoryId) || null;
  }

  selectCategory(categoryId: string): void {
    this.activeCategoryId = categoryId;
    this.expandedTopicId = null;
  }

  toggleTopic(topicId: string): void {
    this.expandedTopicId = this.expandedTopicId === topicId ? null : topicId;
  }

  goBack(): void {
    if (this.certification) {
      this.router.navigate(['/certifications', this.certification.id]);
    } else {
      this.router.navigate(['/']);
    }
  }

  trackByCategoryId(index: number, section: StudySection): string {
    return section.categoryId;
  }

  trackByTopicId(index: number, topic: { id: string }): string {
    return topic.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
