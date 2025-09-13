import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Devotee {
  id?: number;
  name: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  preferredLanguage?: 'ENGLISH' | 'TAMIL' | 'HINDI' | 'TELUGU' | 'KANNADA' | 'MALAYALAM';
  notificationPreference: 'VOICE_CALL' | 'SMS' | 'WHATSAPP' | 'EMAIL' | 'ALL';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationCampaign {
  id?: number;
  name: string;
  description?: string;
  messageContent: string;
  voiceMessage?: string;
  voiceMessageUrl?: string;
  scheduledTime?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  notificationType: 'VOICE_CALL' | 'SMS' | 'WHATSAPP' | 'EMAIL' | 'MULTI_CHANNEL';
  retryEnabled: boolean;
  maxRetryAttempts: number;
  retryDelayMinutes: number;
  emailSubject?: string;
  emailBody?: string;
  smsMessage?: string;
  whatsappMessage?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationLog {
  id: number;
  devotee: Devotee;
  campaign: NotificationCampaign;
  notificationType: 'VOICE_CALL' | 'SMS' | 'WHATSAPP' | 'EMAIL';
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'CANCELLED' | 'NO_ANSWER' | 'BUSY' | 'ANSWERED';
  attemptNumber: number;
  externalId?: string;
  messageContent?: string;
  errorMessage?: string;
  durationSeconds?: number;
  sentAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class DevoteeService {
  private apiUrl = `${environment.apiUrl}/devotees`;

  constructor(private http: HttpClient) {}

  getDevotees(page: number = 0, size: number = 20): Observable<PageResponse<Devotee>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Devotee>>(this.apiUrl, { params });
  }

  getDevotee(id: number): Observable<Devotee> {
    return this.http.get<Devotee>(`${this.apiUrl}/${id}`);
  }

  createDevotee(devotee: Devotee): Observable<Devotee> {
    return this.http.post<Devotee>(this.apiUrl, devotee);
  }

  updateDevotee(id: number, devotee: Devotee): Observable<Devotee> {
    return this.http.put<Devotee>(`${this.apiUrl}/${id}`, devotee);
  }

  deleteDevotee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchDevotees(query: string): Observable<Devotee[]> {
    const params = new HttpParams().set('searchTerm', query);
    return this.http.get<Devotee[]>(`${this.apiUrl}/search`, { params });
  }

  getActiveDevoteesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/active`);
  }

  bulkImportDevotees(devotees: Devotee[]): Observable<Devotee[]> {
    return this.http.post<Devotee[]>(`${this.apiUrl}/bulk`, devotees);
  }
}
