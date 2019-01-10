import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

    constructor(public navCtrl: NavController) {

    }

    goToOtherPage() {
        //push another page onto the history stack
        //causing the nav controller to animate the new page in
        this.navCtrl.push(LoginPage);
    }

}
