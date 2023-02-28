import { Component, OnInit } from '@angular/core';
import { LandlordService } from 'src/app/_core/_service/evse/landlord.service';

@Component({
  selector: 'app-bank-account-finish-screen',
  templateUrl: './bank-account-finish-screen.component.html',
  styleUrls: ['./bank-account-finish-screen.component.css']
})
export class BankAccountFinishScreenComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('user_landlord'))
  input: any;
  constructor(private landlordService: LandlordService) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.landlordService.getBankAccountByLandlordGuid(this.user.guid).subscribe(input => {
      this.input = input;
      console.log(input)
    })
  }

}
