import { Component } from '@angular/core';
 import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassBoardSubjectService } from '../class-board-subject.service';
 import { CoursepackagesService } from '../coursepackages.service';
import { ActivatedRoute, Router } from '@angular/router';
 
@Component({
  selector: 'app-manage-course-packagesand-details2',
  standalone: false,
  templateUrl: './manage-course-packagesand-details2.component.html',
  styleUrl: './manage-course-packagesand-details2.component.css'
})
export class ManageCoursePackagesandDetails2Component {
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
  CourseInfoErrorMsg :any = '';
courseInfoForm:any;
batchErrorMsg:any = '';
  batchForm!: FormGroup;
    paymentForm: FormGroup;
  paymentErrorMsg: any = '';


  constructor(private fb: FormBuilder,private Class_board_subjectservice:ClassBoardSubjectService,private coursepackages:CoursepackagesService,private route: ActivatedRoute,private router: Router) 
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

 
    this.courseInfoForm = this.fb.group({
 courseName: ['maths', Validators.required],
      classId: ['1', Validators.required],
      boardId: ['1', Validators.required],
   subjectId: [[], Validators.required],
      price: [120, Validators.required],
      oldPrice: [60],
   courseLevel: ['intermediate', Validators.required],
      courseImage: [''],
   duration: ['4', Validators.required],
  shortDescription: ['test short', Validators.required],
  overview: ['test overview', Validators.required],
  highlights: this.fb.array([]),
      requirements: this.fb.array([]),
      objectives: this.fb.array([]),
       teacher: ['irfan1', Validators.required], 
  status: [1, Validators.required]
});


this.batchForm = this.fb.group({
      batches: this.fb.array([])   // Initial empty array
    });

    this.addBatch(); // Add the first batch by default


this.paymentForm = this.fb.group({

      // 1️⃣ Payment Type
      paymentType: ['', Validators.required], // fixed | subscription

      // 2️⃣ FIXED PAYMENT FIELDS
      fixed_paymentMode: [''],  // oneTime | installments | both
      totalPrice: [''],

      installments: this.fb.array([]),

      // 3️⃣ SUBSCRIPTION FIELDS
      monthlyAmount: [''],
      quarterlyAmount: [''],
      halfYearlyAmount: [''],
      yearlyAmount: ['']
    });


  }

  ngOnInit(): void 
  {
  //  this.initForm();
  
//this.populate_data();

  }

  initForm() {
  this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      classId: ['', Validators.required],
      boardId: ['', Validators.required],
      subjectId: [[]],
      price: [0, Validators.required],
      oldPrice: [0],
      courseLevel: [''],
      courseImage: [''],
        duration: [''],    
      shortDescription: [''],
      overview: [''],
      highlights: this.fb.array([]),
      requirements: this.fb.array([]),
      objectives: this.fb.array([]),
       batches: this.fb.array([]) ,
      paymentType: [null],
      installments: this.fb.array([]),
      status: [1, Validators.required],
      teacher:['',Validators.required],
      standard_paymentMode:[''],
      totalPrice:[''],
        monthlyAmount: [''],
  quarterlyAmount: [''],
  halfYearlyAmount: [''],
  yearlyAmount: ['']
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
    return this.courseInfoForm.get('highlights') as FormArray;
  }

  get requirements(): FormArray {
    return this.courseInfoForm.get('requirements') as FormArray;
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
  return this.courseInfoForm.get('objectives') as FormArray;
}

 addObjective(){
  this.objectives.push(this.fb.group({text:['']}));
 }

