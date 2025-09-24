import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CreateQuizComponent } from './pages/create-quiz/create-quiz.component';
import { ManageClassBoardSubjectsComponent } from './manage-class-board-subjects/manage-class-board-subjects.component';
  
 
@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    CreateQuizComponent,
    ManageClassBoardSubjectsComponent,
   ],
  imports: [ HttpClientModule,FormsModule,ReactiveFormsModule,RouterModule, BrowserModule, AppRoutingModule
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
