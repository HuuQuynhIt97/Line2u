import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { SystemGroupNo } from 'src/app/_core/enum/SystemGroupNo';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { AuthLandlordService } from 'src/app/_core/_service/auth-landlord.service';
import { AuthService } from 'src/app/_core/_service/auth.service';
import { environment } from 'src/environments/environment';
declare let $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username: any;
  user = JSON.parse(localStorage.getItem('user_landlord'))
  constructor(
    public router: Router,
    private cookieService: CookieService,
    private alertify: AlertifyService,
    private trans: TranslateService,
    private authService: AuthLandlordService
    ) {
     }
  ngOnInit() {
    this.username =
    JSON.parse(localStorage.getItem("user_landlord"))?.username || "Guest";
    this.configImage();

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
      this.router.navigate(['/login']);
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
      deleteUrl: `${environment.apiUrl}Landlord/DeleteUploadFile`
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
