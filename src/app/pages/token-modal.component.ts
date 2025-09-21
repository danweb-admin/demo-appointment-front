// token-modal.component.ts
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-token-modal',
  template: `
    <div class="modal-header">
      <h5 class="modal-title">Digite seu Token</h5>
    </div>
    <div class="modal-body">
      <input type="text" [(ngModel)]="token" class="form-control" placeholder="Token">
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" (click)="salvar()">Salvar</button>
    </div>
  `
})
export class TokenModalComponent {
  token: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  salvar() {
    this.activeModal.close(this.token);
  }
}
