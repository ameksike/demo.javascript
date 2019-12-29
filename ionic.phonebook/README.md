# IONIC Lucky Number Demo 
IONIC Phonebook, it is a demo written on JavaScript over IONIC-Angular framework. Is very simple project with one used services, modules, web component, etc.

# develop steps
npm install -g ionic 
npm install --save @ionic/storage

npm install @ionic-native/sqlite @ionic-native/sqlite-porter
ionic cordova plugin add cordova-sqlite-storage
ionic cordova plugin add uk.co.workingedge.cordova.plugin.sqliteporter

ionic cordova plugin add cordova-plugin-file
npm install --save @ionic-native/file
ionic cordova plugin add cordova-plugin-file-opener2
npm install @ionic-native/file-opener
ionic cordova plugin add cordova-plugin-chooser
npm install @ionic-native/chooser
npm install --save rxjs-compat

ionic start ionic.phonebook blank

ionic g page edit
ionic g page list
ionic g page help
ionic g page option
ionic g page details

ionic g service services/metadata
ionic g service services/person
ionic g service services/datajson

ionic g class model/person

ionic g component components/listMenu --export
ionic g component components/listSimplePerson
ionic g component components/news --export

# run steps
ionic serve

# principal files
/src/app/home/home.page.html    => View
/src/app/home/home.page.ts		=> Controller
/src/app/app-routing.module.ts	=> Router


# technologies: ionic info
Ionic:
   Ionic CLI                     : 5.4.13 (C:\Users\io\AppData\Roaming\npm\node_modules\ionic)
   Ionic Framework               : @ionic/angular 4.11.7
   @angular-devkit/build-angular : 0.803.21
   @angular-devkit/schematics    : 8.1.3
   @angular/cli                  : 8.1.3
   @ionic/angular-toolkit        : 2.1.1

Cordova:
   Cordova CLI       : 9.0.0 (cordova-lib@9.0.1)
   Cordova Platforms : none
   Cordova Plugins   : no whitelisted plugins (4 plugins total)

Utility:
   cordova-res : not installed
   native-run  : not installed

System:
   NodeJS : v12.13.1 (C:\Program Files\nodejs\node.exe)
   npm    : 6.12.1
   OS     : Windows 10
