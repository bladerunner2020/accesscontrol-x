/* eslint-disable func-names, no-underscore-dangle */
const AccessControl = require('accesscontrol');
const { Access, Query, Permission } = require('accesscontrol/lib/core');
const { actions } = require('accesscontrol/lib/enums');
const objectPath = require('object-path');

const { Action, Possession } = AccessControl;

AccessControl.prototype.grantAny = function grantAll(role, resource, attributes) {
  const access = this.grant(role);
  Object
    .keys(Action)
    .forEach((action) => access._prepareAndCommit(Action[action], Possession.ANY, resource, attributes));
  return access;
};

AccessControl.prototype.grantOwn = function grantAll(role, resource, attributes) {
  const access = this.grant(role);
  Object
    .keys(Action)
    .forEach((action) => access._prepareAndCommit(Action[action], Possession.OWN, resource, attributes));
  return access;
};

AccessControl.registerAction = function registerAction(name) {
  const action = name.toLowerCase();
  Action[action.toUpperCase()] = action;
  actions.push(action);
  Access.prototype[`${action}Any`] = function(resource, attributes) {
    return this._prepareAndCommit(action, Possession.ANY, resource, attributes);
  };
  Access.prototype[`${action}Own`] = function(resource, attributes) {
    return this._prepareAndCommit(action, Possession.OWN, resource, attributes);
  };
  Query.prototype[`${action}Any`] = function(resource) {
    return this._getPermission(action, Possession.ANY, resource);
  };
  Query.prototype[`${action}Own`] = function(resource) {
    return this._getPermission(action, Possession.OWN, resource);
  };
};

AccessControl.prototype.getGrantsAsArray = function getGrantsAsArray(role) {
  const result = [];

  if (Array.isArray(role)) {
    role.forEach((r) => {
      result.push(...this.getGrantsAsArray(r));
    });
    return result;
  }

  const grantObject = this.getGrants();
  if (role) {
    const roleGrants = grantObject[role];
    if (roleGrants.$extend) {
      roleGrants.$extend.forEach((extendedRole) => {
        result.push(...this.getGrantsAsArray(extendedRole).map((res) => ({ ...res, role })));
      });
    }
    Object.keys(roleGrants).forEach((resource) => {
      if (resource === '$extend') return;
      const actionsObject = roleGrants[resource];
      if (actions) {
        Object.keys(actionsObject).forEach((action) => {
          result.push({
            role, resource, action, attributes: actionsObject[action]
          });
        });
      }
    });
    return result;
  }

  Object.keys(grantObject).forEach((r) => {
    result.push(...this.getGrantsAsArray(r));
  });

  return result;
};

Access.prototype.any = function any(resource, attributes) {
  Object.keys(Action).forEach((action) => this._prepareAndCommit(Action[action], Possession.ANY, resource, attributes));
  return this;
};

Access.prototype.own = function own(resource, attributes) {
  Object.keys(Action).forEach((action) => this._prepareAndCommit(Action[action], Possession.OWN, resource, attributes));
  return this;
};

Query.prototype.getGroups = function getGroups(baseResource, action) {
  const result = { any: [], own: [] };
  const { role: roleOrRoles } = this._;
  if (typeof roleOrRoles === 'undefined') return result;
  const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
  // const resources = [];

  roles.forEach((role) => {
    const grants = this._grants[role];
    if (!grants) return;
    const resources = Object.keys(grants).filter((resource) => resource.includes(baseResource));
    resources.forEach((resource) => {
      const [, group] = resource.split(':');
      if (group) {
        if (grants[resource][`${action}:any`]) {
          if (result.any[0] !== '' && !result.any.includes(group)) result.any.push(group);
          if (result.own[0] !== '' && !result.own.includes(group)) result.own.push(group);
        }
        if (grants[resource][`${action}:own`]) {
          if (result.own[0] !== '' && !result.own.includes(group)) result.own.push(group);
        }
      } else {
        if (grants[resource][`${action}:any`]) {
          result.any = [''];
          result.own = [''];
        }
        if (grants[resource][`${action}:own`]) {
          result.own = [''];
        }
      }
    });
  });

  return result;
};

Query.prototype.__getPermission = Query.prototype._getPermission;
Query.prototype._getPermission = function _getPermission(action, possession, resource) {
  if (Array.isArray(resource)) {
    const count = resource.length;
    let permission;
    for (let i = 0; i < count; i++) {
      permission = this._getPermission(action, possession, resource[i]);
      if (permission.granted) return permission;
    }
    // not granted
    return permission;
  }

  const resourceChain = resource.split(':');
  return resourceChain.reduce((acc, item, index) => {
    if (acc.granted) return acc;
    const resourcePath = resourceChain.slice(0, index + 1).join(':');
    return this.__getPermission(action, possession, resourcePath);
  }, {});
};

Query.prototype.allGranted = function allGranted(actionPossession, resource) {
  let permissions = [];
  let { role: roles } = this._ || {};
  if (!roles) return [];

  const match = (item) => {
    if (resource.split(':').length < item.split(':').length) return item.indexOf(resource) === 0;
    return resource.indexOf(item) === 0;
  };

  if (!Array.isArray(roles)) roles = [roles];
  roles.forEach((role) => {
    let { _grants: grants } = this;
    if (typeof grants !== 'object') return;
    grants = grants[role] || {};

    const [action, possession] = actionPossession.split(':');

    permissions = [
      ...permissions,
      ...Object
        .keys(grants)
        .filter(match)
        .map((item) => this._getPermission(action, possession, item))
    ];
  });

  return permissions;
};

Query.prototype.hasGranted = function hasGranted(actionPossession, resource) {
  const permissions = this.allGranted(actionPossession, resource);
  return permissions.filter((item) => item.granted).length > 0;
};

Permission.prototype.check = function(attribute) {
  const obj = {};
  objectPath.set(obj, attribute, 1);

  return objectPath.get(this.filter(obj), attribute) === 1;
};

module.exports = AccessControl;
