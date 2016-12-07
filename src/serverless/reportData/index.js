import { call } from 'sg';
import smoker from '../services/smoker';

export default function* reportData({ phone, uuid }) {
    const user = yield call(smoker.get, phone);
    if (user.uuid !== uuid) {
        return {
            statusCode: 401,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: 'Unauthorized',
        };
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: user.history,
    };
}
