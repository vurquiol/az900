import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CertificationCategory } from '../../../core/models/certification.model';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryCardComponent {
  @Input() category: CertificationCategory;
  @Input() questionCount: number = 0;
  @Input() selectable: boolean = false;
  @Input() selected: boolean = false;
  @Output() selectedChange = new EventEmitter<boolean>();

  toggle(): void {
    if (this.selectable) {
      this.selected = !this.selected;
      this.selectedChange.emit(this.selected);
    }
  }
}
