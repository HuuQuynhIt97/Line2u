import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from 'herr-core';
import { CookieService } from 'ngx-cookie-service';
import { SystemGroupNo } from 'src/app/_core/enum/SystemGroupNo';
import { XAccount } from 'src/app/_core/_model/xaccount';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { AuthLandlordService } from 'src/app/_core/_service/auth-landlord.service';
import { AuthService } from 'src/app/_core/_service/auth.service';
import { XAccountService } from 'src/app/_core/_service/xaccount.service';
import { environment } from 'src/environments/environment';
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
import { DataService } from 'src/app/_core/_service/data.service';
declare let $: any;

@Component({
  selector: 'app-home-boss-update-restaurant',
  templateUrl: './home-boss-update-restaurant.component.html',
  styleUrls: ['./home-boss-update-restaurant.component.css']
})
export class HomeBossUpdateRestaurantComponent implements OnInit {
  username: any;
  model: XAccount = {} as XAccount;
  user = JSON.parse(localStorage.getItem('user'))
  noImage = ImagePathConstants.NO_IMAGE_QR;
  apiHost = environment.apiUrl.replace('/api/', '');
  IsloadCategoryProductComponent: boolean = false
  IsloadStoreTableComponent: boolean = false
  IsloadBannerNewComponent: boolean = false
  IsloadPreviewComponent: boolean = false
  @ViewChild('myButton1') myButton1 : ElementRef;
  @ViewChild('myButton2') myButton2 : ElementRef;
  @ViewChild('myButton3') myButton3 : ElementRef;
  constructor(
    public router: Router,
    private cookieService: CookieService,
    private alertify: AlertifyService,
    private dataService: DataService,
    private trans: TranslateService,
    private utilityService: UtilitiesService,
    private service: XAccountService,
    private authService: AuthLandlordService
    ) {
      this.dataService.currentMessage.subscribe((res: any) => {
        if(res === 'nextStep2') {
          this.trigger1Click()
        }
        // if(res === 'nextStep3') {
        //   this.trigger2Click()
        // }
        // if(res === 'nextStep4') {
        //   this.trigger3Click()
        // }
      })
     }
  ngOnInit() {
    // this.loadDetail();
    this.username =
    JSON.parse(localStorage.getItem("user_landlord"))?.username || "Guest";
    // this.configImage();

  }

  Back() {
    let isLogin_Cus_url = localStorage.getItem('isLogin_Cus')
    this.router.navigate([isLogin_Cus_url]);
  }
  trigger1Click() {
    let el: HTMLElement = this.myButton1.nativeElement as HTMLElement;
    console.log(el)
    setTimeout(()=> el.click(), 200);
  }
  trigger2Click() {
    let el: HTMLElement = this.myButton2.nativeElement as HTMLElement;
    console.log(el)
    setTimeout(()=> el.click(), 200);
  }
  trigger3Click() {
    let el: HTMLElement = this.myButton3.nativeElement as HTMLElement;
    console.log(el)
    setTimeout(()=> el.click(), 200);
  }
  loadCategoryProductComponent() {
    this.IsloadCategoryProductComponent = true;
    this.IsloadStoreTableComponent = true;
  }
  loadBannerNewComponent() {
    this.IsloadBannerNewComponent = true
    this.IsloadCategoryProductComponent = false
  }
  loadPreviewComponent() {
    this.IsloadPreviewComponent = true
    this.IsloadBannerNewComponent = false
    this.IsloadCategoryProductComponent = false
  }
  loadDetail() {
    const guid = this.user.id;
    if (guid) {
      this.service.getById(guid).subscribe(x=> {
        this.model = x;

        this.configImage();
      })
    }
    
  }
  imagePath(path) {
    if (path !== null && this.utilityService.checkValidImage(path)) {
      if (this.utilityService.checkExistHost(path)) {
        return path;
      }
      return this.apiHost + path;
    }
    return this.noImage;
  }
  backDesktop() {
    this.router.navigate(['/'])
    .then(() => {
      window.location.reload();
    });
  }
  logout() {
    this.authService.logOutLandlord().subscribe(() => {
      const uri = this.router.url;
      this.cookieService.delete('remember_landlord');
      this.cookieService.delete('key_temp_landlord');
      localStorage.setItem('lang','tw')
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      // this.router.navigate(['/mobile/landlord-login']);
      this.router.navigate(['/home']);
      this.alertify.message(this.trans.instant('Logged out'));
    });
  }
  goToDetail() {
    this.router.navigate(['/mobile/detail']);
  }
  goToMakeOrder(type) {
    this.router.navigate([`/mobile/pigdata/${type}`]);
  }
  noFunction() {
    alert('This function is not ready!')
  }
  configImage() {
    var btnCust = '<button type="button" class="btn btn-secondary edit-profile" >' +
    '<i class="bi-tag"></i>' +
    '</button>'; 
    const option = {
      overwriteInitial: true,
      maxFileSize: 1500,
      showClose: false,
      showCaption: false,
      browseLabel: '',
      removeLabel: '',
      browseIcon: '<i class="bi-folder2-open"></i>',
      removeIcon: '<i class="bi-x-lg"></i>',
      removeTitle: 'Cancel or reset changes',
      elErrorContainer: '#kv-avatar-errors-1',
      msgErrorClass: 'alert alert-block alert-danger',
      defaultPreviewContent: '<img class="img-circle" src="../../../../../assets/images/no-img.jpg" alt="No Image">',
      layoutTemplates: { main2: '{preview} ' +  btnCust + ' {browse}' },
      allowedFileExtensions: ["jpg", "png", "gif"],
      initialPreview: [],
      initialPreviewConfig: [],
      deleteUrl: `${environment.apiUrl}xAccount/DeleteUploadFile`
    };
  
    $("#avatar-1").fileinput(option);;
    let that = this;
    $('#avatar-1').on('filedeleted', function (event, key, jqXHR, data) {

    });
    $('.edit-profile').on('click', function (event, key, jqXHR, data) {
      alert(1)
    });
  }

}
