import { Request, Response } from 'express';
import {
  internalHRNotesRepository,
  interviewerPanelsRepository,
  auditLogsRepository
} from '../repositories/index.ts';
import { sendSuccess, sendBadRequest, sendNotFound } from '../utils/response.ts';

export class NotesAndInterviewerController {
  public static async getInternalNotes(req: Request, res: Response): Promise<void> {
    const { candidateId } = req.params;
    const notes = await internalHRNotesRepository.findByField('candidateId', candidateId);
    sendSuccess(res, notes, 'Confidential HR notes retrieved.');
  }

  public static async createInternalNote(req: Request, res: Response): Promise<void> {
    const { candidateId } = req.params;
    const { note } = req.body;

    if (!note) {
      sendBadRequest(res, 'Note content is required.');
      return;
    }

    const noteId = 'note_' + Date.now();
    const newNote = {
      id: noteId,
      candidateId,
      authorId: req.user?.uid || 'admin',
      authorName: req.user?.displayName || 'Talent Acquisition Team',
      authorRole: req.user?.role || 'hr_admin',
      note,
      createdAt: new Date().toISOString()
    };

    await internalHRNotesRepository.create(noteId, newNote);

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'ADD_INTERNAL_NOTE',
      actorId: req.user?.uid || 'admin',
      actorRole: req.user?.role || 'admin',
      targetId: candidateId,
      details: 'Added confidential HR evaluation note'
    });

    sendSuccess(res, newNote, 'Internal note recorded.', 201);
  }

  public static async getInterviewers(req: Request, res: Response): Promise<void> {
    const interviewers = await interviewerPanelsRepository.findAll(100);
    sendSuccess(res, interviewers, 'Interviewer panel roster retrieved.');
  }

  public static async addInterviewer(req: Request, res: Response): Promise<void> {
    const body = req.body;
    if (!body.name || !body.email || !body.role) {
      sendBadRequest(res, 'name, email, and role are required fields.');
      return;
    }

    const intId = 'int_' + Date.now().toString(36);
    const newInt = {
      ...body,
      id: intId,
      activeInterviewsCount: 0,
      createdAt: new Date().toISOString()
    };

    await interviewerPanelsRepository.create(intId, newInt);
    sendSuccess(res, newInt, 'Interviewer panelist added successfully.', 201);
  }
}
