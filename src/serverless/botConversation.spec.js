import expect from 'expect';

import dynamoDB from './services/dynamoDB';
import botConversation from './botConversation';
import { setupSmokerTable } from './setupSmokerTable';


describe('botConversation', () => {
    describe('botConversation lambda', () => {
        before(function* () {
            yield setupSmokerTable();
        });

        it('should return 200 with valid number of cigarettes', (done) => {
            botConversation({ message: '42', number: '+33614786356' }, null, (error, result) => {
                expect(result).toBe('');
                done(error);
            });
        });

        it('should return 200 with invalid number of cigarettes', (done) => {
            botConversation({ message: 'foo', number: '+33614786356' }, null, (error, result) => {
                expect(result).toBe('');
                done(error);
            });
        });

        after(function* () {
            yield dynamoDB.deleteTable({
                TableName: 'smoker',
            });
        });
    });
});
