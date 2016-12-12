export default (smokers = []) =>
    smokers.filter(smoker =>
        smoker.remainingDays !== 21
        && smoker.remainingDays !== 14
        && smoker.remainingDays !== 7
        && smoker.remainingDays !== 0
        && smoker.state !== 'stopped'
    );
