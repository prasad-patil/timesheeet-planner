import { DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, fromEvent, map, merge, Observable } from 'rxjs';
import { Course } from '../courses/Courses.model';
import { NotificationService } from '../shared/notification.service';
import { AddSubjectDialogComponent } from './dialogs/add/add-subject.dialog.component';
import { DeleteSubjectDialogComponent } from './dialogs/delete/delete.dialog.component';
import { EditSubjectDialogComponent } from './dialogs/edit/edit-subject.dialog.component';
import { Subject } from './subject.models';
import { SubjectsService } from './subjects.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {

  displayedColumns = ['subject_id', 'name', 'course_name', 'course_year', 'course_sem', 'actions'];
  subjectDatabase: SubjectsService;
  dataSource: SubjectDataSourse;
  index: number;
  id: number;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('filter',  {static: true}) filter: ElementRef;

  constructor(public dialog: MatDialog, private http: HttpClient, private notificationService: NotificationService, private subjectService: SubjectsService) { }

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
    this.subjectDatabase = new SubjectsService(this.http);
    this.dataSource = new SubjectDataSourse(this.subjectDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  addNew() {
    const dialogRef = this.dialog.open(AddSubjectDialogComponent, {
      data: {subject: Subject }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside CoursesService
        this.notificationService.showSuccess('Course has been added successfully!')
        this.subjectDatabase.dataChange.value.push(this.subjectService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, subject_id: number, name: string, course: Course) {
    this.id = subject_id;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    console.log(this.index);
    const dialogRef = this.dialog.open(EditSubjectDialogComponent, {
      data: {subject_id, name, course_id: course.course_id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.notificationService.showSuccess('Course has been updated successfully!');
        // When using an edit things are little different, firstly we find record inside CoursesService by id
        const foundIndex = this.subjectDatabase.dataChange.value.findIndex(x => x.subject_id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        this.subjectDatabase.dataChange.value[foundIndex] = this.subjectService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, subject_id: number, name: string, course: Course) {
    this.index = i;
    this.id = subject_id;
    const dialogRef = this.dialog.open(DeleteSubjectDialogComponent, {
      data: {subject_id, name, course}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.notificationService.showSuccess('Subject has been deleted successfully!');
        const foundIndex = this.subjectDatabase.dataChange.value.findIndex(x => x.subject_id === this.id);
        this.subjectDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }
}

export class SubjectDataSourse extends DataSource<Subject> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Subject[] = [];
  renderedData: Subject[] = [];

  constructor(public subjectsService: SubjectsService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Subject[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.subjectsService.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this.subjectsService.getSubjects();


    return merge(...displayDataChanges).pipe(map( () => {
        // Filter data
        this.filteredData = this.subjectsService.data.slice().filter((subject: Subject) => {
          const searchStr = (subject.subject_id + subject.name + subject.course.course_name + subject.course.course_sem + subject.course.course_year).toLowerCase();
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
  sortData(data: Subject[]): Subject[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'subject_id': [propertyA, propertyB] = [a.subject_id, b.subject_id]; break;
        case 'subject_name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'course_name': [propertyA, propertyB] = [a.course.course_name, b.course.course_name]; break;
        case 'course_sem': [propertyA, propertyB] = [a.course.course_sem, b.course.course_sem]; break;
        case 'course_year': [propertyA, propertyB] = [a.course.course_year, b.course.course_year]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
