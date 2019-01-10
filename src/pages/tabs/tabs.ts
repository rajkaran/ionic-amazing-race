import { Component, ViewChild } from '@angular/core';
import { ViewController, Tabs, Events } from 'ionic-angular';
import { forkJoin } from "rxjs/observable/forkJoin";

import { ClipboardPage } from '../clipboard/clipboard';
import { SectionPage } from '../section/section';
import { BonusPage } from '../bonus/bonus';
import { DatastoreProvider } from '../../providers/datastore/datastore';
import { Participant } from '../../models/participant';
import { Team } from '../../models/team';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
    @ViewChild(Tabs) tabs: Tabs;

    participant: Participant;
    team: Team;

    tabClipboard = ClipboardPage;
    tabSection = SectionPage;
    tabBonus = BonusPage;
    forwardParam = { quizIndex: 0, sectionIndex: 0 };

    constructor(private viewController : ViewController,
        private datastoreProvider: DatastoreProvider,
        private events: Events
    ) {}

    /* Inoic by default adds back button in header when user navigates between
     * pages. We do not want to allow user to go back to authentication page.
     * So we hide this back button.
     */
    ionViewWillEnter() {
        this.viewController.showBackButton(false);
    }

    ionViewDidLoad() {
        this.loadPrefetch();
        this.watchParamChanges();
    }

    /* particpant and team was fetched at the time of authentication and was
     * stored in ionic storage. here all we need to do is to fetch from storage.
     */
    loadPrefetch(){
        forkJoin([
            this.datastoreProvider.getKeyValuePair('participant'),
            this.datastoreProvider.getKeyValuePair('team')
        ])
        .subscribe( ([participants, teams]) => {
            this.participant = <Participant>participants;
            this.team = <Team>teams;
        })
    }

    /* Here we are subscribing to change-tab event being broadcasted by section
     * bonus tabs. On every change request we loads the requested tab..
     */
    watchParamChanges(){
        this.events.subscribe('change-tab', (tabIndex, quizIndex, sectionIndex) => {
            this.tabs.select(tabIndex);
        });
    }

}
