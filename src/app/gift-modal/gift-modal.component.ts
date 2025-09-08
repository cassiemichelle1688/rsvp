import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { Subscription } from 'rxjs';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-gift-modal',
  imports: [NgOptimizedImage],
  templateUrl: './gift-modal.component.html',
  styleUrl: './gift-modal.component.scss'
})
export class GiftModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  isCopied = false;
  private sub?: Subscription;

  data : any = "";

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.sub = this.modalService.state$.subscribe(state => {
      console.log('ModalComponent: state =', state); // debug log
      this.isOpen = state.isOpen;
      this.data = state.data;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  close() {
    this.modalService.close();
  }

  copyText() {
    // The Clipboard API is asynchronous and returns a Promise
    navigator.clipboard.writeText(this.data.copyText).then(
      () => {
        // 4. On success, update the flag
        this.isCopied = true;

        // 5. Reset the flag after a timeout
        setTimeout(() => {
          this.isCopied = false;
        }, 2000); // Reset after 2 seconds
      },
      (err) => {
        // Handle potential errors
        console.error('Failed to copy text: ', err);
      }
    );
  }
  
}
