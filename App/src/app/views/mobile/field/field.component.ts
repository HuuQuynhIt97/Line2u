import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataManager, UrlAdaptor ,Query } from '@syncfusion/ej2-data';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  dataSource: any;
  baseUrl = environment.apiUrlImage;
  user = JSON.parse(localStorage.getItem('user_landlord'))

  constructor() { }

  ngOnInit() {
    this.loadData();
  }
  loadData() {
    const accessToken = localStorage.getItem('token');
    const lang = localStorage.getItem('lang');
    new DataManager({
      url: `${environment.apiUrl}Site/LoadData?lang=${lang}`,
      adaptor: new UrlAdaptor,
      headers: [{ authorization: `Bearer ${accessToken}` }]
    }).executeQuery(new Query().where('landlordGuid', 'equal', this.user?.guid)).then(x=> {
  this.dataSource = x['result'].result
    });
}
}
