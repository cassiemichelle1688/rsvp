import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-rsvp',
  standalone: true, // Add this line
  imports: [
    ReactiveFormsModule, // <-- Add to imports
    HttpClientModule
  ],
  templateUrl: './rsvp.component.html',
  styleUrl: './rsvp.component.scss'
})
export class RsvpComponent implements OnInit{
  rsvpForm: FormGroup;
  isLoading = false;
  isSubmitted = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  m_summary: string | null = null;
  c_summary: string | null = null;
  rsvpDataForm: any | null = null;

  isBothEvent: boolean | null = null;

  @Input() dataFromHome: any; 
  guestName:string | null = null;
  id:string | null = null;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.rsvpForm = this.fb.group({
      m_attendance: ['', Validators.required],
      m_person: ['', Validators.required],
      c_attendance: ['', Validators.required],
      c_person: ['', Validators.required],
    });
  }

  ngOnInit(): void { 
    // Load home data 
    this.guestName = this.dataFromHome.guestName;
    this.id = this.dataFromHome.id;
    // Load existing data
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    }
  }

  loadData(){
    var rsvpData = sessionStorage.getItem("rsvpData");
    if (rsvpData != undefined) { 
      this.isSubmitted = true;
      this.rsvpDataForm = JSON.parse(rsvpData);
      this.setSummary();
    }
    if (this.id == environment.all_token) {
      this.isBothEvent = true;
    } else if (this.id == environment.m_only_token) {
      this.isBothEvent = false;
      this.rsvpForm.get('c_attendance')?.clearValidators();
      this.rsvpForm.get('c_person')?.clearValidators();
    }
  }

  setSummary() {
    if(this.rsvpDataForm.m_attendance == "1"){
      this.m_summary = "Yes, for " + this.rsvpDataForm.m_person;
    }else{
      this.m_summary = "No, I can't come";
    }
    if(this.isBothEvent){
      if(this.rsvpDataForm.c_attendance == "1"){
        this.c_summary = "Yes, for " + this.rsvpDataForm.c_person;
      }else{
        this.c_summary = "No, I can't come";
      }    
    }
  }

  onSubmit() {
    if (this.rsvpForm.get('m_attendance')?.value != "1"){ this.rsvpForm.get('m_person')?.setValue('0') };
    if (this.rsvpForm.get('c_attendance')?.value != "1"){ this.rsvpForm.get('c_person')?.setValue('0') };

    if (this.rsvpForm.invalid) {
      console.log("masih invalid: ", this.logValidationErrors())
      return; // Don't submit if form is invalid
    }

    this.isLoading = true;
    this.isSubmitted = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formData = this.rsvpForm.value;
    const scriptURL = 'PASTE_YOUR_WEB_APP_URL_HERE'; // <-- IMPORTANT: Replace with your script URL

    // We need to send the data as text/plain to avoid CORS preflight issues with Google Apps Script
    const headers = new HttpHeaders({'Content-Type': 'text/plain;charset=utf-8'});

    this.http.post(scriptURL, JSON.stringify(formData), { headers: headers, responseType: 'json' })
      .subscribe({
        next: (response: any) => {
          if (response.result === 'success') {
            this.successMessage = 'Thank you! Your message has been sent.';
            this.rsvpForm.reset();
          } else {
            // This would be an error returned from the script itself
            this.errorMessage = `An error occurred: ${response.message || 'Unknown error'}`;
          }
          this.isLoading = false;
          this.isSubmitted = true;
        },
        error: (error) => {
          // This is a network-level error
          this.errorMessage = `Failed to send message. Error: ${error.message}`;
          this.isLoading = false;
          this.isSubmitted = true;
        }
      });
      sessionStorage.setItem("rsvpData", JSON.stringify(formData));
      this.loadData();
  }

  // Create this new helper method
  private logValidationErrors() {
    Object.keys(this.rsvpForm.controls).forEach(key => {
      const control = this.rsvpForm.get(key);
      if (control && control.invalid) {
        const errors = control.errors;
        console.log('Control:', key, 'is invalid. Errors:', errors);
      }
    });
  }

}
