import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from '../../modal-content/modal-content.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UserData } from '../../UserData/userdata';
import { AdminModuleService } from '../admin-portal.service';
import { StockList } from '../../static-data/static'

@Component({
  selector: 'app-holding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './holding.component.html',
  styleUrl: './holding.component.css'
})
export class HoldingComponent {
  @ViewChild('SellHoldingModal', { static: true }) SellHoldingModal !: ElementRef;
  @ViewChild('ConfirmationModal', { static: true }) ConfirmationModal !: ElementRef;

  StockForm !: FormGroup;
  UserData: any;
  Today !: string;
  StocksList : any;
  Total = 0;
  PortFolio: any;
  ActiveTab = "stock_tab";
  SellHoldingForm !: FormGroup;
  UserType = 'member';

  constructor(
    private _ModalService: NgbModal,
    private _ADMS: AdminModuleService
  ) {}

  async ngOnInit () {

    let today = new Date();
    let dd = today.getDate().toString();
    let mm = today.getMonth() + 1 + '';
    let yyyy = today.getFullYear();
    if (mm.toString().length == 1) mm = '0' + mm;
    if (dd.toString().length == 1) dd = '0' + dd;
    this.Today = `${yyyy}-${mm}-${dd}`;
    // this.Today = `${yyyy}-${mm}-${dd}`;
    console.log(this.Today);
    
    this.UserData = new UserData().getData('userdata');
    this.UserType = this.UserData.user.UserType;

    this.StockForm = new FormGroup({
      Date: new FormControl(this.Today, Validators.required),
      StockIndex: new FormControl('', [Validators.required]),
      StockName: new FormControl(''),
      Symbol: new FormControl(''),
      Amount: new FormControl(0, [Validators.required, Validators.min(0)]),
      Quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
      Exchange: new FormControl('NSE', [Validators.required]),
      MandaliId: new FormControl(this.UserData.user.MandaliId),
    });

    this.SellHoldingForm = new FormGroup({
      StockName: new FormControl('', Validators.required),
      Symbol: new FormControl('', Validators.required),
      SellingPrice: new FormControl(0, Validators.required),
      ExistQuantity: new FormControl(0),
      SellingQuantity: new FormControl(1, Validators.required),
      MandaliId: new FormControl(this.UserData.user.MandaliId),

    });

    this.updateTotal();
    
    const apiUrl = 'https://twelve-data1.p.rapidapi.com/stocks?exchange=BSE&format=json';

    try {
      // const response = await fetch(apiUrl, { 
      //   method: 'GET', 
      //   headers: {
      //     'X-RapidAPI-Key': 'f1ca2ea9f7msh0f49fd45992f09bp1a6fdfjsnacc37f183acd',
      //     'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
      //   } 
      // });
      // if (!response.ok) {
      //   this.openErrorMsg(`Error in read stock list`);
      // } else {
      //   const data = await response.json();
      //   this.StocksList = data.data; 
      //   console.log(this.StocksList);
      // }
      this.StocksList = new StockList().data;
    } catch (error) {
      console.error('Fetch error:', error);
    }

    this.fetchDate();

  }


  fetchDate() {
    this._ADMS.readStocks({
      MandaliId: this.UserData.user.MandaliId,
    }).subscribe(
      (data: any) => {
        console.log(data);    
        this.PortFolio = data.data.all_stock_detail;
      },
      (e) => {
        console.log(e);
      }
    );
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

  updateTotal() {
    const amount = this.StockForm.get('Amount')?.value;
    const quantity = this.StockForm.get('Quantity')?.value;
    this.Total =  amount * quantity;
  }

  buy_stock() {   
    this._ADMS.buyStock(
      this.StockForm.value
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
        // this.ngOnInit();  
      }
    );
  } 

  openConfirmationModal() {

    let index = this.StockForm.get('StockIndex')?.value;
    this.StockForm.get('StockName')?.setValue(this.StocksList[index].name);
    this.StockForm.get('Symbol')?.setValue(this.StocksList[index].symbol);

    if(this.UserType == 'admin') {
      this._ModalService.open(this.ConfirmationModal, {
        centered: true,
        backdrop: 'static',
        keyboard: false,
      });
    }
    else {
      this.openErrorMsg("You don't have access to buy stock");
    }
  }

  change_active_tab(CurrentTab: any) {
    this.ActiveTab = CurrentTab;
  }

  openSellPopup(item: any) {
    this.SellHoldingForm.get('StockName')?.setValue(item.StockName);
    this.SellHoldingForm.get('Symbol')?.setValue(item.Symbol);
    this.SellHoldingForm.get('ExistQuantity')?.setValue(item.Quantity);
    if(this.UserType == 'admin') {
      this._ModalService.open(this.SellHoldingModal, {
        centered: true,
        backdrop: 'static',
        keyboard: false,
      });
    } else {
      this.openErrorMsg("You don't have access to sell stock");
    }
  }

  sell_stock() {
    if(this.SellHoldingForm.get('SellingQuantity')?.value <= this.SellHoldingForm.get('ExistQuantity')?.value) {
      this._ADMS.sellStock(
        this.SellHoldingForm.value
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
          // this.ngOnInit();  
        }
      );
    }
    else {
      this.openErrorMsg('Please enter valid selling quantity');
    }
    
  }
}



