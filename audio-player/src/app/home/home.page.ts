import {Component, ViewChild} from '@angular/core';
import {trigger, state, style, animate, transition } from '@angular/animations';
import {NavController, NavParams, IonContent, LoadingController} from '@ionic/angular';
import {FormControl} from '@angular/forms';
import {Store} from '@ngrx/store';
import {CANPLAY, LOADEDMETADATA, PLAYING, TIMEUPDATE, LOADSTART, RESET} from '../providers/store/store';

import {CloudService} from '../providers/cloud.service';
import {pluck, filter, map, distinctUntilChanged} from 'rxjs/operators';
import { AudioService } from '../providers/audio.service';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('showHide', [
      state(
        'active',
        style({
          opacity: 1
        })
      ),
      state(
        'inactive',
        style({
          opacity: 0
        })
      ),
      transition('inactive => active', animate('250ms ease-in')),
      transition('active => inactive', animate('250ms ease-out'))
    ])
  ]
})
export class HomePage {

  files: any = [];
  seekbar: FormControl = new FormControl("seekbar");
  state: any = {};
  res: any = {duration:""}
  onSeekState: boolean;
  currentFile: any = {};
  displayFooter: string = "inactive";
  @ViewChild(NavigationBar) navBar: NavigationBar;
  @ViewChild('resize') content: IonContent;
  playing: boolean = true;
  fileplay : boolean = false;
  indexfile: number;
  pose : boolean
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public audioProvider: AudioService,
    public loadingCtrl: LoadingController,
    public cloudProvider: CloudService,
    private store: Store<any>
  ) {
      this.getDocuments();
    }
  
  async getDocuments() {
    let loader = await this.presentLoading();
    this.cloudProvider.getFiles().subscribe(files => {
      this.files = files;
      loader.dismiss();
    });
  }

  async presentLoading() {
    let loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    loading.present();
    return loading;
  }

  ngOnInit() {
  }

  openFile(file, index) {
    if(this.indexfile == index){
      if(this.fileplay){
        this.fileplay = !this.fileplay;
        this.pause()
      } else {
        this.fileplay = !this.fileplay;
        this.play()
      }
      return true;
    }
    this.currentFile = { index, file };
    this.playStream(file.url);
    this.fileplay = true
    this.playing = true
    this.indexfile = index
  }

  resetState() {
    this.audioProvider.stop();
    this.store.dispatch({ type: RESET });
  }

  playStream(url) {
    this.resetState();
    this.audioProvider.playStream(url).subscribe(event => {
      switch (event.type) {
        case 'canplay':
          this.displayFooter = 'active';
          return true;//this.store.dispatch({ type: CANPLAY, payload: { value: true } });

        case 'loadedmetadata':
          this.res.duration = this.audioProvider.formatTime(
            event.path[0].duration * 1000,
            'HH:mm:ss'
          );
          this.res.durationSec = Number.parseInt(event.path[0].duration)
          /*return this.store.dispatch({
            type: LOADEDMETADATA,
            payload: {
              value: true,
              data: {
                time: this.audioProvider.formatTime(
                  event.path[0].duration * 1000,
                  'HH:mm:ss'
                ),
                timeSec: event.path[0].duration,
                mediaType: 'mp3'
              }
            }
          });*/

        case 'playing':
          //this.seekbar.setValue(Number.parseInt(event.path[0].currentTime));
          return true//this.store.dispatch({ type: PLAYING, payload: { value: true } });

        case 'pause':
          console.log("3")
          //return this.store.dispatch({ type: PLAYING, payload: { value: false } });

        case 'timeupdate':
          this.seekbar.setValue(Number.parseInt(event.path[0].currentTime));
          /*if(event.path[0].currentTime){
            this.res.time = this.audioProvider.formatTime(
              event.path[0].currentTime * 1000,
              'HH:mm:ss'
            );
          }*/
        case 'loadstart':
          this.res.time = this.audioProvider.formatTime(
            event.path[0].currentTime * 1000,
            'HH:mm:ss'
          );
          //return this.store.dispatch({ type: LOADSTART, payload: { value: true } });
      }
    });
  }

  pause() {
    this.audioProvider.pause();
    this.playing = false
    this.fileplay = false
  }

  play() {
    this.audioProvider.play();
    this.playing = true
    this.fileplay = true
  }

  stop() {
    this.audioProvider.stop();
  }

  next() {
    this.playing = true
    let index = this.currentFile.index + 1;
    let file = this.files[index];
    this.openFile(file, index);
  }

  previous() {
    this.playing = true
    let index = this.currentFile.index - 1;
    let file = this.files[index];
    this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  onSeekEnd() {
   let val = ( this.seekbar.value);
    if (this.onSeekState) {
      this.audioProvider.seekTo(val);
      this.play();
    } else {
      this.audioProvider.seekTo(val);
    }
  }

  reset() {
    this.resetState();
    this.currentFile = {};
    this.displayFooter = "inactive";
  }

}
