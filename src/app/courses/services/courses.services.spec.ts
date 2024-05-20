import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { COURSES } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe("CourseService", () => {
    let coursesServices: CoursesService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            //since in the unitest we are testing the service itself, we want an actual instance of the service, not a mock
            providers: [
                CoursesService
            ]
        });
        //instance of the service
        coursesServices = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);

    });

    it('should retrieve all courses', () => {
        coursesServices.findAllCourses()
            .subscribe(courses => {
                expect(courses).toBeTruthy('No courses were finded');
                expect(courses.length).toBe(12, 'Incorrect number of courses');

                const course = courses.find(course => course.id == 12);
                expect(course.titles.description).toBe("Angular Testing Course")
            });
        
        //with the testing controller we can validate some extra information about the recieved data
        const req = httpTestingController.expectOne('/api/courses');
        expect(req.request.method).toEqual("GET");
        req.flush({payload: Object.values(COURSES)});

        //we should verify that ony the http request made in the method epectOne are being made
        //httpTestingController.verify();
    });

    it('should find a course by its id', () => {
        coursesServices.findCourseById(12)
            .subscribe(courses => {
                expect(courses).toBeTruthy('No courses with that id were finded');
                expect(courses.id).toBe(12, 'Incorrect number of courses');
            });
        
        //with the testing controller we can validate some extra information about the recieved data
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual("GET");
        req.flush(COURSES[12]);

        //httpTestingController.verify();
    });

    it('should save the course data', () => {
        const changes: Partial<Course> = {titles: {description: 'Testing Course'}}
        coursesServices.saveCourse(12, changes)
            .subscribe(course => {
                expect(course.id).toBe(12);
            });

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toBe("PUT");
        expect(req.request.body.titles.description).toEqual(changes.titles.description);

        //simulates the response for the http requets
        req.flush(
            {
            ...COURSES[12],
            ...changes
            }
        );
    });

    it('should give an error if save course fails', () => {
        const changes: Partial<Course> = {titles: {description: 'Testing Course'}}
        coursesServices.saveCourse(12, changes)
            .subscribe(course =>
                fail('the save course operation should have failed'),
                (error: HttpErrorResponse) => {
                    expect(error.status).toBe(500);
                }
            );

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toBe("PUT");
        expect(req.request.body.titles.description).toEqual(changes.titles.description);

        //simulates the response for the http requets
        req.flush('error', {status: 500, statusText: 'Internal error for testing purpose'});
    });

    afterEach(() => {
        httpTestingController.verify();
    });
});