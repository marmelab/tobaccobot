export const hasStoppedSmoking = user =>
    user.history.slice(-3).every(data => data.consumption === 0);

export default users =>
    users.reduce((result, user) => ({
        ...result,
        [hasStoppedSmoking(user) ? 'success' : 'failure']: [...result.success, user],
    }), {
        success: [],
        failure: [],
    });
