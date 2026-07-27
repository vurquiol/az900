export interface StudyTopic {
  id: string;
  title: string;
  content: string;
  keyPoints?: string[];
}

export interface StudySection {
  categoryId: string;
  categoryName: string;
  icon: string;
  topics: StudyTopic[];
}
