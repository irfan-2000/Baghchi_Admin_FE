import { Component, ElementRef, ViewChild, Inject, Optional } from '@angular/core';
import { Room,createLocalAudioTrack, LocalVideoTrack, Track, RemoteParticipant, RoomEvent, Participant, LocalAudioTrack } from 'livekit-client';
import { environment } from '../environments/environment.prod';
import { ActivatedRoute } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-admin-live-class-webrtc',
  standalone: false,
  templateUrl: './admin-live-class-webrtc.component.html',
  styleUrl: './admin-live-class-webrtc.component.css'
})
export class AdminLiveClassWebrtcComponent {

  private userurl = environment.userurl;
  private livekitUrl = environment.livekitUrl;
    room!: Room;

  screenTrack: LocalVideoTrack | null = null;
  isScreenSharing = false;
  isConnected = false;
  initialspeaker: any | null = null;

  data: any;
  @ViewChild('screenPreview')
  screenPreview!: ElementRef<HTMLVideoElement>;
  @ViewChild('adminAudio', { static: true })
  adminAudio!: ElementRef<HTMLAudioElement>;
  currentSpeaker: string | null = null;
  private audioElements = new Map<string, HTMLAudioElement>();
  adminIdentity: any // 🔑 SINGLE SOURCE OF TRUTH
  roomName: any


  CourseId:any=''
  Batchname:any = ''

