import { Component, ElementRef, ViewChild } from '@angular/core';
import { Room, LocalTrack, LocalVideoTrack, Track, RemoteParticipant, RoomEvent, Participant } from 'livekit-client';
import { environment } from '../environments/environment.prod';

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

  /* -------------------------------
     STEP 2.1 – CONNECT AS TEACHER
  --------------------------------*/
async ngOnInit()
 {
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
          room: 'class_123',   // dynamic
          identity: 'teacher_1', role: 'teacher'
        })
      }
    );

    const data = await res.json();
this.data = data;
    // 2️⃣ Backend response MUST contain these
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


async joinAsAdmin() {
  this.hasAdminJoined = true;

  // MUST be inside click
  await this.connectAsTeacher(this.livekitUrl, this.data.token);
  await this.publishTeacherMic();

  // 🔥 Unlock browser audio
  this.room.startAudio();

  // 🔥 Attach student audio + detect speaker
  this.registerStudentAudio();

  setTimeout(() => {
    
  this.registerStudentList(); // 🔥 STEP-6
  }, 6000);

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

    this.addStudent(participant.identity);
  });

  // 2️⃣ LISTEN FOR NEW STUDENTS
  console.log('📡 Registering ParticipantConnected listener');

  this.room.on(
    RoomEvent.ParticipantConnected,
    (participant: Participant) => {
      console.log('👤 ParticipantConnected EVENT FIRED');
      console.log('   ↳ identity:', participant.identity);
      console.log('   ↳ isLocal:', participant.isLocal);

      this.addStudent(participant.identity);
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


muteAllStudents() {
  console.log('🔇 Muting all students');

  this.students.forEach(s => {
    if (!s.isLocked) {
      fetch(`${this.userurl}api/guest/lock-mic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: 'class_123',
          identity: s.identity
        })
      }).then(() => {
        // Optimistic UI update
        s.isLocked = true;
        s.micOn = false;
      });
    }
  });
}

unmuteAllStudents() {
  console.log('🔊 Unmuting all students');

  this.students.forEach(s => {
    if (s.isLocked) {
      fetch(`${this.userurl}api/guest/unlock-mic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: 'class_123',
          identity: s.identity
        })
      }).then(() => {
        // Optimistic UI update
        s.isLocked = false;
        // micOn will turn true only when student actually publishes audio
      });
    }
  });
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



}
 