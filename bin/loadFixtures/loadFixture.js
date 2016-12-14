import archive from '../../src/serverless/services/archive';
import smoker from '../../src/serverless/services/smoker';

const targetConsumption = {
    1: 33,
    2: 22,
    3: 11,
    4: 0,
};

const user = {
    name: 'john',
    phone: '+33123456789',
    history: [
        40,
        30, 38, 36, 34, 34, 32, 30,
        28, 26, 24, 22, 20, 22, 20,
        18, 16, 16, 14, 12, 8, 10,
        8, 6, 4, 2, 0, 0, 0,
    ].map((consumption, day) => {
        const week = (((day - 1) - ((day - 1) % 7)) / 7) + 1;
        const target = targetConsumption[week];
        return {
            consumption,
            day,
            week,
            state: consumption <= target ? 'good' : 'bad',
        };
    }),
    targetConsumption,
    week: 4,
    state: 'good',
    uuid: 'uuid',
};

const archived = {
    name: 'dude',
    id: '73b4cbdb-75a4-4345-b6b3-f4ae08456b7a',
    history: [
        40,
        30, 38, 36, 34, 34, 32, 30,
        28, 26, 24, 22, 20, 22, 20,
        18, 16, 16, 14, 12, 8, 10,
        8, 6, 4, 2, 0, 0, 0,
    ].map((consumption, day) => {
        const week = (((day - 1) - ((day - 1) % 7)) / 7) + 1;
        const target = targetConsumption[week];
        return {
            consumption,
            day,
            week,
            state: consumption <= target ? 'good' : 'bad',
        };
    }),
    targetConsumption,
    week: 4,
    state: 'good',
    uuid: 'uuid',
};

Promise.all([
    smoker.save(user),
    archive.save(archived),
])
.then(() => {
    console.log('done');
    process.exit(0);
})
.catch((error) => {
    console.error(error);
    process.exit(1);
});
