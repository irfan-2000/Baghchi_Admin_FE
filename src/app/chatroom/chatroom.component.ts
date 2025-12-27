import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Room,
  RemoteParticipant,
  RemoteTrack,
  RoomEvent,Track   
} from "livekit-client";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chatroom',
  standalone: false,
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.css'
})
export class ChatroomComponent implements OnInit, OnDestroy {

  room!: Room;   // strongly typed
  currentSpeaker: string = '';
  chatMessages: string[] = [];
  messageInput = '';
  constructor(private http: HttpClient) {}

  private audioEnabled = false;
private audioElements: HTMLAudioElement[] = [];

enableAudio()
 {
  this.audioEnabled = true;
console.log("audio enable");
  // play all pending audio
  this.audioElements.forEach(a => {
    a.muted = false;
    console.log("audio playing");

    a.play().catch(() => {});
  });
}

  ngOnInit(): void {
    this.startTeacherRoom();
  }

  ngOnDestroy(): void {
    if (this.room) {
    }
  }

 
async startTeacherRoom() {
  const roomName = "class_2025";
  const identity = "teacher_01";

  // 1️⃣ GET TOKEN
  const response = await this.http.post<{ token: string }>(
    "http://localhost:8080/api/guest/token",
    { identity, room: roomName }
  ).toPromise();

  const token = response!.token;

  // 2️⃣ CREATE ROOM
  this.room = new Room({
    adaptiveStream: false,
    dynacast: false
  });

  // 3️⃣ CONNECT
  await this.room.connect("ws://localhost:7880", token);
  console.log("Teacher joined room");

  // 4️⃣ AUDIO FROM STUDENTS (ONE PLACE ONLY)
  this.room.on(RoomEvent.TrackSubscribed,
    (track: RemoteTrack, _pub, participant: RemoteParticipant) => {

      if (track.kind !== Track.Kind.Audio) return;

      const audio = document.createElement('audio');
      audio.srcObject = new MediaStream([track.mediaStreamTrack]);
      audio.autoplay = false;
      audio.muted = true;

      this.audioElements.push(audio);

      if (this.audioEnabled) {
        audio.muted = false;
        audio.play().catch(() => {});
      }

      console.log('Audio from:', participant.identity);
    }
  );

  // 5️⃣ ACTIVE SPEAKER
  this.room.on(RoomEvent.ActiveSpeakersChanged, speakers => {
    this.currentSpeaker = speakers.length > 0
      ? speakers[0].identity ?? ''
      : '';
  });

  // 6️⃣ PARTICIPANT LEFT
  this.room.on(RoomEvent.ParticipantDisconnected, participant => {
    console.log("Student left:", participant.identity);
  });
}




}
