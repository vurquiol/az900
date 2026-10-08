import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Certification } from '../../../core/models/certification.model';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-certification-card',
    templateUrl: './certification-card.component.html',
    styleUrls: ['./certification-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink]
})
export class CertificationCardComponent {
  @Input() certification: Certification;
  @Input() questionCount = 0;
}
