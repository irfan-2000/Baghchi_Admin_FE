import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LiveClassesService } from '../../live-classes.service';
import { text } from 'stream/consumers';
import { firstValueFrom } from 'rxjs';
import { QuizService } from '../../quiz.service';

@Component({
  selector: 'app-create-quiz',
  standalone: false,
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent {
  quizForm: FormGroup;

constructor(private fb: FormBuilder,private Liveclasses:LiveClassesService,private quizservice:QuizService)
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
      questions: this.fb.array([])   
     });

  this.getAllCourses();
  this.populateSampleData();
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
const Pyaload = {
QuizId:0,
CourseId: this.quizForm.get('CourseId')?.value,
BatchId: this.quizForm.get('batchId')?.value,
Title: this.quizForm.get('title')?.value,
StartDate:   this.quizForm.get('startDate')?.value ,//,  new Date(this.quizForm.get('startDate')?.value),
EndDate: this.quizForm.get('endDate')?.value, //new Date(this.quizForm.get('endDate')?.value),
Duration: this.quizForm.get('duration')?.value,
Questions: this.quizForm.get('questions')?.value,
StartTime: this.quizForm.get('startTime')?.value,
EndTime: this.quizForm.get('endTime')?.value


}
 debugger
console.log(this.validateQuiz());

   console.log(this.quizForm.value); 
   
   this.quizservice.createQuiz(Pyaload).subscribe({
    next:(response:any) =>
      {
        console.log('Quiz created successfully:', response);
    },
    error:(error:any)=>
    {
      console.error('Error creating quiz:', error);
    }
    })
   


  }
 

   validateQuiz(): string | null 
   {
     
if(this.quizForm.get('CourseId')?.value == '' ||
 this.quizForm.get('CourseId')?.value == null ||this.quizForm.get('CourseId')?.value == undefined)
{
    return `Please select the course`;

}

if(this.quizForm.get('batchId')?.value == '' ||
 this.quizForm.get('batchId')?.value == null ||this.quizForm.get('batchId')?.value == undefined)
{
  return `Please select the batch`;

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


  // ✅ Populate Sample Data
  async populateSampleData(quizdata: any = '')
   {

    //const response = await firstValueFrom(this.Liveclasses.getBatchesByCourseid(quizdata.CourseId));
     //this.Batches = response.Result;


    const response = await firstValueFrom(this.Liveclasses.getBatchesByCourseid(11));
    this.Batches = response.Result;
     
    // Ensure form and array are clean before adding
    this.questions.clear();
   
    const batcharray = ['13']

   const startDate = '2025-09-10T09:00:00'; // Example start date-time

    this.quizForm.patchValue({
      CourseId: 12,
      batchId:  batcharray,  
      duration: '00:45:00',
      startDate:   '2025-09-10',
      startTime: '09:00',
      endDate: '2025-10-10',
      endTime: '09:45',
      title: 'Physics Basics Quiz'
    });
    
    console.log("this si quiz",this.quizForm.value)

     const sampleQuestions = [
      {
        question_text: 'What is the SI unit of force?',
        options: [
          { text: 'Newton', isCorrect: true },
          { text: 'Joule', isCorrect: false },
          { text: 'Pascal', isCorrect: false },
          { text: 'Watt', isCorrect: false }
        ]
      },
      {
        question_text: 'Which law states that F = ma?',
        options: [
          { text: 'Newton’s First Law', isCorrect: false },
          { text: 'Newton’s Second Law', isCorrect: true },
          { text: 'Newton’s Third Law', isCorrect: false },
          { text: 'Law of Gravitation', isCorrect: false }
        ]
      }
    ];

    sampleQuestions.forEach(q => 
      {
      const qGroup = this.fb.group({
        question_text: [q.question_text, Validators.required],
        options: this.fb.array(q.options.map(o => this.fb.group({
          text: [o.text],
          isCorrect: [o.isCorrect]
        })))
      });
      this.questions.push(qGroup);
    });
  }



  toTimeInput(time24: string): string
 {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}




}
