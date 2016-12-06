export default (user, consumption) => {
    const { targetConsumption, week, history = [], remainingDays } = user;
    const state = consumption <= targetConsumption[week] ? 'good' : 'bad';
    const newHistory = history
    .concat({
        day: 28 - remainingDays,
        week,
        consumption,
        state,
    });

    return {
        ...user,
        remainingDays: remainingDays - 1,
        history: newHistory,
        state,
    };
};
