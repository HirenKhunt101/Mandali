import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div>
      <h4 class="confirm text-center my-4 camel-case p-2">
        {{ name }}
      </h4>
      <div class="d-flex justify-content-center mt-2 mb-4">
        <button
          class="btn light_button button"
          (click)="activeModal.close(true)"
        >
          Close
        </button>
      </div>
    </div>
  `,
})
export class ModalContentComponent {
  @Input() name: any;

  constructor(public activeModal: NgbActiveModal) {}
}
