import { DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, BehaviorSubject, Observable, merge, map } from 'rxjs';
import { NotificationService } from 'src/app/shared/notification.service';
import { TimesheetService } from '../timesheet.service';

@Component({
  selector: 'app-view-all-timesheet',
  templateUrl: './view-all-timesheet.component.html',
  styleUrls: ['./view-all-timesheet.component.scss']
})
export class ViewAllTimesheetComponent implements OnInit {
  displayedColumns = ['course_id', 'course_name', 'actions'];
  timeSheetDatabase: TimesheetService;
  dataSource: TimeSheetDataSource;
  index: number;
  id: number;

  constructor(public httpClient: HttpClient,public timesheetService: TimesheetService,public notificationService: NotificationService) { }
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit(): void {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }
  public refreshTable() {
    // Refreshing table using paginator
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  public loadData() {
    this.timeSheetDatabase = new TimesheetService(this.httpClient);
    this.dataSource = new TimeSheetDataSource(this.timeSheetDatabase, this.paginator, this.sort);
  }
}

export class TimeSheetDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

   filteredData: any[] = [];
  renderedData: any[] = [];

  constructor(public timesheetService: TimesheetService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    //this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.timesheetService.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this.timesheetService.getAllTimeSheets();


    return merge(...displayDataChanges).pipe(map( () => {
        //Filter data
        this.filteredData = this.timesheetService.data.slice().filter((timesheet: any) => {
          const searchStr = (timesheet.course_id + timesheet.course_name ? timesheet.course_name : '').toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        // Sort filtered data
        const sortedData = this.sortData(this.timesheetService.data.slice());

        // Grab the page's slice of the filtered sorted data.
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
        return this.renderedData;
      }
    ));
  }

  disconnect() {}


  /** Returns a sorted copy of the database data. */
  sortData(data: any[]): any[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'course_id': [propertyA, propertyB] = [a.course_id, b.course_id]; break;
        case 'course_name': [propertyA, propertyB] = [a.course_name, b.course_name]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
