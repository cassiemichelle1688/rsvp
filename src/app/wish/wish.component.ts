import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { NgOptimizedImage } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-wish',
  standalone: true, // Add this line
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule, // <-- Add to imports
    HttpClientModule
  ],
  templateUrl: './wish.component.html',
  styleUrl: './wish.component.scss'
})
export class WishComponent {

  @Input() dataFromHome: any; 
  guestName:string | null = null;
  date:string | null = null;
  wishForm!: FormGroup;
  isLoading: boolean | undefined;
  errorMessage: string | null | undefined;
  successMessage: string | null | undefined;
  isSubmitted: boolean | undefined;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.wishForm = this.fb.group({
      name: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.guestName = this.dataFromHome.guestName;
    this.date = this.dataFromHome.date;
    this.wishForm.get("name")?.setValue(this.guestName);
  }
  
  onSubmit() {
    if (this.wishForm.invalid) {
      console.log("masih invalid: ", this.logValidationErrors())
      return; // Don't submit if form is invalid
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formData = this.wishForm.value;
    const scriptURL = 'http://localhost:3000/send'; // <-- IMPORTANT: Replace with your script URL
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
    this.http.post(scriptURL, formData, { headers: headers, responseType: 'json' })
      .subscribe({
        next: (response: any) => {
          if (response.result === 'success') {
            this.isSubmitted = true;
            this.successMessage = 'Thank you! Your message has been sent.';
            this.isLoading = false;
            this.isSubmitted = true;
            this.wishForm.reset();
          } else {
            // This would be an error returned from the script itself
            this.errorMessage = `An error occurred: ${response.message || 'Unknown error'}`;
          }
        },
        error: (error) => {
          // This is a network-level error
          this.errorMessage = `Failed to send message.`;
        }
      });
  }

  // Create this new helper method
  private logValidationErrors() {
    Object.keys(this.wishForm.controls).forEach(key => {
      const control = this.wishForm.get(key);
      if (control && control.invalid) {
        const errors = control.errors;
        console.log('Control:', key, 'is invalid. Errors:', errors);
      }
    });
  }

}
