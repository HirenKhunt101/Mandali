import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from '../../modal-content/modal-content.component';

@Component({
  selector: 'app-realize',
  standalone: true,
  imports: [],
  templateUrl: './realize.component.html',
  styleUrl: './realize.component.css'
})
export class RealizeComponent {

  constructor(
    private _ModalService: NgbModal
  ) {}

  async ngOnInit () {
    const apiUrl = 'https://twelve-data1.p.rapidapi.com/stocks';
    const exchange = 'BSE';
    const format = 'json';

    const url = new URL(apiUrl);
    url.searchParams.append('exchange', exchange);
    url.searchParams.append('format', format);

    const headers = {
      'X-RapidAPI-Key': 'f1ca2ea9f7msh0f49fd45992f09bp1a6fdfjsnacc37f183acd',
      'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
    };

    try {
      const response = await fetch(url, { method: 'GET', headers: headers });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Fetch error:', error);
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
