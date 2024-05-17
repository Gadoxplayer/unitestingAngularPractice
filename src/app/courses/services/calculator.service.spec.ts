import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";


describe('calculator service', () => {

    it('should add two numbers', () => {
// 1. should create an instance of the service, preparing the services we are going to use
        const calculatorSer = new CalculatorService(new LoggerService());
// 2. should create the variable related to the test, this is the execution phase were we trigger the operation that we want to test
        const result = calculatorSer.add(2,2);
// 3. should write the test assertion, will fail o pass depending of what we are evaluating
        expect(result).toBe(4);
    });

    it('should subtract two numbers', () => {
        const calculatorSer = new CalculatorService(new LoggerService());
        const result = calculatorSer.subtract(2,2);
        expect(result).toBe(0);
    });

    it('should add two numbers using a jasmin spy in order to keep track of the number of calls to a service', () => {
        // the prefered way of creating instances of dependencies of the service unitested is creating mocks of this dependencis, thus it will only fail due to problems in the service, not the dependencies
            const logger = new LoggerService();
            spyOn(logger, 'log');
            const calculatorSer = new CalculatorService(logger);
            const result = calculatorSer.add(2,2);
            expect(result).toBe(4);
            expect(logger.log).toHaveBeenCalledTimes(1);
        });

        it('should add two numbers using a mock of the dependencies of the service thats being evaluated', () => {
            const logger = jasmine.createSpyObj('LoggerService', ['log']);
            //the method being mocked in the logger spy service doesnt return any values, but if it would, one can mock that return like so:
            // logger.log.and.returnValue('sometihng');
            const calculatorSer = new CalculatorService(logger);
            const result = calculatorSer.add(2,2);
            expect(result).toBe(4);
            expect(logger.log).toHaveBeenCalledTimes(1);
        });
});