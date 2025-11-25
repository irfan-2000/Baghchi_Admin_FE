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

  let params = new HttpParams().set('id',id.toString()).set('FromAdmin','1');


  return this.http.get<any>(`${this.baseurl}api/GetCoursebyId?_=${unique}`,
     {
      params:params,
    headers,withCredentials: false
  });
}




UploadandParseWordFile(file: any)
 {

  const formData = new FormData();
  formData.append("file", file);    

  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.post<any>(
    `${this.baseurl}api/UploadCourseContent`,
    formData,
    { headers, withCredentials: false }
  );
}


submitCourseInfoDetails(formData:any)
{
 const token = localStorage.getItem('token'); // Or wherever you store your token
 
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.post<any>(`${this.baseurl}api/submitCourseInfoDetails?_=${unique}`, formData,
    {
    headers,withCredentials: false
  });

}


SaveBatchDetails(formData:any)
{
 const token = localStorage.getItem('token'); // Or wherever you store your token
 
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.post<any>(`${this.baseurl}api/SaveBatchDetails?_=${unique}`, formData,
    {
    headers,withCredentials: false
  });

}


SubmitPaymentTypeOfCourse(Payload:any)
{
  debugger
 const token = localStorage.getItem('token'); // Or wherever you store your token
 
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.post<any>(`${this.baseurl}api/SubmitPaymentTypeOfCourse?_=${unique}`, Payload,
    {
    headers,withCredentials: false
  });

}



}
