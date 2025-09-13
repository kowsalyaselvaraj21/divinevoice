import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DevoteeService, Devotee } from '../../services/devotee.service';

@Component({
  selector: 'app-devotee-form',
  templateUrl: './devotee-form.component.html',
  styleUrls: ['./devotee-form.component.scss'],
  standalone: false
})
export class DevoteeFormComponent implements OnInit {
  devoteeForm: FormGroup;
  isEditMode = false;
  devoteeId: number | null = null;
  loading = false;
  submitting = false;

  // Enum values for dropdowns
  languages = [
    { value: 'ENGLISH', label: 'English' },
    { value: 'TAMIL', label: 'Tamil' },
    { value: 'HINDI', label: 'Hindi' },
    { value: 'TELUGU', label: 'Telugu' },
    { value: 'KANNADA', label: 'Kannada' },
    { value: 'MALAYALAM', label: 'Malayalam' }
  ];

  notificationPreferences = [
    { value: 'VOICE_CALL', label: 'Voice Call', icon: '📞' },
    { value: 'SMS', label: 'SMS', icon: '💬' },
    { value: 'WHATSAPP', label: 'WhatsApp', icon: '📱' },
    { value: 'EMAIL', label: 'Email', icon: '📧' },
    { value: 'ALL', label: 'All Channels', icon: '📢' }
  ];

  constructor(
    private fb: FormBuilder,
    private devoteeService: DevoteeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.devoteeForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.devoteeId = +params['id'];
        this.loadDevotee();
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      email: ['', [Validators.email]],
      address: ['', [Validators.maxLength(500)]],
      preferredLanguage: ['ENGLISH', Validators.required],
      notificationPreference: ['VOICE_CALL', Validators.required],
      isActive: [true]
    });
  }

  private loadDevotee(): void {
    if (this.devoteeId) {
      this.loading = true;
      this.devoteeService.getDevotee(this.devoteeId).subscribe({
        next: (devotee) => {
          this.devoteeForm.patchValue({
            name: devotee.name,
            phoneNumber: devotee.phoneNumber,
            email: devotee.email || '',
            address: devotee.address || '',
            preferredLanguage: devotee.preferredLanguage || 'ENGLISH',
            notificationPreference: devotee.notificationPreference || 'VOICE_CALL',
            isActive: devotee.isActive
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading devotee:', error);
          this.loading = false;
          this.router.navigate(['/devotees']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.devoteeForm.valid && !this.submitting) {
      this.submitting = true;
      const formValue = this.devoteeForm.value;
      
      const devoteeData: Devotee = {
        name: formValue.name.trim(),
        phoneNumber: formValue.phoneNumber.trim(),
        email: formValue.email?.trim() || undefined,
        address: formValue.address?.trim() || undefined,
        preferredLanguage: formValue.preferredLanguage,
        notificationPreference: formValue.notificationPreference,
        isActive: formValue.isActive
      };

      const operation = this.isEditMode 
        ? this.devoteeService.updateDevotee(this.devoteeId!, devoteeData)
        : this.devoteeService.createDevotee(devoteeData);

      operation.subscribe({
        next: (devotee) => {
          this.submitting = false;
          this.router.navigate(['/devotees'], {
            queryParams: { 
              message: this.isEditMode ? 'Devotee updated successfully' : 'Devotee added successfully',
              type: 'success'
            }
          });
        },
        error: (error) => {
          console.error('Error saving devotee:', error);
          this.submitting = false;
          // Handle specific error cases
          if (error.status === 409) {
            this.devoteeForm.get('phoneNumber')?.setErrors({ duplicate: true });
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.devoteeForm.controls).forEach(key => {
      const control = this.devoteeForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/devotees']);
  }

  getFieldError(fieldName: string): string {
    const control = this.devoteeForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
      if (control.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} must not exceed ${control.errors['maxlength'].requiredLength} characters`;
      }
      if (control.errors['duplicate']) {
        return 'A devotee with this phone number already exists';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      phoneNumber: 'Phone Number',
      email: 'Email',
      address: 'Address',
      preferredLanguage: 'Preferred Language',
      notificationPreference: 'Notification Preference'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.devoteeForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }
}
