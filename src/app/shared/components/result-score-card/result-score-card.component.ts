import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ExamResult } from '../../../core/models/exam.model';

@Component({
  selector: 'app-result-score-card',
  templateUrl: './result-score-card.component.html',
  styleUrls: ['./result-score-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultScoreCardComponent {
  @Input() result: ExamResult;

  get motivationalMessage(): string {
    const pct = this.result ? this.result.scorePercentage : 0;
    if (pct >= 90) { return '¡Excelente! Estás listo para el examen real.'; }
    if (pct >= 70) { return '¡Aprobado! Sigue practicando para mejorar tu puntaje.'; }
    if (pct >= 50) { return 'Buen intento. Revisa las respuestas incorrectas y vuelve a intentar.'; }
    return 'Sigue estudiando. Cada intento te acerca más a la certificación.';
  }

  get scoreClass(): string {
    const pct = this.result ? this.result.scorePercentage : 0;
    if (pct >= 70) { return 'score--pass'; }
    return 'score--fail';
  }
}
