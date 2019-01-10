import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ClipboardPage } from '../pages/clipboard/clipboard';
import { SectionPage } from '../pages/section/section';
import { BonusPage } from '../pages/bonus/bonus';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { LoginProvider } from '../providers/login/login';
import { CommunicateServerProvider } from '../providers/communicate-server/communicate-server';
import { DatastoreProvider } from '../providers/datastore/datastore';
import { LoginUtilProvider } from '../providers/login-util/login-util';
import { ClipboardProvider } from '../providers/clipboard/clipboard';
import { ClipboardUtilProvider } from '../providers/clipboard-util/clipboard-util';

@NgModule({
  declarations: [
    MyApp,
    ClipboardPage,
    SectionPage,
    BonusPage,
    TabsPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ClipboardPage,
    SectionPage,
    BonusPage,
    TabsPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    LoginProvider,
    CommunicateServerProvider,
    DatastoreProvider,
    LoginUtilProvider,
    ClipboardProvider,
    ClipboardUtilProvider,
    ClipboardUtilProvider
  ]
})
export class AppModule {}
