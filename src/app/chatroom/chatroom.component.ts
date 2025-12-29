import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import {
  Room,
  RemoteParticipant,
  RemoteTrack,
  RoomEvent,
  Track
} from "livekit-client";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Route } from '@angular/router';
import { environment } from '../environments/environment.prod';

@Component({
  selector: 'app-chatroom',
  standalone: false,
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.css'
})
export class ChatroomComponent implements OnInit, OnDestroy 
{ 
private baseurl = environment.userurl;

  room!: Room;
  currentSpeaker: string = '';
  chatMessages: string[] = [];
  messageInput = '';
  participants: RemoteParticipant[] = [];
  isListening: boolean = false;

  CourseId:any;
  Batchname:any;
  Chatroom_id:any
  Teacher:any
  
  public canPlayAudio = true; // Used to show/hide a "Resume Audio" button in HTML

  constructor(private http: HttpClient, private ngZone: NgZone,private route:ActivatedRoute) 
  {
      this.route.queryParams.subscribe(params => {
        this.CourseId = params['courseId'],
        this.Batchname = params['Batchname'],
        this.Chatroom_id = params['chatroom_id'],
        this.Teacher = params['teacher']
  });
  }

  ngOnInit(): void 
  {
    // Run outside Angular to fix NG0506 Hydration stability error
    this.ngZone.runOutsideAngular(() => {
      this.startTeacherRoom();
    });
  }
  async startTeacherRoom()
   { 
    const response = await this.http.post<{ token: string }>(
     `${this.baseurl}api/guest/token`,
      { identity: this.Teacher, room: this.Chatroom_id }
    ).toPromise();

    this.room = new Room({ adaptiveStream: true, dynacast: true });

    this.room.on(RoomEvent.ParticipantConnected, p => {
      console.log('Student joined:', p.identity);
      this.updateParticipants();
    });

    this.room.on(RoomEvent.ParticipantDisconnected, p => {
      console.log('Student left:', p.identity);
      this.updateParticipants();
    });

    this.room.on(RoomEvent.ActiveSpeakersChanged, () => {
      this.sortParticipants();
    });
this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) =>
   {
  if (track.kind === Track.Kind.Audio) {
    // 1. Remove any old audio elements for this participant to prevent "ghosting"
    const oldEl = document.getElementById(`audio-${participant.identity}`);
    if (oldEl) oldEl.remove();

    // 2. Attach the new track
    const element = track.attach();
    element.id = `audio-${participant.identity}`; // Give it a unique ID
    document.body.appendChild(element);
    
    console.log(`Audio attached for ${participant.identity}`);
  }
});

    this.room.on(RoomEvent.AudioPlaybackStatusChanged, () => {
      this.ngZone.run(() => {
        this.canPlayAudio = this.room.canPlaybackAudio;
        console.log(
          this.canPlayAudio
            ? '🔊 Audio Allowed'
            : '⛔ Audio Blocked'
        );
      });
    });

    await this.room.connect('wss://livekit.race-elearn.com', response!.token);
    console.log('✅ Admin connected');
    this.updateParticipants();


  }

  updateParticipants() {
    this.ngZone.run(() => {
      this.participants = Array.from(this.room.remoteParticipants.values());
      this.sortParticipants();
      console.table(this.participants.map(p => ({
        id: p.identity,
        speaking: p.isSpeaking
      })));
    });
  }

  sortParticipants() {
    this.participants.sort(
      (a, b) => Number(b.isSpeaking) - Number(a.isSpeaking)
    );
  }

  async enableAudio() {
    console.log('▶ Resuming audio');
    await this.room.startAudio();
    this.isListening = true;
  }

  toggleListening() {
    if (!this.isListening) {
      this.enableAudio();
    } else {
      console.log('Audio already active');
    }
  }

  // 🔴 MUTE ONE STUDENT
  async muteStudent(p: RemoteParticipant) 
  {
    console.log('🔇 Muting:', p.identity);

    const payload = new TextEncoder().encode(
      JSON.stringify({ type: 'MUTE' })
    );

    await this.room.localParticipant.publishData(payload, {
      destinationIdentities: [p.identity]
    });

    console.log('📤 Mute command sent');
  }

  // 🔴 MUTE ALL
  async muteAll() {
    console.log('🔇 Muting ALL students');

    const payload = new TextEncoder().encode(
      JSON.stringify({ type: 'MUTE_ALL' })
    );

    await this.room.localParticipant.publishData(payload);

    console.log('📤 Mute-all command broadcasted');
  }

  ngOnDestroy(): void {
    this.room?.disconnect();
    console.log('Admin disconnected');
  }

async muteStudentForcefully(p: any)
 {
  const body = {
    roomName: this.Chatroom_id,
    identity: p.identity
  };

  this.http.post( `${this.baseurl}api/guest/lock-mic`, body).subscribe({
    next: () => {
      console.log(`Successfully locked mic for ${p.identity}`);
      // The student's UI will update automatically via ParticipantMetadataChanged
    },
    error: (err) => console.error('Failed to lock mic', err)
  });
}


setStudentMic(participant: any, shouldAllow: boolean) {
  const endpoint = shouldAllow ? 'unlock-mic' : 'lock-mic';
  const payload = {
    roomName: this.Chatroom_id,
    identity: participant.identity
  };

  this.http.post( `${this.baseurl}api/guest/${endpoint}` , payload)
    .subscribe({
      next: () => console.log(`Successfully ${shouldAllow ? 'unlocked' : 'locked'} mic for ${participant.identity}`),
      error: (err) => console.error("API Error:", err)
    });
}


/**
 * Mute All Students - Iterates through participants and calls Java API
 */
muteAllStudents() {
  if (confirm("Are you sure you want to mute everyone?")) {
    this.participants.forEach(p => {
      if (p.permissions?.canPublish) {
        this.setStudentMic(p, false);
      }
    });
  }
}

/**
 * Unmute All Students - Restores publishing permissions for everyone
 */
unmuteAllStudents() {
  if (confirm("Allow everyone to speak? (This will unlock their microphones)")) {
    this.participants.forEach(p => {
      // Check if they are currently locked (canPublish is false)
      if (p.permissions && !p.permissions.canPublish) {
        this.setStudentMic(p, true); // true = unlock-mic
      }
    });
  }
}

}