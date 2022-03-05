import { DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Observable, merge, map, fromEvent } from 'rxjs';
import { NotificationService } from '../shared/notification.service';
import { Teacher } from './teacher.model';
import { TeachersService } from './teacher.service';
import { MatDialog } from '@angular/material/dialog';
import { SubjectsService } from '../subjects/subjects.service';
import { AddTeacherDialogComponent } from './dialogs/add/add-teacher.dialog.component';
import { EditTeacherDialogComponent } from './dialogs/edit/edit-teacher.dialog.component';
import { Subject } from '../subjects/subject.models';
import { DeleteSubjectDialogComponent } from '../subjects/dialogs/delete/delete-subject.dialog.component';
import { DeleteTeacherDialogComponent } from './dialogs/delete/delete-teacher.dialog.component';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {

  displayedColumns = ['teacher_id', 'firstname', 'lastname', 'subject_name', 'course_name', 'actions'];
  teacherDatabase: TeachersService;
  dataSource: TeacherDataSource;
  index: number;
  id: number;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('filter',  {static: true}) filter: ElementRef;

  constructor(
     public dialog: MatDialog,
     private http: HttpClient,
     private notificationService: NotificationService,
     private teacherService: TeachersService,
     private subjectService: SubjectsService) { }

  ngOnInit(): void {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  private refreshTable() {
    // Refreshing table using paginator
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  public loadData() {
    this.teacherDatabase = new TeachersService(this.http, this.subjectService);
    this.dataSource = new TeacherDataSource(this.teacherDatabase, this.paginator, this.subjectService, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  addNew() {
    const dialogRef = this.dialog.open(AddTeacherDialogComponent, {
      data: {teacher: Teacher }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside CoursesService
        this.notificationService.showSuccess('Teacher has been added successfully!')
        this.teacherDatabase.dataChange.value.push(this.teacherService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, teacher_id: number, firstname: string, lastname: string, subject: Subject) {
    this.id = teacher_id;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    console.log(this.index);
    const dialogRef = this.dialog.open(EditTeacherDialogComponent, {
      data: {teacher_id, firstname, lastname,  subject_id: subject?.subject_id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.notificationService.showSuccess('Course has been updated successfully!');
        // When using an edit things are little different, firstly we find record inside CoursesService by id
        const foundIndex = this.teacherDatabase.dataChange.value.findIndex(x => x.teacher_id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        this.teacherDatabase.dataChange.value[foundIndex] = this.teacherService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, teacher_id: number, firstname: string, lastname: string, subject: Subject) {
    this.index = i;
    this.id = teacher_id;
    const dialogRef = this.dialog.open(DeleteTeacherDialogComponent, {
      data: {teacher_id, firstname, lastname,  subject}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.notificationService.showSuccess('Teacher has been deleted successfully!');
        const foundIndex = this.teacherDatabase.dataChange.value.findIndex(x => x.teacher_id === this.id);
        this.teacherDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }
}

export class TeacherDataSource extends DataSource<Teacher> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Teacher[] = [];
  renderedData: Teacher[] = [];

  constructor(public teacherService: TeachersService,
              public _paginator: MatPaginator,
              private subjectService: SubjectsService,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Teacher[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.teacherService.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this.teacherService.getTeachers();
    this.subjectService.getSubjects();


    return merge(...displayDataChanges).pipe(map( () => {
        // Filter data
        this.filteredData = this.teacherService.data.slice().filter((teacher: Teacher) => {
          const searchStr = (teacher.firstname + teacher.lastname + teacher.subject?.name + teacher.subject?.course.course_name).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());

        // Grab the page's slice of the filtered sorted data.
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
        return this.renderedData;
      }
    ));
  }

  disconnect() {}


  /** Returns a sorted copy of the database data. */
  sortData(data: Teacher[]): Teacher[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'teacher_id': [propertyA, propertyB] = [a.teacher_id, b.teacher_id]; break;
        case 'firstname': [propertyA, propertyB] = [a.firstname, b.firstname]; break;
        case 'lastname': [propertyA, propertyB] = [a.lastname, b.lastname]; break;
        case 'subject_name': [propertyA, propertyB] = [a.subject ? a.subject?.name : '', b.subject ? b.subject.name : '']; break;
        case 'course_name': [propertyA, propertyB] = [a.subject ? a.subject?.course.course_name : '', b.subject ? b.subject?.course.course_name : '']; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
