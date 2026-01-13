import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
private baseurl = environment.baseUrl;
  
 
 constructor(private http:HttpClient ,private router:Router)
   { }


getAllStudents()
{
   const token = localStorage.getItem('token'); // Or wherever you store your token
   const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  

   return this.http.get<any>(`${this.baseurl}api/Getallstudents?_=${unique}`,{
 
     headers,withCredentials:false
   });
}


getstudentbyid(id:any)
{
   const token = localStorage.getItem('token'); // Or wherever you store your token
   const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  let params = new HttpParams().set('studentid',id);
 
   return this.http.get<any>(`${this.baseurl}api/GetStudentsbyid?_=${unique}`,{
 params:params,
     headers,withCredentials:false
   });
}


SubmitStudentDetails(formData:any)
{
    const token = localStorage.getItem('token'); 

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
 
   return this.http.post<any>(`${this.baseurl}api/UpdateStudentdetails?_=${unique}`,formData,{
     headers,withCredentials:false
   });
}





  SubmitAdminFeedback(payload:any)
  {
 const token = localStorage.getItem('token'); 

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
let feedback= payload.feedback;
 
return this.http.post( `${this.baseurl}api/SubmitAdminFeedback?_=${unique}`, `"${feedback}"`, {
  headers: { 'Content-Type': 'application/json' }
});

  }

}
