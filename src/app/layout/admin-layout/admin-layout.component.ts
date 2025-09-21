import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
isCollapsed = false;

  menuItems = [
    { label: 'Dashboard', icon: 'fas fa-home' },
    { label: 'Courses', icon: 'fas fa-book' },
    { label: 'Batches', icon: 'fas fa-users' },
    { label: 'Live Sessions', icon: 'fas fa-video' },
    { label: 'Students', icon: 'fas fa-user-graduate' },
    { label: 'Settings', icon: 'fas fa-cog' }
  ];

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
