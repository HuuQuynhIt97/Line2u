import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-breeding-detail-modal',
  templateUrl: './breeding-detail-modal.component.html',
  styleUrls: ['./breeding-detail-modal.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class BreedingDetailModalComponent implements OnInit {
  audit: any
  model: any
  dataSource: any
  editSettings: any
  pageSettings: any
  title: any = '選配作業'
  user = JSON.parse(localStorage.getItem('user'))

  @ViewChild("optionModal") templateRef: TemplateRef<any>;

  constructor(
    public modalService: NgbModal,
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }
  open() { this.modalService.open(this.templateRef, {
    size: "xl",
    backdrop: "static",
  }); }
}
