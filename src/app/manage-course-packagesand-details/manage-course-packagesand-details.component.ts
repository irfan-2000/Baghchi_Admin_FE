import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassBoardSubjectService } from '../class-board-subject.service';
import { error } from 'console';
import { CoursepackagesService } from '../coursepackages.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-course-packagesand-details',
  standalone: false,
  templateUrl: './manage-course-packagesand-details.component.html',
  styleUrl: './manage-course-packagesand-details.component.css'
})
export class ManageCoursePackagesandDetailsComponent {

  courseForm!: FormGroup;
  errorMessage: string = '';

  availableClasses: any[] = [];
  availableBoards: any[] = [];
  availableSubjects: any[] = [];
  Selectedfile:any;
  OldImageName:any;
  IsEditMode:boolean=false;
 coursePackageDetails :any;
 CourseId:any;
 isLoading = false;


  constructor(private fb: FormBuilder,private Class_board_subjectservice:ClassBoardSubjectService,private coursepackages:CoursepackagesService,private route: ActivatedRoute) 
  {
this.loadDropdowns();
 
this.route.queryParams.subscribe(params => {
      this.CourseId  = params['CourseId'];
      
      this.IsEditMode= this.IsEditMode = params["IsEditMode"]?.toLowerCase() === "true";
         
    });
     if(this.IsEditMode && this.CourseId >0)
    {
 this.getcoursebyid(this.CourseId);

    }


  }

  ngOnInit(): void {
    this.initForm();
  

  }

  initForm() {
  this.courseForm = this.fb.group({
      courseName: ['test coursename', Validators.required],
      classId: ['', Validators.required],
      boardId: ['', Validators.required],
      subjectId: [[]],
      price: [120, Validators.required],
      oldPrice: [0],
      courseLevel: ['Advacned'],
      courseImage: [''],
        duration: ['3 months'],    
      shortDescription: ['test short description'],
      overview: ['test overview'],
      highlights: this.fb.array([]),
      requirements: this.fb.array([]),
      objectives: this.fb.array([]),
       batches: this.fb.array([]) ,
         paymentType: [''],
      installments: this.fb.array([]),
      status: [1, Validators.required]
    });
  }

  loadDropdowns() 
  { 

 this.Class_board_subjectservice.GetAvailableCourses().subscribe({
    next: (response: any) => {
       
      this.availableClasses = response.Result; // match backend casing
      console.log("Courses fetched:", this.availableClasses);
    },
    error: (err: any) => {
      console.error("Error fetching courses:", err);
    }
  });


 this.Class_board_subjectservice.GetAvailableBaords().subscribe({
    next: (response: any) => {
       
      this.availableBoards = response.Result; // match backend casing
      console.log("Courses fetched:", this.availableBoards);
    },
    error: (err: any) => {
      console.error("Error fetching courses:", err);
    }
  });
 
    this.Class_board_subjectservice.GetAvailableSubjects().subscribe({
    next: (response: any) => {
       
      this.availableSubjects = response.Result; // match backend casing
      console.log("subject fetched:", this.availableSubjects);
    },
    error: (err: any) => {
      console.error("Error fetching courses:", err);
    }
  });

 
  }


   get highlights(): FormArray {
    return this.courseForm.get('highlights') as FormArray;
  }

  get requirements(): FormArray {
    return this.courseForm.get('requirements') as FormArray;
  }

  addHighlight() {
    this.highlights.push(this.fb.group({ text: [''] }));
  }

  removeHighlight(index: number) {
    this.highlights.removeAt(index);
  }

  addRequirement() {
    this.requirements.push(this.fb.group({ text: [''] }));
  }

  removeRequirement(index: number) {
    this.requirements.removeAt(index);
  }


get objectives():FormArray{
  return this.courseForm.get('objectives') as FormArray;
}

 addObjective(){
  this.objectives.push(this.fb.group({text:['']}));
 }

removeobjective(index:any)
{
this.objectives.removeAt(index);
}

  selectAllSubjects() {
    const subjectIdControl = this.courseForm.get('subjectId');
    if (subjectIdControl) {
      subjectIdControl.patchValue(this.availableSubjects.map(s => s.SubjectId));
    }
  }

