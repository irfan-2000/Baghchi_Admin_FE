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
  { label: 'Dashboard', icon: 'fas fa-home', route: '/home' },

  { label: 'Classes, Boards & Subjects', icon: 'fas fa-layer-group', route: '/home/manage-class-board-subjects' },

  { label: 'Manage Courses', icon: 'fas fa-book-open', route: '/home/manage-courses' },

  { label: 'Live Classes', icon: 'fas fa-video', route: '/home/live-classes' },

  { label: 'Create Quiz', icon: 'fas fa-pencil-alt', route: '/home/create-quiz' },

  { label: 'Quiz History', icon: 'fas fa-history', route: '/home/quiz-history' },

  { label: 'Notes & Media', icon: 'fas fa-file-alt', route: '/home/notes-media' },

  { label: 'Student Details', icon: 'fas fa-user-graduate', route: '/home/student-details' },

  { label: 'Class History', icon: 'fas fa-chalkboard-teacher', route: '/home/class-history' },

  { label: 'Discounts', icon: 'fas fa-tags', route: '/home/discounts' },

  { label: 'Admin Feedback', icon: 'fas fa-comment-dots', route: '/home/Admin-Feedback' }
];



  constructor(private router: Router) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }


   isActiveRoute(route: string): boolean 
   {
    return this.router.url === route ;
  }
}
