import { Component } from '@angular/core';

@Component({
  selector: 'app-notes-media-reports',
  standalone: false,
  templateUrl: './notes-media-reports.component.html',
  styleUrl: './notes-media-reports.component.css'
})
export class NotesMediaReportsComponent {
   notes: any[] = [];
  videos: any[] = [];
  selectedFile: File | null = null;
  filterType: any = 'All'; // All | Notes | Videos
  showUploadPopup: boolean = false;

  constructor() {
    // Load some dummy data (replace with API calls)
    this.notes = [
      { fileName: 'Math Notes.pdf', downloadUrl: '#' },
      { fileName: 'Physics Notes.docx', downloadUrl: '#' }
    ];

    this.videos = [
      { title: 'Physics Lecture 1', url: '#' },
      { title: 'Chemistry Lecture 2', url: '#' }
    ];
  }

  // Open upload popup
  openUploadPopup(): void 
  {
    this.showUploadPopup = true;
  }

  // Close upload popup
  closeUploadPopup(): void {
    this.showUploadPopup = false;
  }

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Upload note
  uploadNote(): void {
    if (!this.selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    // Dummy logic: in real app, call backend API to upload and get download URL
    const newNote = {
      fileName: this.selectedFile.name,
      downloadUrl: '#' // replace with actual URL
    };
    this.notes.push(newNote);

    // Reset selection and close popup
    this.selectedFile = null;
    this.showUploadPopup = false;
  }

  // Change filter type
  setFilter(type: string): void {
    this.filterType = type;
  }


}