removeobjective(index:any)
{
this.objectives.removeAt(index);
}

  selectAllSubjects() {
    const subjectIdControl = this.courseInfoForm.get('subjectId');
    if (subjectIdControl) {
      subjectIdControl.patchValue(this.availableSubjects.map(s => s.SubjectId));
    }
  }

  unselectAllSubjects() 
  {
  const subjectIdControl = this.courseInfoForm.get('subjectId');
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


  
    get   batches(): FormArray {
       
    return this.batchForm.get('batches') as FormArray;
    
  }

  addBatch()
   {
    const batchGroup = this.fb.group({
      batchId: [0],   // ✔ required for SP logic1
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

   removeBatch(index: number): void {
    if (this.batches.length === 1) {
      this.batchErrorMsg = 'At least one batch is required';
      return;
    }
    this.batchErrorMsg = '';
    this.batches.removeAt(index);
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


if(this.courseForm.get('paymentType')?.value == 'installments' || this.courseForm.get('paymentType')?.value == 'both')
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
 let course: any = {};
 
course.courseName = item1.CourseName;        // update courseName
course.shortDescription = item2.ShortDescription;
course.overview = item2.Overview;
course.courseLevel = item1.CourseLevel || item2.Level;
course.duration = item2.Duration;
course.oldPrice = item1.OldPrice;
course.price = item1.Price;
course.status = item1.Status;
course.boardId = item1.BoardId;
course.classId = item1.ClassId;
course.subjectId = item1.SubjectId || [];
course.paymentType = item1.PaymentType;

course.courseImage = item1.CourseImageName;

course.requirements = item1.Requirements || [];
course.objectives = item1.Objectives || [];
course.highlights = item2.Highlights || [];

course.batches = item1.Batches || [];
course.installments = item1.Installments || [];

// Update teacher like this:
course.teacher = item1.teacher;   // or any new value you want



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
    teacher:course.teacher
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

this.coursecontent_wordfile = this.coursePackageDetails.Item3;
debugger

} 



popultecourseInfo()
{
  
  if (!this.coursePackageDetails) return;

  const item1 = this.coursePackageDetails.Item1 || {};
  const item2 = this.coursePackageDetails.Item2 || {};
 
  // Merge both objects for easier mapping
 let course: any = {}; 
course.courseName = item1.CourseName;        // update courseName
course.shortDescription = item2.ShortDescription;
course.overview = item2.Overview;
course.courseLevel = item1.CourseLevel || item2.Level;
course.duration = item2.Duration;
course.oldPrice = item1.OldPrice;
course.price = item1.Price;
course.status = item1.Status;
course.boardId = item1.BoardId;
course.classId = item1.ClassId;
course.subjectId = item1.SubjectId || [];
 course.courseImage = item1.CourseImageName;

course.requirements = item1.Requirements || [];
course.objectives = item1.Objectives || [];
course.highlights = item2.Highlights || [];
 
course.teacher = item1.Teacher;   // or any new value you want


debugger
  this.courseInfoForm.patchValue({
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
    teacher:course.teacher
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

    

this.coursecontent_wordfile = this.coursePackageDetails.Item3;
debugger

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
  formData.append('teacher',this.courseForm.get('teacher')?.value);
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
    console.log(err.error.Message);
    alert("Error submitting course details:" + err.error.Message);

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
       
     this.popultecourseInfo( );
     this.populateBatchData(response.Item1.Batches);
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


coursecontent_wordfile:any
popupVisible:boolean =false;

ondocFileSelected(event:any)
{ 
  const file = event.target.files[0];

  const fileNameElement = document.getElementById('selectedFileName');
  const loadingElement = document.getElementById('loadingText');

  if (file) 
    {
    fileNameElement!.textContent = file.name;
    loadingElement!.classList.remove('hidden');
    this.UploadandParseWordFile(event)
  } else 
    {
    fileNameElement!.textContent = "No file chosen";
  }

}

UploadandParseWordFile(event:any)
{ 
  const file = event.target.files[0];
  const loadingElement = document.getElementById('loadingText');
 this.errorMessage = '' 
  if (!file) {
    alert('Please select a Word file to upload.');
    return;
  }else{
      
  this.coursepackages.UploadandParseWordFile(file).subscribe({
    next:(response:any)=>
    {
       console.log(response);
 
      if(response.Message == "Course content parsed successfully")
      {
          this.coursecontent_wordfile = response.Data;
             loadingElement!.classList.add('hidden');
            console.log(this.coursecontent_wordfile);
       }
    //  this.populateSampleData(response);
    },
    error:(error:any)=>
    {
      this.errorMessage = error.error.Message + 'Please corrrect the errors in the Word file and re-upload.';
      loadingElement!.classList.add('hidden');
      console.error('Error fetching quiz:', error);
    }});
 
  }

}



toggleModule(i: number) 
{
  this.coursecontent_wordfile[i].open = !this.coursecontent_wordfile[i].open;
}


    openLessons: any = {};

  toggleLesson(ci: number, li: number) {
    const key = `${ci}-${li}`;
    this.openLessons[key] = !this.openLessons[key];
  }

  isLessonOpen(ci: number, li: number) {
    return !!this.openLessons[`${ci}-${li}`];
  }
  

 //new code
 submitCourseInfoSection()
 {
  
if(this.ValidateCourseInfo() >0)
{
  return;
}
  
  let formData = new FormData(); 
  if(this.IsEditMode)
  {

  formData.append('CourseId', this.CourseId || '0');  
  }
  formData.append('courseName', this.courseInfoForm.get('courseName')?.value);
  formData.append('courseLevel', this.courseInfoForm.get('courseLevel')?.value);
  formData.append('classId', this.courseInfoForm.get('classId')?.value);
  formData.append('boardId', this.courseInfoForm.get('boardId')?.value);
  formData.append('subjectId', JSON.stringify(this.courseInfoForm.get('subjectId')?.value)); // multiple subjects
  formData.append('price', this.courseInfoForm.get('price')?.value);
  formData.append('oldPrice', this.courseInfoForm.get('oldPrice')?.value);
  formData.append('duration', this.courseInfoForm.get('duration')?.value);
  formData.append('shortDescription', this.courseInfoForm.get('shortDescription')?.value);
  formData.append('overview', this.courseInfoForm.get('overview')?.value);
   formData.append('status', this.courseInfoForm.get('status')?.value);
  formData.append('IsEditing',this.IsEditMode.toString());
  formData.append('teacher',this.courseInfoForm.get('teacher')?.value);

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
debugger
   if(this.IsEditMode)
   {
formData.append('CourseContent', JSON.stringify(this.coursecontent_wordfile));

   }



 // Highlights (already done)
const highlightsArray = this.courseInfoForm.get('highlights')?.value.map((h: any) => h.text);
const highlightsJson = JSON.stringify(highlightsArray);
formData.append('highlights', highlightsJson);

// Requirements
const requirementsArray = this.courseInfoForm.get('requirements')?.value.map((r: any) => r.text || r); // handle plain strings too
const requirementsJson = JSON.stringify(requirementsArray);
formData.append('requirements', requirementsJson);

// Objectives
const objectivesArray = this.courseInfoForm.get('objectives')?.value.map((o: any) => o.text || o); // handle plain strings too
const objectivesJson = JSON.stringify(objectivesArray);
formData.append('objectives', objectivesJson);
  this.isLoading = true;


this.coursepackages.submitCourseInfoDetails(formData).subscribe({
  next: (response: any) => 
    {
       
    if (response && response.statuscode == '200') 
      {  
        this.isLoading = false;

        alert(response.message); 
     }
  },
  error: (err: any) =>
     {
      this.isLoading= false;
    console.log(err.error.Message);
    alert("Error submitting course details:" + err.error.Message);

  }
});

 } 


ValidateCourseInfo(): any
 {
  let errorcount = 0;
  this.CourseInfoErrorMsg = '';

  if(this.courseInfoForm.get('courseName')?.value.trim() == '' || this.courseInfoForm.get('courseName')?.value == null || this.courseInfoForm.get('courseName')?.value == undefined) {
    this.CourseInfoErrorMsg += "Course Name is required.\n";
     errorcount++;
    return errorcount;
  }

  if(this.courseInfoForm.get('courseLevel')?.value.trim() == '' || this.courseInfoForm.get('courseLevel')?.value == null || this.courseInfoForm.get('courseLevel')?.value == undefined) {
    this.CourseInfoErrorMsg += "course Level is required.\n";
     errorcount++;
    return errorcount;
  }

  if(this.courseInfoForm.get('teacher')?.value.trim() == '' || this.courseInfoForm.get('teacher')?.value == null || this.courseInfoForm.get('teacher')?.value == undefined) {
    this.CourseInfoErrorMsg += "Teacher Name is required.\n";
     errorcount++;
    return errorcount;
  }

  if(this.courseInfoForm.get('classId')?.value == null || this.courseInfoForm.get('classId')?.value == undefined || this.courseInfoForm.get('classId')?.value <= 0) {
    this.CourseInfoErrorMsg += "class is required.\n";
     errorcount++;
    return errorcount;
  }

  if(this.courseInfoForm.get('boardId')?.value == null || this.courseInfoForm.get('boardId')?.value == undefined || this.courseInfoForm.get('boardId')?.value <= 0) {
    this.CourseInfoErrorMsg += "board is required.\n";
     errorcount++;
    return errorcount;
  }

  if(this.courseInfoForm.get('subjectId')?.value == null || this.courseInfoForm.get('subjectId')?.value == undefined || this.courseInfoForm.get('subjectId')?.value.length == 0) {
    this.CourseInfoErrorMsg += "subject is required.\n";
     errorcount++;
    return errorcount;
  }

  if(this.courseInfoForm.get('price')?.value == '' || this.courseInfoForm.get('price')?.value == null || this.courseInfoForm.get('price')?.value == undefined || this.courseInfoForm.get('price')?.value == 0) {
    this.CourseInfoErrorMsg += "price is required.\n";
     errorcount++;
    return errorcount;
  }

  if(this.courseInfoForm.get('duration')?.value == '' || this.courseInfoForm.get('duration')?.value == null || this.courseInfoForm.get('duration')?.value == undefined) {
    this.CourseInfoErrorMsg += "course duration is required.\n";
     errorcount++;
    return errorcount;
  }

  if(this.courseInfoForm.get('shortDescription')?.value == '' || this.courseInfoForm.get('shortDescription')?.value == null || this.courseInfoForm.get('shortDescription')?.value == undefined) {
    this.CourseInfoErrorMsg += "shortDescription is required.\n";
     errorcount++;
    return errorcount;
  }

  if(this.courseInfoForm.get('overview')?.value == '' || this.courseInfoForm.get('overview')?.value == null || this.courseInfoForm.get('overview')?.value == undefined) {
    this.CourseInfoErrorMsg += "overview is required.\n";
     errorcount++;
    return errorcount;
  }

  if(this.courseInfoForm.get('highlights')?.value == '' || this.courseInfoForm.get('highlights')?.value == null || this.courseInfoForm.get('highlights')?.value == undefined || this.courseInfoForm.get('highlights')?.value.length == 0) {
    this.CourseInfoErrorMsg += "highlights is required.\n";
     errorcount++;
    return errorcount;
  }

  if(this.courseInfoForm.get('requirements')?.value == '' || this.courseInfoForm.get('requirements')?.value == null || this.courseInfoForm.get('requirements')?.value == undefined || this.courseInfoForm.get('requirements')?.value.length == 0) {
    this.CourseInfoErrorMsg += "requirements is required.\n";
     errorcount++;
    return errorcount;
  }

  if(this.courseInfoForm.get('objectives')?.value == '' || this.courseInfoForm.get('objectives')?.value == null || this.courseInfoForm.get('objectives')?.value == undefined || this.courseInfoForm.get('objectives')?.value.length == 0) {
    this.CourseInfoErrorMsg += "objectives is required.\n";
     errorcount++;
    return errorcount;
  }

  if(this.courseInfoForm.get('status')?.value == null || this.courseInfoForm.get('status')?.value == undefined) {
    this.CourseInfoErrorMsg += "status is required.\n";
     errorcount++;
    return errorcount;
  }

  return errorcount;
}

AddNewCourse() {
  window.location.href = '/home/manage-courses2';
}

submitbatches()
{
  console.log(this.validateBatches() > 0);
  console.log("batches new",this.batchForm.value);
 
if(this.CourseId <= 0 || this.CourseId == null || this.CourseId == undefined)
{
  alert("CourseId not found");
}

  let formData = new FormData(); 
  
  formData.append('batches', JSON.stringify(this.batchForm.get('batches')?.value));
  formData.append('CourseId',  this.CourseId.toString());
debugger
this.coursepackages.SaveBatchDetails(formData).subscribe({
  next: (response: any) => 
    {
       
    if (response && response.statuscode == '200') 
      {  
        this.isLoading = false;

        alert(response.message); 
     }
  },
  error: (err: any) =>
     {
      this.isLoading= false;
    console.log(err.error.Message);
    alert("Error submitting course details:" + err.error.Message);

  }
});
}


 validateBatches() 
 {

  let errorcount = 0;
  this.batchErrorMsg = '';

  if (
    this.batchForm.get('batches')?.value == '' ||
    this.batchForm.get('batches')?.value == null ||
    this.batchForm.get('batches')?.value == undefined ||
    this.batchForm.get('batches')?.value.length == 0
  ) {
    this.batchErrorMsg += "Atleast 1 batch is required.\n";
    errorcount++;
    return errorcount;
  }

  let Noofbatches = this.batchForm.get('batches')?.value.length;

  for (let i = 0; i < Noofbatches; i++) {

    if (
      this.batchForm.get('batches')?.value[i].batchName == '' ||
      this.batchForm.get('batches')?.value[i].batchName == null ||
      this.batchForm.get('batches')?.value[i].batchName == undefined
    ) {
      this.batchErrorMsg += "Batch Name is required for batch " + (i + 1) + ".\n";
      errorcount++;
      return errorcount;
    }

    if (
      this.batchForm.get('batches')?.value[i].batch_classId == '' ||
      this.batchForm.get('batches')?.value[i].batch_classId == null ||
      this.batchForm.get('batches')?.value[i].batch_classId == undefined ||
      this.batchForm.get('batches')?.value[i].batch_classId <= 0
    ) {
      this.batchErrorMsg += "Class is required for batch " + (i + 1) + ".\n";
      errorcount++;
      return errorcount;
    }

    if (
      this.batchForm.get('batches')?.value[i].batch_subjectId == '' ||
      this.batchForm.get('batches')?.value[i].batch_subjectId == null ||
      this.batchForm.get('batches')?.value[i].batch_subjectId == undefined ||
      this.batchForm.get('batches')?.value[i].batch_subjectId <= 0
    ) {
      this.batchErrorMsg += "Subject Name is required for batch " + (i + 1) + ".\n";
      errorcount++;
      return errorcount;
    }

    if (
      this.batchForm.get('batches')?.value[i].batch_boardId == '' ||
      this.batchForm.get('batches')?.value[i].batch_boardId == null ||
      this.batchForm.get('batches')?.value[i].batch_boardId == undefined ||
      this.batchForm.get('batches')?.value[i].batch_boardId <= 0
    ) {
      this.batchErrorMsg += "Batch board is required for batch " + (i + 1) + ".\n";
      errorcount++;
      return errorcount;
    }

    if (
      this.batchForm.get('batches')?.value[i].startDate == '' ||
      this.batchForm.get('batches')?.value[i].startDate == null ||
      this.batchForm.get('batches')?.value[i].startDate == undefined ||
      this.batchForm.get('batches')?.value[i].startDate <= 0
    ) {
      this.batchErrorMsg += "start Date is required for batch " + (i + 1) + ".\n";
      errorcount++;
      return errorcount;
    }

    if (
      this.batchForm.get('batches')?.value[i].endDate == '' ||
      this.batchForm.get('batches')?.value[i].endDate == null ||
      this.batchForm.get('batches')?.value[i].endDate == undefined ||
      this.batchForm.get('batches')?.value[i].endDate <= 0
    ) {
      this.batchErrorMsg += "end Date is required for batch " + (i + 1) + ".\n";
      errorcount++;
      return errorcount;
    }

    if (
      this.batchForm.get('batches')?.value[i].startTime == '' ||
      this.batchForm.get('batches')?.value[i].startTime == null ||
      this.batchForm.get('batches')?.value[i].startTime == undefined ||
      this.batchForm.get('batches')?.value[i].startTime <= 0
    ) {
      this.batchErrorMsg += "start Time is required for batch " + (i + 1) + ".\n";
      errorcount++;
      return errorcount;
    }

    if (
      this.batchForm.get('batches')?.value[i].endTime == '' ||
      this.batchForm.get('batches')?.value[i].endTime == null ||
      this.batchForm.get('batches')?.value[i].endTime == undefined ||
      this.batchForm.get('batches')?.value[i].endTime <= 0
    ) {
      this.batchErrorMsg += "end Time is required for batch " + (i + 1) + ".\n";
      errorcount++;
      return errorcount;
    }
  }
      return errorcount;

}

// ...existing code... 
populateBatchData(batches: any[]) {
  const batchArray = this.batchForm.get('batches') as FormArray;
  if (!batchArray) return;

  batchArray.clear();

  if (!batches || batches.length === 0) {
    // keep one empty batch if you want — currently do nothing
    return;
  }

  batches.forEach((b: any) => 
    {
       
    let data: any = {};

// Assign each property individually
data.batchId = b. batchId?? b.batchId ?? b.batch_id ?? 0;
data.batchName = b.BatchName ?? b.batchName ?? '';
data.batch_classId = b.batch_classId ?? b.batch_classId ?? '';
data.batch_subjectId = b.batch_subjectId ?? b.batch_subjectId ?? '';
data.batch_boardId = b.batch_boardId ?? b.batch_boardId ?? '';

data.startDate = b.startDate  ? ('' + b.startDate).split('T')[0]  : null;

data.endDate = b.endDate  ? ('' + b.endDate).split('T')[0]  : null;

data.startTime = b.startTime
  ? this.toTimeInput(b.startTime)  : null;

data.endTime = b.endTime  ? this.toTimeInput(b.endTime)  : null;
 
    const group = this.fb.group({
      batchId: [data.batchId],
      batchName: [data.batchName, Validators.required],
      batch_classId: [data.batch_classId, Validators.required],
      batch_subjectId: [data.batch_subjectId, Validators.required],
      batch_boardId: [data.batch_boardId, Validators.required],
      startDate: [data.startDate, Validators.required],
      endDate: [data.endDate, Validators.required],
      startTime: [data.startTime, Validators.required],
      endTime: [data.endTime, Validators.required]
    });

    batchArray.push(group);
  });
} 


  get installments(): FormArray 
  {
    return this.paymentForm.get('installments') as FormArray;
  }

    addInstallment()
     {
    const index = this.installments.length + 1;

    const instGroup = this.fb.group({
      installmentid: [0],
      installmentNumber: [index, Validators.required],
      amount: ['', Validators.required],
      dueDaysFromStart: ['', Validators.required],
      remarks: ['']
    });

    this.installments.push(instGroup);
  }
  removeInstallment(i: number) {
    this.installments.removeAt(i);
    this.reorderInstallmentNumbers();
  }

  reorderInstallmentNumbers() {
    this.installments.controls.forEach((ctrl, i) => {
      ctrl.get('installmentNumber')?.setValue(i + 1);
    });
  }

submitFixedPayment()
 {
    this.paymentErrorMsg = '';


    this.validateFixedandInstallments();
 

    const payload = {
      courseId:this.CourseId,
      paymentType: this.paymentForm.value.paymentType,
      fixed_paymentMode: this.paymentForm.value.fixed_paymentMode,
      totalPrice: this.paymentForm.value.totalPrice.toString(),
      installments: this.paymentForm.value.installments,
      NoOfInstallments: this.paymentForm.value.installments.length
    };

debugger
    this.coursepackages.SubmitPaymentTypeOfCourse(payload).subscribe({
  next: (response: any) => 
    {
       
    if (response && response.statuscode == '200') 
      {  
        this.isLoading = false;

        alert(response.message); 
     }
  },
  error: (err: any) =>
     {

      this.isLoading= false;
     alert("Error submitting course details:" + err.error. ErrorMessage);

  }
});




    console.log("Fixed Payment Data:", payload);
  }

 submitSubscriptionPayment()
     {
    this.paymentErrorMsg = '';

    if(this.validatesubscriptionfields() >0)
    {
      return;
    }

    const payload = 
    {
      paymentType: this.paymentForm.value.paymentType,
      monthlyAmount: this.paymentForm.value.monthlyAmount,
      quarterlyAmount: this.paymentForm.value.quarterlyAmount,
      halfYearlyAmount: this.paymentForm.value.halfYearlyAmount,
      yearlyAmount: this.paymentForm.value.yearlyAmount
    };

    console.log("Subscription Payment Data:", payload);
  }



validateFixedandInstallments()
  {
    
    let  errorcount=0;
this.paymentErrorMsg  = '';
 
 
if(this.paymentForm.get('paymentType')?.value=='' ||  this.paymentForm.get('paymentType')?.value==null || this.paymentForm.get('paymentType')?.value==undefined  )
{
  this.paymentErrorMsg +="payment Type is required.\n";
   errorcount++;
  return errorcount;
}

 if(this.paymentForm.get('paymentType')?.value=='fixed' )
{
if(this.paymentForm.get('totalPrice')?.value =='' ||  this.paymentForm.get('totalPrice')?.value ==null ||  this.paymentForm.get('totalPrice')?.value ==undefined ||  this.paymentForm.get('totalPrice')?.value <=0)
  {
  this.paymentErrorMsg +="Total Price is required and cant be 0 .\n";
  errorcount++;
  return errorcount;
  }   
}

 
if(this.paymentForm.get('fixed_paymentMode')?.value == 'installments' || this.paymentForm.get('fixed_paymentMode')?.value == 'both')
{

   const installments = this.paymentForm.get('installments')?.value;

    if (!installments || installments.length === 0) 
      {
      this.paymentErrorMsg += "At least 1 installment is required.\n";
       errorcount++;
       return errorcount;

    }

  installments.forEach((inst: any, i: number) => {
      
      // Validate Amount
      if (        inst.amount === '' ||inst.amount === null || inst.amount === undefined ||     inst.amount <= 0      ) {
        this.paymentErrorMsg += `Installment ${i + 1}: Amount is required and must be greater than 0.\n`;
        errorcount++;
      }

      // Validate Due Days
      if (inst.dueDaysFromStart === '' || inst.dueDaysFromStart === null ||      inst.dueDaysFromStart === undefined  ) {
        this.paymentErrorMsg += `Installment ${i + 1}: Due Days From Start is required.\n`;
                errorcount++;
      }
    });

  }

     return errorcount;

}
 

validatesubscriptionfields() {

  let errorcount = 0;
  this.paymentErrorMsg = '';

  if (
    this.paymentForm.get('paymentType')?.value == '' ||
    this.paymentForm.get('paymentType')?.value == null ||
    this.paymentForm.get('paymentType')?.value == undefined
  ) {
    this.paymentErrorMsg += "payment Type is required.\n";
    errorcount++;
    return errorcount;
  }

  // "subscription"
  if (this.paymentForm.get('paymentType')?.value == 'subscription') {

    if (
      this.paymentForm.get('monthlyAmount')?.value == '' ||
      this.paymentForm.get('monthlyAmount')?.value == null ||
      this.paymentForm.get('monthlyAmount')?.value == undefined ||
      this.paymentForm.get('monthlyAmount')?.value <= 0
    ) {

      if (
        this.paymentForm.get('quarterlyAmount')?.value == '' ||
        this.paymentForm.get('quarterlyAmount')?.value == null ||
        this.paymentForm.get('quarterlyAmount')?.value == undefined ||
        this.paymentForm.get('quarterlyAmount')?.value <= 0
      ) {

        if (
          this.paymentForm.get('halfYearlyAmount')?.value == '' ||
          this.paymentForm.get('halfYearlyAmount')?.value == null ||
          this.paymentForm.get('halfYearlyAmount')?.value == undefined ||
          this.paymentForm.get('halfYearlyAmount')?.value <= 0
        ) {

          if (
            this.paymentForm.get('yearlyAmount')?.value == '' ||
            this.paymentForm.get('yearlyAmount')?.value == null ||
            this.paymentForm.get('yearlyAmount')?.value == undefined ||
            this.paymentForm.get('yearlyAmount')?.value <= 0
          ) {

            this.paymentErrorMsg +=
              "Atleast one subscription amount is required and cant be 0 .\n";
            errorcount++;
            return errorcount;
          }
        }
      }
    }
  }

  return errorcount;
}





 






}
