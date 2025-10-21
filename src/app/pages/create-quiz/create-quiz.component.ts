import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LiveClassesService } from '../../live-classes.service';
import { text } from 'stream/consumers';
import { firstValueFrom } from 'rxjs';
import { QuizService } from '../../quiz.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-quiz',
  standalone: false,
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent {
  quizForm: FormGroup;
  QuizId:any;
  IsEditMode: boolean = false;

constructor(private fb: FormBuilder,private Liveclasses:LiveClassesService,private quizservice:QuizService,private route: ActivatedRoute)
{
   
  this.quizForm = this.fb.group({
      title: ['', Validators.required],
      batchId: [[]]   ,
      CourseId:['',Validators.required],
      startDate:['',Validators.required],
      startTime:['',Validators.required],
      endDate:['',Validators.required],
      endTime:['',Validators.required],
       duration:['',Validators.required],
      questions: this.fb.array([])   ,
      status:[2,Validators.required],
      quizId: [0],
  totalQuestions: [0, [Validators.required, Validators.min(1)]],
  marksPerQuestion: [1, [Validators.required, Validators.min(0)]],
  allowNegative: [false],
  negativeMarking: [{ value: 0, disabled: true }], // auto-enabled if AllowNegative = true
 totalMarks: [{ value: 0, disabled: true }],
  subjects: ['', Validators.required],
  allowSkip: [true],
  shuffleQuestions: [false]
     });


      
this.route.queryParams.subscribe(params => {
      this.QuizId  = params['id'];      
      this.IsEditMode= this.IsEditMode = params["IsEditMode"]?.toLowerCase() === "true";         
    });
     if(this.IsEditMode && this.QuizId >0)
    {
this.getquizdatabyid('Id',this.QuizId);
    
}
  this.getAllCourses();
  
  

// Enable/disable NegativeMarking field dynamically
this.quizForm.get('allowNegative')?.valueChanges.subscribe((allow: boolean) => {
  const negCtrl = this.quizForm.get('negativeMarking');
  if (allow) {
    negCtrl?.enable();
  } else {
    negCtrl?.disable();
    negCtrl?.setValue(0);
  }
});

// Auto-calculate total marks
this.quizForm.get('totalQuestions')?.valueChanges.subscribe(() => this.updateTotalMarks());
this.quizForm.get('marksPerQuestion')?.valueChanges.subscribe(() => this.updateTotalMarks());
 

}

updateTotalMarks(): void {
  const total = (this.quizForm.get('totalQuestions')?.value || 0) *
                (this.quizForm.get('marksPerQuestion')?.value || 0);
  this.quizForm.get('totalMarks')?.setValue(total);
}


 get questions(): FormArray
  {
     
    return this.quizForm.get('questions') as FormArray;
  }

 getOptions(questionIndex: number): FormArray 
 {
     return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addQuestion()
   {
  
    const questionForm = this.fb.group({
      question_text: ['', Validators.required],
      options: this.fb.array([])
    });
    this.questions.push(questionForm);
  }
 
  removeQuestion(index: number)
   {
    this.questions.removeAt(index);
  }

  addOption(questionIndex: number)
   {
    const optionsArray = this.getOptions(questionIndex);
    const optionForm = this.fb.group({
      text: ['', Validators.required],
      isCorrect: [false]
    });
    optionsArray.push(optionForm);
  }


 removeOption(questionIndex: number, optionIndex: number)
  {
    this.getOptions(questionIndex).removeAt(optionIndex);
  }

  Errormsg:any = '';
 submitQuiz() 
 {

  let errormsg = this.validateQuiz();
  if(errormsg != null)
  {

    this.Errormsg = errormsg;
    return;
  }
console.log(this.quizForm.value);
 

const Pyaload = {
QuizId: this.quizForm.get('quizId')?.value,
CourseId: this.quizForm.get('CourseId')?.value,
BatchId: this.quizForm.get('batchId')?.value,
Title: this.quizForm.get('title')?.value,
StartDate:   this.quizForm.get('startDate')?.value ,//,  new Date(this.quizForm.get('startDate')?.value),
EndDate: this.quizForm.get('endDate')?.value, //new Date(this.quizForm.get('endDate')?.value),
Duration: this.quizForm.get('duration')?.value,
Questions: this.quizForm.get('questions')?.value,
StartTime: this.quizForm.get('startTime')?.value,
EndTime: this.quizForm.get('endTime')?.value,
Status:this.quizForm.get('status')?.value,
  TotalQuestions: this.quizForm.get('totalQuestions')?.value,
  MarksPerQuestion: this.quizForm.get('marksPerQuestion')?.value,
  AllowNegative: this.quizForm.get('allowNegative')?.value,
  ShuffleQuestions: this.quizForm.get('shuffleQuestions')?.value,
  TotalMarks: this.quizForm.get('totalMarks')?.value,
  Subjects: this.quizForm.get('subjects')?.value,
  AllowSkip: this.quizForm.get('allowSkip')?.value,
  Negativemarks:this.quizForm.get('negativeMarking')?.value 

} 

debugger
   this.quizservice.createQuiz(Pyaload).subscribe({
    next:(response:any) =>
      {
        if(response.statuscode == 200)
        {
          alert(response.message);
        }
        window.location.reload(); 

    },
    error:(error:any)=>
    {
      console.error('Error creating quiz:', error);
    }
    }) 
  }
 

   validateQuiz(): string | null 
   {
     debugger
if(this.quizForm.get('CourseId')?.value == '' ||
 this.quizForm.get('CourseId')?.value == null || 
 this.quizForm.get('CourseId')?.value == undefined)
{
    return `Please select the course`;

}

if(this.quizForm.get('batchId')?.value == '' ||
 this.quizForm.get('batchId')?.value == null ||this.quizForm.get('batchId')?.value == undefined ||
 this.quizForm.get('batchId')?.value.length == 0)
{
  return `Please select the batch`;

}
 
if(this.quizForm.get('title')?.value == '' || this.quizForm.get('title')?.value == '' ||this.quizForm.get('title')?.value == '')
{
  return `Please enter the quiz title`;
}

if(this.quizForm.get('startDate')?.value == '' || 
this.quizForm.get('startDate')?.value == null || this.quizForm.get('startDate')?.value == undefined)
{
  return `Please select the quiz start date`;
}

if(this.quizForm.get('endDate')?.value == '' || 
this.quizForm.get('endDate')?.value == null || this.quizForm.get('endDate')?.value == undefined)
{
  return `Please select the quiz  endDate   `;
}
 
 
if(this.quizForm.get('duration')?.value == '' || 
this.quizForm.get('duration')?.value == null || this.quizForm.get('duration')?.value == undefined || this.quizForm.get('duration')?.value == '00:00:00')
{
  return `Please enter the quiz duration`;
}

if(this.quizForm.get('startTime')?.value == '' || 
this.quizForm.get('startTime')?.value == null || this.quizForm.get('startTime')?.value == undefined)
{
  return `Please select the quiz  start Time   `;
}

if(this.quizForm.get('endTime')?.value == '' || 
this.quizForm.get('endTime')?.value == null || this.quizForm.get('endTime')?.value == undefined)
{
  return `Please select the quiz  end Time   `;
}

const start = new Date(this.quizForm.get('startDate')?.value);
const end = new Date(this.quizForm.get('endDate')?.value);

if (end < start) {
  return 'Quiz end date must be after start date';
}

if(this.quizForm.get('status')?.value == '' || this.quizForm.get('endTime')?.value == null || this.quizForm.get('endTime')?.value == undefined || this.quizForm.get('endTime')?.value == 0)
{
  return `Please select the quiz status`;
}


if(this.quizForm.get('totalQuestions')?.value == '' || this.quizForm.get('totalQuestions')?.value == null || this.quizForm.get('totalQuestions')?.value == undefined || this.quizForm.get('totalQuestions')?.value == 0)
{
  return `Please enter total number of questions`;
}

if(this.quizForm.get('marksPerQuestion')?.value == '' || this.quizForm.get('marksPerQuestion')?.value == null || this.quizForm.get('marksPerQuestion')?.value == undefined || this.quizForm.get('marksPerQuestion')?.value == 0)
{
  return `Please enter marks per question`;
}

const allownegative = this.quizForm.get('allowNegative')?.value;

if (allownegative === '' || allownegative === null || allownegative === undefined || (allownegative !== true && allownegative !== false)) {
  return `AllowNegative can't be undefined`;
}

if(allownegative)
{

  if(this.quizForm.get('negativeMarking')?.value == 0 )
  {
    return `Negative marks are required else uncheck the allow negative marking`;
  }
}


debugger
const val = this.quizForm.get('shuffleQuestions')?.value;

if (val === '' || val === null || val === undefined || (val !== true && val !== false)) {
  return `shuffleQuestions can't be undefined`;
}

if(this.quizForm.get('totalMarks')?.value == '' || this.quizForm.get('totalMarks')?.value == null || this.quizForm.get('totalMarks')?.value == undefined || this.quizForm.get('totalMarks')?.value == 0)
{
   return `TotalMarks can't be undefined or 0`;
}


if(this.quizForm.get('subjects')?.value == '' || this.quizForm.get('subjects')?.value == null || this.quizForm.get('subjects')?.value == undefined )
{
   return `subjects is required `;
}

if(this.quizForm.get('allowSkip')?.value == '' || this.quizForm.get('allowSkip')?.value == null || this.quizForm.get('allowSkip')?.value == undefined )
{ if(this.quizForm.get('shuffleQuestions')?.value != true  || this.quizForm.get('shuffleQuestions')?.value != false )
  {
 return `allowSkip can't be undefined `;  
}  
}



   const questions = this.questions.controls;

    for (let i = 0; i < questions.length; i++) 
     {
      const q = questions[i].value;

       if (!q.question_text || q.question_text.trim() === '') 
        {
        return `Question ${i + 1} is missing text.`;
      }

       for (let j = 0; j < q.options.length; j++)
         {
        if (!q.options[j].text || q.options[j].text.trim() === '') {
          return `Option ${j + 1} of Question ${i + 1} is missing.`;
        }
      }

       const hasCorrect = q.options.some((opt: any) => opt.isCorrect);
      if (!hasCorrect) 
        {
        return `Question ${i + 1} does not have a correct answer selected.`;
      }
    }

    return null;  
  }
 
 AvailableCourses:any = [];
 
  
getAllCourses()
{
    try 
     {
        this. Liveclasses.getAllCourses().subscribe({
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
          console.log(this.AvailableCourses);
 
          },
          error: (error: any) => {             
          },
        });
      } catch (error: any) {
        console.error('API error:', error);
      } 
}


oncoursechange(event:any)
{
 
this.getBatchesByCourseid(event.target.value);
}
Batches:any = [];
getBatchesByCourseid(CourseId:any)
{
  try{

    this.Liveclasses.getBatchesByCourseid(CourseId).subscribe({
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

  duration: number | null = null; // in minutes

 calculateDuration(): void 
 {
    if (this.quizForm.get('startDateTime')?.value && this.quizForm.get('endDateTime')?.value) {
      const start = new Date(this.quizForm.get('startDateTime')?.value).getTime();
      const end = new Date(this.quizForm.get('endDateTime')?.value).getTime();

      if (end > start) 
        {
        const diffMs = end - start; // difference in milliseconds
        this.duration = Math.floor(diffMs / (1000 * 60)); // convert to minutes
      } else {
        this.duration = null;
    //    alert("  End time must be after start time!");
      }
    }
  }
 
  toggleCheckAll(event: any)
   {
    if(event.currentTarget.checked)
      {
      this.selectAllbatches();
    } else {
      this.unselectAllbatches();
    }
  }

    selectAllbatches() {
    const batchidcontrol = this.quizForm.get('batchId');
    if (batchidcontrol) {
      batchidcontrol.patchValue(this.Batches.map((s:any) => s.BatchId));
    }
  }

  unselectAllbatches() 
  {
  const batchidcontrol = this.quizForm.get('batchId');
    if (batchidcontrol)
    {
 batchidcontrol.patchValue([]);
    }
    
  }
 
  async populateSampleData(quizData: any) {
  // Populate batches
  const response = await firstValueFrom(this.Liveclasses.getBatchesByCourseid(quizData.CourseId));
  this.Batches = response.Result;

  // Clear existing questions
  this.questions.clear();

  // Ensure batch array is consistent with API (BatchId is a list of strings)
  const batchArray = quizData.BatchId || [];
 
  // Patch main quiz form
  this.quizForm.patchValue({
    quizId: quizData.QuizId || 0,
    CourseId: quizData.CourseId,
    batchId: batchArray,
    duration: quizData.Duration,
    startDate: quizData.StartDate ? quizData.StartDate.split('T')[0] : '',
    startTime: quizData.StartTime ? quizData.StartTime : '',
    endDate: quizData.EndDate ? quizData.EndDate.split('T')[0] : '',
    endTime: quizData.EndTime ? quizData.EndTime : '',
    title: quizData.Title,
    status: quizData.Status
  });

  // Populate questions
  (quizData.Questions || []).forEach((q:any) => {
    const qGroup = this.fb.group({
      question_text: [q.Question_text || q.question_text || '', Validators.required],
      options: this.fb.array((q.Options || q.options || []).map((o:any) =>
        this.fb.group({
          text: [o.Text || o.text || '', Validators.required],
          isCorrect: [o.IsCorrect ?? o.isCorrect ?? false]
        }))
      )
    });

    this.questions.push(qGroup);
  });

  console.log('Quiz form after patch:', this.quizForm.value);
}

 
toTimeInput(time24: string): string
 {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}



getquizdatabyid(flag:any,id :any)
{
   
  this.quizservice.getQuizById('Id',id).subscribe({
    next:(response:any)=>
    {
      console.log(response);
 
      this.populateSampleData(response);
    },
    error:(error:any)=>
    {
      console.error('Error fetching quiz:', error);
    }});
}





}
