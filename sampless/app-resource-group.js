/* eslint-disable no-console */
const AccessControl = require('..');

const ac = new AccessControl();

ac.grant('user')
  .readAny('booking:meeting-room')
  .createOwn('booking:meeting-room:zone1')
  .updateOwn('booking:meeting-room:zone1')
  .deleteOwn('booking:meeting-room:zone1');

ac.grant('superuser')
  .readAny('booking')
  .createAny('booking:meeting-room')
  .updateAny('booking:meeting-room')
  .deleteAny('booking:meeting-room');

ac.grant('admin')
  .readAny('booking')
  .createAny('booking')
  .updateAny('booking')
  .deleteAny('booking');

console.log('user:');
console.log(` => view any: ${ac.can('user').readAny('booking').granted}`);
console.log(` => view any meeting-room: ${ac.can('user').readAny('booking:meeting-room').granted}`);
console.log(` => create meeting-room: ${ac.can('user').createAny('booking:meeting-room').granted}`);
console.log(` => create own zone1: ${ac.can('user').createOwn('booking:meeting-room:zone1').granted}`);
console.log(` => create any zone1: ${ac.can('user').createAny('booking:meeting-room:zone1').granted}`);

console.log('');
console.log('superuser:');
console.log(` => view any: ${ac.can('superuser').readAny('booking').granted}`);
console.log(` => view any meeting-room: ${ac.can('superuser').readAny('booking:meeting-room').granted}`);
console.log(` => create meeting-room: ${ac.can('superuser').createAny('booking:meeting-room').granted}`);
console.log(` => create own zone1: ${ac.can('superuser').createOwn('booking:meeting-room:zone1').granted}`);
console.log(` => create any zone1: ${ac.can('superuser').createAny('booking:meeting-room:zone1').granted}`);
console.log(` => deleate any: ${ac.can('superuser').deleteAny('booking').granted}`);
console.log(` => deleate any meeting-room: ${ac.can('superuser').deleteAny('booking:meeting-room').granted}`);
console.log(` => deleate any zone1: ${ac.can('superuser').deleteAny('booking:meeting-room:zone1').granted}`);

console.log('');
console.log('admin:');
console.log(` => view any: ${ac.can('admin').readAny('booking').granted}`);
console.log(` => view any meeting-room: ${ac.can('admin').readAny('booking:meeting-room').granted}`);
console.log(` => create meeting-room: ${ac.can('admin').createAny('booking:meeting-room').granted}`);
console.log(` => create own zone1: ${ac.can('admin').createOwn('booking:meeting-room:zone1').granted}`);
console.log(` => create any zone1: ${ac.can('admin').createAny('booking:meeting-room:zone1').granted}`);
console.log(` => deleate any: ${ac.can('admin').deleteAny('booking').granted}`);
console.log(` => deleate any meeting-room: ${ac.can('admin').deleteAny('booking:meeting-room').granted}`);
console.log(` => deleate any zone1: ${ac.can('admin').deleteAny('booking:meeting-room:zone1').granted}`);

console.log('user (check many resources)');

console.log(` => view any meeting-room: ${ac.can('user')
  .updateOwn(['booking:meeting-room:zone2', 'booking:meeting-room:zone1']).granted}`);
