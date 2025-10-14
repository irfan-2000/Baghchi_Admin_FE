import { Component } from '@angular/core';
import { LiveClassesService } from '../live-classes.service';
import { QuizService } from '../quiz.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quizhistory',
  standalone: false,
  templateUrl: './quizhistory.component.html',
  styleUrl: './quizhistory.component.css'
})
export class QuizhistoryComponent
{
quizzes:any;

constructor(private fb: FormBuilder,private Liveclasses:LiveClassesService,private quizservice:QuizService,private router:Router  )
{
  this.getallquizzes();
  
}

getallquizzes( )
{
  this.quizservice.getallquizzes( ).subscribe({
    next:(response:any)=>
    {
      this.quizzes =  response;
      console.log(response);
     },
    error:(error:any)=>
    {
      console.error('Error fetching quiz:', error);
    }});
}

gotoEditQuiz(id: number) {
  this.router.navigate(['/home/create-quiz'], { 
    queryParams: { IsEditMode: true, id: id } 
  });
}
 
ReleaseResult(id:any)
{

}


}
