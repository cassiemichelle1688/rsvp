import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams} from '@angular/common/http';
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
  guestName:string = "";
  id:string | null = null;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.rsvpForm = this.fb.group({
      name: ['', Validators.required],
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
    //check invitation type
    if (this.id == environment.all_token) {
      this.isBothEvent = true;
    } else if (this.id == environment.m_only_token) {
      this.isBothEvent = false;
      this.rsvpForm.get('c_attendance')?.clearValidators();
      this.rsvpForm.get('c_person')?.clearValidators();
    }
    //load existing data
    var rsvpData = sessionStorage.getItem("rsvpData");
    if (rsvpData != undefined) { 
      this.isSubmitted = true;
      this.rsvpDataForm = JSON.parse(rsvpData);
      this.setSummary();
    }    
  }

  setSummary() {
    if(this.rsvpDataForm.m_attendance == "Yes"){
      this.m_summary = "Yes, for " + this.rsvpDataForm.m_person + " person";
    }else{
      this.m_summary = "No, I can't come";
    }
    console.log(this.isBothEvent);
    if(this.isBothEvent){
      if(this.rsvpDataForm.c_attendance == "Yes"){
        this.c_summary = "Yes, for " + this.rsvpDataForm.c_person + " person";
      }else{
        this.c_summary = "No, I can't come";
      }    
    }
  }

  onSubmit() {
    if (this.rsvpForm.get('m_attendance')?.value != "Yes"){ this.rsvpForm.get('m_person')?.setValue('0') };
    if (this.rsvpForm.get('c_attendance')?.value != "Yes"){ this.rsvpForm.get('c_person')?.setValue('0') };
    this.rsvpForm.get('name')?.setValue(this.guestName);

    if (this.rsvpForm.invalid) {
      console.log("masih invalid: ", this.logValidationErrors())
      return; // Don't submit if form is invalid
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formData = this.rsvpForm.value;
    const scriptURL = 'http://localhost:3000/submit'; // <-- IMPORTANT: Replace with your script URL
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
    this.http.post(scriptURL, formData, { headers: headers, responseType: 'json' })
      .subscribe({
        next: (response: any) => {
          if (response.result === 'success') {
            this.isSubmitted = true;
            sessionStorage.setItem("rsvpData", JSON.stringify(formData));
            this.successMessage = 'Thank you! Your message has been sent.';
            this.isLoading = false;
            this.isSubmitted = true;
            this.rsvpForm.reset();
            this.loadData();
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

  onSubmitLate() {
    if (this.rsvpForm.get('m_attendance')?.value != "Yes"){ this.rsvpForm.get('m_person')?.setValue('0') };
    if (this.rsvpForm.get('c_attendance')?.value != "Yes"){ this.rsvpForm.get('c_person')?.setValue('0') };

    if (this.rsvpForm.invalid) {
      console.log("masih invalid: ", this.logValidationErrors())
      return; // Don't submit if form is invalid
    }

    this.isLoading = true;
    this.isSubmitted = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLScCmOOMTHVQOp1dnE51DY3vBZBjVK97zIM2TcpUJ2O5vhpiLw/viewform"

    const formData = new HttpParams()
      .set('entry.1657656994', this.guestName)   // replace with your field ID
      .set('entry.641019334', this.rsvpForm.value.m_attendance)
      .set('entry.1622601914', this.rsvpForm.value.m_person)
      .set('entry.845509910', this.rsvpForm.value.c_attendance)
      .set('entry.718431137', this.rsvpForm.value.c_person);

    this.http.post(formUrl, formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).subscribe(
      () => {
        alert('Form submitted successfully!');
        this.rsvpForm.reset();
      },
      (err) => {
        console.error(err);
        alert('Form submission failed');
      }
    );
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

  numberInput(){
    const maxValue = 5;
    const currentValue =  this.rsvpForm.get("m_person")?.value;
    if (currentValue > maxValue) {
        this.rsvpForm.get("m_person")?.setValue(String(maxValue));
    }
  }

}
