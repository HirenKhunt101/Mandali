import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from '../../modal-content/modal-content.component';
import { AdminModuleService } from '../admin-portal.service';
import { UserData } from '../../UserData/userdata';

@Component({
  selector: 'app-suggestion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './suggestion.component.html',
  styleUrl: './suggestion.component.css'
})
export class SuggestionComponent {

  StockForm !: FormGroup;
  storage = inject(Storage);
  UserData: any;
  AnalysisDetail: any;

  constructor(
    private _ModalService: NgbModal,
    private _ADMS: AdminModuleService

  ) {}

  ngOnInit() {
    this.UserData = new UserData().getData('userdata');
    this._ADMS.readAnalysis({
      MandaliId: this.UserData.user.MandaliId,
    }).subscribe(
      (data: any) => {
        console.log(data);    
        this.AnalysisDetail = data.data.analysis_detail;
      },
      (e) => {
        console.log(e);
      }
    );

    this.StockForm = new FormGroup({
      StockName: new FormControl(''),
      StockImage: new FormControl('', Validators.required),
      Notes: new FormControl(''),
      MandaliId: new FormControl(this.UserData.user.MandaliId),
      ImageUrl: new FormControl(''),
      UserId: new FormControl(this.UserData.user.UserId),
    });
  }

  add_analysis() {
    console.log(this.StockForm.value);
    this.uploadFile(this.StockForm.get('StockImage')?.value);
  }

  // uploadFile(input: HTMLInputElement) {
  //   if (!input.files) return

  //   const files: FileList = input.files;

  //   for (let i = 0; i < files.length; i++) {
  //       const file = files.item(i);
  //       if (file) {
  //           let storageRef = ref(this.storage, file.name);
  //           let uploadTask = uploadBytesResumable(storageRef, file);
  //           console.log(storageRef, uploadTask);
              
  //       }
  //   }
  // }

  uploadFile(input: HTMLInputElement) {
    if (!input.files || input.files.length === 0) return;
  
    const files: FileList = input.files;
  
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file && file.type.startsWith('image/')) {
        const randomString = Math.random().toString(36).substring(2);
        const filePath = `${file.name}-${randomString}`;
        const storageRef = ref(this.storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Handle progress if needed
          },
          (error) => {
            this.openErrorMsg('Error in uploading image');
          },
          () => {
            getDownloadURL(storageRef)
              .then((downloadURL) => {
                this.StockForm.get('ImageUrl')?.setValue(downloadURL);
                this._ADMS.createAnalysis(this.StockForm.value).subscribe(
                  (data: any) => {
                    console.log(data);
                    // Move the success message here
                    this.openErrorMsg('Successfully image uploaded');
                    this.ngOnInit();
                  },
                  (e) => {
                    console.log(e);
                    this.openErrorMsg('Error in uploading image');
                  }
                );
                this.openErrorMsg('Successfully image uploaded');
              })
              .catch((error) => {
                this.openErrorMsg('Error in uploading image');
              });
          }
        );
      } else {
        this.openErrorMsg('Invalid image uploaded');
      }
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