  unselectAllSubjects() 
  {
  const subjectIdControl = this.courseForm.get('subjectId');
    if (subjectIdControl)
    {
 subjectIdControl.patchValue([]);
    }
    
  }



  toggleCheckAll(event: any)
   {
    if(event.currentTarget.checked)
      {
      this.selectAllSubjects();
    } else {
      this.unselectAllSubjects();
    }
  }
 get batches(): FormArray {
    return this.courseForm.get('batches') as FormArray;
  }

  addBatch() {
    const batchGroup = this.fb.group({
      batchName: ['', Validators.required],
      batch_classId: ['', Validators.required],
      batch_subjectId: ['', Validators.required],
      batch_boardId: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required]
    });
    this.batches.push(batchGroup);
  }

  removeBatch(index: number) {
    this.batches.removeAt(index);
  }
get installments() {
  return this.courseForm.get('installments') as FormArray;
}

addInstallment() {
    const instArray = this.courseForm.get('installments') as FormArray;

  this.installments.push(this.fb.group({ 
    InstallmentNumber: instArray.length + 1,  // auto increment
     Amount: [''],
    DueDaysFromStart: [''],
    Remarks: ['']
  }));
}

removeInstallment(index: number) 
{
   const instArray = this.courseForm.get('installments') as FormArray;
  instArray.removeAt(index);
   instArray.controls.forEach((ctrl, idx) => ctrl.patchValue({ InstallmentNumber: idx + 1 }));
}

fileName: string | null = null;

 
Onfilechange(event:any)
{
  if(event.target.files.length>0)
  {
this.Selectedfile = event.target.files[0];
   
} 
}



