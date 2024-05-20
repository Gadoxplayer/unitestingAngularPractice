import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

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
        
    });
});