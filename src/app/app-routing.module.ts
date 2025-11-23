import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { ClassroomComponent } from './pages/live-classes/classroom/classroom.component';
import { CreateQuizComponent } from './pages/create-quiz/create-quiz.component';
import { ManageClassBoardSubjectsComponent } from './manage-class-board-subjects/manage-class-board-subjects.component';
import { ManageCoursePackagesandDetailsComponent } from './manage-course-packagesand-details/manage-course-packagesand-details.component';
import { QuizhistoryComponent } from './quizhistory/quizhistory.component';
import { NotesMediaReportsComponent } from './notes-media-reports/notes-media-reports.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { ClasseshistoryComponent } from './classeshistory/classeshistory.component';
import { ManageCoursePackagesandDetails2Component } from './manage-course-packagesand-details2/manage-course-packagesand-details2.component';
 
const routes: Routes = [

    { path: 'login', component: AdminLayoutComponent },
    {path: 'classroom',component: ClassroomComponent},
   {
   path: 'home',
   component: AdminLayoutComponent,
   children: [
     {
       path: 'live-classes',
       loadChildren: () => import('./pages/live-classes/live-classes.module')
         .then(m => m.LiveClassesModule)
     }, 
     {path:'create-quiz',component:CreateQuizComponent},
      { path:'manage-class-board-subjects',component:ManageClassBoardSubjectsComponent},
      {path:'manage-courses',component:ManageCoursePackagesandDetailsComponent},
      {path:'quiz-history',component:QuizhistoryComponent},
      {path:'notes-media', component: NotesMediaReportsComponent},
      {path:'student-details', component: StudentDetailsComponent},
      {path:'class-history', component: ClasseshistoryComponent},
      {path:'manage-courses2',component:ManageCoursePackagesandDetails2Component}
     
      
    ]
 }
 ];


 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
