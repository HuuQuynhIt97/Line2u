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

  constructor(
    private service: StoreProfileService,
    private utilityService: UtilitiesService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.loadStoreData();
    this.sysConf = JSON.parse(localStorage.getItem('sysConf'))
    console.log(this.sysConf)
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
  gotoShop(item) {
    localStorage.setItem('store', JSON.stringify(item));
    this.router.navigate([`home/store/${item.storeName}/${item.id}`])
  }

}
