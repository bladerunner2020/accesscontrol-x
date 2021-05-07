/* eslint-disable no-console */
const AccessControl = require('..');

AccessControl.registerAction('execute');
const ac = new AccessControl();

// Add all roles
ac.grant(['user', 'admin', 'superuser']);

ac.grant('superuser')
  .extend('user')
  .readAny('trigger')
  .executeAny('trigger');

ac.grant('admin')
  .extend('superuser')
  .createAny('trigger')
  .deleteAny('trigger');

console.log('User:');
console.log(` => view: ${ac.can('user').readAny('trigger').granted}`);
console.log(` => create: ${ac.can('user').createAny('trigger').granted}`);
console.log(` => delete: ${ac.can('user').deleteAny('trigger').granted}`);
console.log(` => execute: ${ac.can('user').executeAny('trigger').granted}`);

console.log('');
console.log('Superuser:');
console.log(` => view: ${ac.can('superuser').readAny('trigger').granted}`);
console.log(` => create: ${ac.can('superuser').createAny('trigger').granted}`);
console.log(` => delete: ${ac.can('superuser').deleteAny('trigger').granted}`);
console.log(` => execute: ${ac.can('superuser').executeAny('trigger').granted}`);

console.log('');
console.log('admin:');
console.log(` => view: ${ac.can('admin').readAny('trigger').granted}`);
console.log(` => create: ${ac.can('admin').createAny('trigger').granted}`);
console.log(` => delete: ${ac.can('admin').deleteAny('trigger').granted}`);
console.log(` => execute: ${ac.can('admin').executeAny('trigger').granted}`);
