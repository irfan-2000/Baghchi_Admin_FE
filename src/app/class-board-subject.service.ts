import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassBoardSubjectService {

  private baseurl = environment.baseUrl;
  constructor(private http:HttpClient) { }


  GetAvailableCourses()
  {
   const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.get<any>(`${this.baseurl}api/GetAvailableClasses?_=${unique}`, {
    headers,withCredentials: false
  });
    }


 SubmitClassDetails(payload:any)
  {
   const token = localStorage.getItem('token'); // Or wherever you store your token
debugger
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.post<any>(`${this.baseurl}api/AddUpdateClass?_=${unique}`, payload,
    {
    headers,withCredentials: false
  });

    }


 DeleteClassDetails(id:any)
  {
let params = new HttpParams().set('Classid',id.toString());
 
   const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.post<any>(`${this.baseurl}api/DeleteClass?_=${unique}`,null,
    {
      params:params,
    headers,withCredentials: false
  });
  }




  GetAvailableBaords()
  {
   const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.get<any>(`${this.baseurl}api/GetAvailableBoards?_=${unique}`, {
    headers,withCredentials: false
  });
    }


    SubmitBoardDetails(payload:any)
    {
   const token = localStorage.getItem('token'); // Or wherever you store your token
debugger
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.post<any>(`${this.baseurl}api/AddUpdateBoards?_=${unique}`, payload,
    {
    headers,withCredentials: false
  });

    }

 DeleteboardDetails(id:any)
  {
    debugger
let params = new HttpParams().set('Boardid',id.toString());
 
   const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.post<any>(`${this.baseurl}api/DeleteBoard?_=${unique}`,null,
    {
      params:params,
    headers,withCredentials: false
  });
  }





    GetAvailableSubjects()
    {
       const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.get<any>(`${this.baseurl}api/GetAvailableSubjects?_=${unique}`, {
    headers,withCredentials: false
  });
    }












}
