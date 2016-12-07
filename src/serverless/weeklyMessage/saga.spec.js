import expect from 'expect';
import { call } from 'sg.js';
import config from 'config';

import weeklyMessageSaga from './saga';
import smoker from '../services/smoker';
import newTargetSaga from './newTarget';
import endSaga from './end';

describe('weeklyMessageSaga', () => {
    let iterator;

    before(() => {
        iterator = weeklyMessageSaga();
    });

    it('should call smoker.all with config.batchSize', () => {
        const { value } = iterator.next();
        expect(value).toEqual(call(smoker.all, config.batchSize, undefined));
    });

    it('should call newTargetSaga with user returned by smoker.all', () => {
        const { value } = iterator.next({ items: 'users', lastKey: 'lastKey' });
        expect(value).toEqual([
            call(newTargetSaga, 'users'),
            call(endSaga, 'users'),
        ]);
    });

    it('should restart and call smoker.all with config.batchSize and lastKey that was returned by previous smoker.all', () => {
        const { value } = iterator.next();
        expect(value).toEqual(call(smoker.all, config.batchSize, 'lastKey'));
    });

    it('shoulod end if smoker.all returned no last Key', () => {
        const { done } = iterator.next({});
        expect(done).toBe(true);
    });
});
