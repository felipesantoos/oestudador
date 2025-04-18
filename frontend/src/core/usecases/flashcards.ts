import { FlashcardService } from '../ports/services';
import { NoteRepository } from '../ports/repositories';
import { NoteType, Note, CardInstance, CardReview } from '../domain/entities/note';

export class FlashcardsUseCase {
  constructor(
    private flashcardService: FlashcardService,
    private noteRepository: NoteRepository
  ) {}

  async createNoteType(noteTypeData: Omit<NoteType, 'id' | 'createdAt' | 'updatedAt'>): Promise<NoteType> {
    return this.flashcardService.createNoteType(noteTypeData);
  }

  async getUserNoteTypes(userId: string): Promise<NoteType[]> {
    // This would need to be implemented in the repository
    const notes = await this.noteRepository.findByUserId(userId);
    // We'd need to extract the unique note types here or create a specific repository method
    return [] as NoteType[]; // Placeholder
  }

  async createNote(noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    return this.flashcardService.createNote(noteData);
  }

  async getUserNotes(userId: string): Promise<Note[]> {
    return this.noteRepository.findByUserId(userId);
  }

  async getCardsForReview(userId: string, limit?: number): Promise<CardInstance[]> {
    return this.flashcardService.getCardsForReview(userId, limit);
  }

  async recordReview(reviewData: Omit<CardReview, 'id' | 'reviewedAt'>): Promise<CardReview> {
    return this.flashcardService.recordReview(reviewData);
  }
}