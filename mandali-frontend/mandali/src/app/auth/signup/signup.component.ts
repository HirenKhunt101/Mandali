import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthModuleService } from '../auth-module.service';
import { ModalContentComponent } from '../../modal-content/modal-content.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  SignupForm: FormGroup;

  constructor(
      private _AMS: AuthModuleService,
      private _Router: Router,
      private _ModalService: NgbModal
    ) {
    this.SignupForm = new FormGroup({
      FirstName: new FormControl('', [Validators.required]),
      LastName: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required]),
      ConfirmPassword: new FormControl('', [Validators.required]),
      MandaliName: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {

  }

  signup() {
    console.log("Signup function", this.SignupForm.value, this.SignupForm.valid);
    if (this.SignupForm.valid) {
      this._AMS.userSignup(this.SignupForm.value).subscribe(
        (data) => {
          console.log(data);     
          this._Router.navigate(['/login']);
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
}
