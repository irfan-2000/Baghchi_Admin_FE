import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
  import { ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { LiveClassesService } from '../live-classes.service';
 
@Component({
  selector: 'app-classeshistory',
  standalone: false,
  templateUrl: './classeshistory.component.html',
  styleUrl: './classeshistory.component.css'
})
export class ClasseshistoryComponent {

classHistory:any
  constructor(private fb: FormBuilder, private http: HttpClient,private Liveclasses:LiveClassesService,private router:Router) 
  {
    this.GetClassHistory();
  }

  
GetClassHistory(): void {
  this.Liveclasses.GetClassHistory().subscribe({
    next: (response: any) =>
   {
     
       this.classHistory = response;
      console.log('Class History:', this.classHistory);
    },
    error: (error: any) => {
      console.error('Error loading class history:', error);
    }
  });
}

  
  

}
