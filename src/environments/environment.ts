// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBCjcVowCuBu3nuXLRsNCAhR56QcZm4o9M',
    authDomain: 'cardinal-ng.firebaseapp.com',
    databaseURL: 'https://cardinal-ng.firebaseio.com',
    projectId: 'cardinal-ng',
    storageBucket: 'cardinal-ng.appspot.com',
    messagingSenderId: '956312128006'
  },
  routing: {
    enableTracing: true,
  },
};
