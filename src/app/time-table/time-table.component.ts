import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { LiveClassesComponent } from '../pages/live-classes/live-classes/live-classes.component';
import { LiveClassesService } from '../live-classes.service';



 
@Component({
  selector: 'app-time-table',
  standalone: false,
  templateUrl: './time-table.component.html',
  styleUrl: './time-table.component.css'
})
export class TimeTableComponent {
 
   // ✅ Include Sunday
  days: string[] = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  // ✅ Dynamic timing (change anytime)
  startHour = 6;
  endHour = 24;

  sessions1: any[] = [
    {
      id: 1,
      day: 'Monday',
      title: 'Biology',
      startTime: '08:00',
      endTime: '10:00'
    }
  ];



  
  sessions: any[] = [  ];

  showModal = false;
  isEdit = false;
  selectedDay = '';

  form: any = {
    id: null,
    title: '',
      courseid: 'null',
      batchid: 'null',
    startTime: '',
    endTime: ''
  };

constructor(private Liveclasses:LiveClassesService)
{
  this.getAllCourses();
    this.GetTimeTable();
}

  // -------------------------
slotHeight = 60; // must match CSS EXACTLY

getTop(time: string): number {
  const [h, m] = time.split(':').map(Number);

  const totalMinutes = (h - this.startHour) * 60 + m;
  const totalDayMinutes = (this.endHour - this.startHour) * 60;

  return (totalMinutes / totalDayMinutes) * 100;
}
getHeight(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);

  let startMin = sh * 60 + sm;
  let endMin = eh * 60 + em;

  if (endMin < startMin) {
    endMin += 24 * 60;
  }

  const totalDayMinutes = (this.endHour - this.startHour) * 60;

  return ((endMin - startMin) / totalDayMinutes) * 100;
}


  getSessions(day: string) {
    return this.sessions.filter(s => s.day === day);
  }

  // -------------------------
  // Click empty space → Add
  openModal(day: string) {
    this.isEdit = false;
    this.selectedDay = day;

    this.form = {
      id: null,
      title: '',
      courseid: 'null',
      batchid: 'null',
      startTime: '',
      endTime: '',
      teachername:'Dr.bagchi'
    };

    this.showModal = true;
  }

  // -------------------------
  // Click existing → Edit
  editSession(session: any)
   {
    this.isEdit = true;
    this.selectedDay = session.day;

    this.form = { ...session };

      this.getBatchesByCourseid(this.form['courseid']);
    this.showModal = true;
  }

  // -------------------------
  saveSession() {

  if (!this.validateForm()) return;

  // ✅ Create payload ONCE
  const payload = {
    sessionId: this.form.id,
    day: this.selectedDay,
    title: this.form.title,
    startTime: this.form.startTime + ':00',
    endTime: this.form.endTime + ':00',
    courseId: Number(this.form.courseid),
    batchId: Number(this.form.batchid),
    teacherName: this.form.teachername
  };

  debugger;

  // ✅ Local UI update (optional)
  if (this.isEdit) {

    const index = this.sessions.findIndex(s => s.id === this.form.id);

    if (index > -1) {
      this.sessions[index] = { ...payload, id: this.form.id };
    }

  } else {

    const newSession = {
      ...payload,
      id: Date.now()
    };

    this.sessions.push(newSession);
  }

  // ✅ Single API call
  this.Liveclasses.AddUpdateTimeTable(payload).subscribe({
    next: (response: any) => {

      console.log('API PAYLOAD:', payload);
      console.log('API RESPONSE:', response);

      if (response?.Result > 0) {
        alert(this.isEdit ? 'Session updated successfully!' : 'Session created successfully!');
        this.showModal = false;
      } else {
        alert('Failed to save session.');
      }
    },

    error: (error: any) => {
      console.error('API Error:', error);
      alert('Something went wrong!');
    }
  });
}   



AvailableCourses: any[] = [];

getAllCourses() {
  this.Liveclasses.getAllCourses().subscribe({
    next: (response: any) => {

      if (response?.Result)
       {
         
        this.AvailableCourses = response.Result;
      } else {
        this.AvailableCourses = [];
      }

    },

    error: (error: any) => {
      console.error('API error:', error);
      this.AvailableCourses = [];
    }
  });
}

Batches:any = [];

getBatchesByCourseid(CourseId:any)
{
  try{

    this.Liveclasses.getBatchesByCourseid(CourseId).subscribe({
      next:(response:any)=>{
    console.log(response);
    this.Batches = response.Result;
      },
      error:(error:any) =>{

      }});

  } catch(error:any)
  {
    console.error('API error:', error);
  }
}



onCourseChange(Event:any)
{
   
  const courseid = Event.target.value;
  this.getBatchesByCourseid( this.form['courseid']);

}

errorMessage:any = '';

validateForm(): boolean {

  if (
    this.isInvalid(this.form.title) ||
    this.isInvalid(this.form.startTime) ||
    this.isInvalid(this.form.endTime) ||
    this.isInvalid(this.form.courseid) ||
    this.isInvalid(this.form.batchid)
  ) {
    this.errorMessage = 'Please fill in all fields.';
    return false;
  }

  return true;
}



isInvalid(value: any): boolean 
{
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    value === 'null'
  );
}


GetTimeTable()
{
try{

    this.Liveclasses.GetTimeTable( ).subscribe({
      next:(response:any)=>{
    console.log(response);

  this.sessions = response.Result.map((item: any) => ({

  id: item.SessionId,
  day: item.Day,
  title: item.SessionTitle,

  // ✅ FIX HERE
  startTime: item.StartTimeIST.substring(0,5),
  endTime: item.EndTimeIST.substring(0,5),

  courseid: item.CourseId,
  batchid: item.BatchId,
  teachername: item.TeacherName
}));
    
 
 
  },
      error:(error:any) =>{

      }});

  } catch(error:any)
  {
    console.error('API error:', error);
  }
}


}