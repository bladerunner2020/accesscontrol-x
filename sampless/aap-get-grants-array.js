/* eslint-disable no-console */
const AccessControl = require('..');

AccessControl.registerAction('execute');
const ac = new AccessControl();

ac.grant('guest');

ac.grant('system')
  .readAny('all');

ac.grant('user')
  .readOwn('profile')
  .readAny('users', ['*', '!profile.secret']);

ac.grant('superuser')
  .extend('user')
  .createOwn('article')
  .readAny('trigger')
  .executeAny('trigger');

ac.grant('admin')
  .extend(['superuser', 'system'])
  .createAny('trigger')
  .deleteAny('trigger');

// console.log(JSON.stringify(ac.getGrantsAsArray('admin'), undefined, 2));
console.log(JSON.stringify(ac.getGrantsAsArray(), undefined, 2));

// console.log(JSON.stringify(ac.getGrantsAsArray('system'), undefined, 2));
