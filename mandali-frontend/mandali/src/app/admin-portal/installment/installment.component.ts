import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserData } from '../../UserData/userdata';
import { AdminModuleService } from '../admin-portal.service';
import { ModalContentComponent } from '../../modal-content/modal-content.component';

@Component({
  selector: 'app-installment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './installment.component.html',
  styleUrl: './installment.component.css'
})
export class InstallmentComponent {
  @ViewChild('ConfirmationModal', { static: true }) ConfirmationModal !: ElementRef;

  InstallmentForm !: FormGroup;
  PendingRequest !: any[];
  InstallmentDetails !: any[];
  UserType = 'admin';
  UserData: any;
  months = [
    { name: 'January', value: '01' },
    { name: 'February', value: '02' },
    { name: 'March', value: '03' },
    { name: 'April', value: '04' },
    { name: 'May', value: '05' },
    { name: 'June', value: '06' },
    { name: 'July', value: '07' },
    { name: 'August', value: '08' },
    { name: 'September', value: '09' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' },
  ];
  currentYear = new Date().getFullYear();
  years = Array.from({ length: 21 }, (_, index) => (this.currentYear - 10) + index);

  constructor(
    private _ModalService: NgbModal,
    private _ADMS: AdminModuleService,
  ) {
  }

  ngOnInit() {  
    this.UserData = new UserData().getData('userdata');
    this.UserType = this.UserData.user.UserType;
    this.InstallmentForm = new FormGroup({
      Month: new FormControl('', [Validators.required]),
      Year: new FormControl('', [Validators.required]),
      Amount: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      MandaliId: new FormControl(this.UserData.user.MandaliId),
      UserId: new FormControl(this.UserData.user.UserId),
      UserType: new FormControl(this.UserType),
      Penalty: new FormControl(false),
      // Approved: new FormControl(false)
    });

    this._ADMS.readInstallment({
      MandaliId: this.UserData.user.MandaliId,
      UserId: this.UserData.user.UserId,
      UserType: this.UserType,
    }).subscribe(
      (data: any) => {
        console.log(data);    
        this.InstallmentDetails = data.data.Installment;
        this.PendingRequest = data.data.pending_installment;
      },
      (e) => {
        console.log(e);
      }
    );

    // this.PendingRequest = [
    //   { "No": 1, "Member_Name": "John Doe1", "Amount": 50000, "Date": "Nov-2023", "_id": '1234' },
    //   { "No": 2, "Member_Name": "John Doe2", "Amount": 50000, "Date": "Nov-2023", "_id": '1234' },
    //   { "No": 3, "Member_Name": "John Doe3", "Amount": 50000, "Date": "Nov-2023", "_id": '1234' },
    //   { "No": 4, "Member_Name": "John Doe4", "Amount": 50000, "Date": "Nov-2023", "_id": '1234' },
    // ];

    // this.InstallmentDetails = [
    //   { "No": 1, "Member_Name": "John Doe1", "Amount": 50000, "Date": "Nov-2023", "Total": 9500015 },
    //   { "No": 2, "Member_Name": "John Doe2", "Amount": 50000, "Date": "Nov-2023", "Total": 9500015 },
    //   { "No": 3, "Member_Name": "John Doe3", "Amount": 50000, "Date": "Nov-2023", "Total": 9500015 },
    //   { "No": 4, "Member_Name": "John Doe4", "Amount": 50000, "Date": "Nov-2023", "Total": 9500015 },
    // ];
  }

  // handleDateChange() {
  //   const selectedMonth = (document.getElementById('Month') as HTMLSelectElement).value;
  //   const selectedYear = (document.getElementById('Year') as HTMLSelectElement).value;
  //   const selectedDate = `${selectedYear}-${selectedMonth}`;
  //   console.log('Selected Date:', selectedDate);

  //   // You can perform further actions with the selected date if needed
  // }

  create_installment() {
    console.log(this.InstallmentForm.value); 
    this._ADMS.createInstallment(
      this.InstallmentForm.value
    ).subscribe(
      (data: any) => {
        console.log(data);  
        this._ModalService.dismissAll();
        this.openErrorMsg(data.statusMessage);
        this.ngOnInit();  
      },
      (err) => {
        console.log(err);
        this.openErrorMsg(err.statusMessage);
        this.ngOnInit();  
      }
    );
  }

  approveDeleteRequest(ID: any, active: any) {
    // this.InstallmentForm.get('Approved')?.setValue(Active);
    this._ADMS.approveDeletePendingRequest({
      PendingInstallmentId: ID,
      Active: active,
      MandaliId: this.UserData.user.MandaliId,
      UserId: this.UserData.user.UserId
    }).subscribe(
      (data: any) => {
        console.log(data);
        this.openErrorMsg(data.statusMessage);
        this.ngOnInit();  
      },
      (e) => {
        console.log(e);
        this.ngOnInit();  
      }
    );
  }

  openConfirmationModal() {
    this._ModalService.open(this.ConfirmationModal, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
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
