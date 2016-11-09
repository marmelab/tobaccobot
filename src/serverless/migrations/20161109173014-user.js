'use strict';

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.up = function (db, callback) {
    db.createTable('smoker', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        name: { type: 'string' },
        phone: { type: 'int' },
    }, callback);
};

exports.down = function (db, callback) {
    db.dropTable('smoker', callback);
};
