import { AccessToken } from '../models/access-token';

export class Participant {
    barcode: string;
    department: string;
    email: string;
    familyName: string;
    givenName: string;
    id: string;
    isActive: boolean;
    participantGroupId: string;
    participantGroup: string;
    position: string;
    teamId: string;
    username: string;
    accessToken?: AccessToken;
}
