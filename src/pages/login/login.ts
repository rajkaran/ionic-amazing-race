import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ToastController } from 'ionic-angular';
import { map, flatMap } from 'rxjs/operators';
import { forkJoin } from "rxjs/observable/forkJoin";

import { TabsPage } from '../tabs/tabs';
import { LoginProvider } from '../../providers/login/login';
import { DatastoreProvider } from '../../providers/datastore/datastore';
import { LoginUtilProvider } from '../../providers/login-util/login-util';
import { Participant } from '../../models/participant';
import { Quiz } from '../../models/quiz';
import { Team } from '../../models/team';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
    selectedItem: any;
    qrCode: string;
    captureMethod: string = "scan";
    loadingBoxInstance: any;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private barcodeScanner: BarcodeScanner,
        private toastCtrl: ToastController,
        private loginProvider: LoginProvider,
        private datastoreProvider: DatastoreProvider,
        private loadingCtrl: LoadingController,
        private loginUtilProvider: LoginUtilProvider
    ) { }

    ionViewDidLoad() { }

    /* Allow user to scan only QR codes. Once a code is scanned call onSubmit
     * method to begin submission
     */
    onScan(){
        this.barcodeScanner.scan({formats: 'QR_CODE'}).then(barcodeData => {
            this.qrCode = barcodeData.text;
            this.onSubmit(); //submit scanned qrcode
        }).catch(err => {
            this.displaytoastBottom(err)
        });
    }

    /* When barcode value is submitted. First authenticate participant and
     * generate access token. Store this participant details in ionic Storage.
     * fetch Team and quizzes associated with authenticated paticipant and
     * store them in inonic storage.
     */
    onSubmit(){
        this.presentLoadingCustom();

        this.loginProvider.fetchParticipant(this.qrCode)
        .pipe(
            map( (participant: Participant) => {
                this.datastoreProvider
                .setKeyValuePair('token', participant.accessToken);

                this.datastoreProvider.setKeyValuePair('participant', participant);

                return participant;
            }),
            flatMap( (participant: Participant) =>{
                return forkJoin([ this.loginProvider.fetchTeam(
                        participant.department, participant.accessToken),
                    this.loginProvider.fetchQuiz(
                        participant.participantGroup, participant.accessToken),
                    this.loginProvider.fetchQuiz(
                        participant.participantGroup, participant.accessToken)
                ])
            }),
            flatMap( ([teams, quizzes]) => {
                let teamList: Team[] = <Team[]>teams,
                    quizList: Quiz[] = <Quiz[]>quizzes;

                return forkJoin([
                    this.loginUtilProvider.confirmTeams(teamList),
                    this.loginUtilProvider.confirmQuizzes(quizList)
                ])
            })
        )
        .subscribe( ([team, quizzes]) => {

            this.datastoreProvider.setKeyValuePair('team', team);
            this.datastoreProvider.setKeyValuePair('quiz', quizzes);
            this.loadingBoxInstance.dismiss();
            this.navCtrl.push(TabsPage);
        }, (error) =>{
            if(error.status === 0) { this.displaytoastBottom(error.message); }
            else{ this.displaytoastBottom(error.error.error.message); }

            this.loadingBoxInstance.dismiss();
        })
    }

    /* display snack bar at the bottom. allow user to close it.*/
    displaytoastBottom(message){
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            showCloseButton: true,
            dismissOnPageChange: true
        });

        toast.present();
    }

    /* Show a modal until app configures*/
    presentLoadingCustom() {
        this.loadingBoxInstance = this.loadingCtrl.create({
            content: 'Configuring...'
        });

        this.loadingBoxInstance.present();
    }


}
