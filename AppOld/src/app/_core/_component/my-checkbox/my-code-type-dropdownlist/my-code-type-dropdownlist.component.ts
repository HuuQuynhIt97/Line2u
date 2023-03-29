import { DataManager, Query, UrlAdaptor } from '@syncfusion/ej2-data';
import { Component, Input, OnInit, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Browser } from '@syncfusion/ej2-base';

@Component({
  selector: 'app-my-code-type-dropdownlist',
  templateUrl: './my-code-type-dropdownlist.component.html',
  styleUrls: ['./my-code-type-dropdownlist.component.css']
})
export class MyCodeTypeDropdownlistComponent implements OnInit, OnChanges {

  @Input() id = "codeType-remote";
  @Input() selectedValue: any;
  @Input() placeholder = "";
  @Input() codeType = "";
  @Input() disabled = false;
  @Output() change = new EventEmitter<any>();
  @Output() ngModelChange = new EventEmitter<any>();
  @Output() selectedValueChange = new EventEmitter<any>();
  @ViewChild('codeTypeRemote') public dropdownObj: DropDownListComponent
  @Output('onblur') onblurChange = new EventEmitter<any>();

  public data: DataManager;
  public query: Query ;
  public remoteFields: Object = { text: 'name', value: 'guid' };
  baseUrl = environment.apiUrl;
  take = 20;
  skip = 0;
  public relatePosition;
  public popupOpenHandler;
  public onOpen(args) {
    this.autoResizeDropDown(args)
    // let start: number = this.take;
    // let end: number = 5;
    // let listElement: HTMLElement = (this.dropdownObj as any).list;
    // listElement.addEventListener('scroll', () => {
    //   console.log(listElement.scrollTop + listElement.offsetHeight,listElement.scrollHeight )
    //   if ((listElement.scrollTop + listElement.offsetHeight) >= listElement.scrollHeight) {

    //     let filterQuery = this.dropdownObj.query.clone();
    //     this.data.executeQuery(filterQuery.skip(start).take(end)).then((event: any) => {
    //       start = end;
    //       end += 5;
    //       // const unique = [...new Set(event.result.map(item => item.group))];
    //       this.dropdownObj.addItem(event.result as { [key: string]: Object }[]);
    //     }).catch((e: Object) => {
    //     });
    //   }
    // })
  }
  autoResizeDropDown(event) {
    var parentEl = document.getElementById(this.id)
    setTimeout(() => {
      if (Browser.isDevice) {
        event.popup.position = { X: 'left', Y: 'bottom' };
        event.popup.width = 300;
        event.popup.dataBind();
        event.popup.element.classList.remove('e-ddl-device', 'e-popup-full-page'
        );
        event.popup.element.style.top = parseInt(event.popup.element.style.top) + 'px';
        event.popup.element.style.bottom = 'auto';
        event.popup.element.style.maxHeight = 300;
        event.popup.element.querySelector('.e-content').style.maxHeight = 300 + 'px';
        event.popup.element.querySelector('.e-content').style.height = 'initial';
      }
    },150 );
  }

  autoResizeDropDown2(event) {
    
  }

  public onOpenD(event) {
    setTimeout(() => {
      if (Browser.isDevice) {
        event.popup.position = { X: 'left', Y: 'bottom' };
        event.popup.width = 300;
        event.popup.dataBind();
        event.popup.element.classList.remove('e-ddl-device','e-popup-full-page');
        event.popup.element.style.top = parseInt(event.popup.element.style.top) + 'px';
        event.popup.element.style.bottom = 'auto';
        event.popup.element.style.maxHeight = 300;
        event.popup.element.querySelector('.e-content').style.maxHeight = 300 + 'px';
        event.popup.element.querySelector('.e-content').style.height = 'initial';
      }
    });
    // event.popup.position = { X: 'left', Y: 'bottom' };
    // event.popup.width = document.getElementById('hallDropdownModal').offsetWidth;
    // event.popup.dataBind();
    // event.popup.element.classList.remove(
    //   'e-ddl-device',
    //   'e-popup-full-page'
    // );
    // event.popup.element.style.top = parseInt(event.popup.element.style.top) + 'px';
    // event.popup.element.style.bottom = 'auto';
    // event.popup.element.style.maxHeight = 300;
    // event.popup.element.querySelector('.e-content').style.maxHeight =
    //   300 + 'px';
    // event.popup.element.querySelector('.e-content').style.height =
    //   'initial';
  }

  public onFiltering: any = (e: any) => {
    if (e.text === '') {
      e.updateData(this.data);
    } else {
      const query = this.dropdownObj.query.clone().search(e.text, 'name');
      e.updateData(this.data, query);
    }
  };
  public actionComplete(e: any): void {
    if(this.codeType === "VIP_TYPEC") {
      e.result = e.result.filter(x => x.guid === this.selectedValue.toString()).map(x => {
        let name = x.guid === "" ? this.trans.instant(x.name) : x.name;
        return {
          guid: x.guid,
          name: name
        }
      })
    }else {
      e.result = e.result.map(x => {
        let name = x.guid === "" ? this.trans.instant(x.name) : x.name;
        return {
          guid: x.guid,
          name: name
        }
      })
      
    }
}
  constructor(public trans: TranslateService) {}
  ngOnInit() {
    this.query = new Query()
    .skip(this.skip)
    .addParams("lang", localStorage.getItem('lang'));
    this.data = new DataManager({
      url: `${this.baseUrl}CodeType/GetDataDropdownlist?lang=${localStorage.getItem('lang')}&codeType=${this.codeType}`,
      adaptor: new UrlAdaptor,
      crossDomain: true,
    }, this.query);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    this.selectedValue = this.selectedValue || "";
  }
  onChange(args) {
    console.log(args)
    this.change.emit(args);
  }
  onNgModelChange(value) {
    console.log(value)
    this.ngModelChange.emit(value);
    this.selectedValueChange.emit(value);
    console.log(this.selectedValue)
  }
  onblur(e) {
    this.onblurChange.emit(e);
  }

}
