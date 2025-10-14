import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LiveClassesRoutingModule } from './live-classes-routing.module';
 import { LiveClassesComponent } from './live-classes/live-classes.component';
 import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
 

@NgModule({
  declarations: [LiveClassesComponent
   ],
  imports: [
    CommonModule,
    LiveClassesRoutingModule,FormsModule,ReactiveFormsModule,NgSelectModule
  ]
})
export class LiveClassesModule { }
