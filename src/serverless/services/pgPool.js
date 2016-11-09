import config from 'config';
import { PgPool } from 'co-postgres-queries';

export default new PgPool({
    user: config.postgres.user,
    password: config.postgres.password,
    host: config.postgres.host,
    port: config.postgres.port,
    database: config.postgres.database,
});
