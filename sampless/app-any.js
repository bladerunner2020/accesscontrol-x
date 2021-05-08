/* eslint-disable no-console */
const AccessControl = require('..');

const ac = new AccessControl();

ac.grant('admin')
  .any('venue');

console.log('admin - venue - any:');
console.log(` => view: ${ac.can('admin').readAny('venue').granted}`);
console.log(` => create: ${ac.can('admin').createAny('venue').granted}`);
console.log(` => delete: ${ac.can('admin').deleteAny('venue').granted}`);
console.log(` => execute: ${ac.can('admin').updateAny('venue').granted}`);

console.log('');
console.log('admin - venue - own:');
console.log(` => view: ${ac.can('admin').readOwn('venue').granted}`);
console.log(` => create: ${ac.can('admin').createOwn('venue').granted}`);
console.log(` => delete: ${ac.can('admin').deleteOwn('venue').granted}`);
console.log(` => execute: ${ac.can('admin').updateOwn('venue').granted}`);
