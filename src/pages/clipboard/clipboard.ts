import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Slides } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms'
import { ToastController } from 'ionic-angular';
import { forkJoin } from "rxjs/observable/forkJoin";
import { flatMap } from 'rxjs/operators';

import { DatastoreProvider } from '../../providers/datastore/datastore';
import { Quiz } from '../../models/quiz';
import { Question } from '../../models/question';
import { Participant } from '../../models/participant';
import { ClipboardProvider } from '../../providers/clipboard/clipboard';
import { ClipboardUtilProvider } from '../../providers/clipboard-util/clipboard-util';
import { Clipboard } from '../../models/clipboard';
import { AccessToken } from '../../models/access-token';

@IonicPage()
@Component({
  selector: 'page-clipboard',
  templateUrl: 'clipboard.html',
})
export class ClipboardPage {
    @ViewChild(Slides) slides: Slides;

    quizzes: Quiz[];
    participant: Participant;
    token: AccessToken;
    sectionOnScreen: string;
    questions: Question[];
    quizIndexSelected: number;
    sectionIndexSelected: number;
    questionForm : FormGroup;

    constructor(public navCtrl: NavController,
        public navParams: NavParams, private events: Events,
        private datastoreProvider: DatastoreProvider,
        private formBuilder: FormBuilder,
        private clipboardProvider: ClipboardProvider,
        private clipboardUtilProvider: ClipboardUtilProvider,
        private toastCtrl: ToastController,
    ) { }

    ionViewDidLoad() {
        this.quizIndexSelected = this.navParams.get('quizIndex');
        this.sectionIndexSelected = this.navParams.get('sectionIndex');

        this.loadPrefetch();
        this.watchSelectionChanges();
    }

    /* Participant, quiz list and token was fetched at the time of
     * authentication and was stored in ionic storage. here all we need to do
     * is to fetch from storage.
     */
    loadPrefetch(){
        forkJoin([
            this.datastoreProvider.getKeyValuePair('participant'),
            this.datastoreProvider.getKeyValuePair('quiz'),
            this.datastoreProvider.getKeyValuePair('token')
        ])
        .subscribe( ([participants, quizzes, token]) => {
            this.participant = <Participant>participants;
            this.quizzes = <Quiz[]>quizzes;
            this.token = <AccessToken>token;

            this.setViewVariables()
        }, (error) => {
            this.displaytoastBottom(error.error.error.message)
        })
    }

    /* Here we are subscribing to change-tab event being broadcasted by section
     * bonus tabs. On every change reset quizIndexSelected and
     * sectionIndexSelected properties. Which will eventually change view.
     */
    watchSelectionChanges(){
        this.events.subscribe('change-tab', (tab, quizIndex, sectionIndex) => {
            this.slides.slideTo(0, 500);

            this.quizIndexSelected = quizIndex;
            this.sectionIndexSelected = sectionIndex;

            this.setViewVariables();
        });
    }

    /* To present a section in view we have to go down the nesting of quizzes
     * object. This will make *ngFor statement long, to keep view small and
     * readble. we have added extra properties and updated them on every
     * requested change.
     */
    setViewVariables(){
        this.questions = this.quizzes[this.quizIndexSelected]
            .sections[this.sectionIndexSelected].questions;

        this.sectionOnScreen = this.quizzes[this.quizIndexSelected]
            .sections[this.sectionIndexSelected].name;

        this.prepareForm();
    }

    /* To track user responses and be able to save them, we have created a form
     * consisting all the checkboxes for a selected section.
     */
    prepareForm(){
        this.questionForm = this.formBuilder.group({
            questions: this.formBuilder.array([])
        });

        for (var i = 0; i < this.questions.length; i++) {
            let question = this.formBuilder.group({
                statement: [this.questions[i].statement, Validators.required],
                selections: this.formBuilder.array([])
            });

            (<FormArray>this.questionForm.controls['questions']).push(question);
        }
    }

    /* As user interacts we will modify form accordingly to track responses
    in real time. */
    checkChange(answer: string, $event: any, index: number){
        // const answers = <FormArray>this.questionForm.controls.questions
        // .controls[index].controls.selections

        const answers = (<FormArray>this.questionForm.controls['questions'])
            .at(index).get('selections') as FormArray;

        if($event.value){
            answers.push(new FormControl(answer))
        }
        else{
            let idx = answers.controls.findIndex(x => x.value == answer)
            answers.removeAt(idx)
        }
    }

    /* User needs to submit response to each question. There is no bulk
     * submission. One thing that still needs to be added is put indicator on
     * question to which user has already responded. */
    onSubmit(questionIndex){
        if(this.questionForm.value.questions[questionIndex].selections.length > 0){
            this.clipboardUtilProvider.prepareClipboardObject(
                this.participant.id, this.quizzes, this.quizIndexSelected,
                this.sectionIndexSelected, questionIndex,
                this.questionForm.value
            )
            .pipe(
                flatMap( (clipboard: Clipboard) => {
                    return this.clipboardProvider.saveClipboard(clipboard, this.token);
                })
            )
            .subscribe( (clipboard: Clipboard) => {
                this.displaytoastBottom('Your response has been recorded.');
            }, (error) =>{
                this.displaytoastBottom(error.error.error.message);
            })
        }

        if(!this.slides.isEnd()){
            this.slides.slideTo(questionIndex+1, 500);
        }
        else{
            this.displaytoastBottom('Reached end! select another section.');
        }
    }

    /* display snack bar at the bottom. allow user to close it.*/
    displaytoastBottom(message){
        let toast = this.toastCtrl.create({
            message: message,
            duration: 1000,
            showCloseButton: false,
            dismissOnPageChange: true
        });

        toast.present();
    }

}
