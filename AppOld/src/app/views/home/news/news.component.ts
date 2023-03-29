import { Component, OnInit } from "@angular/core";
import {
  DataManager,
  Query,
  UrlAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";
import { WebNewsService } from "src/app/_core/_service/evse/web-news.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.css"],
})
export class NewsComponent implements OnInit {
  news = [];
  baseUrl = environment.apiUrlImage;

  constructor(private webNewsService: WebNewsService) {}

  ngOnInit(): void {
    this.loadNewsData();
  }

  loadNewsData() {
    this.webNewsService.getWebNews().subscribe(x=> {
      this.news = x;
    })
    
  }
}
