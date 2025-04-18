export interface NoteType {
  id: string;
  userId: string;
  name: string;
  isCloze: boolean;
  templateFront: string;
  templateBack: string;
  css?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  userId: string;
  noteTypeId: string;
  fields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NoteField {
  id: string;
  noteTypeId: string;
  name: string;
  fieldOrder: number;
  required: boolean;
  createdAt: string;
}

export interface CardInstance {
  id: string;
  noteId: string;
  cardOrdinal: number;
  queue: number;
  type: number;
  due?: number;
  interval?: number;
  factor?: number;
  reps?: number;
  lapses?: number;
  lastReviewed?: string;
  nextReview?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardReview {
  id: string;
  cardInstanceId: string;
  userId: string;
  ease: number;
  timeTakenMs?: number;
  reviewedAt: string;
}