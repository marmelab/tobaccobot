import config from 'config';

export default function getWeeklyMessageData(users) {
    return users.reduce((result, { week, targetConsumption, phone }) => {
        const remainingWeeks = 4 - week;
        const oldTarget = targetConsumption[week];
        const newTarget = targetConsumption[week + 1];
        const reportLink = `${config.reportLink}/?phone=${encodeURIComponent(phone)}`;
        return {
            newTarget: [...result.newTarget, newTarget],
            oldTarget: [...result.oldTarget, oldTarget],
            phones: [...result.phones, phone],
            remainingWeeks: [...result.remainingWeeks, remainingWeeks],
            reportLink: [...result.reportLink, reportLink],
        };
    }, {
        phones: [],
        remainingWeeks: [],
        oldTarget: [],
        newTarget: [],
        reportLink: [],
    });
}
