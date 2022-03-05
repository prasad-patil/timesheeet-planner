import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { TeachersComponent } from './teachers/teachers.component';
import { GenerateTimesheetComponent } from './timesheet/generate-timesheet/generate-timesheet.component';

const routes: Routes = [
  {
    path: 'courses',
    component: CoursesComponent
  },
  {
    path: 'subjects',
    component: SubjectsComponent
  },
  {
    path: 'teachers',
    component: TeachersComponent
  },
  {
    path: 'generate',
    component: GenerateTimesheetComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
