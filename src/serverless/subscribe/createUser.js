import uuid from 'uuid/v4';
import smoker from '../services/smoker';

export default async function (userData) {
    const smokerData = {
        ...userData,
        state: 'subscribed',
    };

    smoker.check(smokerData);
    await smoker.save({
        ...smokerData,
        uuid: uuid(),
    });
    return smoker.get(smokerData.phone);
}
