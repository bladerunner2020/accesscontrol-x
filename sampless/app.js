/* eslint-disable no-console */
const AccessControl = require('..');

const ac = new AccessControl();

ac.grant('admin').createAny('booking');

ac.grant('user')
  .createOwn('venue')
  .createOwn('booking:desk')
  .createOwn('booking:meeting-room:zone1')
  .createOwn('booking:meeting-room:zone2');

ac.grant('guest').createOwn('booking:meeting-room:zone1');

// const access = ac.can('guest');
// const result = access.hasGranted('create:own', 'booking:desk');

const access = ac.can('user');
const result = access.hasGranted('create:own', 'booking');
console.log(result);

console.log(ac.can('admin').createAny('booking:desk').granted);
