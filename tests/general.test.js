const AccessControl = require('..');

describe('AccessControl tests', () => {
  it('get grants as array', () => {
    const ac = new AccessControl();
    expect(ac.getGrantsAsArray).toBeDefined();

    ac.grant('guest');
    ac.grant('system').readAny('system');
    ac.grant('user').readOwn('profile');
    ac.grant('superuser').extend('user').createOwn('article');

    const res = ac.getGrantsAsArray();
    expect(res.length).toBe(4);
  });

  it('grantAny (resources as string)', () => {
    const ac = new AccessControl();
    expect(ac.grantAny).toBeDefined();

    ac.grantAny('admin', 'venue');
    expect(ac.can('admin').readAny('venue').granted).toBe(true);
    expect(ac.can('admin').createAny('venue').granted).toBe(true);
    expect(ac.can('admin').deleteAny('venue').granted).toBe(true);
    expect(ac.can('admin').updateAny('venue').granted).toBe(true);

    expect(ac.can('admin').readOwn('venue').granted).toBe(true);
    expect(ac.can('admin').createOwn('venue').granted).toBe(true);
    expect(ac.can('admin').deleteOwn('venue').granted).toBe(true);
    expect(ac.can('admin').updateOwn('venue').granted).toBe(true);
  });

  it('grantAny (resources as array)', () => {
    const ac = new AccessControl();
    expect(ac.grantAny).toBeDefined();

    ac.grantAny('admin', ['user', 'venue']);
    expect(ac.can('admin').readAny('venue').granted).toBe(true);
    expect(ac.can('admin').createAny('venue').granted).toBe(true);
    expect(ac.can('admin').deleteAny('venue').granted).toBe(true);
    expect(ac.can('admin').updateAny('venue').granted).toBe(true);

    expect(ac.can('admin').readAny('user').granted).toBe(true);
    expect(ac.can('admin').createAny('user').granted).toBe(true);
    expect(ac.can('admin').deleteAny('user').granted).toBe(true);
    expect(ac.can('admin').updateAny('user').granted).toBe(true);

    expect(ac.can('admin').readOwn('venue').granted).toBe(true);
    expect(ac.can('admin').createOwn('venue').granted).toBe(true);
    expect(ac.can('admin').deleteOwn('venue').granted).toBe(true);
    expect(ac.can('admin').updateOwn('venue').granted).toBe(true);

    expect(ac.can('admin').readOwn('user').granted).toBe(true);
    expect(ac.can('admin').createOwn('user').granted).toBe(true);
    expect(ac.can('admin').deleteOwn('user').granted).toBe(true);
    expect(ac.can('admin').updateOwn('user').granted).toBe(true);
  });
});
