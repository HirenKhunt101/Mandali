import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';

import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from "ngx-ui-loader";

import { routes } from './app.routes';
import { environment } from '../environments/environment';


const ngxUiLoaderConfig: any = {
  "bgsColor": "red",
  "bgsOpacity": 1,
  "bgsPosition": "center-center",
  "bgsSize": 80,
  "bgsType": "three-bounce",
  "blur": 15,
  "delay": 0,
  "fastFadeOut": true,
  "fgsColor": "#04aa6d",
  "fgsPosition": "center-center",
  "fgsSize": 90,
  "fgsType": "three-strings",
  "gap": 50,
  "logoPosition": "center-center",
  "logoSize": 70,
  "logoUrl": "",
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(40, 40, 40, 0.8)",
  "pbColor": "#04aa6d",
  "pbDirection": "ltr",
  "pbThickness": 3,
  "hasProgressBar": true,
  "text": "Please Wait...",
  "textColor": "#000000",
  "textPosition": "center-center",
  "maxTime": -1,
  "minTime": 300
};

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), importProvidersFrom([
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideStorage(() => getStorage()),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
  ])]
};
