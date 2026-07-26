import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Certification } from '../../../core/models/certification.model';

@Component({
  selector: 'app-certification-card',
  templateUrl: './certification-card.component.html',
  styleUrls: ['./certification-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificationCardComponent {
  @Input() certification: Certification;
  @Input() questionCount: number = 0;
}
