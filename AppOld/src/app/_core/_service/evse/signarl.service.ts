import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignarlService {

  public hubConnection: HubConnection;
  private connectionUrl = environment.hub;
  baseUrl = environment.apiUrl;
  messageSource = new BehaviorSubject<number>(0);
  currentMessage = this.messageSource.asObservable();
  // method này để change source message
  changeMessage(message) {
    this.messageSource.next(message);
  }
  constructor(
    ) { }

    
    public connect = () => {
      this.startConnection();
    }
    public close = async () => {
       return await this.hubConnection.stop();
    }

    public loadData = () => {
      this.hubConnection.on('ReceiveMessage', (result, message) => {
        this.messageSource.next(result)
      });
    }
    
    public startConnection = () => {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(this.connectionUrl)
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();
      this.hubConnection.start().then(() => console.log('Connection started')).catch(err =>{
      })
    }
    
    // This method will implement the methods defined in the ISignalrDemoHub inteface in the SignalrDemo.Server .NET solution
    private setSignalrClientMethods(): void {
      this.hubConnection.onreconnected(() => {
        console.log('Restarted signalr!');
      });
    }

}
