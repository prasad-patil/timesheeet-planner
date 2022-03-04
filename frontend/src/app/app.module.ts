import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { CoursesComponent } from './courses/courses.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { TeachersComponent } from './teachers/teachers.component';
import { CustomMaterialModule } from './material.module';
import { AddDialogComponent } from './courses/dialogs/add/add.dialog.component';
import { EditDialogComponent } from './courses/dialogs/edit/edit.dialog.component';
import { DeleteDialogComponent } from './courses/dialogs/delete/delete.dialog.component';
import { ToastrModule } from 'ngx-toastr';
import { AddSubjectDialogComponent } from './subjects/dialogs/add/add-subject.dialog.component';
import { EditSubjectDialogComponent } from './subjects/dialogs/edit/edit-subject.dialog.component';
import { DeleteSubjectDialogComponent } from './subjects/dialogs/delete/delete.dialog.component';
import { AddTeacherDialogComponent } from './teachers/dialogs/add/add-teacher.dialog.component';
import { EditTeacherDialogComponent } from './teachers/dialogs/edit/edit-teacher.dialog.component';
import { DeleteTeacherDialogComponent } from './teachers/dialogs/delete/delete-teacher.dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
    SubjectsComponent,
    TeachersComponent,
    AddDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent,
    AddSubjectDialogComponent,
    EditSubjectDialogComponent,
    DeleteSubjectDialogComponent,
    AddTeacherDialogComponent,
    EditTeacherDialogComponent,
    DeleteTeacherDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      closeButton: true
    }),
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CustomMaterialModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
