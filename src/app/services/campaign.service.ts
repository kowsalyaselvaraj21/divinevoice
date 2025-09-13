import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NotificationCampaign } from './devotee.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private apiUrl = `${environment.apiUrl}/campaigns`;

  constructor(private http: HttpClient) {}

  getCampaigns(page: number = 0, size: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  getCampaign(id: number): Observable<NotificationCampaign> {
    return this.http.get<NotificationCampaign>(`${this.apiUrl}/${id}`);
  }

  createCampaign(campaign: NotificationCampaign): Observable<NotificationCampaign> {
    return this.http.post<NotificationCampaign>(this.apiUrl, campaign);
  }

  updateCampaign(id: number, campaign: NotificationCampaign): Observable<NotificationCampaign> {
    return this.http.put<NotificationCampaign>(`${this.apiUrl}/${id}`, campaign);
  }

  deleteCampaign(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  executeCampaign(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/execute`, {});
  }

  scheduleCampaign(id: number): Observable<NotificationCampaign> {
    return this.http.post<NotificationCampaign>(`${this.apiUrl}/${id}/schedule`, {});
  }

  cancelCampaign(id: number): Observable<NotificationCampaign> {
    return this.http.post<NotificationCampaign>(`${this.apiUrl}/${id}/cancel`, {});
  }

  searchCampaigns(query: string): Observable<NotificationCampaign[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<NotificationCampaign[]>(`${this.apiUrl}/search`, { params });
  }

  getCampaignsByStatus(status: string): Observable<NotificationCampaign[]> {
    return this.http.get<NotificationCampaign[]>(`${this.apiUrl}/status/${status}`);
  }

  getActiveCampaigns(): Observable<NotificationCampaign[]> {
    return this.http.get<NotificationCampaign[]>(`${this.apiUrl}/active`);
  }
}
