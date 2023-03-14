import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  DataManager,
  Query,
  UrlAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";
import { StoreProfileService } from "src/app/_core/_service/evse/store-profile.service";
import { WebNewsService } from "src/app/_core/_service/evse/web-news.service";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-home-store-list',
  templateUrl: './home-store-list.component.html',
  styleUrls: ['./home-store-list.component.scss']
})
export class HomeStoreListComponent implements OnInit {

  news = [];
  baseUrl = environment.apiUrlImage;

  constructor(
    private service: StoreProfileService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.loadStoreData();
  }

  loadStoreData() {
    this.service.getAll().subscribe(x=> {
      console.log(x)
      this.news = x;
    })
    
  }
  gotoShop(item) {
    localStorage.setItem('store', JSON.stringify(item));
    this.router.navigate([`home/store/${item.storeName}/${item.id}`])
  }

}
