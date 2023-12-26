import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserData } from '../../UserData/userdata';
import { AdminModuleService } from '../admin-portal.service';
import { ModalContentComponent } from '../../modal-content/modal-content.component';


@Component({
  selector: 'app-realized',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './realized.component.html',
  styleUrl: './realized.component.css'
})
export class RealizedComponent {
  RealizedDetails !: any[];
  UserData: any;

  constructor(
    private _ModalService: NgbModal,
    private _ADMS: AdminModuleService,
  ) {
  }

  ngOnInit() {  
    this.UserData = new UserData().getData('userdata');

    this._ADMS.readRealized({
      MandaliId: this.UserData.user.MandaliId,
    }).subscribe(
      (data: any) => {
        console.log(data);    
        this.RealizedDetails = data.data.realized_details;
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

}
