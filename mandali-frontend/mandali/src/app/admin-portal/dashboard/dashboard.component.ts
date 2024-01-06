import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { UserData } from '../../UserData/userdata';
import { AdminModuleService } from '../admin-portal.service';
import { HeaderComponent } from '../../header/header.component';
import { ModalContentComponent } from '../../modal-content/modal-content.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @ViewChild('ConfirmModal', { static: true }) ConfirmModal !: ElementRef;

  memberData !: any[]
  UserForm !: FormGroup;
  UserData: any;
  TotalAccount = 1;
  UserType = 'member';

  constructor(
    private _ModalService: NgbModal,
    private _ADMS: AdminModuleService,
  ) {
  }
  
  ngOnInit(): void {

    this.UserData = new UserData().getData('userdata');
    this.UserType = this.UserData.user.UserType;

    this.UserForm = new FormGroup({
      FirstName: new FormControl('', [Validators.required]),
      LastName: new FormControl('', [Validators.required]),
      NoOfAccount: new FormControl(1, [Validators.required, Validators.min(1)]),
      IsAdmin: new FormControl(false),
      ContactNumber: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl(this.generateRandomPassword(16), [Validators.required]),
      MandaliId: new FormControl(this.UserData.user.MandaliId),
    });

    this._ADMS.readUser({
      MandaliId: this.UserData.user.MandaliId
    }).subscribe(
      (data: any) => {
        console.log(data); 
        this.memberData = data.data.UserDetails; 
        this.TotalAccount = data.data.TotalAccount;
      },
      (e) => {
        console.log(e);
      }
    );
    // this.memberData = [
    //   { "No": 1, "Member_Name": "John Doe", "Contact": "123-456-7890", "Total_Investment": 50000, "Edit_User": "Edit", "Active": true, "Current_Value": 55000, "Share": 0.05, "Net_Profit": 5000 },
    //   { "No": 2, "Member_Name": "Jane Smith", "Contact": "987-654-3210", "Total_Investment": 75000, "Edit_User": "Edit", "Active": false, "Current_Value": 72000, "Share": 0.08, "Net_Profit": -3000 },
    //   { "No": 3, "Member_Name": "Bob Johnson", "Contact": "555-123-4567", "Total_Investment": 100000, "Edit_User": "Edit", "Active": true, "Current_Value": 110000, "Share": 0.1, "Net_Profit": 10000 },
    //   { "No": 4, "Member_Name": "Alice Brown", "Contact": "111-222-3333", "Total_Investment": 30000, "Edit_User": "Edit", "Active": true, "Current_Value": 32000, "Share": 0.03, "Net_Profit": 2000 },
    //   { "No": 5, "Member_Name": "Charlie Wilson", "Contact": "444-555-6666", "Total_Investment": 60000, "Edit_User": "Edit", "Active": false, "Current_Value": 58000, "Share": 0.06, "Net_Profit": -2000 },
    //   { "No": 6, "Member_Name": "Eva Davis", "Contact": "777-888-9999", "Total_Investment": 90000, "Edit_User": "Edit", "Active": true, "Current_Value": 95000, "Share": 0.09, "Net_Profit": 5000 },
    //   { "No": 7, "Member_Name": "Frank Miller", "Contact": "333-222-1111", "Total_Investment": 120000, "Edit_User": "Edit", "Active": false, "Current_Value": 115000, "Share": 0.12, "Net_Profit": -5000 },
    //   { "No": 8, "Member_Name": "Grace Turner", "Contact": "666-777-8888", "Total_Investment": 45000, "Edit_User": "Edit", "Active": true, "Current_Value": 47000, "Share": 0.045, "Net_Profit": 2000 },
    //   { "No": 9, "Member_Name": "Henry Wilson", "Contact": "999-888-7777", "Total_Investment": 80000, "Edit_User": "Edit", "Active": true, "Current_Value": 82000, "Share": 0.08, "Net_Profit": 2000 },
    //   { "No": 10, "Member_Name": "Isabel Moore", "Contact": "222-333-4444", "Total_Investment": 35000, "Edit_User": "Edit", "Active": false, "Current_Value": 32000, "Share": 0.03, "Net_Profit": -3000 },
    //   { "No": 11, "Member_Name": "Jack White", "Contact": "555-444-3333", "Total_Investment": 70000, "Edit_User": "Edit", "Active": true, "Current_Value": 72000, "Share": 0.07, "Net_Profit": 2000 },
    //   { "No": 12, "Member_Name": "Kelly Black", "Contact": "111-999-8888", "Total_Investment": 25000, "Edit_User": "Edit", "Active": false, "Current_Value": 22000, "Share": 0.025, "Net_Profit": -3000 },
    //   { "No": 13, "Member_Name": "Larry Green", "Contact": "777-666-5555", "Total_Investment": 110000, "Edit_User": "Edit", "Active": true, "Current_Value": 115000, "Share": 0.11, "Net_Profit": 5000 },
    //   { "No": 14, "Member_Name": "Mia Taylor", "Contact": "444-333-2222", "Total_Investment": 32000, "Edit_User": "Edit", "Active": false, "Current_Value": 30000, "Share": 0.03, "Net_Profit": -2000 },
    //   { "No": 15, "Member_Name": "Nathan Clark", "Contact": "888-777-6666", "Total_Investment": 54000, "Edit_User": "Edit", "Active": true, "Current_Value": 56000, "Share": 0.054, "Net_Profit": 2000 },
    //   { "No": 16, "Member_Name": "Olivia Turner", "Contact": "555-444-3333", "Total_Investment": 96000, "Edit_User": "Edit", "Active": false, "Current_Value": 92000, "Share": 0.09, "Net_Profit": -4000 },
    //   { "No": 17, "Member_Name": "Paul Anderson", "Contact": "111-222-3333", "Total_Investment": 42000, "Edit_User": "Edit", "Active": true, "Current_Value": 45000, "Share": 0.042, "Net_Profit": 3000 },
    //   { "No": 18, "Member_Name": "Quincy Harris", "Contact": "777-888-9999", "Total_Investment": 78000, "Edit_User": "Edit", "Active": true, "Current_Value": 80000, "Share": 0.078, "Net_Profit": 2000 },
    //   { "No": 19, "Member_Name": "Rachel Smith", "Contact": "333-444-5555", "Total_Investment": 64000, "Edit_User": "Edit", "Active": false, "Current_Value": 62000, "Share": 0.064, "Net_Profit": -2000 },
    //   { "No": 20, "Member_Name": "Samuel Brown", "Contact": "999-888-7777", "Total_Investment": 88000, "Edit_User": "Edit", "Active": true, "Current_Value": 92000, "Share": 0.088, "Net_Profit": 4000 }
    // ];
  }

  generateRandomPassword(length: number) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
  
    return password;
  }

  add_user_modal() {
    if(this.UserType == 'admin') {
      this._ModalService.open(this.ConfirmModal, {
        centered: true,
        backdrop: 'static',
        keyboard: false,
      });
    }
    else {
      this.openErrorMsg("You don't have access to add member");
    }
  }

  add_user() {
    if (this.UserForm.valid) {
      this._ADMS.addUser(this.UserForm.value).subscribe(
        (data: any) => {
          this._ModalService.dismissAll();
          this.UserForm.reset();
          this.openErrorMsg(data.statusMessage);
          this.ngOnInit();
        },
        (err) => {
          console.log(err);
          this.openErrorMsg(err.statusMessage);
        }
      );
    } 
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.UserForm.get('Password')?.value);    
  }
  
  openErrorMsg(str: any) {
    let cfm = this._ModalService.open(ModalContentComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    cfm.componentInstance.name = str;

    cfm.result.then((res) => {
      if (res) {
      }
    });
  }



}
