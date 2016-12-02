export default function getWeeklyMessageData(users) {
    return users.reduce((result, user) => {
        const remainingWeeks = user.week - 4;
        const oldTarget = user.targetConsumption[user.week];
        const newTarget = user.targetConsumption[user.week + 1];
        return {
            phone: [...result.phone, user.phone],
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
