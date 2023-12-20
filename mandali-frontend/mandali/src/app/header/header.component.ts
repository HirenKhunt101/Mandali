import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserData } from '../UserData/userdata';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalContentComponent } from '../modal-content/modal-content.component';
import { RestrictionService } from '../Services/restriction.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthModuleService } from '../auth/auth-module.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  UserData !: any;
  ErrMsg = '';
  PasswordForm !: FormGroup;
  activeLink !: String;
  ConfirmPassword!: FormControl;
  NewPassword!: FormControl;


  constructor(
    private _Router: Router,
    private _ModalService: NgbModal,
    private _RMS: RestrictionService,
    private _AMS: AuthModuleService

  ) {

  }

  ngOnInit(): void {
    this.UserData = new UserData().getData('userdata');
    console.log("UserData", this.UserData);

    this.NewPassword = new FormControl('', [Validators.required]);
    this.ConfirmPassword = new FormControl('', [Validators.required]);

    this.PasswordForm = new FormGroup({
      OldPassword: new FormControl('', Validators.required),
      NewPassword: this.NewPassword,
      ConfirmPassword: this.ConfirmPassword,
      UserId: new FormControl(this.UserData?.user?.UserId),
    });
    
  }

  myFunction() {
    const x = document.getElementById("myTopnav") as HTMLElement;
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
  checkUserLogin(){
    this.UserData = new UserData().getData('userdata');
    return this.UserData;
  }
  getProfilepath() {
    return false;
    // let u = new UserData().getData('userdata');
    // if (u && u.data.user.ProfilePath) {
    //   return environment.S3URL + u.data.user.ProfilePath;
    // }
  }

  // getEmail() {
  //   return this.UserData.user.Email;
  // }   

  async logout() {
    this._AMS.logout().subscribe(
      (data: any) => {
        console.log(data);
        localStorage.clear();
        sessionStorage.clear();
        this._Router.navigate(['/login']);
        this.ngOnInit();
      },
      (err) => {
        this.openErrorMsg(err.statusMessage);
      }
    );
    
  }

  changePasswordPop(content: any) {
    this.ErrMsg = '';
    this._ModalService.open(content, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }

  changePassword() {
    // event.preventDefault();

    if (this.PasswordForm.get('NewPassword')?.value == this.PasswordForm.get('ConfirmPassword')?.value) {
      this.ErrMsg = '';
      let u = new UserData().getData('userdata');
      this._RMS.changePassword(this.PasswordForm.value).subscribe(
        (data: any) => {
          console.log(data);
          this._ModalService.dismissAll();
          this.PasswordForm.reset();
          this.openErrorMsg('Password Change Successfuly!');
        },
        (error) => {
          console.log(error);
          // this._ModalService.dismissAll();
          // this.PasswordForm.reset();
          this.openErrorMsg(error.statusMessage);
        }
      );
    } else {
      this.ErrMsg = 'password does not match!';
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

}
