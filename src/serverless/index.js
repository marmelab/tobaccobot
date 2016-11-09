import config from 'config';
import { PgPool } from 'co-postgres-queries';

export default (event, context, callback) => {
    const pool = new PgPool({
        user: config.postgres.user,
        password: config.postgres.password,
        host: config.postgres.host,
        port: config.postgres.port,
        database: config.postgres.database,
    });
    pool.query({ sql: "SELECT 'hello world'" })
    .then((result) => {
        const response = {
            statusCode: 200,
            headers: {
                'x-custom-header': 'My Header Value',
            },
            body: JSON.stringify({ message: result }),
        };

        callback(null, response);
    });
};
