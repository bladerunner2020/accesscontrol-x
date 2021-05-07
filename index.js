/* eslint-disable func-names, no-underscore-dangle */
const AccessControl = require('accesscontrol');
const { Access, Query } = require('accesscontrol/lib/core');
const { actions } = require('accesscontrol/lib/enums');

const { Action, Possession } = AccessControl;

AccessControl.prototype.grantAny = function grantAll(role, resource, attributes) {
  const access = this.grant(role);
  Object
    .keys(Action)
    .forEach((action) => access._prepareAndCommit(Action[action], Possession.ANY, resource, attributes));
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

Query.prototype.__getPermission = Query.prototype._getPermission;
Query.prototype._getPermission = function _getPermission(action, possession, resource) {
  const resourceChain = resource.split(':');
  return resourceChain.reduce((acc, item, index) => {
    if (acc.granted) return acc;
    const resourcePath = resourceChain.slice(0, index + 1).join(':');
    return this.__getPermission(action, possession, resourcePath);
  }, {});
};

module.exports = AccessControl;
