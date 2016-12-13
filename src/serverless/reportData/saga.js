import { call } from 'sg.js';
import smoker from '../services/smoker';

export default function* reportDataSaga({ phone }) {
    const user = yield call(smoker.get, phone);

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