  StudentInMeetList: any  = [];
 
constructor(
  private route: ActivatedRoute,private studentservice: StudentService,
  @Inject(PLATFORM_ID) private platformId: Object
) {
  
  if (isPlatformBrowser(this.platformId)) {
    this.route.queryParams.subscribe(params => {
      this.CourseId = params['courseId'];
      this.Batchname = params['Batchname'];
      this.roomName = params['chatroom_id'];
      this.adminIdentity = params['teacher'];
    });
  }
}
  /* -------------------------------
     STEP 2.1 – CONNECT AS TEACHER
  --------------------------------*/


async ngOnInit()
 {
  // Skip initialization on server-side (SSR/prerendering)
  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  try {
    // 1️⃣ Call YOUR backend to get LiveKit config
    const res = await fetch(
      `${this.userurl}api/guest/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          room: this.roomName,   // dynamic
          identity: this.adminIdentity, role: 'teacher'
        })
      }
    );
     

    const data = await res.json();
this.data = data;
     //const livekitUrl = data.url;     // e.g. wss://livekit.race-elearn.com
    const token = data.token;        // JWT
  
 
  } catch (err) {
    console.error('Failed to init teacher live class', err);
  }


}
async connectAsTeacher(url: string, token: string) {
  this.room = new Room({
    adaptiveStream: true,
    dynacast: true
  });

  await this.room.connect(url, token);

  this.isConnected = true;
   
  // this.room.remoteParticipants.forEach((participant) => {
  //   participant.trackPublications.forEach((publication) => {
  //     if (publication.track && publication.kind === 'audio') {
  //       console.log('🔊 Found existing student audio:', participant.identity);
  //       this.initialspeaker = participant.identity;
  //       // Manually trigger your subscription logic here if needed
  //     }
  //   }); 
  // });

  console.log('✅ Teacher connected to LiveKit');
}


  /* -------------------------------
     STEP 2.2 – TEACHER MICROPHONE
  --------------------------------*/
  async publishTeacherMic()
   {
    if (!this.room || !this.isConnected) {
    console.warn('⏳ LiveKit not connected yet');
    return;
  }
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    const audioTrack = stream.getAudioTracks()[0];
    await this.room.localParticipant.publishTrack(audioTrack);

    console.log('🎙️ Teacher mic published');
  }

  /* -------------------------------
     STEP 2.3 – SCREEN / BOARD SHARE
  --------------------------------*/
  async toggleScreenShare() {
    if (!this.room) return;

    /* STOP SHARING */
    if (this.isScreenSharing && this.screenTrack) {
      await this.room.localParticipant.unpublishTrack(this.screenTrack);
      this.screenTrack.stop();
      this.screenTrack = null;
      this.isScreenSharing = false;
      console.log('🛑 Screen sharing stopped');
      return;
    }

    /* START SHARING */
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: false // 🔴 NEVER capture system audio
      });

      const videoTrack = stream.getVideoTracks()[0];

      // Safety: remove old screen track if exists
   const publications = this.room.localParticipant.getTrackPublications();

for (const pub of publications) {
  if (pub.source === Track.Source.ScreenShare && pub.track) {
await this.room.localParticipant.unpublishTrack(pub.track.mediaStreamTrack);
  }
}

      this.screenTrack = new LocalVideoTrack(videoTrack);

      await this.room.localParticipant.publishTrack(this.screenTrack, {
        name: 'teacher-screen',
        source: Track.Source.ScreenShare
      });

      // Local preview for teacher
      if (this.screenPreview) {
        this.screenPreview.nativeElement.srcObject =
          new MediaStream([videoTrack]);
        await this.screenPreview.nativeElement.play();
      }
       

      this.isScreenSharing = true;
      console.log('🖥️ Screen sharing started');

      // Auto stop when browser "Stop sharing" clicked
      videoTrack.onended = async () => {
        if (this.screenTrack) {
          await this.room.localParticipant.unpublishTrack(this.screenTrack);
          this.screenTrack = null;
          this.isScreenSharing = false;
          console.log('🛑 Screen sharing ended by browser');
        }
      };

    } catch (err) {
      console.error('❌ Screen share failed', err);
    }
  }

 
 private audioListenerRegistered = false;
registerSpeakingIndicator() {
  this.room.on(
    RoomEvent.ActiveSpeakersChanged,
    (speakers: Participant[]) => {

      if (!speakers || speakers.length === 0) {
        this.currentSpeaker = null;
        return;
      }

      // Pick loudest active speaker
      let loudest: Participant | null = null;
      let maxLevel = 0;

      for (const p of speakers) {
        if (p.audioLevel > maxLevel) {
          maxLevel = p.audioLevel;
          loudest = p;
        }
      }

      if (loudest && loudest.audioLevel > 0.01) {
        this.currentSpeaker = loudest.identity;
        console.log(
          '🗣️ Speaking:',
          loudest.identity,
          'Level:',
          loudest.audioLevel
        );
      } else {
        this.currentSpeaker = null;
      }
    }
  );
}


private handleSpeakers(speakers: Participant[]) {
  if (!speakers || speakers.length === 0)
     {  
    this.currentSpeaker = null;
    return;
  }

  let loudestSpeaker: Participant | null = null;
  let maxLevel = -1; // Start below 0 to catch even quiet speakers

  for (const participant of speakers) {
    // Note: audioLevel is a value from 0 to 1
    if (participant.audioLevel !== undefined && participant.audioLevel > maxLevel) {
      maxLevel = participant.audioLevel;
      loudestSpeaker = participant;
    }
  }

  if (loudestSpeaker && maxLevel > 0) 
    {
      this.initialspeaker = "";
    this.currentSpeaker = loudestSpeaker.identity;
  } else {
    this.currentSpeaker = null;
  }

}
registerStudentAudio() {
   
  if (this.audioListenerRegistered) return;
  this.audioListenerRegistered = true;

  this.room.on(
    RoomEvent.TrackSubscribed,
    (track, publication, participant) => {

      if (track.kind !== 'audio') return;

      console.log('🔊 Student audio subscribed:', participant.identity);
this.currentSpeaker = participant.identity;
      const audioEl = this.adminAudio.nativeElement;

      audioEl.srcObject = new MediaStream([
        track.mediaStreamTrack
      ]);

      audioEl.muted = false;
      audioEl.volume = 1;

      audioEl.play()
        .then(() => console.log('🔊 Audio playing'))
        .catch(err => console.warn('Audio play blocked', err));
    } 
  );

    this.room.on(
    RoomEvent.TrackUnsubscribed,
    (track, publication, participant) => {

      if (track.kind !== 'audio') return;

      console.log('🔇 Student mic OFF:', participant.identity);
      this.currentSpeaker = null;
      // 🔥 CLEAR speaking indicator immediately
      if (this.currentSpeaker === participant.identity) {
        this.currentSpeaker = null;
      }
    }
  );
}




hasAdminJoined = false;


async joinAsAdmin() 
{
  this.hasAdminJoined = true;

  // MUST be inside click
  await this.connectAsTeacher(this.livekitUrl, this.data.token);
  //await this.publishTeacherMic();

  // 🔥 Unlock browser audio
  this.room.startAudio();

  // 🔥 Attach student audio + detect speaker
  this.registerStudentAudio();
await this.startAdminCamera();


  setTimeout(() => {
    
  this.registerStudentList(); // 🔥 STEP-6
  }, 6000);

this.room.remoteParticipants.forEach((participant) => {
  if (participant.identity !== this.adminIdentity) {

    console.log("👤 Existing student found:", participant.identity);

      this.StudentInMeetList.push({
        identity: participant.identity
       });
       this.fetchStudentList();

     // Example usage
   }
});

this.room.on( RoomEvent.ParticipantConnected,  (participant) => {
      if (participant.identity === this.adminIdentity) return;

      console.log('👤 Student joined:', participant.identity);

        this.StudentInMeetList.push({
        identity: participant.identity
       });

});

    this.room.on(
    RoomEvent.ParticipantDisconnected,
    (participant) => {
      if (participant.identity === this.adminIdentity) return;

      console.log('👋 Student left:', participant.identity);
 this.StudentInMeetList.splice(this.StudentInMeetList.findIndex((s:any) => s.identity === participant.identity), 1);


    }

  );

  
  this.room.on(
    RoomEvent.ParticipantMetadataChanged,
    (metadata, participant) => {
      try {
        const data = JSON.parse(metadata || '{}');
        if (data.micLocked !== undefined) {
          console.log(
            '🔒 Mic lock changed:',
            participant.identity,
            data.micLocked
          );
          this.setLockStatus(participant.identity, data.micLocked);
        }
      } catch (e) {
        console.warn('Invalid metadata JSON', metadata);
      }
    }
  );

  console.log('▶️ Admin joined, audio unlocked, detection active');

}



 registerStudentList() {

  console.log('==============================');
  console.log('📋 registerStudentList() CALLED');

  // 🧪 Check room object
  if (!this.room) {
    console.error('❌ room is NULL or UNDEFINED');
    return;
  }

  console.log('✅ room exists');

  // 🧪 Check connection state
  console.log('🔗 room.state:', this.room.state);

  // 🧪 Check remoteParticipants map
  const remoteMap = this.room.remoteParticipants;
  console.log('🧪 remoteParticipants Map:', remoteMap);
  console.log('🧪 remoteParticipants size:', remoteMap.size);

  // 1️⃣ READ ALREADY CONNECTED STUDENTS
  if (remoteMap.size === 0) {
    console.warn('⚠️ No remote participants at time of registration');
  }
 
  remoteMap.forEach((participant, key) => {
    console.log('👤 Found existing participant');
    console.log('   ↳ key:', key);
    console.log('   ↳ identity:', participant.identity);
    console.log('   ↳ isLocal:', participant.isLocal);
    console.log('   ↳ tracks:', participant.trackPublications);

    if (participant.identity !== this.adminIdentity) {
  this.addStudent(participant.identity);
}



  });

  // 2️⃣ LISTEN FOR NEW STUDENTS
  console.log('📡 Registering ParticipantConnected listener');

  this.room.on(
    RoomEvent.ParticipantConnected,
    (participant: Participant) => {
      console.log('👤 ParticipantConnected EVENT FIRED');
      console.log('   ↳ identity:', participant.identity);
      console.log('   ↳ isLocal:', participant.isLocal);

if (participant.identity !== this.adminIdentity) {
  this.addStudent(participant.identity);
}

}
  );

  // 3️⃣ LISTEN FOR STUDENT LEAVING
  console.log('📡 Registering ParticipantDisconnected listener');

  this.room.on(
    RoomEvent.ParticipantDisconnected,
    (participant: Participant) => {
      console.log('👋 ParticipantDisconnected EVENT FIRED');
      console.log('   ↳ identity:', participant.identity);

      this.removeStudent(participant.identity);
    }
  );
this.room.on(
    RoomEvent.TrackPublished,
    (publication, participant) => {
      if (publication.kind === 'audio') {
        console.log('🎙️ Mic ON:', participant.identity);
        this.setMicStatus(participant.identity, true);
      }
    }
  );

  // 5️⃣ MIC OFF (student clicked mic OFF)
  this.room.on(
    RoomEvent.TrackUnpublished,
    (publication, participant) => {
      if (publication.kind === 'audio') {
        console.log('🔇 Mic OFF:', participant.identity);
        this.setMicStatus(participant.identity, false);
      }
    }
  );
  console.log('✅ registerStudentList() SETUP COMPLETE');
  console.log('==============================');
}

students: {
  identity: string;
  micOn: boolean;
    isLocked: boolean;

}[] = [];

private addStudent(identity: string) {
  if (this.students.find(s => s.identity === identity)) return;

  this.students.push({
    identity,
    micOn: false,
      isLocked: false
  });
}

private removeStudent(identity: string) {
  this.students = this.students.filter(
    s => s.identity !== identity
  );
}

private setMicStatus(identity: string, micOn: boolean) {
  const student = this.students.find(
    s => s.identity === identity
  );
  if (student) {
    student.micOn = micOn;
  }
}
 



lockMic(studentId: string) {
  fetch(`${this.userurl}lock-mic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomName: 'class_123',
      identity: studentId
    })
  })
  .then(() => {
    this.setLockStatus(studentId, true);
  });
}

