import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthModuleService } from '../auth-module.service';
import { UserData } from '../../UserData/userdata';
import { ModalContentComponent } from '../../modal-content/modal-content.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgbModule, RouterModule, CommonModule, ReactiveFormsModule , FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  LoginForm: FormGroup;
  UserData !: UserData;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  isVisiblePassword1 = false;

  constructor(
      private _AMS: AuthModuleService,
      private _Router: Router,
      private _ModalService: NgbModal
    ) {
    this.LoginForm = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.UserData = new UserData();

    if(this.UserData.getData('userdata')) {
      this._Router.navigate(['/admin/dashboard']);
    }

  }

  login() {
    console.log("login function", this.LoginForm.value, this.LoginForm.valid);
    if (this.LoginForm.valid) {
      this._AMS.userLogin(this.LoginForm.value).subscribe(
        (data: any) => {
          console.log(data);    
          this.UserData.setData(data.data, 'userdata');   
          this._Router.navigate(['/admin/dashboard']);
        },
        (err) => {
          console.log(err);
          this.openErrorMsg(err.statusMessage);
        }
      );
    }
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

  togglePasswordVisibility(): void {
    this.isVisiblePassword1 = !this.isVisiblePassword1;
  }

}
