import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassBoardSubjectService } from '../class-board-subject.service';
import { response } from 'express';
import { ActivatedRoute } from '@angular/router';

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


  boardForm: FormGroup;
 errorMessage_Board:any;
 AvailableBoards:any;


 
  subjectForm: FormGroup;
 errorMessage_Subject:any;
 AvailableSubjects:any;





  constructor(private fb: FormBuilder,private Class_board_subjectservice:ClassBoardSubjectService,private route: ActivatedRoute )
   {
    this.GetAvailableCourses();
    this.GetAvailableBoards();
    this.GetAvailableSubjects();
    this.classForm = this.fb.group({
        classId: [0],  
        flag:['A'],
      className: ['', Validators.required],
      status: ['', Validators.required]
    });

 
this.boardForm = this.fb.group({
        boardId: [0],  
        flag:['I'],
      boardName: ['', Validators.required],
      status: ['', Validators.required]
    });


    
this.subjectForm = this.fb.group({
        subjectId: [0],  
             subjectName:['',Validators.required],
        
        // classId:['',Validators.required],
        // boardId:['',Validators.required],
   
        flag:['I'],
       status: ['', Validators.required]
    });

  }
 

 GetAvailableCourses(): void
  {
  this.Class_board_subjectservice.GetAvailableCourses().subscribe({
    next: (response: any) => {
       
      this.AvailableCourses = response.Result; // match backend casing
     },
    error: (err: any) => {
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
    next: (response: any) => 
      {
        if(response.Result)
        {
           this.classForm.patchValue({
      classId:0,
      className:'',
      status:'',
      flag:'A'})
          alert("Data has been updated successfully");
        }
                
       this.GetAvailableCourses();
     },
    error: (err: any) => {
      console.error("Error fetching courses:", err);
    }
  });
}



deleteclass(id:any)
{
    

  if(!confirm("are you sure want to delete"))
  {
    return;
  }
    
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

//Board Details

 GetAvailableBoards(): void
  {
  this.Class_board_subjectservice.GetAvailableBaords().subscribe({
    next: (response: any) => {
       
      this.AvailableBoards = response.Result; // match backend casing
     },
    error: (err: any) => {
     }
  });
}
 

EditBoardDetails(item:any,flag:any = '')
{  
   
   
  this.boardForm.patchValue(
    {
      boardId:item.BoardId,
      boardName:item.BoardName,
      status:item.Status,
      flag:flag
    }
  )
}



SubmitBoardDetails( )
{
this.errorMessage_Board = ''

  if (this.boardForm.invalid) 
      {
      this.errorMessage_Board = 'Please enter a board name and select status.';
      return;
    }

  const payload =
  {
    BoardId: this.boardForm.get('boardId')?.value,
    BoardName :this.boardForm.get('boardName')?.value,
    Status : this.boardForm.get('status')?.value,
    Flag :this.boardForm.get('flag')?.value,
  }
    debugger
this.Class_board_subjectservice.SubmitBoardDetails(payload).subscribe({
    next: (response: any) => 
      {
        if(response.Result)
        {
           this.boardForm.patchValue({
      boardId:0,
      boardName:'',
      status:'',
      flag:'I'})
          alert("Data has been updated successfully");
        }
                
       this.GetAvailableBoards();
     },
    error: (err: any) => {
      console.error("Error fetching courses:", err);
    }
  });
}



DeleteBoardDetails(id:any)
{  
  if(!confirm("are you sure want to delete"))
  {
    return;
  }
    
this.Class_board_subjectservice.DeleteboardDetails(id).subscribe({
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
       this.GetAvailableBoards();
     },
    error: (err: any) => {
      console.error("Error fetching courses:", err);
    }
  });
}


//subject details

 GetAvailableSubjects(): void
  {
  this.Class_board_subjectservice.GetAvailableSubjects().subscribe({
    next: (response: any) => {
       
      this.AvailableSubjects = response.Result; // match backend casing
      console.log("subject fetched:", this.AvailableSubjects);
    },
    error: (err: any) => {
      console.error("Error fetching courses:", err);
    }
  });
}
  
EditSubjectDetails(item:any,flag:any = '')
{   
   this.subjectForm.patchValue({
      subjectId:item.SubjectId,
      subjectName:item.SubjectName,
      classId:item.ClassId,
      boardId:item.BoardId,
      status:item.Status,
      flag: flag})
 
} 

SubmitSubjectDetails( )
{
this.errorMessage_Subject= ''

  if (this.subjectForm.invalid) 
      {
      this.errorMessage_Subject = 'Please fill all the details';
      return;
    }
 

  const payload =
  {
    subjectId:this.subjectForm.get('subjectId')?.value,
    SubjectName:this.subjectForm.get('subjectName')?.value,
    classId:this.subjectForm.get('classId')?.value,
    BoardId: this.subjectForm.get('boardId')?.value,
    Status : this.subjectForm.get('status')?.value,
    Flag :this.subjectForm.get('flag')?.value,
  }
    debugger
this.Class_board_subjectservice.SubmitSubjectDetails(payload).subscribe({
    next: (response: any) => 
       {
        if(response.Result)
        {
           this.subjectForm.patchValue({
      subjectId:0,
      subjectName:'',
      classId:'',
      BoardId:'',
      status:'',
      flag:'I'})
          alert("Data has been updated successfully");
        }
                
       this.GetAvailableSubjects();
     },
    error: (err: any) => {
      console.error("Error fetching courses:", err);
    }
  });
}



DeleteSubjectDetails(id:any)
{  
  if(!confirm("are you sure want to delete"))
  {
    return;
  }
     
this.Class_board_subjectservice.DeleteSubjectDetails(id).subscribe({
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
       this.GetAvailableSubjects();
     },
    error: (err: any) => {
      console.error("Error fetching courses:", err);
    }
  });
}

getClassName(classId: any = '',flag:any = ''): any 
{
    
if(flag == 'selected')
{
    const course = this.AvailableCourses.find((s:any) => s.ClassId === classId);
  return course ? course.ClassName : 'N/A'; }

if(flag == 'select')
{  
return this.AvailableCourses.filter((s:any)=>s.Status == 1)
}
 
}


getboardName(Boardid: any = '',flag:any = ''): any
 {   
if(flag == 'selected')
{
    
  const boards = this.AvailableBoards.find((s:any) => s.BoardId === Boardid);
  return boards ? boards.BoardName : 'N/A';
}

if(flag == 'select')
{    
  return this.AvailableBoards.filter((s:any) => s.Status === 1);
} 
}



}
