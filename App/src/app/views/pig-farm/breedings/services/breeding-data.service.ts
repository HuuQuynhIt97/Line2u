import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreedingDataService {
  messageSource = new BehaviorSubject<number>(0);
  
  SourceLang = new BehaviorSubject<any>('en');
  currentSourceLang = this.SourceLang.asObservable();


  currentMessage = this.messageSource.asObservable();
  messageSources = new BehaviorSubject<number>(0);


  public info = new BehaviorSubject<boolean>(false);
  locale = new BehaviorSubject<string>(null);
  // method này để change source message

  breeding2SowSource = new BehaviorSubject<any>(null);
  currentSourceBreeding2Sow = this.breeding2SowSource.asObservable();

  constructor() { }
  // method này để change source message
  changeMessage(message) {
    this.messageSource.next(message);
  }

  changeMessages(message) {
    this.messageSources.next(message);
  }

  
  changebreeding2SowSource(value) {
    this.breeding2SowSource.next(value);
  }
  changeLang(message) {
    this.SourceLang.next(message);
  }
  public setValue(message): void {
    this.info.next(message);
  }
  public getValue(): Observable<boolean> {
    return this.info.asObservable();
  }
  public setValueLocale(message): void {
    this.locale.next(message);
  }
  public getValueLocale(): Observable<string> {
    return this.locale.asObservable();
  }

}
