import { Component, OnInit, ViewChild } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { DataManager, Query, UrlAdaptor } from '@syncfusion/ej2-data';
import { environment } from 'src/environments/environment';
import { SiteActionComponent } from '../station/site/site-action/site-action.component';
@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
 ngOnInit(): void {
  this.loadData();
 }
 baseUrl = environment.apiUrlImage
 // google maps zoom level
 zoom: number = 8;
 @ViewChild(SiteActionComponent) public action: SiteActionComponent;
  
 // initial center position for the map
 lat: number = 51.673858;
 lng: number = 7.815982;

 clickedMarker(label: string, index: number) {
 }
 
 mapClicked($event: MouseEvent) {
  //  this.markers.push({
  //    lat: $event.coords.lat,
  //    lng: $event.coords.lng,
  //    draggable: true
  //  });
 }
 
 markerDragEnd(m: marker, $event: MouseEvent) {
 }
 
 markers: marker[] = [
 ]

 loadData() {
 let query = new Query()
  .where('status', 'equal', 1);
  new DataManager({
    url: `${environment.apiUrl}Site/GetDataDropdownlist`,
    adaptor: new UrlAdaptor,
    crossDomain: true,
  }, query).executeQuery(query).then(x=> {
    this.markers = x['result'].map(a=> {
      return {
        lat: +a.latitude,
        lng: +a.longitude,
        label: a.siteNo + ' - ' + a.siteName,
        siteNo: a.siteNo,
        siteName: a.siteName,
        address: a.siteAddress,
        photo: a.sitePhoto,
        guid: a.guid,
        id: a.id,
        comment: a.comment,
        draggable: false
      }
    })
    if (this.markers.length > 0) {
      this.lat = this.markers[0].lat;
      this.lng = this.markers[0].lng;
    }
  });
}

edit(e) {
  this.action.initModel();
  this.action.guid = e.guid;
  this.action.open();
}
saveChange() {
  this.loadData();
}
}

// just an interface for type safety.
interface marker {
 id: number;
 guid: string;
 lat: number;
 lng: number;
 label?: string;
 draggable: boolean;
 address: string;
 photo: string;
 comment: string;
 siteName: string;
 siteNo: string;
}
