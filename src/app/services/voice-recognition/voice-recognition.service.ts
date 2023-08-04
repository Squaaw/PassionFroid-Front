import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageService } from '../image/image.service';
import { SearchFilterService } from '../search-filter/search-filter.service';
import { ImageDataAzure } from 'src/app/models/image';
declare var webkitSpeechRecognition: any;


@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  textRecognitionValueSubject = new BehaviorSubject<string>("");
  textRecognitionValue$ = this.textRecognitionValueSubject.asObservable();
  isStoppedSpeechRecognizeSubject = new BehaviorSubject<boolean>(true);
  isStoppedSpeechRecognize$ = this.isStoppedSpeechRecognizeSubject.asObservable();
  recognition = new webkitSpeechRecognition()
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords: any;
  transcript_arr: any[] = [];
  confidence_arr: any[] = [];
  isStarted = false;
  isStoppedAutomatically = true;
  imagesSearchByInput: ImageDataAzure[] = [];
  private audio: HTMLAudioElement;
  
  constructor(private imageService: ImageService, private searchFilterService: SearchFilterService, private http: HttpClient) {
    this.searchFilterService.imagesSearchInput$.subscribe((value) => this.imagesSearchByInput = value)
    this.audio = new Audio();
  }

  setTextRecognitionValue(value: string) {
    this.textRecognitionValueSubject.next(value);
  }

  setIsStoppedSpeechRecognizeSubjectValue(value: boolean) { 
    this.isStoppedSpeechRecognizeSubject.next(value);
  }

  init() {
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = 'en-US';

    this.recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;
      
      this.setTextRecognitionValue(transcript)
    });
  }

  start() {
    
    this.playAudioStart();
    this.isStoppedSpeechRecog = false;
    this.setIsStoppedSpeechRecognizeSubjectValue(false);
    this.recognition.start();
    
    this.recognition.addEventListener('end', (e: any) => {
      this.isStoppedSpeechRecog = true;
      this.setIsStoppedSpeechRecognizeSubjectValue(true);
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        this.audio.pause()
        this.audio.currentTime = 0
        this.playAudioEnd()

        if(this.textRecognitionValueSubject.getValue().length !== 0){
          this.imageService.getImagesByCognitiveSearch(this.textRecognitionValueSubject.getValue()).subscribe({
            next: (images: any) => {
              this.imagesSearchByInput = images
              this.searchFilterService.imagesSearchInputSubject.next(this.imagesSearchByInput)
              //this.searchFilterService.handleFilterImages()
              this.imageService.imagesSubject.next(this.imagesSearchByInput)
            },
            error: (e) => console.error(e),
        })
      }
      } else {
        this.wordConcat();
        this.recognition.start();
      }
    })
  }

  playAudioStart(){
    this.recordAudioHandler("start_audio");
  }

  playAudioEnd(){
    this.recordAudioHandler("stop_audio");
  }

  recordAudioHandler(audioName: string){
    this.http.get("assets/audio/"+audioName+".wav", { responseType: 'arraybuffer' }).subscribe((arrayBuffer: ArrayBuffer) => {
      const songBlob = new Blob([arrayBuffer], { type: 'audio/wav' });
      const songUrlObject = URL.createObjectURL(songBlob);
      this.audio.src = songUrlObject;
      
      this.audio.pause();
      this.audio.currentTime = 0;
      var nopromise = {
        catch : new Function()
      };
      (this.audio.play() || nopromise).catch(function(){}); ;
    });
  }
  
  stop() {
    this.isStoppedSpeechRecog = true;
    this.setIsStoppedSpeechRecognizeSubjectValue(true);
    this.wordConcat()
    this.recognition.stop();
  }

  wordConcat() { 
    this.text = this.text + ' ' + this.tempWords + '.';
    this.tempWords = '';
  }
}