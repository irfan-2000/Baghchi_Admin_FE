import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassBoardSubjectService } from '../class-board-subject.service';
import { response } from 'express';

@Component({
  selector: 'app-manage-class-board-subjects',
  standalone: false,
  templateUrl: './manage-class-board-subjects.component.html',
  styleUrl: './manage-class-board-subjects.component.css'
})
export class ManageClassBoardSubjectsComponent {
activeTab = 0; // default first tab
  tabs = [
    { label: 'Manage Classes' },
    { label: 'Manage Boards' },
    { label: 'Manage Subjects' }
  ];


  classForm: FormGroup;
errorMessage: string | null = null;
 AvailableCourses:any = []

  constructor(private fb: FormBuilder,private Class_board_subjectservice:ClassBoardSubjectService )
   {
    this.GetAvailableCourses();

    this.classForm = this.fb.group({
        classId: [null],  
        flag:['A'],
      className: ['', Validators.required],
      status: ['', Validators.required]
    });
  }
 

 GetAvailableCourses(): void
  {
  this.Class_board_subjectservice.GetAvailableCourses().subscribe({
    next: (response: any) => {
       
      this.AvailableCourses = response.Result; // match backend casing
      console.log("Courses fetched:", this.AvailableCourses);
    },
    error: (err: any) => {
      console.error("Error fetching courses:", err);
    }
  });
}

EditClassDetails(item:any,flag:any = '')
{ 
   
  this.classForm.patchValue(
    {
      classId:item.ClassId,
      className:item.ClassName,
      status:item.Status,
      flag:flag
    }
  )
}


SubmitClassDetails( )
{
this.errorMessage = ''

  if (this.classForm.invalid) 
      {
      this.errorMessage = 'Please enter a class name and select status.';
      return;
    }

  const payload =
  {
    ClassId: this.classForm.get('classId')?.value,
    ClassName :this.classForm.get('className')?.value,
    Status : this.classForm.get('status')?.value,
    Flag :this.classForm.get('flag')?.value,
  }
    
this.Class_board_subjectservice.SubmitClassDetails(payload).subscribe({
    next: (response: any) => {       
       this.GetAvailableCourses();
     },
    error: (err: any) => {
      console.error("Error fetching courses:", err);
    }
  });
}



deleteclass(id:any)
{
  debugger 
    
this.Class_board_subjectservice.DeleteClassDetails(id).subscribe({
    next: (response: any) =>
       {
        if(response.Result)
        {
          alert("successfully deleted");
        }
        else
        {
          alert("there are some associated data with it try deleting it");
        }
       this.GetAvailableCourses();
     },
    error: (err: any) => {
      console.error("Error fetching courses:", err);
    }
  });
}




}
