import { DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, BehaviorSubject, Observable, merge, map } from 'rxjs';
import { Issue, Course } from './Courses.model';
import { CoursesService } from './courses.service';
import { AddDialogComponent } from './dialogs/add/add.dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.dialog.component';
import { EditDialogComponent } from './dialogs/edit/edit.dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  displayedColumns = ['course_id', 'course_name', 'course_year', 'course_sem', 'actions'];
  courseDatabase: CoursesService;
  dataSource: CourseDataSource;
  index: number;
  id: number;

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public CoursesService: CoursesService) {}

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('filter',  {static: true}) filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: {course: Course }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside CoursesService
        this.courseDatabase.dataChange.value.push(this.CoursesService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, course_id: number, course_name: string, course_year: string, course_sem: string) {
    this.id = course_id;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    console.log(this.index);
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {course_id, course_name, course_year, course_sem}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside CoursesService by id
        const foundIndex = this.courseDatabase.dataChange.value.findIndex(x => x.course_id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        this.courseDatabase.dataChange.value[foundIndex] = this.CoursesService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, course_id: number, course_name: string, course_year: string, course_sem: string) {
    this.index = i;
    this.id = course_id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {course_id, course_name, course_year, course_sem}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.courseDatabase.dataChange.value.findIndex(x => x.course_id === this.id);
        // for delete we use splice in order to remove single object from CoursesService
        this.courseDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }


  private refreshTable() {
    // Refreshing table using paginator
    this.paginator._changePageSize(this.paginator.pageSize);
  }



  public loadData() {
    this.courseDatabase = new CoursesService(this.httpClient);
    this.dataSource = new CourseDataSource(this.courseDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

}

export class CourseDataSource extends DataSource<Course> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Course[] = [];
  renderedData: Course[] = [];

  constructor(public coursesService: CoursesService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Course[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.coursesService.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this.coursesService.getAllCourses();


    return merge(...displayDataChanges).pipe(map( () => {
        // Filter data
        this.filteredData = this.coursesService.data.slice().filter((course: Course) => {
          const searchStr = (course.course_id + course.course_name + course.course_sem + course.course_year).toLowerCase();
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
  sortData(data: Course[]): Course[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'course_id': [propertyA, propertyB] = [a.course_id, b.course_id]; break;
        case 'course_name': [propertyA, propertyB] = [a.course_name, b.course_name]; break;
        case 'course_sem': [propertyA, propertyB] = [a.course_sem, b.course_sem]; break;
        case 'course_year': [propertyA, propertyB] = [a.course_year, b.course_year]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}