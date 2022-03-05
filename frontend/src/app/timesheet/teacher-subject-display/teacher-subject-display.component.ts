import { DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, BehaviorSubject, Observable, merge, map } from 'rxjs';
import { NotificationService } from 'src/app/shared/notification.service';
import { SubjectTeacherDataService } from './subject-teacher-data.service';
import { SubjectTeacher } from './subject-teacher.model';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { CoursesService } from 'src/app/courses/courses.service';
import { Course } from 'src/app/courses/Courses.model';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-teacher-subject-display',
  templateUrl: './teacher-subject-display.component.html',
  styleUrls: ['./teacher-subject-display.component.scss']
})
export class TeacherSubjectDisplayComponent implements OnInit {
  displayedColumns = ['subject_name', 'teacher_name', 'hours'];
  subjectTeacherDatabase: SubjectTeacherDataService;
  dataSource: SubjectTeacherDataSource;
  index: number;
  id: number;

  constructor(private httpClient: HttpClient, public teacherSubjectService: SubjectTeacherDataService, public notifcationService: NotificationService, private courseService: CoursesService) { }
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('filter',  {static: true}) filter: ElementRef;

  selectedCourseId: number;

  courses: Course[]


  ngOnInit(): void {
    this.courseService.getCoursesFromDB().subscribe((courses: Course[])=>{
      this.courses = courses;
    });
  }

  public loadData(course_id: number) {
    this.subjectTeacherDatabase = new SubjectTeacherDataService(this.httpClient);
    this.dataSource = new SubjectTeacherDataSource(this.subjectTeacherDatabase, this.paginator, this.sort, course_id);
    fromEvent(this.filter.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  onCourseSelected() {
    this.loadData(this.selectedCourseId);
  }

}

export class SubjectTeacherDataSource extends DataSource<SubjectTeacher> {
  _filterChange = new BehaviorSubject('');
  course_id: number;


  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: SubjectTeacher[] = [];
  renderedData: SubjectTeacher[] = [];

  constructor(public subjectTeacherService: SubjectTeacherDataService,
              public _paginator: MatPaginator,
              public _sort: MatSort,
              course_id: number) {
    super();
    this.course_id = course_id;
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<SubjectTeacher[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.subjectTeacherService.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this.subjectTeacherService.getSubjectTeacher(this.course_id);


    return merge(...displayDataChanges).pipe(map( () => {
        // Filter data
        this.filteredData = this.subjectTeacherService.data.slice().filter((subjectTeacher: SubjectTeacher) => {
          const searchStr = (subjectTeacher.name + subjectTeacher.teacher?.firstname + subjectTeacher.teacher?.lastname).toLowerCase();
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
  sortData(data: SubjectTeacher[]): SubjectTeacher[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'subject_name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'teacher_name': [propertyA, propertyB] = [a.teacher ? a.teacher?.firstname : '', b.teacher ? b.teacher.firstname : '']; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