unlockMic(studentId: string) {
  fetch(`${this.userurl}unlock-mic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomName: 'class_123',
      identity: studentId
    })
  })
  .then(() => {
    this.setLockStatus(studentId, false);
  });
}

private setLockStatus(identity: string, locked: boolean) {
  const student = this.students.find(s => s.identity === identity);
  if (student) {
    student.isLocked = locked;

    // If locked, mic is effectively OFF
    if (locked) {
      student.micOn = false;
    }
  }
}  

// Mute all students (except admin)
muteAllStudents() {
  console.log('🔇 Sending MUTE ALL request to backend');

  fetch(`${this.userurl}api/guest/mute-all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomName: this.roomName,
      adminIdentity: this.adminIdentity
    })
  })
  .then(res => {
    if (!res.ok) throw new Error('Mute all failed');
    return res.text();
  })
  .then(() => {
    console.log('✅ All students muted');

    // Update UI optimistically
    this.students.forEach(s => {
      if (s.identity !== this.adminIdentity) {
        s.isLocked = true;
        s.micOn = false;
      }
    });
  })
  .catch(err => console.error('❌ Error muting all:', err));
}

// Unmute all students (except admin)
unmuteAllStudents() {
  console.log('🔊 Sending UNMUTE ALL request to backend');

  fetch(`${this.userurl}api/guest/unmute-all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomName: this.roomName,
      adminIdentity: this.adminIdentity
    })
  })
  .then(res => {
    if (!res.ok) throw new Error('Unmute all failed');
    return res.text();
  })
  .then(() => {
    console.log('✅ All students unmuted');

    // Update UI optimistically
    this.students.forEach(s => {
      if (s.identity !== this.adminIdentity) {
        s.isLocked = false;
        // micOn will update automatically when student publishes audio
      }
    });
  })
  .catch(err => console.error('❌ Error unmuting all:', err));
}


kickStudent(identity: string) {
  if (!confirm(`Kick ${identity} from class?`)) return;

  fetch(`${this.userurl}api/guest/kick-student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomName: 'class_123', // make dynamic if needed
      identity: identity
    })
  })
  .then(res => res.json())
  .then(() => {
    console.log('🚫 Student kicked:', identity);

    // Remove from UI immediately
    this.students = this.students.filter(
      s => s.identity !== identity
    );
  })
  .catch(err => {
    console.error('Kick failed', err);
  });
}



  private _activeTab: 'students' | 'chat' = 'students';
  // expose as property with getter/setter so template assignments trigger logic
  get activeTab(): 'students' | 'chat' { return this._activeTab; }
  set activeTab(v: 'students' | 'chat') {
    if (this._activeTab === v) return;
    this._activeTab = v;
    // start/stop polling when switching to/from chat
    if (v === 'chat') {
      this.startChatPolling();
    } else {
      this.stopChatPolling();
    }
  }

  private chatIntervalId: any = null;

  // HARD-CODED STUDENTS
  students_data= [
    { name: 'Rahul', status: 'on' },
    { name: 'Ayesha', status: 'off' },
    { name: 'Rohan', status: 'locked' }
  ];
 messages:  any=[ ];

  chatInput = '';

  @ViewChild('chatContainer')
  chatContainer!: ElementRef;
