import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { ClassroomComponent } from './pages/live-classes/classroom/classroom.component';

const routes: Routes = [

    { path: 'login', component: AdminLayoutComponent },
    {
       path: 'classroom',
       component: ClassroomComponent
     },
 {
   path: 'home',
   component: AdminLayoutComponent,
   children: [
     {
       path: 'live-classes',
       loadChildren: () => import('./pages/live-classes/live-classes.module')
         .then(m => m.LiveClassesModule)
     },
      
    ]
 }
 ];


 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
