import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilitiesService } from 'herr-core';
import { StoreProfile } from 'src/app/_core/_model/xaccount';
import { StoreProfileService } from 'src/app/_core/_service/evse/store-profile.service';
import { ImagePathConstants } from 'src/app/_core/_constants';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
@Component({
  selector: 'app-list-all-store',
  templateUrl: './list-all-store.component.html',
  styleUrls: ['./list-all-store.component.scss']
})
export class ListAllStoreComponent implements OnInit {
  storeData: StoreProfile
  noImage = ImagePathConstants.NO_IMAGE_QR;
  noImage_Comment = ImagePathConstants.NO_IMAGE_HEADER_IMAGE;
  apiHost = environment.apiUrl.replace('/api/', '');
  banners: any
  listStart = []
  hovered = 0;
  selected = 0;
  countyId: string = ''
  townShipId: string = ''
  countyData: any
  storeCountyFields: object = { text: 'countyName', value: 'countyId' };
  storeTownShipFields: object = { text: 'townshipName', value: 'townshipId' };
  townshipData: any
  @ViewChild('county_dropdown')
  public county_dropdown: DropDownListComponent;
  @ViewChild('townShip_dropdown')
  public townShip_dropdown: DropDownListComponent;
  startData = [
    { id: "Tw", name: "Tw" },
    { id: "En", name: "En" },
  ];
  constructor(
    private _storeProfile: StoreProfileService,
    public sanitizer: DomSanitizer,
    private router: Router,
    private spinner: NgxSpinnerService,
    private utilityService: UtilitiesService
  ) { }

  ngOnInit() {
    this.getAllStore()
    this.getCountyTownShip()
  }
  countyChange(args) {
    console.log('countyChange', args)
    if(args.isInteracted) {
      this.countyId = args.value
      this.townShipId = ''
      this.townShip_dropdown.value = null;
      this.getAllTownShipByCounty();
      this.getAllStoreByCountyAndTownShip()
    }
  }
  getAllStore() {
    this.spinner.show()
    this._storeProfile.getAllByFillterStart(this.selected).subscribe((res: any) => {
      this.storeData = res
      this.spinner.hide()
    })
  }
  townShipChange(args) {
    console.log('townShipChange', args)
    if(args.isInteracted) {
      this.townShipId = args.value
      this.getAllStoreByCountyAndTownShip()
      this.getAllTownShipByCounty();
    }
  }
  async getCountyTownShip() {
    await this.getAllCounty()
    // await this.getAllTownShip()
  }
  getAllCounty() {
    return new Promise((result, rej) => {
      this._storeProfile.getAllCounty().subscribe(
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
      this._storeProfile.getAllTowship().subscribe(
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
      this._storeProfile.getTowshipByCounty(this.countyId).subscribe(
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
    this._storeProfile.getAllStoreByCountyAndTownShip(this.countyId, this.townShipId,this.selected).subscribe(x=> {
      console.log('store', x)
      this.storeData = x;
    })
  }
  rateChange(args) {
    this.selected = args
    this.getAllStore()
  }
  clearFillter() {
    this.county_dropdown.value = null;
    this.townShip_dropdown.value = null;
    this.selected = 0 
    this.countyId = ''
    this.townShipId = ''
    this.getAllStore()
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
  imagePathCustome(path) {
    if (path !== null) {
      return  path;
    }
    return this.noImage_Comment;
  }
  orderNow(item){
    localStorage.setItem('store', JSON.stringify(item));
    this.router.navigate([`home/store/${item.storeName}/${item.id}`])
  }
  safeHtml(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
