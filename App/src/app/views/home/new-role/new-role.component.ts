import { Component, OnInit, SecurityContext } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import {
  DataManager,
  Query,
  UrlAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";
import { WebNewsService } from "src/app/_core/_service/evse/web-news.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-new-role",
  templateUrl: "./new-role.component.html",
  styleUrls: ["./new-role.component.scss"],
})
export class NewRoleComponent implements OnInit {
  news = [];
  baseUrl = environment.apiUrlImage;
  constructor(
    public sanitizer: DomSanitizer,
    private webNewsService: WebNewsService
  ) {}
  ngOnInit(): void {
    this.loadNewsRoleData();
  }
  safeHtml(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }


  loadNewsRoleData() {
    this.webNewsService.getWebPages().subscribe((x) => {
      this.news = x;
    });
  }
}
