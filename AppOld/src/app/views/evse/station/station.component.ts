import { Component, OnInit } from '@angular/core';
import { ParkingLot, Site } from 'src/app/_core/_model/evse/model';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})
export class StationComponent implements OnInit {
  site: Site
  parkingLot: ParkingLot

  constructor() { }

  ngOnInit() {
  }

}
