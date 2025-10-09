import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

private baseurl = environment.baseUrl;
  
 
 constructor(private http:HttpClient ,private router:Router)
   { }


createQuiz(quizform:any)
{
  const token = localStorage.getItem('token'); // Or wherever you store your token
debugger

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
 
   return this.http.post<any>(`${this.baseurl}api/createQuiz?_=${unique}`,quizform,{
     headers,withCredentials:false
   });

}


}
