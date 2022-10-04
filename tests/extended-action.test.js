const AccessControl = require('..');

describe('extended action tests', () => {
  it('register extended action', () => {
    const ac = new AccessControl();
    ac.grant(['user', 'admin']);
    AccessControl.registerAction('execute');

    expect(ac.can('user').executeAny).toBeDefined();
    expect(ac.can('admin').executeAny).toBeDefined();

    ac.grant('admin').executeAny('trigger');

    expect(ac.can('user').executeAny('trigger').granted).toBe(false);
    expect(ac.can('user').executeOwn('trigger').granted).toBe(false);

    expect(ac.can('admin').executeAny('trigger').granted).toBe(true);
    expect(ac.can('admin').executeOwn('trigger').granted).toBe(true);

    ac.grant('user').executeOwn('trigger');

    expect(ac.can('user').executeAny('trigger').granted).toBe(false);
    expect(ac.can('user').executeOwn('trigger').granted).toBe(true);
  });
});