sendMessage() {
  if (!this.chatInput.trim()) return;

  this.messages.push({
    user: 'You',
    text: this.chatInput,
    time: this.getTime()
  });

  this.chatInput = '';

  setTimeout(() => {
    if (this.isUserAtBottom) {
      this.scrollToBottom();
    }
  });
}


onChatScroll() {
  const el = this.chatContainer.nativeElement;

  const scrollTop = el.scrollTop;
  const clientHeight = el.clientHeight;
  const scrollHeight = el.scrollHeight;

  const threshold = 20;

  const atBottom =
    scrollTop + clientHeight >= scrollHeight - threshold;

  console.log('CHAT SCROLL DEBUG');
  console.log('scrollTop      :', scrollTop);
  console.log('clientHeight  :', clientHeight);
  console.log('scrollHeight  :', scrollHeight);
  console.log('sum (top+view):', scrollTop + clientHeight);
  console.log('bottom target :', scrollHeight - threshold);
  console.log('isUserAtBottom:', atBottom);
  console.log('-----------------------------');

  this.isUserAtBottom = atBottom;
}

isUserAtBottom = true;

 

  private scrollToBottom() {
    if (!this.chatContainer) return;

    const el = this.chatContainer.nativeElement;
    el.scrollTop = el.scrollHeight;
  }

  private getTime(): string {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

private apiSimulationStarted = false;
private apiIntervalId: any;
  
  // Start polling chat messages when teacher opens Chat tab
  private startChatPolling() 
  {
    if (this.chatIntervalId) return; // already running
    // fetch immediately, then every 1s
    try { this.getAllComments(); } catch (e) { /* ignore */ }
    this.chatIntervalId = setInterval(() => {
      this.getAllComments();
    }, 20000);
  }

  private stopChatPolling() {
    if (!this.chatIntervalId) return;
    clearInterval(this.chatIntervalId);
    this.chatIntervalId = null;
  }
 
unreadCount = 0;
ngOnDestroy() {
  if (this.apiIntervalId) {
    clearInterval(this.apiIntervalId);
  }
  if (this.chatIntervalId) {
    clearInterval(this.chatIntervalId);
    this.chatIntervalId = null;
  }
}


/**
 * 🔊 Admin mic toggle
 * Teacher can always turn mic ON/OFF
 */
 
// -------------------- LiveKit --------------------
localAudioTrack: LocalAudioTrack | null = null;
isMicOn = false; // mic OFF by default

  
 async toggleAdminMic() {

  if (!this.room || !this.isConnected) {
    console.warn('⏳ LiveKit not connected yet');
    return;
  }

  const localParticipant = this.room.localParticipant;

  // 🔇 TURN MIC OFF
  if (this.isMicOn && this.localAudioTrack) 
    {
    await localParticipant.unpublishTrack(this.localAudioTrack);
    this.localAudioTrack.stop();
    this.localAudioTrack = null;
    this.isMicOn = false;
    console.log('🔇 Admin mic OFF');
    return;
  }

  // 🎙️ TURN MIC ON
  try {
    const track = await createLocalAudioTrack({
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    });

    await localParticipant.publishTrack(track);

    this.localAudioTrack = track;
    this.isMicOn = true;
    console.log('🎙️ Admin mic ON');

  } catch (err) {
    console.error('❌ Failed to toggle admin mic', err);
  }
}


cameraTrack: LocalVideoTrack | null = null;
isCameraOn = false;
@ViewChild('adminCameraPreview')
adminCameraPreview!: ElementRef<HTMLVideoElement>;

async startAdminCamera() {
  if (!this.room || this.isCameraOn) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720, frameRate: 30 }
    });

    const mediaTrack = stream.getVideoTracks()[0];

    // Create LiveKit track
    this.cameraTrack = new LocalVideoTrack(mediaTrack);

    // Publish to room
    await this.room.localParticipant.publishTrack(this.cameraTrack, {
      source: Track.Source.Camera
    });

    // 🔥 CRITICAL: attach using LiveKit
    setTimeout(() => {
      const videoEl = this.adminCameraPreview?.nativeElement;

      if (!videoEl) {
        console.error('❌ adminCameraPreview element not found');
        return;
      }

      this.cameraTrack!.attach(videoEl);
      videoEl.muted = true;        // REQUIRED
      videoEl.playsInline = true; // mobile safe

      videoEl.play()
        .then(() => console.log('📷 Admin camera preview playing'))
        .catch(err => console.warn('⚠️ Autoplay blocked:', err));
    }, 100);

    this.isCameraOn = true;
    console.log('📷 Admin camera ON');

  } catch (err) {
    console.error('❌ Failed to start admin camera', err);
  }
}

 