ValidateFields() :any
{
let  errorcount=0;
this.errorMessage  = '';
 

if(this.courseForm.get('courseName')?.value.trim()=='' || this.courseForm.get('courseName')?.value==null || this.courseForm.get('courseName')?.value==undefined)
{
  this.errorMessage +="Course Name is required.\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
}
 
if(this.courseForm.get('courseLevel')?.value.trim()=='' || this.courseForm.get('courseLevel')?.value==null || this.courseForm.get('courseLevel')?.value==undefined)
{
  this.errorMessage +="course Level is required.\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
}
 
if (this.courseForm.get('classId')?.value == null || this.courseForm.get('classId')?.value == undefined || this.courseForm.get('classId')?.value <= 0) {
  this.errorMessage += "class is required.\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
}

if (this.courseForm.get('boardId')?.value == null || this.courseForm.get('boardId')?.value == undefined || this.courseForm.get('boardId')?.value <= 0) {
  this.errorMessage += "board is required.\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
}

if (this.courseForm.get('subjectId')?.value == null || this.courseForm.get('subjectId')?.value == undefined || this.courseForm.get('subjectId')?.value.length == 0) {
  this.errorMessage += "subject is required.\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
}
 
if(this.courseForm.get('price')?.value=='' || this.courseForm.get('price')?.value==null || this.courseForm.get('price')?.value==undefined || this.courseForm.get('price')?.value == 0)
{
  this.errorMessage +="price is required.\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
} 

 if(this.courseForm.get('duration')?.value=='' ||  this.courseForm.get('duration')?.value==null ||  this.courseForm.get('duration')?.value==undefined  )
{
  this.errorMessage +="course duration is required.\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
} 


 if(this.courseForm.get('shortDescription')?.value=='' ||  this.courseForm.get('shortDescription')?.value==null ||  this.courseForm.get('shortDescription')?.value==undefined  )
{
  this.errorMessage +=" shortDescription is required.\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
} 
 

 if(this.courseForm.get('overview')?.value=='' ||  this.courseForm.get('overview')?.value==null ||  this.courseForm.get('overview')?.value==undefined  )
{
  this.errorMessage +="overview is required.\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
} 
 
 if(this.courseForm.get('highlights')?.value=='' ||  this.courseForm.get('highlights')?.value==null ||  this.courseForm.get('highlights')?.value==undefined  || this.courseForm.get('highlights')?.value.length==0 )
{
  this.errorMessage +="highlights is required.\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
} 

if(this.courseForm.get('highlights')?.value=='' ||  this.courseForm.get('highlights')?.value==null ||  this.courseForm.get('highlights')?.value==undefined  || this.courseForm.get('highlights')?.value.length==0 )
{
  this.errorMessage +="highlights is required.\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
} 


if(this.courseForm.get('requirements')?.value=='' ||  this.courseForm.get('requirements')?.value==null ||  this.courseForm.get('requirements')?.value==undefined  || this.courseForm.get('requirements')?.value.length==0 )
{
  this.errorMessage +="requirements is required.\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
} 
 

if(this.courseForm.get('objectives')?.value=='' ||  this.courseForm.get('objectives')?.value==null ||  this.courseForm.get('objectives')?.value==undefined  || this.courseForm.get('objectives')?.value.length==0 )
{
  this.errorMessage +="objectives is required.\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
} 
//check batches length and validate each field of that batch

if(this.courseForm.get('batches')?.value=='' ||  this.courseForm.get('batches')?.value==null ||  this.courseForm.get('batches')?.value==undefined  || this.courseForm.get('batches')?.value.length==0 )
{
  this.errorMessage +="Atleast 1 batch is required.\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
} 

let Noofbatches = this.courseForm.get('batches')?.value.length;

for(let i=0;i<Noofbatches;i++)
{
  if(this.courseForm.get('batches')?.value[i].batchName=='' || this.courseForm.get('batches')?.value[i].batchName==null || this.courseForm.get('batches')?.value[i].batchName==undefined)
{
  this.errorMessage +="Batch Name is required for batch "+(i+1)+".\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
}
 

if(this.courseForm.get('batches')?.value[i].batch_classId=='' ||
 this.courseForm.get('batches')?.value[i].batch_classId==null ||
  this.courseForm.get('batches')?.value[i].batch_classId==undefined ||
   this.courseForm.get('batches')?.value[i].batch_classId<=0)
{
    this.errorMessage +="Class is required for batch "+(i+1)+".\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
} 

if(this.courseForm.get('batches')?.value[i].batch_subjectId=='' ||
 this.courseForm.get('batches')?.value[i].batch_subjectId==null ||
  this.courseForm.get('batches')?.value[i].batch_subjectId==undefined ||
   this.courseForm.get('batches')?.value[i].batch_subjectId<=0)
{
    this.errorMessage +="Subject Name is required for batch "+(i+1)+".\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
}


if(this.courseForm.get('batches')?.value[i].batch_boardId=='' ||
 this.courseForm.get('batches')?.value[i].batch_boardId==null ||
  this.courseForm.get('batches')?.value[i].batch_boardId==undefined ||
   this.courseForm.get('batches')?.value[i].batch_boardId<=0)
{
    this.errorMessage +="Batch board is required for batch "+(i+1)+".\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
}


if(this.courseForm.get('batches')?.value[i].startDate=='' ||
 this.courseForm.get('batches')?.value[i].startDate==null ||
  this.courseForm.get('batches')?.value[i].startDate==undefined ||
   this.courseForm.get('batches')?.value[i].startDate<=0)
{
    this.errorMessage +="start Date   is required for batch "+(i+1)+".\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
}

if(this.courseForm.get('batches')?.value[i].endDate=='' ||
 this.courseForm.get('batches')?.value[i].endDate==null ||
  this.courseForm.get('batches')?.value[i].endDate==undefined ||
   this.courseForm.get('batches')?.value[i].endDate<=0)
{
    this.errorMessage +="end Date   is required for batch "+(i+1)+".\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
}

if(this.courseForm.get('batches')?.value[i].startTime=='' ||
 this.courseForm.get('batches')?.value[i].startTime==null ||
  this.courseForm.get('batches')?.value[i].startTime==undefined ||
   this.courseForm.get('batches')?.value[i].startTime<=0)
{
    this.errorMessage +="start Time     is required for batch "+(i+1)+".\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
}
if(this.courseForm.get('batches')?.value[i].endTime =='' ||
 this.courseForm.get('batches')?.value[i].endTime == null ||
  this.courseForm.get('batches')?.value[i].endTime == undefined ||
   this.courseForm.get('batches')?.value[i].endTime <= 0)
{
    this.errorMessage +=" end Time       is required for batch "+(i+1)+".\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
}
 
}

if(this.courseForm.get('paymentType')?.value=='' || 
 this.courseForm.get('paymentType')?.value==null ||
 
 this.courseForm.get('paymentType')?.value==undefined  )
{
  this.errorMessage +="payment Type is required.\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
}


if(this.courseForm.get('paymentType')?.value == 'installments')
{

let Noofinstallments = this.courseForm.get('installments')?.value.length;

if(Noofinstallments <= 0)
{
  alert("Atleast 1 installment is required.");
  errorcount++;
  return errorcount;
}

for(let i=0;i<Noofinstallments;i++)
{   
   
  
if(this.courseForm.get('installments')?.value[i].Amount =='' ||
 this.courseForm.get('installments')?.value[i].Amount==null ||
  this.courseForm.get('installments')?.value[i].Amount==undefined ||
   this.courseForm.get('installments')?.value[i].Amount<=0)
{
    this.errorMessage +=" Amount    is required for installment "+(i+1)+".\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
}


if(this.courseForm.get('installments')?.value[i].DueDaysFromStart==='' ||
 this.courseForm.get('installments')?.value[i].DueDaysFromStart===null ||
  this.courseForm.get('installments')?.value[i].DueDaysFromStart===undefined)
{
    this.errorMessage +="  Due date     is required for installment "+(i+1)+".\n";
  alert(this.errorMessage);
  errorcount++;
  return errorcount;
} 
} 
}
 
return errorcount;  
 
}
 

