import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from "rxjs/observable/of";

import { Clipboard } from '../../models/clipboard';
import { Quiz } from '../../models/quiz';


@Injectable()
export class ClipboardUtilProvider {

    constructor() {}

    /* Params:
     *      participantId number
     *      quizzes Quiz
     *      quizIndex number
     *      sectionIndex number
     *      questionIndex number
     *      userinput any
     * Clipboard object is consisting data from multiple models and not all is
     * captured from user form. So here we assemble it altogether and prepare
     * to be sent to cloud/server.
     */
    prepareClipboardObject(participantId: string, quizzes: Quiz[],
        quizIndex: number, sectionIndex: number,
        questionIndex: number, userinput: any
    ): Observable<Clipboard>{
        let clipboard: Clipboard = {
            participantId: participantId
        }

        let section = quizzes[quizIndex].sections[sectionIndex];
        let question = section.questions[questionIndex];
        let selections = userinput.questions[questionIndex].selections;
        let isCorrect = false;

        clipboard['sectionId'] = section.id;
        clipboard['questionId'] = question.id;
        clipboard['statement'] = question.statement;
        clipboard['choices'] = question.choices;
        clipboard['answers'] = question.answers;
        clipboard['selections'] = selections;

        for( let i = 0, len = selections.length; i < len; i++){

            if(question.answers.indexOf(selections[i]) !== -1){
                isCorrect = true;
            }
            else{
                isCorrect = false;
                i = len;
            }
        }

        clipboard['isCorrect'] = isCorrect;

        return of(clipboard)
    }

}
