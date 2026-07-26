import { Injectable } from '@angular/core';
import { ExamAttempt, StoredProgress } from '../models/exam.model';

const ATTEMPT_PREFIX = 'az_cert_attempt_';
const PROGRESS_PREFIX = 'az_cert_progress_';
const HISTORY_PREFIX = 'az_cert_history_';

@Injectable({
  providedIn: 'root'
})
export class ExamStorageService {

  // ── Attempts ──────────────────────────────────────────────────────────────

  saveAttempt(attempt: ExamAttempt): void {
    try {
      localStorage.setItem(ATTEMPT_PREFIX + attempt.id, JSON.stringify(attempt));
    } catch (e) {
      console.warn('No se pudo guardar el intento en localStorage', e);
    }
  }

  getAttempt(attemptId: string): ExamAttempt | null {
    try {
      const raw = localStorage.getItem(ATTEMPT_PREFIX + attemptId);
      return raw ? JSON.parse(raw) as ExamAttempt : null;
    } catch {
      return null;
    }
  }

  getPendingAttempt(certificationId: string): ExamAttempt | null {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(ATTEMPT_PREFIX));
      for (const key of keys) {
        const raw = localStorage.getItem(key);
        if (!raw) { continue; }
        const attempt = JSON.parse(raw) as ExamAttempt;
        if (attempt.certificationId === certificationId && !attempt.isCompleted) {
          return attempt;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  getCompletedAttempts(certificationId: string): ExamAttempt[] {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(ATTEMPT_PREFIX));
      return keys
        .map(key => {
          const raw = localStorage.getItem(key);
          return raw ? JSON.parse(raw) as ExamAttempt : null;
        })
        .filter(
          (a): a is ExamAttempt =>
            a !== null && a.certificationId === certificationId && a.isCompleted
        );
    } catch {
      return [];
    }
  }

  deleteAttempt(attemptId: string): void {
    localStorage.removeItem(ATTEMPT_PREFIX + attemptId);
  }

  deletePendingAttempts(certificationId: string): void {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(ATTEMPT_PREFIX));
    keys.forEach(key => {
      const raw = localStorage.getItem(key);
      if (!raw) { return; }
      try {
        const attempt = JSON.parse(raw) as ExamAttempt;
        if (attempt.certificationId === certificationId && !attempt.isCompleted) {
          localStorage.removeItem(key);
        }
      } catch { /* ignore */ }
    });
  }

  // ── Progress / Statistics ─────────────────────────────────────────────────

  getProgress(certificationId: string): StoredProgress | null {
    try {
      const raw = localStorage.getItem(PROGRESS_PREFIX + certificationId);
      return raw ? JSON.parse(raw) as StoredProgress : null;
    } catch {
      return null;
    }
  }

  saveProgress(progress: StoredProgress): void {
    try {
      localStorage.setItem(PROGRESS_PREFIX + progress.certificationId, JSON.stringify(progress));
    } catch (e) {
      console.warn('No se pudo guardar el progreso', e);
    }
  }

  updateProgressAfterAttempt(certificationId: string, score: number, attemptId: string): void {
    const current = this.getProgress(certificationId);
    const completed = (current ? current.completedAttempts : 0) + 1;
    const best = current ? Math.max(current.bestScore, score) : score;

    this.saveProgress({
      certificationId,
      lastAttemptId: attemptId,
      completedAttempts: completed,
      bestScore: best,
      lastActivityAt: new Date().toISOString()
    });
  }

  // ── History ───────────────────────────────────────────────────────────────

  getHistory(certificationId: string): { attemptId: string; score: number; date: string }[] {
    try {
      const raw = localStorage.getItem(HISTORY_PREFIX + certificationId);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  addHistoryEntry(certificationId: string, attemptId: string, score: number): void {
    try {
      const history = this.getHistory(certificationId);
      history.push({ attemptId, score, date: new Date().toISOString() });
      // Keep only last 20 entries
      const trimmed = history.slice(-20);
      localStorage.setItem(HISTORY_PREFIX + certificationId, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('No se pudo guardar el historial', e);
    }
  }

  generateAttemptId(): string {
    return 'attempt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
