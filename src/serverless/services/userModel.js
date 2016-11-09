import { crudQueries } from 'co-postgres-queries';

const tableName = 'smoker';

const fields = [
    'name',
    'tel',
];

const exposedFields = ['id'].concat(fields);

const smokerQueries = crudQueries(tableName, fields, ['id'], exposedFields);

export default smokerQueries;
