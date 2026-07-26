import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Certification, CertificationCategory } from '../models/certification.model';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class CertificationDataService {

  private readonly catalogPath = 'assets/data/certifications.json';

  constructor(private http: HttpClient) {}

  getCertifications(): Observable<Certification[]> {
    return this.http.get<Certification[]>(this.catalogPath).pipe(
      catchError(err => throwError('No se pudo cargar el catálogo de certificaciones. ' + err.message))
    );
  }

  getCertificationById(id: string): Observable<Certification> {
    return this.getCertifications().pipe(
      map((list: Certification[]) => {
        const cert = list.find((c: Certification) => c.id === id);
        if (!cert) {
          throw new Error(`Certificación '${id}' no encontrada.`);
        }
        return cert;
      }),
      catchError(err => throwError(err))
    );
  }

  getCategories(certification: Certification): Observable<CertificationCategory[]> {
    return this.http.get<CertificationCategory[]>(certification.categoryFile).pipe(
      map((cats: CertificationCategory[]) => cats.sort((a, b) => a.order - b.order)),
      catchError(err => throwError('No se pudieron cargar las categorías. ' + err.message))
    );
  }

  getQuestions(certification: Certification): Observable<Question[]> {
    return this.http.get<Question[]>(certification.questionFile).pipe(
      catchError(err => throwError('No se pudieron cargar las preguntas. ' + err.message))
    );
  }

  getCertificationData(certificationId: string): Observable<{
    certification: Certification;
    categories: CertificationCategory[];
    questions: Question[];
  }> {
    return this.getCertificationById(certificationId).pipe(
      switchMap((cert: Certification) => forkJoin({
        categories: this.getCategories(cert),
        questions: this.getQuestions(cert)
      }).pipe(
        map(({ categories, questions }) => ({ certification: cert, categories, questions }))
      )),
      catchError(err => throwError(err))
    );
  }
}
