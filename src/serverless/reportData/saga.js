import { call } from 'sg.js';
import archive from '../services/archive';
import smoker from '../services/smoker';

export default function* reportDataSaga({ id, phone }) {
    let user;

    if (phone) {
        user = yield call(smoker.get, phone);
    } else if (id) {
        user = yield call(archive.get, id);
    }

    if (!user) {
        const error = new Error('Invalid identifier. Please use the link we sent you.');
        error.code = 'NotFound';
        throw error;
    }

    return {
        consumptionHistory: user.history.map(h => h.consumption),
        targetConsumptionHistory: Object.values(user.targetConsumption),
    };
}
