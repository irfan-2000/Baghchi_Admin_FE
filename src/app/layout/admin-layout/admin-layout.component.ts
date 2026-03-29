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
  // { label: 'Dashboard', icon: 'fas fa-home', route: '/dashboard' },

  { label: 'Classes, Boards & Subjects', icon: 'fas fa-layer-group', route: '/manage-class-board-subjects' },

  { label: 'Manage Courses', icon: 'fas fa-book-open', route: '/manage-courses' },

  { label: 'Live Classes', icon: 'fas fa-video', route: '/live-classes' },

  { label: 'Create Quiz', icon: 'fas fa-pencil-alt', route: '/create-quiz' },

  { label: 'Quiz History', icon: 'fas fa-history', route: '/quiz-history' },

  { label: 'Notes & Media', icon: 'fas fa-file-alt', route: '/notes-media' },

  { label: 'Student Details', icon: 'fas fa-user-graduate', route: '/student-details' },

  { label: 'Class History', icon: 'fas fa-chalkboard-teacher', route: '/class-history' },

  // { label: 'Discounts', icon: 'fas fa-tags', route: '/discounts' },

  { label: 'Admin Feedback', icon: 'fas fa-comment-dots', route: '/Admin-Feedback' },

    { label: 'Time Table', icon: 'fas fa-comment-dots', route: '/time-table' },

      { label: 'Allot Subscription', icon: 'fas fa-comment-dots', route: '/Allot-subscription' },


];


  constructor(private router: Router) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }


   isActiveRoute(route: string): boolean 
   {
    return this.router.url === route ;
  }
 
navigate(item: any) {
  debugger
  window.location.href = item.route;
}


}