async toggleAdminCamera() {
  if (!this.room) return;

  // 🔴 CAMERA OFF
  if (this.isCameraOn && this.cameraTrack) {
    this.cameraTrack.detach();
    await this.room.localParticipant.unpublishTrack(this.cameraTrack);
    this.cameraTrack.stop();
    this.cameraTrack = null;
    this.isCameraOn = false;
    console.log('📷 Camera OFF');
    return;
  }

  // 🟢 CAMERA ON
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 }
    });

    const mediaTrack = stream.getVideoTracks()[0];
    this.cameraTrack = new LocalVideoTrack(mediaTrack);

    await this.room.localParticipant.publishTrack(this.cameraTrack, {
      source: Track.Source.Camera
    });
     

    // 🔥 CRITICAL PART
    setTimeout(() => {
      const videoEl = this.adminCameraPreview?.nativeElement;
      if (!videoEl) {
        console.error('❌ adminCameraPreview NOT FOUND');
        return;
      }

      this.cameraTrack!.attach(videoEl);
      videoEl.muted = true;
      videoEl.play()
        .then(() => console.log('📷 Admin camera preview playing'))
        .catch(err => console.warn('Autoplay blocked', err));
    }, 100);

    this.isCameraOn = true;
    console.log('📷 Camera ON');
  } catch (err) {
    console.error('❌ Camera start failed', err);
  }
}



