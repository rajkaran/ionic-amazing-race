import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { DatastoreProvider } from '../../providers/datastore/datastore';
import { Quiz } from '../../models/quiz';

@IonicPage()
@Component({
  selector: 'page-bonus',
  templateUrl: 'bonus.html',
})
export class BonusPage {

    quizzes: Quiz[];

    constructor(public navController: NavController,
        public navParams: NavParams, private events: Events,
        private datastoreProvider: DatastoreProvider
    ) {}

    ionViewDidLoad() {
        this.fetchQuizList();
    }

    /* Quiz list was fetched at the time of authentication and was stored in
     * ionic storage. here all we need to do is to fetch from storage.
     */
    fetchQuizList(){
        this.datastoreProvider.getKeyValuePair('quiz')
        .subscribe( (quizzes: Quiz[]) => {
            this.quizzes = quizzes;
        }, (error) => {
            console.log('SectionPage fetchQuizList', error)
        })
    }

    /* Params:
     *      quizIndex number
     *      sectionIndex number
     * When user selects a section we forwards quizIndex and sectionIndex to
     * parent page. With index we need to tell parent whihc page to load so,
     * does tabIndex.
     * Publish functions params - eventIdentifier, tabIndex (starts from 0),
     * quizIndex and sectionIndex
     */
    sectionSelected(quizIndex: number, sectionIndex: number){
        this.events.publish('change-tab', 0, quizIndex, sectionIndex);
    }

}
