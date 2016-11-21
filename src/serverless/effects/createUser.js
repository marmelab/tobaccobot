import smoker from '../services/smoker';

export default function (userData) {
    const smokerData = {
        ...userData,
        state: 'subscribed',
    };

    smoker.check(smokerData);
    return smoker.save(smokerData);
}
