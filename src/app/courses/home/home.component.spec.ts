import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';




describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let el: DebugElement;
  let coursesServices: any;

  const beginnersCourses = setupCourses().filter(course => course.category == 'BEGINNER');
  const advanceCourses = setupCourses().filter(course => course.category == 'ADVANCED');

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule
      ], providers: [
        {provide: CoursesService, useValue: coursesServiceSpy}
      ]
    }).compileComponents()
      .then(() => {
        fixture =  TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesServices = TestBed.inject(CoursesService);
      });
// we could use fakeasync and call here flushMicrotask(); to do the same as the waitforasync
  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });

  it("should display only beginner courses", () => {

    coursesServices.findAllCourses.and.returnValue(of(beginnersCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");

  });


  it("should display only advanced courses", () => {
    coursesServices.findAllCourses.and.returnValue(of(advanceCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");

  });


  it("should display both tabs", () => {

    coursesServices.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));

    expect(tabs.length).toBe(2, "Unexpected number of tabs found");

  });


  it("should display advanced courses when tab clicked", (done: DoneFn) => {

    coursesServices.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-mdc-tab"));

    //el.nativeElement.click();

    click(tabs[1]);

    fixture.detectChanges();

    setTimeout(() => {
      const cardTitles = el.queryAll(By.css(".mat-mdc-card-title"));

      expect(cardTitles.length).toBeGreaterThan(0, "Unexpected number of titles found");
      //expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");

      done();
    }, 800);

  });

  it("should display advanced courses when tab clicked - using fakeAsync", fakeAsync(() => {
    // writing the test using fakeasync
    coursesServices.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-mdc-tab"));

    //el.nativeElement.click();

    click(tabs[1]);

    fixture.detectChanges();

    flush();
    // we could use tick(1) since we now the call is to animation frame

    const cardTitles = el.queryAll(By.css(".mat-mdc-card-title"));

    expect(cardTitles.length).toBeGreaterThan(0, "Unexpected number of titles found");
    //expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");

  }));

  it("should display advanced courses when tab clicked - using waitForAsync", waitForAsync(() => {
    // writing the test using waitForAsync
    coursesServices.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-mdc-tab"));

    //el.nativeElement.click();

    click(tabs[1]);

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const cardTitles = el.queryAll(By.css(".mat-mdc-card-title"));

      expect(cardTitles.length).toBeGreaterThan(0, "Unexpected number of titles found");
      //expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");
    });
  }));

});


