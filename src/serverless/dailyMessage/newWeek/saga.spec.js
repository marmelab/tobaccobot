import expect from 'expect';
import { call } from 'sg.js';

import weeklyMessageSaga from './saga';
import newTargetSaga from './newTarget';
import endSaga from './end';

describe('weeklyMessageSaga', () => {
    let iterator;

    before(() => {
        iterator = weeklyMessageSaga('users');
    });

    it('should call newTargetSaga with user returned by smoker.all', () => {
        const { value } = iterator.next();
        expect(value).toEqual([
            call(newTargetSaga, 'users'),
            call(endSaga, 'users'),
        ]);
    });
});
