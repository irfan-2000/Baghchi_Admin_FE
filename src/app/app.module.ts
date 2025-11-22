import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule, NgSelectOption, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CreateQuizComponent } from './pages/create-quiz/create-quiz.component';
import { ManageClassBoardSubjectsComponent } from './manage-class-board-subjects/manage-class-board-subjects.component';
import { ManageCoursePackagesandDetailsComponent } from './manage-course-packagesand-details/manage-course-packagesand-details.component';
import { NgSelectModule } from '@ng-select/ng-select';
  import { CommonModule } from '@angular/common';
import { QuizhistoryComponent } from './quizhistory/quizhistory.component';
import { NotesMediaReportsComponent } from './notes-media-reports/notes-media-reports.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
 import { ClasseshistoryComponent } from './classeshistory/classeshistory.component';
import { ManageCoursePackagesandDetails2Component } from './manage-course-packagesand-details2/manage-course-packagesand-details2.component';
  
@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    CreateQuizComponent,
    ManageClassBoardSubjectsComponent,
    ManageCoursePackagesandDetailsComponent,
    QuizhistoryComponent,
    NotesMediaReportsComponent,
    StudentDetailsComponent,
     ClasseshistoryComponent,
     ManageCoursePackagesandDetails2Component
    ],
  imports: [ HttpClientModule, FormsModule, ReactiveFormsModule, RouterModule, BrowserModule, AppRoutingModule,NgSelectModule ,CommonModule
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
