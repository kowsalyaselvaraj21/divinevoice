import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DevoteeService, Devotee } from '../../services/devotee.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-devotees-list',
  templateUrl: './devotees-list.component.html',
  styleUrls: ['./devotees-list.component.scss'],
  standalone: false
})
export class DevoteesListComponent implements OnInit {
  devotees: Devotee[] = [];
  loading = false;
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  searchQuery = '';
  selectedDevotees: number[] = [];
  statusFilter = '';
  notificationFilter = '';
  showBulkImport = false;

  constructor(
    private devoteeService: DevoteeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDevotees();
  }

  loadDevotees(): void {
    this.loading = true;
    this.devoteeService.getDevotees(this.currentPage, 20).subscribe({
      next: (response) => {
        this.devotees = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading devotees:', error);
        this.loading = false;
      }
    });
  }

  searchDevotees(): void {
    if (this.searchQuery.trim()) {
      this.devoteeService.searchDevotees(this.searchQuery).subscribe({
        next: (devotees) => {
          this.devotees = devotees;
        },
        error: (error) => {
          console.error('Error searching devotees:', error);
        }
      });
    } else {
      this.loadDevotees();
    }
  }

  applyFilters(): void {
    // Apply status and notification filters
    this.loadDevotees();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDevotees();
  }

  toggleSelection(devoteeId: number): void {
    const index = this.selectedDevotees.indexOf(devoteeId);
    if (index > -1) {
      this.selectedDevotees.splice(index, 1);
    } else {
      this.selectedDevotees.push(devoteeId);
    }
  }

  selectAll(): void {
    if (this.selectedDevotees.length === this.devotees.length) {
      this.selectedDevotees = [];
    } else {
      this.selectedDevotees = this.devotees.map(d => d.id!);
    }
  }

  deleteSelected(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedDevotees.length} devotees?`)) {
      const deletePromises = this.selectedDevotees.map(id => 
        this.devoteeService.deleteDevotee(id).toPromise()
      );
      
      Promise.all(deletePromises).then(() => {
        this.selectedDevotees = [];
        this.loadDevotees();
      });
    }
  }

  deleteDevotee(id: number): void {
    if (confirm('Are you sure you want to delete this devotee?')) {
      this.devoteeService.deleteDevotee(id).subscribe({
        next: () => {
          this.loadDevotees();
        },
        error: (error) => {
          console.error('Error deleting devotee:', error);
        }
      });
    }
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'active' : 'inactive';
  }

  getNotificationTypeIcon(type: string): string {
    switch (type) {
      case 'VOICE_CALL': return '📞';
      case 'SMS': return '💬';
      case 'WHATSAPP': return '📱';
      case 'EMAIL': return '📧';
      case 'ALL': return '📢';
      default: return '📋';
    }
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
