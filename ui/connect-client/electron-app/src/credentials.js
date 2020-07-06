const keytar = require('keytar');

/*
 * Provides ability to store, retrieve, and destroy an account associated with
 * a service. An account contains an associated password value.
 * Wrapper class for node-keytar plugin.
 */
module.exports = class Credentials {
  constructor(service) {
    this.service = service;
  }

  // Generate a stored credential based on account
  create(account, password) {
    return keytar.setPassword(this.service, account, password);
  }

  // Retrieve a stored credential based on account
  find(account) {
    return keytar.getPassword(this.service, account);
  }

  // Retrieve all stored credentials
  findAll() {
    return keytar.findCredentials(this.service);
  }

  // Destroy a stored credential based on account
  destroy(account) {
    return keytar.deletePassword(this.service, account);
  }
}
