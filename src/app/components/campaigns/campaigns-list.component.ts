import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../../services/campaign.service';
import { NotificationCampaign } from '../../services/devotee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-campaigns-list',
  templateUrl: './campaigns-list.component.html',
  styleUrls: ['./campaigns-list.component.scss'],
  standalone: false
})
export class CampaignsListComponent implements OnInit {
  campaigns: NotificationCampaign[] = [];
  loading = false;
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  searchQuery = '';
  selectedCampaigns: number[] = [];
  statusFilter = '';
  typeFilter = '';

  constructor(
    private campaignService: CampaignService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.loading = true;
    this.campaignService.getCampaigns(this.currentPage, 20).subscribe({
      next: (response) => {
        this.campaigns = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading campaigns:', error);
        this.loading = false;
      }
    });
  }

  searchCampaigns(): void {
    if (this.searchQuery.trim()) {
      this.campaignService.searchCampaigns(this.searchQuery).subscribe({
        next: (campaigns) => {
          this.campaigns = campaigns;
        },
        error: (error) => {
          console.error('Error searching campaigns:', error);
        }
      });
    } else {
      this.loadCampaigns();
    }
  }

  applyFilters(): void {
    // Apply status and type filters
    this.loadCampaigns();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCampaigns();
  }

  toggleSelection(campaignId: number): void {
    const index = this.selectedCampaigns.indexOf(campaignId);
    if (index > -1) {
      this.selectedCampaigns.splice(index, 1);
    } else {
      this.selectedCampaigns.push(campaignId);
    }
  }

  selectAll(): void {
    if (this.selectedCampaigns.length === this.campaigns.length) {
      this.selectedCampaigns = [];
    } else {
      this.selectedCampaigns = this.campaigns.map(c => c.id!);
    }
  }

  deleteSelected(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedCampaigns.length} campaigns?`)) {
      const deletePromises = this.selectedCampaigns.map(id => 
        this.campaignService.deleteCampaign(id).toPromise()
      );
      
      Promise.all(deletePromises).then(() => {
        this.selectedCampaigns = [];
        this.loadCampaigns();
      });
    }
  }

  executeSelected(): void {
    if (confirm(`Are you sure you want to execute ${this.selectedCampaigns.length} campaigns?`)) {
      const executePromises = this.selectedCampaigns.map(id => 
        this.campaignService.executeCampaign(id).toPromise()
      );
      
      Promise.all(executePromises).then(() => {
        this.selectedCampaigns = [];
        this.loadCampaigns();
      });
    }
  }

  executeCampaign(id: number): void {
    if (confirm('Are you sure you want to execute this campaign?')) {
      this.campaignService.executeCampaign(id).subscribe({
        next: () => {
          this.loadCampaigns();
        },
        error: (error) => {
          console.error('Error executing campaign:', error);
        }
      });
    }
  }

  scheduleCampaign(id: number): void {
    this.campaignService.scheduleCampaign(id).subscribe({
      next: () => {
        this.loadCampaigns();
      },
      error: (error) => {
        console.error('Error scheduling campaign:', error);
      }
    });
  }

  cancelCampaign(id: number): void {
    if (confirm('Are you sure you want to cancel this campaign?')) {
      this.campaignService.cancelCampaign(id).subscribe({
        next: () => {
          this.loadCampaigns();
        },
        error: (error) => {
          console.error('Error canceling campaign:', error);
        }
      });
    }
  }

  deleteCampaign(id: number): void {
    if (confirm('Are you sure you want to delete this campaign?')) {
      this.campaignService.deleteCampaign(id).subscribe({
        next: () => {
          this.loadCampaigns();
        },
        error: (error) => {
          console.error('Error deleting campaign:', error);
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'RUNNING': return 'primary';
      case 'SCHEDULED': return 'info';
      case 'FAILED': return 'danger';
      case 'CANCELLED': return 'warning';
      default: return 'secondary';
    }
  }

  getNotificationTypeIcon(type: string): string {
    switch (type) {
      case 'VOICE_CALL': return '📞';
      case 'SMS': return '💬';
      case 'WHATSAPP': return '📱';
      case 'EMAIL': return '📧';
      case 'MULTI_CHANNEL': return '📢';
      default: return '📋';
    }
  }

  getMessagePreview(campaign: NotificationCampaign): string {
    if (campaign.messageContent) {
      return campaign.messageContent.length > 50 
        ? campaign.messageContent.substring(0, 50) + '...' 
        : campaign.messageContent;
    }
    return 'No message content';
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages - 1, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
