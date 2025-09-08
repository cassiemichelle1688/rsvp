import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ModalState {
  isOpen: boolean;
  data?: any;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalState = new BehaviorSubject<ModalState>({ isOpen: false });
  state$ = this.modalState.asObservable();

  open(data?: any) {
    this.modalState.next({ isOpen: true, data });
  }

  close() {
    this.modalState.next({ isOpen: false });
  }
}
