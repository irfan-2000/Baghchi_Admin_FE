import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../student.service';
import { error } from 'console';
import { LiveClassesService } from '../live-classes.service';
@Component({
  selector: 'app-allot-subscription',
  standalone: false,
  templateUrl: './allot-subscription.component.html',
  styleUrl: './allot-subscription.component.css'
})
export class AllotSubscriptionComponent {

    studentForm: FormGroup;
  subscriptionForm: FormGroup;

  submitted = false;
  studentData: any = null;
  noData = false;
 
  plans = ['monthly', 'quarterly', 'halfYearly', 'yearly'];
  courses = ['Biology', 'Physics', 'Chemistry'];

  constructor(private fb: FormBuilder,private studentservice:StudentService,private Liveclasses:LiveClassesService) {
    this.studentForm = this.fb.group({
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.subscriptionForm = this.fb.group({
      plan: ['', Validators.required],
      course: ['', Validators.required],
       amount: ['', Validators.required],
      courseId:['',Validators.required],
      batchId:['',Validators.required]
    });

    this.getAllCourses();
  }
 
 

  
GetStudentByMobileEmail() 
{
    const { mobile, email } = this.studentForm.value;


  this.studentservice.GetStudentByMobileEmail(mobile, email)
    .subscribe({
      next: (response: any) => {
        this.studentData = response;
        if(!this.studentData)
        {
          alert("No student data found");
        }
      },
      error: (error: any) => {
        console.error(error);
      }
    });
}



 AvailableCourses:any = [];
 
  Batches:any = [];
getAllCourses()
{
    try 
     {
        this. Liveclasses.getAllCourses( ).subscribe({
          next: (response: any) =>
        {
          this.AvailableCourses = response.Result;
           
             this.AvailableCourses = response.Result.map((c: any) => {
          try {
            c.Description = JSON.parse(c.Description);
          } catch {
            // If it's plain text, just keep as is
          }
          return c;
        });
 
           },
          error: (error: any) => {             
          },
        });
      } catch (error: any) {
        console.error('API error:', error);
      }

}


getBatchesByCourseid(Event:any = '')
{
   
  const courseId = this.subscriptionForm.get('courseId')?.value;

   
  try{

    this.Liveclasses.getBatchesByCourseid(courseId).subscribe({
      next:(response:any)=>{
    console.log(response);
    this.Batches = response.Result;
      },
      error:(error:any) =>{

      }});

  } catch(error:any)
  {
    console.error('API error:', error);
  }
}


submitSubscription() {

  // 🔴 Manual validation
  if (!this.studentData || !this.studentData.StudentId) {
    alert('Please search and select a valid student first');
    return;
  }

  const form = this.subscriptionForm.value;
   

  if (!form.plan) {
    alert('Please select a plan');
    return;
  }

  if (!form.courseId) {
    alert('Please select a course');
    return;
  }

  if (!form.batchId) {
    alert('Please select a batch');
    return;
  }

  if (!form.amount || form.amount <= 0) {
    alert('Enter valid amount');
    return;
  }

  // 🔥 Payload mapping (clean)
  const payload = {
    studentId: this.studentData.StudentId,
    courseId: form.courseId,
    batchId: form.batchId,
    plan: form.plan,
    amount: form.amount
  };

  // 🔥 API Call
  this.studentservice.allotSubscription(payload).subscribe({
    next: (response: any) => {
      alert('Subscription successful');
      window.location.reload();
      console.log(response);
    },
    error: (error: any) => {
      console.error(error);
      alert('Something went wrong');
    }
  });
}


}
