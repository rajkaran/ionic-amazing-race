import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, flatMap } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable'
import { of } from "rxjs/observable/of";


import { DatastoreProvider } from '../datastore/datastore';
import { Participant } from '../../models/participant';
import { Quiz } from '../../models/quiz';
import { Team } from '../../models/team';

@Injectable()
export class LoginUtilProvider {

    constructor(private datastoreProvider: DatastoreProvider) { }

    /* Params:
     *      quizzes Quiz[]
     * Quizzes' participantGroup is an array. Loopback doesn't support querying
     * on array. For that we have to yuse like operator which can result into
     * multiple matches. This method loops through query result and filters out
     * unwanted quizzes.
     */
    confirmQuizzes(quizzes: Quiz[]): Observable<Quiz[]>{
        let quizList: Quiz[] = [],
            errorObj = {error:{ error: { message: '' }}, status: 404};

        if(quizzes.length > 0){
            return this.datastoreProvider.getKeyValuePair('participant')
            .pipe(
                map( (participant: Participant) =>{

                    for(let i = 0, len = quizzes.length; i < len; i++){
                        let match = quizzes[i].participantGroup
                            .indexOf(participant.participantGroup)

                        if(match !== -1){ quizList.push(quizzes[i]); }
                    }

                    return quizList;
                })
            )
        }
        else{
            errorObj.error.error.message = 'No quiz has been assigned to Participant.';
            return ErrorObservable.create(errorObj);
        }
    }

    /* Params:
     *      quizzes Quiz[]
     * Quizzes also consist bonus questions. Here we make sure that only
     * bonus questions are listed.
     */
    confirmBonus(quizzes: Quiz[]): Observable<Quiz[]>{
        let quizList: Quiz[] = [],
            errorObj = {error:{ error: { message: '' }}, status: 404};

        if(quizzes.length > 0){
            return this.datastoreProvider.getKeyValuePair('participant')
            .pipe(
                map( (participant: Participant) =>{

                    for(let i = 0, len = quizzes.length; i < len; i++){
                        console.log('sjkffhdjkf', quizzes[i])
                    }

                    return quizList;
                })
            )
        }
        else{
            errorObj.error.error.message = 'No quiz has been assigned to Participant.';
            return ErrorObservable.create(errorObj);
        }
    }

    /* Params:
     *      teams Team[]
     * Team' department property is an array. Loopback doesn't support querying
     * on array property. For that we have to use like operator which can
     * result into multiple matches. This method loops through query result
     * and makes sure participant belongs to only one team.
     */
    confirmTeams(teams: Team[]): Observable<ErrorObservable | Team>{
        let teamList: Team[] = [],
            errorObj = {error:{ error: { message: '' }}, status: 404};

        if(teams.length > 0){
            return this.datastoreProvider.getKeyValuePair('participant')
            .pipe(
                flatMap( (participant: Participant) =>{

                    for(let i = 0, len = teams.length; i < len; i++){
                        let match = teams[i].department
                            .indexOf(participant.department)

                        if(match !== -1){ teamList.push(teams[i]); }
                    }

                    if(teamList.length > 0){ return of(teamList[0]); }
                    else{
                        errorObj.error.error.message = participant.givenName
                            +' '+ participant.familyName+' has no team.';

                        return ErrorObservable.create(errorObj);
                    }
                })
            );
        }
        else{
            errorObj.error.error.message = 'Participant is not a member of any team.';
            return ErrorObservable.create(errorObj);
        }
    }

}
