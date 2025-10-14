import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
 

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
 
   return this.http.post<any>(`${this.baseurl}api/createQuiz?_=${unique}`,quizform,{
     headers,withCredentials:false
   });

}


getQuizById(flag:any,quizId:any)
{
 

  const token = localStorage.getItem('token'); // Or wherever you store your token
   const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
 let params = new HttpParams(). set('flag',flag).  set('quizId', quizId);

   return this.http.get<any>(`${this.baseurl}api/Getquizdata?_=${unique}`,{
    params:params,
     headers,withCredentials:false
   });

}

getallquizzes()
{
  const token = localStorage.getItem('token'); // Or wherever you store your token
   const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
 
   return this.http.get<any>(`${this.baseurl}api/Getallquizzes?_=${unique}`,{
      headers,withCredentials:false
   });

}



}
