import { Component, NgZone, OnInit, ViewChild, ElementRef ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LiveClassesService } from '../../../live-classes.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.css'],
   schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class ClassroomComponent implements OnInit {
  @ViewChild('excalidrawContainer', { static: false }) el!: ElementRef;

  courseId: any | null = 1;
  courseName: string = "Sample Course"; // Can be replaced with API data
  sessions: any = [];
  client: any;

  MeetingId: any = null;
  Issuccess: any;
  meetingDetails: any;
  islive: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private Liveclasses: LiveClassesService
  ) {}


   
 
  async ngOnInit() 
  {
    // Load Zoom Client SDK dynamically
    if (typeof window !== 'undefined') {
      const { default: ZoomMtgEmbedded } = await import('@zoom/meetingsdk/embedded');
      this.client = ZoomMtgEmbedded.createClient();
    }

    // Read query params
    this.route.queryParams.subscribe(async params => {
      this.MeetingId = params['meetingid'];
      this.courseId = params['courseId'];
      this.Issuccess = params["zoom"];

      if (this.Issuccess === 'success' && this.MeetingId) {
        // Fetch meeting details from backend
        const response = await firstValueFrom(this.Liveclasses.GetMeetingDetails(this.MeetingId));
        this.meetingDetails = response;

        if (this.meetingDetails)
           {
         
            




          this.joinMeeting();
        }
      }
    });
  }

  // Trigger Zoom OAuth flow for creating a meeting
  startClass(): void {
    const clientId = "YOUR_ZOOM_CLIENT_ID"; // replace with your Zoom client ID
    const redirectUri = encodeURIComponent("YOUR_REDIRECT_URI"); 
    const responseType = "code";

    const payload = {
      topic: "Biology Instant Class",
      type: 1, // 1 = Instant
      duration: 60,
      timezone: "Asia/Kolkata",
      agenda: "Instant test session",
      host_video: true,
      participant_video: true,
      join_before_host: true,
      mute_upon_entry: false,
      approval_type: 2,
      batchId: 1,
      courseId: this.courseId
    };

    const state = JSON.stringify({ payload });

    const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${encodeURIComponent(state)}`;
    window.location.href = zoomAuthUrl;
  }

  // Join meeting using Zoom Client View
  async joinMeeting() 
  {
    if (!this.client) return;
    this.islive = true;

    const meetingSDKElement = document.getElementById("meetingSDKElement");
    if (!meetingSDKElement) {
      console.error("❌ meetingSDKElement not found in DOM");
      return;
    }

    this.ngZone.runOutsideAngular(async () => {
      try {
        // 1️⃣ Initialize SDK
        await this.client.init({
          zoomAppRoot: meetingSDKElement,
          language: "en-US",
          patchJsMedia: true
        });

        // 2️⃣ Join the meeting
        await this.client.join({
          signature: this.meetingDetails.Signature, // Host signature
          meetingNumber: this.MeetingId,
          password: this.meetingDetails.MeetingPassword,
          userName: this.meetingDetails.TeacherName,
          zak: this.meetingDetails.ZakToken // Host ZAK token
        });
 
        this.startWhiteboard();
        console.log("✅ Successfully joined meeting!");
      } catch (err) {
        console.error("❌ Zoom init/join failed", err);
      }
    });
  }
  
  startWhiteboard() {
  try {

    const whiteboardContainer = document.getElementById('whiteboardContainer');
if(whiteboardContainer)
{
 // Make container visible
    whiteboardContainer.style.display = 'block';

    // Start Zoom Web SDK whiteboard
    this.client.startWhiteboard({
      container: whiteboardContainer,
      width: whiteboardContainer.offsetWidth,
      height: whiteboardContainer.offsetHeight
    });

}
   
    console.log("✅ Whiteboard started for host");
  } catch (error) {
    console.error("❌ Whiteboard failed to start", error);
  }
}


 
 



  // Fetch meeting details from backend
  async GetMeetingDetails(meetingid: any) {
    this.Liveclasses.GetMeetingDetails(meetingid).subscribe({
      next: (response: any) => {
        this.meetingDetails = response;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
}
