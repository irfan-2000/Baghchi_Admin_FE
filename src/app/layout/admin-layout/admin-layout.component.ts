import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
isCollapsed = false;

menuItems = [
  { label: 'Dashboard', icon: 'fas fa-home', route: '' },
  { label: 'Courses', icon: 'fas fa-book', route: '/home/manage-class-board-subjects' },
  { label: 'Manage Courses', icon: 'fas fa-book', route: 'manage-courses' },
  
   { label: 'Live Sessions', icon: 'fas fa-video', route: '/home/live-classes' },
  { label: 'Create-Quiz', icon: 'fas fa-user-graduate', route: '/home/create-quiz' }, // adjust if separate student page
 ];


  constructor(private router: Router) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }


   isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
}
