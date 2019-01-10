import { Question } from '../models/question';

export class Section {
    id: string;
    name: string;
    ballots: number;
    isBonus: boolean;
    isActive: boolean;
    quizId: string;
    questions: Question[];
}
