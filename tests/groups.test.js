const AccessControl = require('..');

describe('groups', () => {
  it('should return empty string if granted access to entire resource', () => {
    const ac = new AccessControl();
    ac.grant('user').readAny('bookings');
    const result = ac.can('user').getGroups('bookings', 'read');
    expect(result.any).toEqual(['']);
    expect(result.own).toEqual(['']);
  });

  it('should return empty arrays if no grants at all', () => {
    const ac = new AccessControl();
    const result = ac.can('user').getGroups('bookings', 'read');
    expect(result.any).toEqual([]);
    expect(result.own).toEqual([]);
  });

  it('should return empty arrays if no grants to resource', () => {
    const ac = new AccessControl();
    ac.grant('user').readAny('users');
    const result = ac.can('user').getGroups('bookings', 'read');
    expect(result.any).toEqual([]);
    expect(result.own).toEqual([]);
  });

  it('should return groups', () => {
    const ac = new AccessControl();
    ac.grant('user').readOwn('bookings:group1');
    ac.grant('user').readOwn('bookings:group2');
    const result = ac.can('user').getGroups('bookings', 'read');
    expect(result.any).toEqual([]);
    expect(result.own).toEqual(['group1', 'group2']);
  });

  it('should return groups with multiple actions', () => {
    const ac = new AccessControl();
    ac.grant('user').readAny('bookings');
    ac.grant('user').createOwn('bookings:group1');
    let result = ac.can('user').getGroups('bookings', 'read');
    expect(result.any).toEqual(['']);
    expect(result.own).toEqual(['']);
    result = ac.can('user').getGroups('bookings', 'create');
    expect(result.any).toEqual([]);
    expect(result.own).toEqual(['group1']);
  });

  it('multiple rules', () => {
    const ac = new AccessControl();
    ac.grant('user').readOwn('bookings:group1');
    ac.grant('user').readOwn('bookings:group2');
    ac.grant('user').readOwn('bookings:group3');
    ac.grant('secretary').readAny('bookings:group2');
    ac.grant('secretary').readOwn('bookings:group3');
    ac.grant('secretary').readAny('bookings:group4');
    ac.grant('secretary').readOwn('bookings:group5');
    const result = ac.can(['user', 'secretary']).getGroups('bookings', 'read');
    expect(result.any).toEqual(['group2', 'group4']);
    expect(result.own).toEqual(['group1', 'group2', 'group3', 'group4', 'group5']);
  });
});
