import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LineBotInfor } from 'src/app/_core/_model/evse/lineBotInfor';
import { CalendarsServiceService } from 'src/app/_core/_service/evse/calendarsService.service';
import { LineLoginOrNotifyService } from 'src/app/_core/_service/evse/lineLoginOrNotify.service';
import { SignarlService } from 'src/app/_core/_service/evse/signarl.service';
import { XAccountService } from 'src/app/_core/_service/xaccount.service';
import { environment } from 'src/environments/environment';
declare let $: any;
@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements AfterViewInit, OnInit {
  typing: string;
  messages: any;
  currentUser: any;
  projectName: '';
  projects: any;
  userLine: any[];
  user_infor = JSON.parse(localStorage.getItem('user'))
  keyword: '%20';
  botInfoData: LineBotInfor = {} as LineBotInfor;
  isActive: boolean;
  message: string = '';
  recieve: any = '';
  height: any;
  baseUrl = environment.apiUrlImage;
  @ViewChild('getHeight') getHeight: ElementRef;
  constructor(
    private calendarsService: CalendarsServiceService,
    private sanitizer: DomSanitizer,
    public signalRService: SignarlService,
    private lineNotify: LineLoginOrNotifyService,
    private serviceXaccount: XAccountService
  ) { 
    this.signalRService.currentMessage.subscribe((res: any) => {
      if(res !== 0) {
        if(this.recieve === res.loadUserFrom || this.recieve === res.loadUserTo) {
          this.startHttpRequest();
        }else {
          console.log('Signalr nothing refresh');
        }
      }else {
        console.log('Signalr nothing refresh');
      }

    })
  }
  ngAfterViewInit(): void {
    console.log('aaaa')
    $(".chat-list a").click(function() {
      $(".chatbox").addClass('showbox');
      return false;
    });

    $(".chat-icon").click(function() {
        $(".chatbox").removeClass('showbox');
    });
  }

  ngOnInit() {
    this.getInforOfficial()
    this.loadUserLineData()
    this.signalRService.startConnection()
    this.signalRService.loadData()
    this.startHttpRequest();
  }
  private startHttpRequest = () => {
    this.getChatMessage();
  }
  ngOnDestroy(): void {
    this.signalRService.close();

  }
  searchProjects() {
    this.loadUserLineDataWithKey();
  }
  loadUserLineData() {
    this.serviceXaccount.getXAccountsToSendMessage(this.user_infor.uid).subscribe(res => {
      this.userLine = res
    })
  }
  loadUserLineDataWithKey() {
    this.serviceXaccount.getXAccountsToSendMessageWithKeyWord(this.keyword,this.user_infor.id).subscribe(res => {
      this.userLine = res
    })
  }
  sendMessage(event) {
    // // console.log(event);
    // if (event.type === 'keyup') {
    //   this.stopTyping();
    // }
    // this.stillTyping();
    if (event.keyCode === 13) {
      this.sendToGroup();
      // self.$refs.messageBox.scrollTop = self.$refs.messageBox.scrollHeight;
    }
  }
  onBlurInputChat(event) {
    // this.stopTyping();
    // this.showImageList = false;
  }
  sendToGroup() {
    this.addMessageGroup();
    // this.isShowIcon = false;
    // this.showImageList = false;
    this.message = '';
  }
  addMessageGroup() {
    let chat = {
      OfficialId: this.botInfoData.userId,
      OfficialName: this.botInfoData.displayName,
      Sender: this.botInfoData.userId,
      Receive: this.recieve,
      AccountUid: this.user_infor.uid,
      Message: this.message
    };
    this.lineNotify.addMessage(chat)
    .subscribe(arg => {
      // this.uploadImage(arg);
    });
  }
  getInforOfficial() {
    this.lineNotify.getBotInfor(this.user_infor.id).subscribe(res => {
      this.botInfoData = res as LineBotInfor
    })
  }
  defaultImage() {
    return '../../../../assets/images/no-img.jpg';
  }
  imageBase64(img) {
    if (img == null) {
      return this.defaultImage();
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, ' + img);
    }
  }
  joinGroup(item) {
    this.isActive = true;
    this.projectName = item.accountName;
    this.recieve = item.uid
    this.getChatMessage();
  }
  getChatMessage() {
    this.lineNotify.getAllMessage(this.botInfoData.userId, this.recieve).subscribe(
      (response: any) => {
        this.messages = response;
        let objDiv = document.getElementById('messageBox');
        objDiv.scrollTop = objDiv.offsetHeight;
      });
  }
 
  checkShowMessage(user): string {
    // let check = Number(this.currentUser) === Number(user);
    return this.botInfoData.userId === user ? 'sent' : 'replies';
  }
  checkShowMessageUsername(user): string {
    // let check = Number(this.currentUser) === Number(user);
    return this.botInfoData.userId === user ? 'username-sent' : 'username-replies';
  }
  datetime(d) {
    return this.calendarsService.JSONDateWithTime(d);
  }

}
