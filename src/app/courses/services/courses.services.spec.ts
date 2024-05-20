import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
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
        
        //with the testing controller we can validate some extra information about the recieved data with a mock http request
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

    it('should fin d a list of lessons', () => {
        coursesServices.findLessons(12)
            .subscribe(lessons => {
                expect(lessons).toBeTruthy();
                expect(lessons.length).toBe(3);
            });
        
        const req = httpTestingController.expectOne(req => req.url == '/api/lessons');

        expect(req.request.method).toEqual("GET");

        expect(req.request.params.get("courseId")).toEqual("12");
        expect(req.request.params.get("filter")).toEqual("");
        expect(req.request.params.get("sortOrder")).toEqual("asc");
        expect(req.request.params.get("pageNumber")).toEqual("0");
        expect(req.request.params.get("pageSize")).toEqual("3");

        req.flush({
            payload: findLessonsForCourse(12).slice(0, 3)
        });
    })

    afterEach(() => {
        httpTestingController.verify();
    });
});

// HttpTestingController
// CLASS
// Controller to be injected into tests, that allows for mocking and flushing of requests.

// HttpTestingController.expectOne()
// code
// Expect that a single request has been made which matches the given URL, and return its mock.

// HttpTestingController.verify()
// code
// Verify that no unmatched requests are outstanding.

// flush()
// provides responses by "flushing" each expected request.