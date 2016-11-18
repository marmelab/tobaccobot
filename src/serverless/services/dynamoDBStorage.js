import smoker from './smoker';

export default {
    users: {
        ...smoker,
    },
    teams: {
        get: () => null,
        save: () => null,
        delete: () => null,
        all: () => null,
    },
    channels: {
        get: () => null,
        save: () => null,
        delete: () => null,
        all: () => null,
    },
};
