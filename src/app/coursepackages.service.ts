import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
 import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoursepackagesService {

  private baseurl = environment.baseUrl;
  constructor(private http:HttpClient) { }

submitCourseDetails(formData:any)
{
 const token = localStorage.getItem('token'); // Or wherever you store your token
 
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.post<any>(`${this.baseurl}api/AddUpdateCoursePackagewithDetails?_=${unique}`, formData,
    {
    headers,withCredentials: false
  });
}


getCourseById(id:any)
{
const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  

  let params = new HttpParams().set('id',id.toString());


  return this.http.get<any>(`${this.baseurl}api/GetCoursebyId?_=${unique}`,
     {
      params:params,
    headers,withCredentials: false
  });
}



}
