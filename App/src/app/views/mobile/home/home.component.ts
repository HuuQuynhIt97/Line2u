import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from 'herr-core';
import { CookieService } from 'ngx-cookie-service';
import { SystemGroupNo } from 'src/app/_core/enum/SystemGroupNo';
import { StoreProfile, XAccount } from 'src/app/_core/_model/xaccount';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { AuthLandlordService } from 'src/app/_core/_service/auth-landlord.service';
import { AuthService } from 'src/app/_core/_service/auth.service';
import { XAccountService } from 'src/app/_core/_service/xaccount.service';
import { environment } from 'src/environments/environment';
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
import { DataService } from 'src/app/_core/_service/data.service';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { NgxSpinnerService } from 'ngx-spinner';
import { StoreProfileService } from 'src/app/_core/_service/evse/store-profile.service';
import { DomSanitizer } from '@angular/platform-browser';
declare let $: any;
import {Location} from '@angular/common';
@Component({
  selector: 'app-home-mobile',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
  isAdmin = JSON.parse(localStorage.getItem('user'))?.uid === 'admin';
  user = JSON.parse(localStorage.getItem('user'))
  constructor(
    private _storeProfile: StoreProfileService,
    public sanitizer: DomSanitizer,
    private router: Router,
    private _location: Location,
    private spinner: NgxSpinnerService,
    private utilityService: UtilitiesService
  ) { }

  ngOnInit() {
    this.getAllStore()
    this.getCountyTownShip()
  }
  countyChange(args) {
    if(args.isInteracted) {
      this.countyId = args.value
      this.townShipId = ''
      this.townShip_dropdown.value = null;
      this.getAllTownShipByCounty();
      this.getAllStoreByCountyAndTownShip()
    }
  }
  Back() {
    let isLogin_Cus_url = localStorage.getItem('isLogin_Cus')
    console.log(isLogin_Cus_url)
    this._location.back()
    this.router.navigate([isLogin_Cus_url]);
  }
  adminAddStore() {
    const uri = this.router.url;
    localStorage.setItem('isLogin_Cus',uri)
    this.router.navigate([`line2u/add-restaurant`])
  }
  getAllStore() {
    this.spinner.show()
    this._storeProfile.getAllStoreForCusBoss(this.selected, this.user?.id).subscribe((res: any) => {
      this.storeData = res
      console.log(res)
      this.spinner.hide()
    })
  }
  townShipChange(args) {
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
    const uri = this.router.url;
    localStorage.setItem('isLogin_Cus',uri)
    localStorage.setItem('store', JSON.stringify(item));
    this.router.navigate([`mobile/home-boss-update/${item.id}`])
  }
  safeHtml(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
