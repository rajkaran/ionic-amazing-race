import { Section } from '../models/section';

export class Quiz {
    id: string;
    name: string;
    participantGroup: string[];
    colorCode: string;
    sectionId: string;
    isActive: boolean;
    sections: Section[];
}
