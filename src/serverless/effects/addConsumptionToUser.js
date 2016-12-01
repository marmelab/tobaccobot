export default (user, consumption) => {
    const state = consumption <= user.targetConsumption[user.week] ? 'good' : 'bad';
    const history = (user.history || [])
    .concat({
        day: 28 - user.remainingDays,
        week: user.week,
        consumption,
        state,
    });

    return {
        ...user,
        remainingDays: user.remainingDays - 1,
        history,
        state,
    };
};
