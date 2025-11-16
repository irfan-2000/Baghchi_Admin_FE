import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LiveClassesService } from '../../../live-classes.service';
 import { ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
 import { StudentService } from '../../../student.service';

@Component({
  selector: 'app-live-classes',
  standalone: false,
  templateUrl: './live-classes.component.html',
  styleUrl: './live-classes.component.css'
})
export class LiveClassesComponent implements OnInit{
   

  form:FormGroup;
  
  result:any;
  defaultTimezone = 'Asia/Kolkata';
  Redirecturl = 'https://83ee03faa761.ngrok-free.app/api/zoom/callback';
  Redirectbaseurl = 'https://83ee03faa761.ngrok-free.app';


  loading = false;
  error: string | null = null;
  ShowClassDetailsFrom = false;
  SelectedLiveClass:any;
  Batches:any;
  Coursepayload:any;
  successmsg:any;
  OngoignClassDetails:any = [];
  Listofstudents:any;

  // sensible defaults
  defaults = {
    topic: 'Maths Class',
    type: 1, // 1 = Instant, 2 = Scheduled
    start_time_local: this.toLocalInputValue(new Date(Date.now() + 5 * 60 * 1000)), // +5 min
    duration: 30,
    timezone: this.defaultTimezone,
    agenda: 'Live session',
    host_video: true,
    participant_video: false,
    join_before_host: false,
    mute_upon_entry: true,
    approval_type: 0
  }; 
  
  constructor(private fb: FormBuilder, private http: HttpClient,private Liveclasses:LiveClassesService,private router:Router,private studentService:StudentService) 
  {
 
       this.getAllCourses();
      this.getOngoingClassDetails();
      this.getAllStudents();
   this.form = this.fb.group({
    topic: [this.defaults.topic, [Validators.required, Validators.maxLength(200)]],
    type: [this.defaults.type, [Validators.required]],
    start_time_local: [this.defaults.start_time_local], // only used when type = 2
    duration: [this.defaults.duration, [Validators.min(1)]],
    timezone: [this.defaults.timezone, [Validators.required]],
    agenda: [this.defaults.agenda, [Validators.maxLength(500)]],
    host_video: [this.defaults.host_video],
    participant_video: [this.defaults.participant_video],
    join_before_host: [this.defaults.join_before_host],
    mute_upon_entry: [this.defaults.mute_upon_entry],
    approval_type: [this.defaults.approval_type],
    batchId: ['', [Validators.required]],
    teachername:['',Validators.required],
    specialClassType:[''],
   studentIds: [[]],        // array of student ids

  });
console.log("Form initial values:", this.form.value);  // ✅ print initial form values

  }

  get fc() {
    return this.form.controls;
  }

 onTypeChange() 
 {
  // if switching to instant, clear start time validation; if scheduled, ensure it exists
  if (this.form.value.type === 2)
     {
    this.fc['start_time_local'].addValidators([Validators.required]);
  } else 
    {
    this.fc['start_time_local'].clearValidators();
    this.fc['start_time_local'].setValue(
      this.toLocalInputValue(new Date(Date.now() + 5 * 60 * 1000))
    );
  }
  this.fc['start_time_local'].updateValueAndValidity();
}

ngOnInit()
 {
  window.addEventListener('message', this.zoomMessageHandler.bind(this), false);
}

zoomMessageHandler(event: MessageEvent) 
{ 
   
  if(event.origin != 'http://localhost:4200')
  {
   }
 
  if (event.origin != this.Redirectbaseurl ) return;

  const data = event.data;
  
  if (data.zoomCode)
     {
       
    this.SubmitMeeting(data.zoomCode);
 
  }
}


ErrorMsg :any = [];

msg:any = ''

async   SubmitMeeting(Zoomcode:any = '')
   { 
      
if(!Zoomcode)
{   alert("Required zoom code");
  return;
} 
    this.ErrorMsg = []; // reset
      this.error = null;
      this.successmsg = null;
    if(this.validateForm() != 0)
     {
      return;
     }

     const response = await firstValueFrom(this.Liveclasses.getOngoingClassDetails())
      if(response?.Result?.length > 0)
     {
      alert("There are some classes already going please end them all before proceeding")
      return;
     }
 
 
    // Build request body to POST (even if backend currently ignores body, this is future-proof)
    const v = this.form.value;

    // Convert local datetime to UTC ISO string required by Zoom (yyyy-MM-ddTHH:mm:ssZ)
    const startUtcISO =
      v.type === 2 && v.start_time_local
        ? this.toUtcZoomISO(v.start_time_local as string, v.timezone!)
        : undefined;

    const payload = {
      topic: v.topic,
      type: v.type, // 1 instant, 2 scheduled
      start_time: startUtcISO, // undefined for instant
      duration: v.duration && v.duration > 0 ? v.duration : 30,
      timezone: v.timezone,
      agenda: v.agenda,      
        host_video: v.host_video,
        participant_video: v.participant_video,
        join_before_host: v.join_before_host,
        mute_upon_entry: v.mute_upon_entry,
        approval_type: v.approval_type,
        batchId :v.batchId,
        CourseId : this.Coursepayload.CourseId ,
        teachername:v.teachername,
        zoomcode:Zoomcode, 
        specialClassType:v.specialClassType ?? '',
        studentIds:v.studentIds
    }; 

   this.loading = true;
  const state = JSON.stringify({ payload});
        this.msg = ' Creating meeting… please wait!! Do not Refresh or close'
  this.Liveclasses.CreateMeeting(payload).subscribe({
next:(response:any) =>{

   
 if(response.StatusCode == 200)
{
  this.msg = "Session has been creating in new tab"
}
 

const url = this.router.serializeUrl(
  this.router.createUrlTree(['/classroom'], {
    queryParams: {
      meetingid: response.meetingid,
      zoom: 'success',
      courseId: this.Coursepayload.CourseId
    }
  })
);

// Open in new tab
window.open(url, '_blank');

},error:(error:any) =>{
  console.log(error);
  this.loading = false;
  alert("error creating a class");
}

  })
 
 
  }

async docallback()
{
   this.loading = true;
   this.msg= 'please wait';
   



  if(this.validateForm() != 0)
     {
      alert("Please fill all required fields");
      this.loading = false;
      return;
     }
   
   const response = await firstValueFrom(this.Liveclasses.getOngoingClassDetails())
      if(response?.Result?.length > 0)
     {
      alert("There are some classes already going please end them all before proceeding")
      this.loading = false;
      return;
     }
    const state = "no state";

   const clientId = "8hXTyshVThO62dBZohgnuA"; // Zoom Client ID
  const redirectUri = encodeURIComponent(this.Redirecturl); 
  const responseType = "code";
  const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${encodeURIComponent(state)}`;
     window.open(zoomAuthUrl, '_blank');
 
}

  


  copy(text: string) {
    navigator.clipboard.writeText(text);
  }



  /** Convert Date -> "yyyy-MM-ddTHH:mm" suitable for <input type="datetime-local"> */
  private toLocalInputValue(d: Date): string 
  {
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }

  /**
   * Convert a local datetime-local string to UTC ISO with trailing Z.
   * Note: HTML datetime-local has no timezone info; we treat it as local machine time.
   * Zoom expects UTC in "yyyy-MM-ddTHH:mm:ssZ".
   */
  private toUtcZoomISO(localDateTime: string, _tz: string): string
   {
    // localDateTime like "2025-08-28T19:30"
    const dt = new Date(localDateTime);
    // If browser parses without timezone, it assumes local tz; we just convert to UTC ISO
    const yyyy = dt.getUTCFullYear();
    const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(dt.getUTCDate()).padStart(2, '0');
    const hh = String(dt.getUTCHours()).padStart(2, '0');
    const mi = String(dt.getUTCMinutes()).padStart(2, '0');
    const ss = String(dt.getUTCSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}Z`;
  }
 
 
validateForm(): any
 {
  this.ErrorMsg = {}; // reset
  let haserror = 0;
  // topic

    
  if (!this.form.get('topic')?.value || this.form.get('topic')?.value.trim() === '') 
    {
    this.ErrorMsg['topic'] = 'Topic is required';
    haserror =1;
  } else if (this.form.get('topic')?.value.length > 200) {
    this.ErrorMsg['topic'] = 'Topic must not exceed 200 characters';
  }
if(!this.form.get('batchId')?.value || this.form.get('batchId')?.value.trim() === '' )
{
  this.ErrorMsg['batch'] = 'Please select a batch';
  haserror =1;
}

if(this.ShowspecialClassDetailsFrom)
{
if(this.form.get('specialClassType')?.value == '' || this.form.get('specialClassType')?.value == null || this.form.get('specialClassType')?.value == undefined)
{
  this.ErrorMsg['specialClassType'] = 'Please select a specialClassType';
  haserror =1;
}
if (this.form.get('specialClassType')?.value === 'specificStudents')
{
  const studentIds = this.form.get('studentIds')?.value;
  
  if (!studentIds || (Array.isArray(studentIds) && studentIds.length === 0)) {
    this.ErrorMsg['studentIds'] = 'Please select at least one student';
    haserror = 1;
  }
}

} 

if(this.form.get('teachername')?.value == null || this.form.get('teachername')?.value == '' ||this.form.get('teachername')?.value == undefined
)
{
  this.ErrorMsg['teachername'] = 'Please enter teacher name';
  haserror =1;
}


  // type
  if (!this.form.get('type')?.value) {
    this.ErrorMsg['type'] = 'Meeting type is required';
    haserror =1;
  }

  // start_time_local (only if type = 2 → scheduled)
  if (this.form.get('type')?.value === 2) {
    if (!this.form.get('start_time_local')?.value) {
      this.ErrorMsg['start_time_local'] = 'Start time is required for scheduled meetings';
      haserror =1;
    }
  }

  // duration
  if (!this.form.get('duration')?.value) {
    this.ErrorMsg['duration'] = 'Duration is required';
      haserror =1;
  } else if (this.form.get('duration')?.value <= 0) {
    this.ErrorMsg['duration'] = 'Duration must be greater than 0 minutes';
      haserror =1;
  }

  // timezone
  if (!this.form.get('timezone')?.value || this.form.get('timezone')?.value.trim() === '') {
    this.ErrorMsg['timezone'] = 'Timezone is required';
      haserror =1;
  }

  // agenda
  if (this.form.get('agenda')?.value == null || this.form.get('agenda')?.value == '' ||this.form.get('agenda')?.value == undefined) {
    this.ErrorMsg['agenda'] = 'Agenda is required';
      haserror =1;
  }

  // host_video
  if (this.form.get('host_video')?.value === null || this.form.get('host_video')?.value === undefined) {
    this.ErrorMsg['host_video'] = 'Please select host video option';
      haserror =1;
  }

  // participant_video
  if (this.form.get('participant_video')?.value === null || this.form.get('participant_video')?.value === undefined) {
    this.ErrorMsg['participant_video'] = 'Please select participant video option';
      haserror =1;
  }

  // join_before_host
  if (this.form.get('join_before_host')?.value === null || this.form.get('join_before_host')?.value === undefined) {
    this.ErrorMsg['join_before_host'] = 'Please select join before host option';
      haserror =1;
  }

  // mute_upon_entry
  if (this.form.get('mute_upon_entry')?.value === null || this.form.get('mute_upon_entry')?.value === undefined) {
    this.ErrorMsg['mute_upon_entry'] = 'Please select mute upon entry option';
      haserror =1;
  }

  // approval_type
  if (this.form.get('approval_type')?.value === null || this.form.get('approval_type')?.value === undefined) {
    this.ErrorMsg['approval_type'] = 'Please select approval type';
      haserror =1;
  }

return haserror;
}


 AvailableCourses:any = [];
 
  
getAllCourses()
{
    try 
     {
        this. Liveclasses.getAllCourses( ).subscribe({
          next: (response: any) =>
        {
          this.AvailableCourses = response.Result;
           
             this.AvailableCourses = response.Result.map((c: any) => {
          try {
            c.Description = JSON.parse(c.Description);
          } catch {
            // If it's plain text, just keep as is
          }
          return c;
        });
 
           },
          error: (error: any) => {             
          },
        });
      } catch (error: any) {
        console.error('API error:', error);
      }

}

goToCourseDetails(course: any) 
{
   
  this.router.navigate(['/course-details'], { queryParams: { id: course.CourseId } });
}


getOngoingClassDetails()
{
  try{
 
    this.Liveclasses.getOngoingClassDetails().subscribe({
      next:(response:any)=>
    {
      if(response.Result)
      {
        this.OngoignClassDetails = response.Result[0];
          
      }else{
        this.OngoignClassDetails = null;
      }
       
      
        
        },
      error:(error:any) =>{

      }});

  } catch(error:any)
  {
    console.error('API error:', error);
  }
}


async DoActionBasedon_getOngoingClassDetails_response()
{
  await this.getOngoingClassDetails();

if(this.OngoignClassDetails > 0)
{
  return
}

}



async StartClass(course:any)
{ 
 
   const response = await firstValueFrom(this.Liveclasses.getOngoingClassDetails())
      if(response?.Result?.length > 0)
     {
      alert("There are some classes already going please end them all before proceeding")
      return;
     }
     
     debugger
 

  this.ShowClassDetailsFrom = true;
  this.SelectedLiveClass = course;
  this.Coursepayload = course
  this.getBatchesByCourseid(course.CourseId);
  console.log(course);
}

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


GobackToCourses()
{
  window.location.reload();
}
 
EditCourse(c:any)
{
 
window.location.href = '/home/manage-courses?CourseId=' + c.CourseId + '&IsEditMode=true';



}
ShowspecialClassDetailsFrom :any =false;

async startspecialclass(course:any)
{
  this.ShowspecialClassDetailsFrom  = true;
  this.ShowClassDetailsFrom = false;
   const response = await firstValueFrom(this.Liveclasses.getOngoingClassDetails())
      if(response?.Result?.length > 0)
     {
      alert("There are some classes already going please end them all before proceeding")
      return;
     } 
     debugger
  this.ShowClassDetailsFrom = true;
  this.SelectedLiveClass = course;
  this.Coursepayload = course
  this.getBatchesByCourseid(course.CourseId); 
}


onSpecialClassTypeChange()
 {
  if (this.form.value.specialClassType !== 'specificStudents')
     {
    this.form.get('studentIds')?.setValue([]); // clear selection if switching to full batch
  }
}
 

getAllStudents()
{
this.studentService.getAllStudents().subscribe({
next:(data:any)=>
{
this.Listofstudents = data.filter((s: any) => s.Status ==1);
     },
error:(error:any)=>
{
  console.log(error);
}}) 
}


 
  toggleCheckAll(event: any)
   {
    if(event.currentTarget.checked)
      {
      this.selectAllbatches();
    } else {
      this.unselectAllbatches();
    }
  }

    selectAllbatches()
     {
    const studentidcontrol = this.form.get('studentIds');
    if (studentidcontrol) {
      debugger
      studentidcontrol.patchValue(this.Listofstudents.map((s:any) => s.StudentId));
    }
  }

  unselectAllbatches() 
  {
  const studentidcontrol = this.form.get('studentIds');
    if (studentidcontrol)
    {
 studentidcontrol.patchValue([]);
    }    
  }




}