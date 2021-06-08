import { Injectable } from '@angular/core';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CloudService {
  files:any = [
    { url: 'https://ia801504.us.archive.org/3/items/EdSheeranPerfectOfficialMusicVideoListenVid.com/Ed_Sheeran_-_Perfect_Official_Music_Video%5BListenVid.com%5D.mp3', 
      name: 'Perfect by Ed Sheeran'
    },
    {
      url: 'https://preprod.aefinfo.fr/assets/podcast/Mort-de-Christophe-JT-20h-France-2-(2020).mp3',
      name: 'Mort de Christophe, JT 20h France 2, 2020'
    },
    {
      url: 'https://preprod.aefinfo.fr/assets/podcast/Le-Journal-De-20-Heures.mp3',
      name: 'Le journal de 20h'
    },
    {
      url: 'https://preprod.aefinfo.fr/assets/podcast/Journal-de-20-Heures-(TV)-1989-FRANCE.mp3',
      name: 'Le journal de 20h TV 1989'
    },
    {
      url: 'https://preprod.aefinfo.fr/assets/podcast/20heures-de-TF1-2006-Bed.mp3',
      name: 'Le journal de 20h TF1 2006'
    },
    {
      url: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2021-03-31/247d12f868e70a7ef20bfc0d06394561.m4a',
      name: 'aefinfo'
    }
  ];
  getFiles() {
   return of(this.files);
  }
}