import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'herr-core';
import { StoreProfile } from 'src/app/_core/_model/xaccount';
import { StoreProfileService } from 'src/app/_core/_service/evse/store-profile.service';
import { ImagePathConstants } from 'src/app/_core/_constants';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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
  }
  getAllStore() {
    this.spinner.show()
    this._storeProfile.getAllByFillterStart(this.selected).subscribe((res: any) => {
      this.storeData = res
      this.spinner.hide()
    })
  }
  rateChange(args) {
    this.selected = args
    this.getAllStore()
  }
  clearFillter() {
    this.selected = 0 
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
