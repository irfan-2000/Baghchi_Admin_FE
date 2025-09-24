import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { ClassroomComponent } from './pages/live-classes/classroom/classroom.component';
import { CreateQuizComponent } from './pages/create-quiz/create-quiz.component';
import { ManageClassBoardSubjectsComponent } from './manage-class-board-subjects/manage-class-board-subjects.component';

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
 
     
      
    ]
 }
 ];


 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
