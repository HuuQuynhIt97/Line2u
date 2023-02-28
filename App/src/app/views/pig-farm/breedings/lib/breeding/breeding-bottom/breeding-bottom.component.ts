import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'herr-core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { BreedingDetailModalComponent } from './breeding-detail-modal/breeding-detail-modal.component';
import { BreedingModalComponent } from './breeding-modal/breeding-modal.component';
import { BreedingTakeCareModalComponent } from './breeding-take-care-modal/breeding-take-care-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-breeding-bottom',
  templateUrl: './breeding-bottom.component.html',
  styleUrls: ['./breeding-bottom.component.css']
})
export class BreedingBottomComponent extends BaseComponent implements OnInit {
  data: any;
  toolbarOptions = [];
  active = 0;
  addbtn = '';
  @ViewChild(BreedingModalComponent) breedingModal: BreedingModalComponent;
  @ViewChild(BreedingDetailModalComponent) breedingDetailModal: BreedingDetailModalComponent;
  @ViewChild(BreedingTakeCareModalComponent) breedingTakeCareModal: BreedingTakeCareModalComponent;

  constructor(
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
  ) {
	    super(translate,environment.apiUrl);
    }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.active = data.active;
      this.addbtn = data.addbtn;
    });
  }
  toolbarClick(e) {}
  dataBound() {}
  odsExport() {}
}