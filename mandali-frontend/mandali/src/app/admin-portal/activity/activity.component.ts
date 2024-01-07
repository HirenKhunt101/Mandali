import { Component } from '@angular/core';

import { UserData } from '../../UserData/userdata';
import { AdminModuleService } from '../admin-portal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css'
})
export class ActivityComponent {

  ActivityData: any;
  UserData: any;

  constructor(
    private _ADMS: AdminModuleService
  ) {}


  async ngOnInit () {
    this.UserData = new UserData().getData('userdata');

    this._ADMS.readActivity({
      MandaliId: this.UserData.user.MandaliId,
    }).subscribe(
      (data: any) => {
        console.log(data);    
        this.ActivityData = data.data.activity_detail;
      },
      (e) => {
        console.log(e);
      }
    );
  }

  formatDate(inputDate: string): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      // timeZoneName: 'short',
    };
  
    const formattedDate = new Date(inputDate).toLocaleString('en-US', options);
    return formattedDate;
  }

  formateMonthYear(month: number, year: number) {
    return new Date(year, month - 1, 1);
  }

  getTimeDifference(createdAt: string): string {
    const activityTimestamp = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - activityTimestamp;
  
    let seconds = Math.floor((timeDifference / 1000) % 60);
    let minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    let hours = Math.floor(timeDifference / (1000 * 60 * 60));
    if(hours > 23) {
      return this.formatDate(createdAt)
    }

    let hh = hours < 10 ? '0' + hours : hours;
    let mm = minutes < 10 ? '0' + minutes : minutes;
    let ss = seconds < 10 ? '0' + seconds : seconds;
    return `${hh}h ${minutes}m ${seconds}s ago`;
  }


}
