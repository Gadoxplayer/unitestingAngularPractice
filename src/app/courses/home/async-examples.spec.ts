import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async testing examples", () => {
    
    it("Asynchronous test example with Jasmine done()", (done: DoneFn) => {
        // alternative uing done
        let test = false;
        setTimeout(() => {
            test = true;

            expect(test).toBeTruthy();
            //done is a callback to let the browser kwno when an async operation is done
            done();
        }, 1000);
    });

    it("Asynchronous test example with setTimeout()", fakeAsync(() => {
        // alternative using fakeasync
        //fakeAsync is the special zone that lets us test asynchronous code in a synchronous way. fakeAsync keeps tasks internally and gives APIs to decide when the task should be executed.
        let test = false;

        setTimeout(() => {
            test = true;
        }, 1000);
        // tick Simulates the asynchronous passage of time for the timers in the fakeAsync zone.
        tick(1000);
        expect(test).toBeTruthy();
    }));

    it("Asynchronous test example with multiple setTimeout()", fakeAsync(() => {
        // alternative using fakeasync
        let test = false;
        setTimeout(()=>{});
        setTimeout(() => {
            test = true;
        }, 1000);
        // flush Simulates the asynchronous passage of time for the timers in the fakeAsync zone by draining the macro-task queue until it is empty. macritask o taks such as settimeout, things like promises are micro tasks
        //Flushes any pending microtasks and simulates the asynchronous passage of time for the timers in the `fakeAsync` zone by draining the macro task queue until it is empty
        flush();
        expect(test).toBeTruthy();
    }));

    it("Asynchronous test example with - plain promise", fakeAsync(()=>{
        let test = false;
        console.log('initializing promise');
        
        // setTimeout(() => {
        //     console.log('first settimeout calllback triggered!');
        // });

        // setTimeout(() => {
        //     console.log('second settimeout calllback triggered!');
        // });

        Promise.resolve().then(() => {
            console.log('first prpmise resolve succesfuelly');
            
            test = true;

            return Promise.resolve();
        })
            .then(() => {
                console.log('second promise, resolvin then');
                
                // test = true;
            });

        flushMicrotasks();

        console.log('running asssertions');
        
        expect(test).toBeTruthy();
    }));

    it("Asynchronous test example with - promise + setTimeout", fakeAsync(()=>{
        let counter = 0;

        Promise.resolve()
            .then(() => {
                counter += 10;
                setTimeout(() => {
                    counter += 1;
                }, 1000);
            });

        expect(counter).toBe(0);

        flushMicrotasks();
        expect(counter).toBe(10);

        tick(500);
        expect(counter).toBe(10);

        tick(500);
        expect(counter).toBe(11);
    }));

    it("Asynchronous test example with - Observables", fakeAsync(() => {
        let test = false;
        console.log("create observable");

        const test$ = of(test).pipe(delay(1000));

        test$.subscribe(() => {
            test = true;
        });
        tick(1000);
        console.log("running test assertions");

        expect(test).toBe(true);        
    }));
});