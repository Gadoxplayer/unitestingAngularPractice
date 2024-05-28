import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';




describe('CoursesCardListComponent', () => {

  // create the component to be use for each test
  let component: CoursesCardListComponent;

  // create a instance of the component to debug using the utility of fixure
  let fixure: ComponentFixture<CoursesCardListComponent>;

  // in order to validate an element from the dom we need to create an isntance of it with another utilty
  let element: DebugElement;

  beforeEach(waitForAsync(() => {
    // with cpurseModule we bring all the components and imports needed for the components to work, with this we can instanciate a component in our test
    TestBed.configureTestingModule({
      imports: [CoursesModule]
    })
      .compileComponents()
      .then(() => {
        fixure = TestBed.createComponent(CoursesCardListComponent);
        component = fixure.componentInstance;

        // we assign the fixure to the element to be able to query the dom
        element = fixure.debugElement;
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display the course list", () => {
    // this is not asychronous test, but we need to notify the component of the changes to update it synchrony


    // we are interacting with the component and giving the course variable the value intended for the test, we use the setupcourses method that returns an array of courses ordered by seq number
    component.courses = setupCourses();

    // after setting the variable, we need to inform the component of the changes
    fixure.detectChanges();

    //console.log(element.nativeElement.outerHTML);

    const cardslist = element.queryAll(By.css(".course-card"));
    expect(cardslist).toBeTruthy("Could not find cards");
    expect(cardslist.length).toBe(12, "unexpected number of courses");
  });


  it("should display the first course", () => {
    component.courses = setupCourses();
    fixure.detectChanges();

    const singleCourse = component.courses[0];

    const card = element.query(By.css(".course-card:first-child"));
    const title = element.query(By.css("mat-card-title"));
    const image = element.query(By.css("img"));

    expect(card).toBeTruthy("Could not find first card");
    expect(title.nativeElement.textContent).toBe(singleCourse.titles.description);
    expect(image.nativeElement.src).toBe(singleCourse.iconUrl);
     
  });


});


