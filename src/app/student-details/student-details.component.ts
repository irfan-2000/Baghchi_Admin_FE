import { Component } from '@angular/core';
import { StudentService } from '../student.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClassBoardSubjectService } from '../class-board-subject.service';
@Component({
  selector: 'app-student-details',
  standalone: false,
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent 
{

Showstudentlist:any=true;

Listofstudents:any ;
studentForm!: FormGroup;
AvailableBoards:any;

  constructor(private studentService: StudentService,private fb: FormBuilder,private Class_board_subjectservice:ClassBoardSubjectService)
  {
    this.getAllStudents()
    this.GetAvailableCourses();
    this.GetAvailableBoards();
this.studentForm = this.fb.group({
      FullName: [''],
      Gender: [''],
      DateOfBirth: [''],
      Email: [''],
      Phone: [''],
      ParentName: [''],
      ParentMobile: [''],
      Address: [''],
      City: [''],
      State: [''],
      Pincode: [''],
      InstitutionName: [''],
      ClassId: [''],
      Status: [''],
      Password: [''],
      IsActive: [''],
      Student_Cast: [''],
      BoardId: ['']
    });
  }
 studentdata:any;

  editStudent(student: any)
   {
 
this.getstudentbyid(student.StudentId);
this.Showstudentlist=false;
}

  viewEnrollments(student: any) {
    console.log('View Enrollments clicked', student);
  }
  
getAllStudents()
{
this.studentService.getAllStudents().subscribe({
next:(data:any)=>
{
  this.Listofstudents = data;
  console.log(data);
},
error:(error:any)=>
{
  console.log(error);
}}) 
}

getstudentbyid(id:any)
{
this.studentService.getstudentbyid(id).subscribe({
next:(data:any)=>
{
  this.studentdata = data;
  console.log(data);
  this.populateStudentForm(); 

},
error:(error:any)=>
{
  console.log(error);
}}) 
} 
 


 populateStudentForm() 
  {
     
    if (this.studentdata) 
      {
      this.studentForm.patchValue({
        FullName: this.studentdata.FullName,
        Gender: this.studentdata.Gender,
        DateOfBirth: this.studentdata.DateOfBirth.split('T')[0], // Format date if necessary
        Email: this.studentdata.Email,
        Phone: this.studentdata.Phone,
        ParentName: this.studentdata.ParentName,
        ParentMobile: this.studentdata.ParentMobile,
        Address: this.studentdata.Address,
        City: this.studentdata.City,
        State: this.studentdata.State,
        Pincode: this.studentdata.Pincode,
        InstitutionName: this.studentdata.InstitutionName,
        ClassId: this.studentdata.ClassId,
        Status: this.studentdata.Status,
        Password: this.studentdata.Password,
        IsActive: this.studentdata.IsActive,
        Student_Cast: this.studentdata.Student_Cast,
        BoardId: this.studentdata.BoardId
      });
    }
  }
selectedFileName: any = '';

onFileSelected(event: any) {
  if (event.target.files && event.target.files.length > 0)
     {
    this.selectedFileName = event.target.files[0];
    debugger
  }
}

ViewProfileimage()
{ 
   
  this.studentdata.ImageUrl;
   
  window.open(this.studentdata.ImageUrl, '_blank');
}
Availableclasses:any;

 GetAvailableCourses(): void
  {
  this.Class_board_subjectservice.GetAvailableCourses().subscribe({
    next: (response: any) => {
       
      this.Availableclasses = response.Result; // match backend casing
     },
    error: (err: any) => {
     }
  });
}

submitForm()
{
  let formData = new FormData(); 
 formData.append('StudentId', this.studentdata.StudentId || '0'); 
formData.append('FullName', this.studentForm.get('FullName')?.value);
formData.append('DateOfBirth', this.studentForm.get('DateOfBirth')?.value);
formData.append('Gender', this.studentForm.get('Gender')?.value);
formData.append('Email', this.studentForm.get('Email')?.value);
formData.append('Phone', this.studentForm.get('Phone')?.value);
formData.append('ParentName', this.studentForm.get('ParentName')?.value);
formData.append('ParentMobile', this.studentForm.get('ParentMobile')?.value);
formData.append('Address', this.studentForm.get('Address')?.value);
formData.append('City', this.studentForm.get('City')?.value);
formData.append('State', this.studentForm.get('State')?.value);
formData.append('Pincode', this.studentForm.get('Pincode')?.value);
formData.append('InstitutionName', this.studentForm.get('InstitutionName')?.value);
 
formData.append('ClassId', this.studentForm.get('ClassId')?.value);
 formData.append('Status', this.studentForm.get('Status')?.value);
formData.append('Password', this.studentForm.get('Password')?.value);
formData.append('IsActive', this.studentForm.get('IsActive')?.value);
formData.append('Student_Cast', this.studentForm.get('Student_Cast')?.value);
formData.append('IsEditing','true');
formData.append('OldImageName', this.studentdata.ImageName );
formData.append('BoardId', this.studentForm.get('BoardId')?.value);
   debugger
if(!this.selectedFileName && !this.studentdata.ImageName)
{
alert("please select course image");
}
else{
    formData.append('ProfileImage', this.selectedFileName);      
}


this.studentService.SubmitStudentDetails(formData).subscribe({
next:(data:any)=>
{
  if(data.statuscode == 200)
  {
    alert("Data has been updated successfully");
  }else{
    alert("Error updating data please enter correct data");
  }
console.log(data) ;
},error:(error:any)=>
{
  console.log(error);
}

}) 
}


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
 



}







 