/* eslint-disable no-console */
const AccessControl = require('..');

const ac = new AccessControl();

ac.grantAny('admin', ['users', 'resources', 'bookings', 'bookings:vip']);
ac.grantAny('user', ['bookings:standard', 'bookings:all']);
ac.grantOwn('user', ['bookings:special', 'resources']);

const access = ac.can('user');

const result = access.getGroups('bookings', 'read');
console.log(JSON.stringify(result, undefined, 2));
