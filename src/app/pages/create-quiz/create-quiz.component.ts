import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LiveClassesService } from '../../live-classes.service';
import { text } from 'stream/consumers';

@Component({
  selector: 'app-create-quiz',
  standalone: false,
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent {
  quizForm: FormGroup;

constructor(private fb: FormBuilder,private Liveclasses:LiveClassesService)
{
  this.quizForm = this.fb.group({
      title: ['', Validators.required],
      batchId: [[]]   ,
      CourseId:['',Validators.required],
      startDateTime:['',Validators.required],
      endDateTime:['',Validators.required],
      duration:['',Validators.required],
      questions: this.fb.array([])   
     });

  this.getAllCourses();
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

 
console.log(this.validateQuiz());

     
  }
 

   validateQuiz(): string | null 
   {
     
if(this.quizForm.get('CourseId')?.value == '' || this.quizForm.get('CourseId')?.value == null ||this.quizForm.get('CourseId')?.value == undefined)
{
          return `Please select the course`;

}

if(this.quizForm.get('batchId')?.value == '' || this.quizForm.get('batchId')?.value == null ||this.quizForm.get('batchId')?.value == undefined)
{
          return `Please select the batch`;

}

    const questions = this.questions.controls;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i].value;

      // 1. Check question text
      if (!q.question_text || q.question_text.trim() === '') {
        return `Question ${i + 1} is missing text.`;
      }

      // 2. Check options
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].text || q.options[j].text.trim() === '') {
          return `Option ${j + 1} of Question ${i + 1} is missing.`;
        }
      }

      // 3. Check at least one correct answer
      const hasCorrect = q.options.some((opt: any) => opt.isCorrect);
      if (!hasCorrect) {
        return `Question ${i + 1} does not have a correct answer selected.`;
      }
    }

    return null; // ✅ No errors
  }
 
 AvailableCourses:any = [];
 
  
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
    this.Batches = [
    { BatchId: 1, BatchName: 'Batch A - Morning' },
    { BatchId: 2, BatchName: 'Batch B - Evening' },
    { BatchId: 3, BatchName: 'Batch C - Weekend' },
    { BatchId: 4, BatchName: 'Batch D - Fast Track' }
  ];

  
      },
      error:(error:any) =>{

      }});

  } catch(error:any)
  {
    console.error('API error:', error);
  }
}

  duration: number | null = null; // in minutes

 calculateDuration(): void {
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





}
