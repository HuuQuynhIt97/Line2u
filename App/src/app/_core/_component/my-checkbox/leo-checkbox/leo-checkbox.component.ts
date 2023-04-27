import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-leo-checkbox',
  templateUrl: './leo-checkbox.component.html',
  styleUrls: ['./leo-checkbox.component.scss']
})
export class LeoCheckboxComponent implements OnInit ,OnChanges {

  @Input() checked: any;
  @Input() label: any = '';
  @Output() checkedChange = new EventEmitter<any>();
  checkedValue = false;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.checked != changes.checked.currentValue) {
      this.checked = changes.checked.currentValue;
      this.checkedValue = this.checked === 1 ? true : false;
    }
    if (changes.checked.firstChange) {
      this.checked = changes.checked.currentValue;
      this.checkedValue = this.checked === 1 ? true : false;
    }
  }

  ngOnInit() {
    console.log(this.checked);
    console.log(this.label);
  }
  onCheckedChange(value) {
    this.checked = value === true ? 1 : 0;
    this.checkedChange.emit(this.checked)
  }

}
