export const hasStoppedSmoking = (user) => {
    if (!user || !user.history || user.history.length < 3) {
        return false;
    }
    return user.history.slice(-3).every(data => data.consumption === 0);
};

export const sortUserBySuccessFactory = hasStopped => users =>
    users.reduce((result, user) => {
        if (hasStopped(user)) {
            return {
                ...result,
                success: [...result.success, user],
            };
        }
        return {
            ...result,
            failure: [...result.failure, user],
        };
    }, {
        success: [],
        failure: [],
    });


export default sortUserBySuccessFactory(hasStoppedSmoking);
