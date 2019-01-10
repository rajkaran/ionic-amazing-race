import { Injectable } from '@angular/core';

import { CommunicateServerProvider } from '../communicate-server/communicate-server';
import { environment } from '../../environments/environment';
import { AccessToken } from '../../models/access-token';

@Injectable()
export class LoginProvider {

    constructor(public communicateServerProvider: CommunicateServerProvider) { }

    /* Authenticate participant on the basis of QR code. */
    fetchParticipant(qrCode: string){
        let url = environment.api_url+'/Participants/authenticate/'+qrCode;
        return this.communicateServerProvider.fetch(url)
    }

    /* Fetch quizzes that has given participantGroup with their active
     * sections and questions.
     */
    fetchQuiz(participantGroup: string, token: AccessToken){
        let url = environment.api_url+'/Quizzes',
            filter = {
                "where": {"and": [
                    {"isActive": true},
                    {"participantGroup": {"like": "%25"+participantGroup+"%25"}}
                ]},
                "include": { "relation": "sections",
                    "scope": { "where": { "isActive": true},
                        "include":{
                            "relation": "questions",
                            "scope":{ "where": { "isActive": true} }
                        }
                    }
                }
            };

        url += '?filter='+JSON.stringify(filter)+'&access_token='+token.id;

        return this.communicateServerProvider.fetch(url);
    }

    /* Fetch teams that has given deaprtment */
    fetchTeam(department: string, token: AccessToken){
        let url = environment.api_url+'/Teams',
            filter = {
                "where": {"and": [
                    {"isActive": true},
                    {"department": {"like": "%25"+department+"%25"}}
                ]},
            };

        url += '?filter='+JSON.stringify(filter)+'&access_token='+token.id;

        return this.communicateServerProvider.fetch(url);
    }

}
