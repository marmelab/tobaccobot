export default function getWeeklyMessageData(users) {
    return users.reduce((result, user) => {
        const remainingWeeks = 4 - user.week;
        const oldTarget = user.targetConsumption[user.week - 1];
        const newTarget = user.targetConsumption[user.week];
        return {
            phones: [...result.phones, user.phone],
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
