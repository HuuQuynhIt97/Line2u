import { Component, OnInit } from "@angular/core";
import {
  DataManager,
  Query,
  UrlAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";
import { UtilitiesService } from "herr-core";
import { WebNewsService } from "src/app/_core/_service/evse/web-news.service";
import { environment } from "src/environments/environment";
import { ImagePathConstants } from 'src/app/_core/_constants';
@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.css"],
})
export class NewsComponent implements OnInit {
  news = [];
  baseUrl = environment.apiUrlImage;
  noImage = ImagePathConstants.NO_IMAGE_QR;
  noImage_Comment = ImagePathConstants.NO_IMAGE_HEADER_IMAGE;
  apiHost = environment.apiUrl.replace('/api/', '');
  
  constructor(
    private utilityService: UtilitiesService,
    private webNewsService: WebNewsService) {}

  ngOnInit(): void {
    this.loadNewsData();
  }

  loadNewsData() {
    this.webNewsService.getWebNews().subscribe(x=> {
      this.news = x;
    })
    
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
}
