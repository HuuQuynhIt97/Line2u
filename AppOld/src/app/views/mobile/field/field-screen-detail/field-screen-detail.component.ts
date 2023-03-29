import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Site } from 'src/app/_core/_model/evse/model';
import { SiteService } from 'src/app/_core/_service/evse/site.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-field-screen-detail',
  templateUrl: './field-screen-detail.component.html',
  styleUrls: ['./field-screen-detail.component.scss']
})
export class FieldScreenDetailComponent implements OnInit {
  item: Site
  baseUrl = environment.apiUrlImage;

  constructor(
    private activatedRoute: ActivatedRoute,
    private siteService: SiteService,
    ) { }

  ngOnInit() {
    this.loadDetail();
  }
  loadDetail() {
    const guid = this.activatedRoute.snapshot.params.guid;
    if (guid) {
      this.siteService.getByGuid(guid).subscribe(x=> {
        this.item = x;
      })
    }
    
  }
}
