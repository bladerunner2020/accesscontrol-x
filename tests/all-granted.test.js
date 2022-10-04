const AccessControl = require('..');

describe('all/has granted tests', () => {
  it('has granted tests', () => {
    const ac = new AccessControl();

    ac.grant('admin').createAny('booking');

    ac.grant('user')
      .createOwn('venue')
      .createOwn('booking:desk')
      .createOwn('booking:meeting-room:zone1')
      .createOwn('booking:meeting-room:zone2');

    ac.grant('guest').createOwn('booking:meeting-room:zone1');

    expect(ac.can('admin').hasGranted('create:any', 'booking')).toBe(true);
    expect(ac.can('admin').hasGranted('create:any', 'booking:desk')).toBe(true);
    expect(ac.can('admin').hasGranted('create:any', 'booking:meeting-room')).toBe(true);
    expect(ac.can('admin').hasGranted('create:any', 'booking:meeting-room:zone1')).toBe(true);
    expect(ac.can('admin').hasGranted('create:any', 'booking:meeting-room:zone2')).toBe(true);

    expect(ac.can('admin').hasGranted('create:own', 'booking')).toBe(true);
    expect(ac.can('admin').hasGranted('create:own', 'booking:desk')).toBe(true);
    expect(ac.can('admin').hasGranted('create:own', 'booking:meeting-room')).toBe(true);
    expect(ac.can('admin').hasGranted('create:own', 'booking:meeting-room:zone1')).toBe(true);
    expect(ac.can('admin').hasGranted('create:own', 'booking:meeting-room:zone2')).toBe(true);

    expect(ac.can('user').hasGranted('create:any', 'booking')).toBe(false);
    expect(ac.can('user').hasGranted('create:any', 'booking:desk')).toBe(false);
    expect(ac.can('user').hasGranted('create:any', 'booking:meeting-room')).toBe(false);
    expect(ac.can('user').hasGranted('create:any', 'booking:meeting-room:zone1')).toBe(false);
    expect(ac.can('user').hasGranted('create:any', 'booking:meeting-room:zone2')).toBe(false);

    expect(ac.can('user').hasGranted('create:own', 'booking')).toBe(true);
    expect(ac.can('user').hasGranted('create:own', 'booking:desk')).toBe(true);
    expect(ac.can('user').hasGranted('create:own', 'booking:meeting-room')).toBe(true);
    expect(ac.can('user').hasGranted('create:own', 'booking:meeting-room:zone1')).toBe(true);
    expect(ac.can('user').hasGranted('create:own', 'booking:meeting-room:zone2')).toBe(true);

    expect(ac.can('guest').hasGranted('create:any', 'booking')).toBe(false);
    expect(ac.can('guest').hasGranted('create:any', 'booking:desk')).toBe(false);
    expect(ac.can('guest').hasGranted('create:any', 'booking:meeting-room')).toBe(false);
    expect(ac.can('guest').hasGranted('create:any', 'booking:meeting-room:zone1')).toBe(false);
    expect(ac.can('guest').hasGranted('create:any', 'booking:meeting-room:zone2')).toBe(false);

    expect(ac.can('guest').hasGranted('create:own', 'booking')).toBe(true);
    expect(ac.can('guest').hasGranted('create:own', 'booking:desk')).toBe(false);
    expect(ac.can('guest').hasGranted('create:own', 'booking:meeting-room')).toBe(true);
    expect(ac.can('guest').hasGranted('create:own', 'booking:meeting-room:zone1')).toBe(true);
    expect(ac.can('guest').hasGranted('create:own', 'booking:meeting-room:zone2')).toBe(false);
  });
});
