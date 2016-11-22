import smoker from '../services/smoker';

export default async function (userData) {
    const smokerData = {
        ...userData,
        state: 'subscribed',
    };

    smoker.check(smokerData);
    await smoker.save(smokerData);
    return smoker.get(smokerData.phone);
}
