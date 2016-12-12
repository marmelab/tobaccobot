export default (smokers = []) =>
    smokers.filter(smoker =>
        (
            smoker.remainingDays === 21
            || smoker.remainingDays === 14
            || smoker.remainingDays === 7
        )
        && smoker.state !== 'stopped'
    );
