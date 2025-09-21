import { HttpClient } from '@angular/common/http';
import { Component, NgZone,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { error } from 'console';
import { response } from 'express';
import { LiveClassesService } from '../../../live-classes.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-classroom',
  standalone: false,
  templateUrl: './classroom.component.html',
  styleUrl: './classroom.component.css'
})
export class ClassroomComponent implements OnInit {
 courseId: any | null = 1;
  courseName: string = "Sample Course"; // Replace with API data if needed
  sessions: any = [];
  client: any;


MeetingId:any = [];
Issuccess:any;
meetingDetails:any


islive:any =false;
 async ngOnInit() {
    if (typeof window !== 'undefined') 
      {
      const { default: ZoomMtgEmbedded } = await import('@zoom/meetingsdk/embedded');
      this.client = ZoomMtgEmbedded.createClient();
    }

  // this.joinMeeting()

   this.route.queryParams.subscribe(params =>{

    this.MeetingId = params['meetingid'];
    this.courseId =params['courseId'];
    this.Issuccess = params["zoom"];
   });

   if (this.Issuccess == 'success' && this.MeetingId)
   {
     const response = await firstValueFrom(this.Liveclasses.GetMeetingDetails(this.MeetingId))
     this.meetingDetails = response;
     if(response)
     {
      debugger
      if(this.meetingDetails)
      {
      this.joinMeeting()
      }
      
     }
    //get the meeting details 
  //join the class
   }


  }
  constructor(private route: ActivatedRoute, private http: HttpClient,private ngZone: NgZone,private Liveclasses:LiveClassesService ) {}

    startClass(): void {
    
  const clientId = "8hXTyshVThO62dBZohgnuA"; // Zoom Client ID
  const redirectUri = encodeURIComponent("https://af433f1f8a9c.ngrok-free.app/api/zoom/callback"); 
  const responseType = "code";

  // 2️⃣ Hardcoded test data
  const courseId = 1;
  const batchId = 1;
  const topic = "Biology Instant Class"; // You can change for testing
  const type = 1; // 1 = Instant, 2 = Scheduled
  const duration = 60; // minutes
  const timezone = "Asia/Kolkata";
  const agenda = "Instant test session";
  const host_video = true;
  const participant_video = true;
  const join_before_host = true;
  const mute_upon_entry = false;
  const approval_type = 2;

  // 3️⃣ Build payload (optional, can send to backend after OAuth if needed)
  const payload = {
    topic,
    type,
    duration,
    timezone,
    agenda,
    host_video,
    participant_video,
    join_before_host,
    mute_upon_entry,
    approval_type,
    batchId,
    courseId
  };

  console.log("Zoom Meeting Payload (for backend):", payload);

  // 4️⃣ Encode state to pass courseId/batchId to backend after OAuth
  const state = JSON.stringify({ payload});

  // 5️⃣ Build Zoom OAuth URL
  const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${encodeURIComponent(state)}`;

  // 6️⃣ Redirect browser to Zoom OAuth
  window.location.href = zoomAuthUrl;
}



 async joinMeeting() {
  if (!this.client) return;
this.islive =true;
  // 🔑 Hardcoded signature + meeting info (testing only)
 //let signature = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBLZXkiOiI4aFhUeXNoVlRoTzYyZEJab2hnbnVBIiwibW4iOiI4OTA1MTAzMjc3OCIsInJvbGUiOjEsImlhdCI6MTc1ODEzOTI1NiwiZXhwIjoxNzU4MTQyODU2LCJ0b2tlbkV4cCI6MTc1ODE0Mjg1Nn0.wL9hP87EwU1MVBPMP9Rf3aAIVR2-xU1bhH0AbB48ntM"
let signature = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBLZXkiOiI4aFhUeXNoVlRoTzYyZEJab2hnbnVBIiwibW4iOiI4OTA1MTAzMjc3OCIsInJvbGUiOjEsImlhdCI6MTc1ODE0MDA1OSwiZXhwIjoxNzU4MTQzNjU5LCJ0b2tlbkV4cCI6MTc1ODE0MzY1OX0.NOJ-b1J6ly2dO2HAtgx7xYUqUTL5bevS0Ogwh8z7w3c"
 const meetingNumber = "89051032778";
  const password = "MsuUxMbFnPLX4KVKcJbbpFInVokPyc.1";
  const userName = "Teacher Name";
 const zak = "eyJ0eXAiOiJKV1QiLCJzdiI6IjAwMDAwMiIsInptX3NrbSI6InptX28ybSIsImFsZyI6IkhTMjU2In0.eyJhdWQiOiJjbGllbnRzbSIsInVpZCI6IllnbHpZSlhjVHJlT3djMGt6eV9rbmciLCJ6aWQiOiIwZjU4NTgyZWMwNWU0MDU4ODgyY2I5YzBiYmU1ZWU4OCIsImlzcyI6IndlYiIsInNrIjoiMCIsInN0eSI6MTAwLCJ3Y2QiOiJ1czAyIiwiY2x0IjowLCJleHAiOjE3NTgxNDU5ODQsImlhdCI6MTc1ODEzODc4NCwiYWlkIjoibU5rMzExTzNUM3Fvb3lpUlktUnBadyIsImNpZCI6IiJ9.rLxUxWqZ1PtXy6dt2bEyaBRQVOB0Qu8IMg7HyEFNdEQ"


 this.ngZone.runOutsideAngular(async () => 
  {
    const meetingSDKElement = document.getElementById("meetingSDKElement");
    if (!meetingSDKElement) {
      console.error("❌ meetingSDKElement not found in DOM");
      return;
    }

    try {
      // 1️⃣ Init SDK
      await this.client.init({
        zoomAppRoot: meetingSDKElement,
        language: "en-US",
        patchJsMedia: true, // recommended
      });
debugger
      // 2️⃣ Join meeting
      await this.client.join({ 
 signature: this.meetingDetails.Signature,  // role = 1
 
  meetingNumber: this.MeetingId,
            password: this.meetingDetails.MeetingPassword,

   userName: this.meetingDetails.TeacherName,
  zak: this.meetingDetails.ZakToken 
      });

      console.log("✅ Successfully joined meeting!");
    } catch (err) {
      console.error("❌ Zoom init/join failed", err);
    }
  });
}
 GetMeetingDetails(meetingid:any)
 {
  this.Liveclasses.GetMeetingDetails(meetingid).subscribe({
      next:(response:any)=>
      {
         
        this.meetingDetails = response;
      },
      error:(error:any) =>
      {
        console.log(error);
      }
  })
 }
   
 
  

   
}
