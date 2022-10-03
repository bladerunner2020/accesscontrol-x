/* eslint-disable no-console */
const AccessControl = require('..');

const ac = new AccessControl();

ac.grant('user')
  .createOwn('venue')
  .createOwn('booking:desk')
  .createOwn('booking:meeting-room:zone1')
  .createOwn('booking:meeting-room:zone2');

const access = ac.can('user');
const permission = access.createOwn('booking');

console.log(permission.granted);
console.log(permission.resource);
console.log(permission.roles);

const permissions = ac.can('user').allGranted('create:own', 'booking');
console.log(permissions);

const hasGranted = ac.can('user').hasGranted('create:own', 'booking:desk');
console.log(hasGranted);
