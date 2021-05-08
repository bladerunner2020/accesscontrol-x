/* eslint-disable no-console */
const AccessControl = require('..');

const ac = new AccessControl();

ac.grant('guest');
ac.grant('user').readAny('user', ['*', '!secret', '!profile.roles']);
ac.grant('admin').readAny('user');

console.log(ac.can('guest').readAny('user').filter({ secret: 1, name: 1, profile: { roles: 1, username: 1 } }));
console.log(ac.can('user').readAny('user').filter({ secret: 1, name: 1, profile: { roles: 1, username: 1 } }));
console.log(ac.can('admin').readAny('user').filter({ secret: 1, name: 1, profile: { roles: 1, username: 1 } }));

const permission = ac.can('user').readAny('user');

console.log(permission.check('profile.roles'));
console.log(permission.check('profile.fullname'));