populate_data() 
{
   
  if (!this.coursePackageDetails) return;

  const item1 = this.coursePackageDetails.Item1 || {};
  const item2 = this.coursePackageDetails.Item2 || {};
 
  // Merge both objects for easier mapping
  const course = {
    courseName: item1.CourseName,
    shortDescription: item2.ShortDescription,
    overview: item2.Overview,
    courseLevel: item1.CourseLevel || item2.Level,
    duration: item2.Duration,
    oldPrice: item1.OldPrice,
    price: item1.Price,
    status: item1.Status,
    boardId: item1.BoardId,
    classId: item1.ClassId,
    subjectId: item1.SubjectId || [],
    paymentType: item1.PaymentType,
    courseImage: item1.CourseImageName,

    requirements: item1.Requirements || [],
    objectives: item1.Objectives || [],
    highlights: item2.Highlights || [],

    batches: item1.Batches || [],
    installments: item1.Installments || []
  };

  this.courseForm.patchValue({
    courseName: course.courseName || '',
    classId: course.classId || '',
    boardId: course.boardId || '',
    subjectId: course.subjectId || [],
    price: course.price || 0,
    oldPrice: course.oldPrice || 0,
    courseLevel: course.courseLevel || '',
    courseImage: course.courseImage || '',
    duration: course.duration || '',
    shortDescription: course.shortDescription || '',
    overview: course.overview || '',
    paymentType: course.paymentType || '',
    status: course.status ?? 1,
  });

  // --- Highlights
  this.highlights.clear();
  (course.highlights || []).forEach((h: string) => {
    if (h?.trim()) {
      this.highlights.push(this.fb.group({ text: [h] }));
    }
  });

  // --- Requirements
  this.requirements.clear();
  (course.requirements || []).forEach((r: string) => {
    if (r?.trim()) {
      this.requirements.push(this.fb.group({ text: [r] }));
    }
  });

  // --- Objectives
  this.objectives.clear();
  (course.objectives || []).forEach((o: string) => {
    if (o?.trim()) {
      this.objectives.push(this.fb.group({ text: [o] }));
    }
  });

  // --- Batches
  this.batches.clear();
  (course.batches || []).forEach((b: any) => {
    this.batches.push(this.fb.group({
      batchName: [b.batchName || ''],
      batch_classId: [b.batch_classId || b.classId || ''],
      batch_subjectId: [b.batch_subjectId || b.subjectId || ''],
      batch_boardId: [b.batch_boardId || b.boardId || ''],
      startDate: [b.startDate ? b.startDate.split('T')[0] : ''],
      endDate: [b.endDate ? b.endDate.split('T')[0] : ''],
      startTime: [b.startTime ? this.toTimeInput(b.startTime) : ''],
      endTime: [b.endTime ? this.toTimeInput(b.endTime) : '']
    }));
  });
this.courseForm.get('paymentType')?.setValue(course.paymentType || '');

  // --- Installments
  this.installments.clear();
  (course.installments || []).forEach((inst: any) => 
    {
    this.installments.push(this.fb.group({
      InstallmentNumber: [inst.InstallmentNumber],
      Amount: [inst.Amount],
      DueDaysFromStart: [inst.DueDaysFromStart],
      Remarks: [inst.Remarks]
    }));
  });
} 


