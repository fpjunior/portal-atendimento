// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnvironmentConfiguration } from "src/app/models/environment-configuration";

export const environment = {
  env_name: 'dev',
  production: false,
  firebase: {
    apiKey: "AIzaSyBGPf3b7Cafiq7Yla4FoCLDiScjVAKTcQ4",
    authDomain: "project-guidance-1c41d.firebaseapp.com",
    projectId: "project-guidance-1c41d",
    storageBucket: "project-guidance-1c41d.appspot.com",
    messagingSenderId: "660929735902",
    appId: "1:660929735902:web:7be00af0a33f609274a64f",
    measurementId: "G-D1PM2M16BM"
  },
  apiKeyGpt: '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',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
