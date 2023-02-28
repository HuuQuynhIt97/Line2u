import { DatePipe, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageConstants } from 'src/app/_core/_constants';
import { Pig } from 'src/app/_core/_model/pigs';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { PigService } from 'src/app/_core/_service/pigs';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { PigModalComponent } from '../pig-modal/pig-modal.component';

@Component({
  selector: 'app-pig-organization-modal',
  templateUrl: './pig-organization-modal.component.html',
  styleUrls: ['./pig-organization-modal.component.css']
})
export class PigOrganizationModalComponent implements OnInit {
  @Input() nodes: any = []
  @Input() title:string;
  @Input() model:Pig;
 
  constructor(
    public activeModal: NgbActiveModal,
    private service: PigService,
    private cdr: ChangeDetectorRef,
    private alertify: AlertifyService,
    private datePipe: DatePipe,
    public modalService: NgbModal,
    public translate: TranslateService
    ) {
    }
  ngOnInit() {
  }
  itemClick(e) {
    this.service.getById(e.id).pipe(tap(data => {
      this.openModal(data);
    })).subscribe()
  }
  openModal(data = {} as any) {
  this.title = 'PIG_EDIT_MODAL';
  const modalRef = this.modalService.open(PigModalComponent, {size: 'xl',backdrop: 'static'});
  modalRef.componentInstance.title = this.title;
  modalRef.componentInstance.model =data;
  modalRef.result.then((result) => {
  }, (reason) => {
  });
}
}
