import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DevoteeService, Devotee } from '../../services/devotee.service';

@Component({
  selector: 'app-devotee-detail',
  templateUrl: './devotee-detail.component.html',
  styleUrls: ['./devotee-detail.component.scss'],
  standalone: false
})
export class DevoteeDetailComponent implements OnInit {
  devotee: Devotee | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private devoteeService: DevoteeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id && !isNaN(id)) {
        this.loadDevotee(id);
      } else {
        this.router.navigate(['/devotees']);
      }
    });
  }

  private loadDevotee(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.devoteeService.getDevotee(id).subscribe({
      next: (devotee) => {
        this.devotee = devotee;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading devotee:', error);
        this.error = 'Failed to load devotee details';
        this.loading = false;
      }
    });
  }

  onEdit(): void {
    if (this.devotee?.id) {
      this.router.navigate(['/devotees/edit', this.devotee.id]);
    }
  }

  onBack(): void {
    this.router.navigate(['/devotees']);
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

  getLanguageLabel(language: string): string {
    const languageMap: { [key: string]: string } = {
      'ENGLISH': 'English',
      'TAMIL': 'Tamil',
      'HINDI': 'Hindi',
      'TELUGU': 'Telugu',
      'KANNADA': 'Kannada',
      'MALAYALAM': 'Malayalam'
    };
    return languageMap[language] || language;
  }
}
