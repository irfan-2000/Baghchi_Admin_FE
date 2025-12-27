import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
 import { environment } from './environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LiveClassesService {

  private baseurl = environment.baseUrl;
  
 
 constructor(private http:HttpClient ,private router:Router)
   { }


  getAllCourses()
  {
    const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.get<any>(`${this.baseurl}api/GetAllCourses?_=${unique}`, {
    headers,withCredentials: false
  });
  
  }

  CreateMeeting(  payload: any) 
    {
 const token = localStorage.getItem('token'); // Or wherever you store your token
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
    return this.http.post<any>(`${this.baseurl}api/zoom/CreateLiveClass?_=${unique}`,payload,{
     headers,withCredentials:false
   });
 
  }
  


getOngoingClassDetails()
{
  const token = localStorage.getItem('token'); // Or wherever you store your token
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.baseurl}api/zoom/GetOnGoingClasses`, {
      headers, withCredentials: false
    });
}

getBatchesByCourseid(CourseId:any)
{
  const token = localStorage.getItem('token'); // Or wherever you store your token
  
let params = new HttpParams().append("CourseId", CourseId);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.baseurl}api/GetBatchesById`, {
          params:params,
      headers, withCredentials: false
    });
}



getSignalrUrl(meetingId:any)
{
   const token = localStorage.getItem('token'); // Or wherever you store your token

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });


    let params = new HttpParams().append("meetingNumber", meetingId).append("role", 1);
 
      const unique = Math.random();  
  return this.http.get<any>(`${this.baseurl}api/generateSignature?_=${unique}`,
    {
      params:params,
    headers,withCredentials:false
  }); 

}



getZAKToken(email: string) 
{
  const token = localStorage.getItem('token'); // Or wherever you store your token

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
        const unique = Math.random();  
    let params = new HttpParams().append("email", email);

  return this.http.get<any>(`${this.baseurl}api/getZak?_=${unique}`,
    {
      params:params,
      headers
    }
  );
}


GetMeetingDetails(meeting:any)
{
  const token = localStorage.getItem('token'); // Or wherever you store your token

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
        const unique = Math.random();  
      let params = new HttpParams().append("MeetingId", meeting);

  return this.http.get<any>(`${this.baseurl}api/zoom/GetMeetingDetails?_=${unique}`,
    {
      params:params,
      headers
    }
  );
}



GetClassHistory()
{
  const token = localStorage.getItem('token'); // Or wherever you store your token
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.baseurl}api/zoom/GetClassHistory`, {
      headers, withCredentials: false
    });
}
EndOngoingclass(Livesessionid: any) {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  // Send Livesessionid as query parameter
  const params = new HttpParams().set('Livesessionid', Livesessionid);

  // Pass headers & params as options, NOT in the body
  return this.http.post<any>(
    `${this.baseurl}api/zoom/EndOngoingclass`,
    {},           // empty body
    { headers, params }  // options
  );
}


}