fetchStudentList() 
{
   
  const identities = this.StudentInMeetList.map((student: any) => student.identity).join(',');
fetch(`${this.userurl}api/guest/GetStudentList`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    studentlist: identities
  })
})
.then(res => res.json())
.then(data => {
  console.log('📋 Student list from backend:', data);
  this.StudentInMeetList = data.result || [];
})
.catch(err => console.error('❌ Failed to fetch student list', err));

}


getAllComments()
{

  this.studentservice.getchats(this.roomName).subscribe({
    next:(response)=>{
      console.log("Chat response",response);
      this.messages = response;
       
      this.scrollToBottom();
    },
    error:(err)=>{
      console.error("Chat error",err);
    }
  });
 
}

sendMessage1() {
    if (!this.chatInput.trim()) return;
     
    const messageText = this.chatInput;
    this.chatInput = ''; // Clear input immediately for UX
     
    console.log('📤 Sending message:', messageText);
    
    const payload = {
      RoomName: this.roomName,
      CourseId:this.CourseId,
      BatchId:this.Batchname,
      SenderId: 0,
      SenderName:  'Admin', // Use actual student name if available
      SenderRole: 'Admin',
      MessageText: messageText
    };

    this.studentservice.sendMessage(payload)
      .subscribe({
        next: (res) => {
          console.log('✅ Message sent successfully:', res);
           
     this.getAllComments(); // Refresh chat after sending
        },
        error: (err) => {
          console.error('❌ Message send failed', err);
           alert('Failed to send message. Please try again.');
          // Re-populate the input in case of error
          this.chatInput = messageText;
        }
      });
  }

}
 