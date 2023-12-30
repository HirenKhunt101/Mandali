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

  ngOnInit(): void {
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

  async add_analysis(e: any, event: any) {
    console.log(this.StockForm.value);
    event.preventDefault();
    const file = e.files[0];
    const downloadURL = await this.uploadFile(file);
    
    if(downloadURL) {
      this.StockForm.get('ImageUrl')?.setValue(downloadURL);
      this._ADMS.createAnalysis(this.StockForm.value).subscribe(
        (data: any) => {
          console.log(data);
          this.openErrorMsg('Analysis uploaded successfully');
          this.ngOnInit();
        },
        (e) => {
          console.log(e);
          this.openErrorMsg('Error in uploading image');
        }
      );
    } else {
    }
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

  async uploadFile(file: any) {
  
    if (file && file.type.startsWith('image/')) {
      const randomString = Math.random().toString(36).substring(2);
      const filePath = `${file.name}-${randomString}`;
      const storageRef = ref(this.storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
        },
        (error) => {
          this.openErrorMsg('Error in uploading image');
        });

        await uploadTask;
        return getDownloadURL(uploadTask.snapshot.ref);
    } else {
      this.openErrorMsg('Please upload valid image');
    }
    return;
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
