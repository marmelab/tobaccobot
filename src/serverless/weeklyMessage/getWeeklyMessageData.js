export default function getWeeklyMessageData(users) {
    return users.reduce((result, { week, targetConsumption, phone }) => {
        const remainingWeeks = 4 - week;
        const oldTarget = targetConsumption[week - 1];
        const newTarget = targetConsumption[week];
        return {
            phones: [...result.phones, phone],
            remainingWeeks: [...result.remainingWeeks, remainingWeeks],
            oldTarget: [...result.oldTarget, oldTarget],
            newTarget: [...result.newTarget, newTarget],
        };
    }, {
        phones: [],
        remainingWeeks: [],
        oldTarget: [],
        newTarget: [],
    });
}
