import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  DataManager,
  Query,
  UrlAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";
import { UtilitiesService } from "herr-core";
import { StoreProfileService } from "src/app/_core/_service/evse/store-profile.service";
import { WebNewsService } from "src/app/_core/_service/evse/web-news.service";
import { environment } from "src/environments/environment";
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
import { Browser } from '@syncfusion/ej2-base';
@Component({
  selector: 'app-home-store-list',
  templateUrl: './home-store-list.component.html',
  styleUrls: ['./home-store-list.component.scss']
})
export class HomeStoreListComponent implements OnInit {

  news = [];
  noImage = ImagePathConstants.NO_IMAGE_QR;
  apiHost = environment.apiUrl.replace('/api/', '');
  baseUrl = environment.apiUrlImage;
  sysConf: any;
  isMobileBrowser: boolean = false
  countyId: string = null
  townShipId: string = null
  countyData: any
  storeCountyFields: object = { text: 'countyName', value: 'countyId' };
  storeTownShipFields: object = { text: 'townshipName', value: 'townshipId' };
  townshipData: any
  constructor(
    private service: StoreProfileService,
    private utilityService: UtilitiesService,
    private router: Router
    ) {
      this.isMobileBrowser = Browser.isDevice
    }

  ngOnInit(): void {
    this.loadStoreData();
    this.getCountyTownShip()
    this.sysConf = JSON.parse(localStorage.getItem('sysConf'))
  }
  imagePath(path) {
    if (path !== null && this.utilityService.checkValidImage(path)) {
      if (this.utilityService.checkExistHost(path)) {
        return path;
      }
      return this.apiHost + path;
    }
    return this.noImage;
  }
  loadStoreData() {
    this.service.getAll().subscribe(x=> {
      this.news = x;
    })
    
  }

  countyChange(args) {
    console.log('countyChange', args)
    if(args.isInteracted) {
      this.countyId = args.value
      this.getAllTownShipByCounty();
      this.getAllStoreByCountyAndTownShip()
    }
  }
  townShipChange(args) {
    console.log('townShipChange', args)
    if(args.isInteracted) {
      this.townShipId = args.value
      this.getAllTownShipByCounty();
    }
  }
  async getCountyTownShip() {
    await this.getAllCounty()
    await this.getAllTownShip()
  }
  getAllCounty() {
    return new Promise((result, rej) => {
      this.service.getAllCounty().subscribe(
        (res: any) => {
          this.countyData  = res
          console.log('countyData', 3)
          result(result);
        },
        (error) => {
          rej(error);
        }
      );
    });
    
  }
  getAllTownShip() {
    return new Promise((result, rej) => {
      this.service.getAllTowship().subscribe(
        (res: any) => {
          this.townshipData  = res
          console.log('townshipData', 1)
          result(result);
        },
        (error) => {
          rej(error);
        }
      );
    });
   
  }

  getAllTownShipByCounty() {
    return new Promise((result, rej) => {
      this.service.getTowshipByCounty(this.countyId).subscribe(
        (res: any) => {
          this.townshipData  = res
          console.log('getTowshipByCounty', this.townshipData)
          result(result);
        },
        (error) => {
          rej(error);
        }
      );
    });
 
  }
  getAllStoreByCountyAndTownShip() {
    this.service.getAllStoreByCountyAndTownShip(this.countyId, this.townShipId,0).subscribe(x=> {
      console.log('store', x)
      this.news = x;
    })
  }
  gotoShop(item) {
    localStorage.setItem('store', JSON.stringify(item));
    this.router.navigate([`home/store/${item.storeName}/${item.id}`])
  }

}
