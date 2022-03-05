import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from 'src/app/courses/courses.service';
import { GenerateTimeSheetService } from '../generate-timesheet/generate-timesheet.service';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-view-timesheet',
  templateUrl: './view-timesheet.component.html',
  styleUrls: ['./view-timesheet.component.scss']
})
export class ViewTimesheetComponent implements OnInit {

  timeSheetData: any;
  courseDetails: any;
  courseId: number;
  timings: any;
  pdfDownloadInProgress = false;
  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;
  constructor(private generateTimeSheetService: GenerateTimeSheetService, private courseService: CoursesService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.timings = [];
    this.route.params.subscribe((params: any)=>{
      if (params.id) {
        this.courseService.getCourseById(+params.id).subscribe((course)=>{
          this.courseDetails = course;
          console.log(course)
        })
      }
    });
    this.timeSheetData = this.generateTimeSheetService.timetableData;
    this.getSlotTimngs();
  }

  getSlotTimngs() {
    const slots = this.timeSheetData[0];
    for (const key in slots) {
      if (Object.prototype.hasOwnProperty.call(slots, key) && key.indexOf('slot') > -1) {
        const element = slots[key];
        this.timings.push(element.slot_timing)
      }
    }
  }

  public downloadAsPDF() {
    const doc = new jsPDF();

    this.pdfTable.nativeElement.style.maxWidth = '250px'
    const element = this.pdfTable.nativeElement;
    this.pdfDownloadInProgress = true;

    html2canvas(element, {
      scale: 4,
      height: 800
    }).then(canvas => {
      this.pdfDownloadInProgress = false;
      setTimeout(() => {
        this.pdfTable.nativeElement.removeAttribute('style');
        const contentDataURL = canvas.toDataURL('image/png');
        var doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Timetable", 20, 20);
        doc.addImage(contentDataURL, "JPEG", 15, 40, 180, 180);
        doc.save('timetable.pdf');
        doc.internal.scaleFactor = 1.55;
      }, 0);

  });

    // const specialElementHandlers = {
    //   '#editor': function () {
    //     return true;
    //   }
    // };

    // const pdfTable = this.pdfTable.nativeElement;


    // doc.fromHTML(pdfTable.innerHTML, 15, 15, {
    //   width: 190,
    //   'elementHandlers': specialElementHandlers
    // });

    // doc.save('tableToPdf.pdf');
  }

}
