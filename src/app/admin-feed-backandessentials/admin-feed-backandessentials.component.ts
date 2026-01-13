import { Component } from '@angular/core';
import { StudentService } from '../student.service';
import { error } from 'console';

@Component({
  selector: 'app-admin-feed-backandessentials',
  standalone: false,
  templateUrl: './admin-feed-backandessentials.component.html',
  styleUrl: './admin-feed-backandessentials.component.css'
})
export class AdminFeedBackandessentialsComponent 
{
  feedback:any

constructor(private studentservice:StudentService)
{

}

 SubmitAdminFeedback(): void {

  if (!this.feedback || this.feedback.trim().length === 0) {
    alert('Please enter feedback');
    return;
  }

  const payload = {
    feedback: this.feedback
  };

  this.studentservice.SubmitAdminFeedback(payload).subscribe({
    next: (response: any) =>
       {
        if(response)
        {
          alert('Feedback submitted successfully');
        }
      console.log('Feedback submitted successfully', response);
      this.feedback = ''; // clear textbox
    },
    error: (err: any) => {
      console.error('Error submitting feedback', err);
      alert('Something went wrong. Please try again.');
    }
  });
}


}
