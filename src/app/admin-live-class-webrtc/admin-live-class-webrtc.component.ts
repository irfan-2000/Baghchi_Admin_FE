import { Component, ElementRef, ViewChild } from '@angular/core';
import { Room, LocalTrack, LocalVideoTrack, Track } from 'livekit-client';
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


  @ViewChild('screenPreview')
  screenPreview!: ElementRef<HTMLVideoElement>;

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

    // 2️⃣ Backend response MUST contain these
    //const livekitUrl = data.url;     // e.g. wss://livekit.race-elearn.com
    const token = data.token;        // JWT

    // 3️⃣ Connect & publish mic
    await this.connectAsTeacher(this.livekitUrl, token);
    await this.publishTeacherMic();

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
}
 