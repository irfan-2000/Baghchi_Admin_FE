import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveClassesComponent } from './live-classes/live-classes.component';

const routes: Routes = [{ path: '', component: LiveClassesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveClassesRoutingModule { }
