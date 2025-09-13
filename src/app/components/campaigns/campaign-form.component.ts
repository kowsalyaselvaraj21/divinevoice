import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationCampaign } from '../../services/devotee.service';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CampaignFormComponent implements OnInit {
  campaignForm!: FormGroup;
  isEditMode = false;
  campaignId?: number;
  loading = false;
  submitting = false;
  notificationTypes = [
    { value: 'VOICE_CALL', label: 'Voice Call', icon: '📞' },
    { value: 'SMS', label: 'SMS', icon: '💬' },
    { value: 'WHATSAPP', label: 'WhatsApp', icon: '📱' },
    { value: 'EMAIL', label: 'Email', icon: '📧' },
    { value: 'MULTI_CHANNEL', label: 'Multi Channel', icon: '📢' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private campaignService: CampaignService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.campaignForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      notificationType: ['VOICE_CALL', Validators.required],
      messageContent: ['', [Validators.required, Validators.minLength(10)]],
      voiceMessageUrl: [''],
      scheduledTime: [''],
      retryEnabled: [true],
      maxRetryAttempts: [3, [Validators.min(1), Validators.max(10)]],
      retryDelayMinutes: [5, [Validators.min(1), Validators.max(60)]],
      emailSubject: [''],
      emailBody: [''],
      smsMessage: [''],
      whatsappMessage: ['']
    });

    // Add conditional validators based on notification type
    this.campaignForm.get('notificationType')?.valueChanges.subscribe(type => {
      this.updateConditionalValidators(type);
    });
  }

  private updateConditionalValidators(type: string): void {
    const emailSubject = this.campaignForm.get('emailSubject');
    const emailBody = this.campaignForm.get('emailBody');
    const smsMessage = this.campaignForm.get('smsMessage');
    const whatsappMessage = this.campaignForm.get('whatsappMessage');
    const voiceMessageUrl = this.campaignForm.get('voiceMessageUrl');

    // Clear all conditional validators
    emailSubject?.clearValidators();
    emailBody?.clearValidators();
    smsMessage?.clearValidators();
    whatsappMessage?.clearValidators();
    voiceMessageUrl?.clearValidators();

    // Add validators based on type
    switch (type) {
      case 'EMAIL':
        emailSubject?.setValidators([Validators.required]);
        emailBody?.setValidators([Validators.required]);
        break;
      case 'SMS':
        smsMessage?.setValidators([Validators.required, Validators.maxLength(160)]);
        break;
      case 'WHATSAPP':
        whatsappMessage?.setValidators([Validators.required]);
        break;
      case 'VOICE_CALL':
        voiceMessageUrl?.setValidators([Validators.required]);
        break;
      case 'MULTI_CHANNEL':
        // For multi-channel, at least one message type should be provided
        break;
    }

    // Update validators
    emailSubject?.updateValueAndValidity();
    emailBody?.updateValueAndValidity();
    smsMessage?.updateValueAndValidity();
    whatsappMessage?.updateValueAndValidity();
    voiceMessageUrl?.updateValueAndValidity();
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.campaignId = +id;
      this.loadCampaign();
    }
  }

  private loadCampaign(): void {
    if (!this.campaignId) return;

    this.loading = true;
    this.campaignService.getCampaign(this.campaignId).subscribe({
      next: (campaign) => {
        this.campaignForm.patchValue({
          name: campaign.name,
          description: campaign.description,
          notificationType: campaign.notificationType,
          messageContent: campaign.messageContent,
          voiceMessageUrl: campaign.voiceMessageUrl,
          scheduledTime: campaign.scheduledTime ? new Date(campaign.scheduledTime).toISOString().slice(0, 16) : '',
          retryEnabled: campaign.retryEnabled,
          maxRetryAttempts: campaign.maxRetryAttempts,
          retryDelayMinutes: campaign.retryDelayMinutes,
          emailSubject: campaign.emailSubject,
          emailBody: campaign.emailBody,
          smsMessage: campaign.smsMessage,
          whatsappMessage: campaign.whatsappMessage
        });
        this.updateConditionalValidators(campaign.notificationType);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading campaign:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.campaignForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;
    const formValue = this.campaignForm.value;

    // Prepare campaign data
    const campaignData: NotificationCampaign = {
      name: formValue.name!,
      description: formValue.description,
      notificationType: formValue.notificationType!,
      messageContent: formValue.messageContent!,
      voiceMessageUrl: formValue.voiceMessageUrl,
      scheduledTime: formValue.scheduledTime ? new Date(formValue.scheduledTime).toISOString() : undefined,
      retryEnabled: formValue.retryEnabled!,
      maxRetryAttempts: formValue.maxRetryAttempts!,
      retryDelayMinutes: formValue.retryDelayMinutes!,
      emailSubject: formValue.emailSubject,
      emailBody: formValue.emailBody,
      smsMessage: formValue.smsMessage,
      whatsappMessage: formValue.whatsappMessage,
      status: 'DRAFT'
    };

    const request = this.isEditMode && this.campaignId
      ? this.campaignService.updateCampaign(this.campaignId, campaignData)
      : this.campaignService.createCampaign(campaignData);

    request.subscribe({
      next: (campaign) => {
        this.submitting = false;
        this.router.navigate(['/campaigns', campaign.id]);
      },
      error: (error) => {
        console.error('Error saving campaign:', error);
        this.submitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/campaigns']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.campaignForm.controls).forEach(key => {
      const control = this.campaignForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.campaignForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['maxlength']) return `${fieldName} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      if (field.errors['min']) return `${fieldName} must be at least ${field.errors['min'].min}`;
      if (field.errors['max']) return `${fieldName} must not exceed ${field.errors['max'].max}`;
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.campaignForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}