toTimeInput(time24: string): string {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}


 submitCourseDetails() 
  {
      
  if(this.ValidateFields() > 0)
  {
  return;
  }


     const data = this.courseForm.value;

    // Convert highlights and requirements to simple arrays
    data.highlights = data.highlights.map((h: any) => h.text);
    data.requirements = data.requirements.map((r: any) => r.text);

    console.log('Course Data:', data);

  let formData = new FormData(); 
  if(this.IsEditMode)
  {

  formData.append('CourseId', this.CourseId || '0');  
  }
  formData.append('courseName', this.courseForm.get('courseName')?.value);
  formData.append('courseLevel', this.courseForm.get('courseLevel')?.value);
  formData.append('classId', this.courseForm.get('classId')?.value);
  formData.append('boardId', this.courseForm.get('boardId')?.value);
  formData.append('subjectId', JSON.stringify(this.courseForm.get('subjectId')?.value)); // multiple subjects
  formData.append('price', this.courseForm.get('price')?.value);
  formData.append('oldPrice', this.courseForm.get('oldPrice')?.value);
  formData.append('duration', this.courseForm.get('duration')?.value);
  formData.append('shortDescription', this.courseForm.get('shortDescription')?.value);
  formData.append('overview', this.courseForm.get('overview')?.value);
  formData.append('paymentType', this.courseForm.get('paymentType')?.value);
  formData.append('status', this.courseForm.get('status')?.value);
  formData.append('IsEditing',this.IsEditMode.toString());
  
 if (!this.Selectedfile && !this.IsEditMode)
   {
    alert("please select course image");
    return;
   }else if(!this.Selectedfile && this.IsEditMode)
    {
      
    formData.append('Old_courseImage', this.coursePackageDetails.Item1.CourseImageName);  
    
        
   }else{
        formData.append('courseImage', this.Selectedfile);
   }

 // Highlights (already done)
const highlightsArray = this.courseForm.get('highlights')?.value.map((h: any) => h.text);
const highlightsJson = JSON.stringify(highlightsArray);
formData.append('highlights', highlightsJson);

// Requirements
const requirementsArray = this.courseForm.get('requirements')?.value.map((r: any) => r.text || r); // handle plain strings too
const requirementsJson = JSON.stringify(requirementsArray);
formData.append('requirements', requirementsJson);

// Objectives
const objectivesArray = this.courseForm.get('objectives')?.value.map((o: any) => o.text || o); // handle plain strings too
const objectivesJson = JSON.stringify(objectivesArray);
formData.append('objectives', objectivesJson);



  
  formData.append('batches', JSON.stringify(this.courseForm.get('batches')?.value));
  formData.append('installments', JSON.stringify(this.courseForm.get('installments')?.value));

  this.isLoading = true;

 
this.coursepackages.submitCourseDetails(formData).subscribe({
  next: (response: any) => 
    {
       
    if (response && response.statuscode == '200') 
      {
        alert(response.message);
        window.location.reload();
     }
  },
  error: (err: any) =>
     {
      this.isLoading= false;
    console.log(err);
    alert("Error submitting course details: " + err.message);
  }
});

 
   }

getcoursebyid(courseid:any)
{
  this.coursepackages.getCourseById(courseid).subscribe
  ({
     next : (response: any) =>
       {
        this.coursePackageDetails = response;
             this.populate_data( );
        console.log(response)
     },
    error: (err: any) => {
    }
  });




}


viewImage()
{
   
  this.coursePackageDetails.Item1.ImagewithPath
   
  window.open(this.coursePackageDetails.Item1.ImagewithPath, '_blank');
}










}
