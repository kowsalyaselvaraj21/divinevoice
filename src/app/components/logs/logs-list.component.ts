import { Component } from '@angular/core';

@Component({
  selector: 'app-logs-list',
  template: `
    <div class="logs-container">
      <h2>Notification Logs</h2>
      <p>Logs functionality will be implemented here.</p>
    </div>
  `,
  styles: [`
    .logs-container {
      padding: 20px;
    }
  `],
  standalone: false
})
export class LogsListComponent {
  // Logs functionality will be implemented here
}
