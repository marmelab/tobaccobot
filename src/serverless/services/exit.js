import { serverlessEnv } from 'config';

export default (code) => {
    if (serverlessEnv === 'dev-server') {
        return;
    }
    setTimeout(() => {
        process.exit(code);
    }, 3000);
};
