export interface Certification {
  id: string;
  code: string;
  name: string;
  description: string;
  level: string;
  enabled: boolean;
  categoryFile: string;
  questionFile: string;
  studyUrl?: string;
  studyFile?: string;
}

export interface CertificationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}
