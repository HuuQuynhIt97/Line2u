import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataManager, Query, UrlAdaptor, Predicate } from '@syncfusion/ej2-data';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/_core/_service/auth.service';
import { SysMenuService } from 'src/app/_core/_service/sys-menu.service';
import { AlertifyService } from 'herr-core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { StoreProfile } from 'src/app/_core/_model/xaccount';
import { Products } from 'src/app/_core/_model/evse/products';
@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: [
    './home-header.component.scss',
    '../../../../assets/css/foodpanda.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class HomeHeaderComponent implements OnInit {
  baseUrl = environment.apiUrlImage;
  logo: any;
  isOpenDropdown: boolean = false
  username: ''
  storeInfo: StoreProfile = {} as StoreProfile;
  cartDetail: Products[] = [];
  totalPrice: number;
  isLogin: boolean = false
  user = JSON.parse(localStorage.getItem('user'))
  lang: string;
  count: any = 0;
  languageData = [
    { id: "Tw", name: "Tw" },
    { id: "En", name: "En" },
  ];
  fieldsLang: object = { text: "name", value: "id" };
  constructor(
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private sysMenuService: SysMenuService,
    private alertify: AlertifyService,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.isLogin = true
      this.username = this.user.accountName
    }else {
      this.isLogin = false
    }
    this.lang = this.capitalize(localStorage.getItem("lang"));
    this.loadLogoData();
    const cartDetail = this.getLocalStore("cart_detail");
    this.count = cartDetail.map((selection) => selection.quantity).reduce((sum, quantity) => sum += quantity, 0);
  }
  langValueChange(args) {
    const lang = args.itemData.id.toLowerCase();
    localStorage.removeItem("lang");
    localStorage.setItem("lang", lang);
    this.lang = this.capitalize(localStorage.getItem("lang"));
    location.reload();
  }
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  loginUser() {
    const uri = this.router.url;
    localStorage.setItem('isLogin_Cus',uri)
    this.router.navigate(["user-login"], {
      queryParams: { uri },
      replaceUrl: true,
    });
    // return this.router.navigate[('user-login')]
  }
  logOutUser() {
    const uri = this.router.url;
    localStorage.setItem('lang','tw')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    // this.router.navigate(['/mobile/landlord-login']);
    this.alertify.message(this.translate.instant('Logged out'));
    location.reload();
  }
  openCart(){
    // this.modalReference = this.modalService.open(template, {size: 'xl',backdrop: 'static'});
    this.router.navigate([`home/store/${this.storeInfo.storeName}/${this.storeInfo.id}/shop-cart`])
    // this.router.navigate([`home/news-detail/${item.id}`])
    this.cartDetail = this.getLocalStore("cart_detail");
    this.totalPrice = this.cartDetail.map((selection) => selection.price).reduce((sum, price) => sum += price, 0);
  }
  getLocalStore(key: string) {
    const data = JSON.parse(localStorage.getItem(key)) || [];
    return data;
  }
  OpenDropdown() {
    this.isOpenDropdown = !this.isOpenDropdown
  }
  loadLogoData() {
    let query = new Query();
    query.where("type", "equal", "Logo");
    new DataManager({
      url: `${environment.apiUrl}WebNews/LoadData?lang=${localStorage.getItem(
        "lang"
      )}`,
      adaptor: new UrlAdaptor(),
    })
      .executeQuery(query.sortBy("sortId"))
      .then((res: any) => {
        var data = res.result.result;
        this.logo = data.length > 0 ? data[0].photoPath : "../../../assets/images/logo.png";
      })
      .catch((err) => {});
  }

}
