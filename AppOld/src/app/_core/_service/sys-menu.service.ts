import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SysMenu } from '../_model/sys-menu';

import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SysMenuService extends CURDService<SysMenu> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"SysMenu", utilitiesService);
  }
  getParents(lang) {
    return this.http.get<any>(`${this.base}SysMenu/getParents?lang=${lang}`, {});
  }
  getToolbarParents(lang) {
    return this.http.get<any>(`${this.base}SysMenu/getToolbarParents?lang=${lang}`, {});
  }
  getToolbarParentsLevel2(lang, upperId) {
    return this.http.get<any>(`${this.base}SysMenu/getToolbarParentsLevel2?lang=${lang}&upperId=${upperId}`, {});
  }
  getMenus(lang) {
    return this.http.get<any>(`${this.base}SysMenu/getMenus?lang=${lang}`, {});
  }
  getMenusByFarm(lang,farmGuid) {
    return this.http.get<any>(`${this.base}SysMenu/getMenusByFarm?lang=${lang}&farmGuid=${farmGuid}`, {});
  }
  getItemByKind(lang,kind) {
    return this.http.get<any>(`${this.base}SysMenu/GetItemByKind?lang=${lang}&kind=${kind}`, {});
  }
  getMenusByMenuType(lang,menuType) {
    return this.http.get<any>(`${this.base}SysMenu/getMenusByMenuType?lang=${lang}&menuType=${menuType}`, {});
  }
  getMenuTopMobile(lang,menuType) {
    return this.http.get<any>(`${this.base}SysMenu/getMenuTopMobile?lang=${lang}&menuType=${menuType}`, {});
  }
  getMenuBottomMobile(lang,menuType) {
    return this.http.get<any>(`${this.base}SysMenu/getMenuBottomMobile?lang=${lang}&menuType=${menuType}`, {});
  }

}
