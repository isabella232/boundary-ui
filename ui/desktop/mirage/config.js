import config from '../config/environment';

export default function() {
  this.namespace = config.api.namespace;

  // Allow any configured API host to passthrough, which is useful in
  // development for testing against a locally running backend.
  if (config.api.host) this.passthrough(`${config.api.host}/**`);
  this.passthrough();

  // Scope resources
  this.get('/scopes', ({ scopes }, { queryParams: { scope_id } }) => {
    // Default parent scope is global
    if (!scope_id) scope_id = 'global';
    const results = scopes.where(scope => {
      return scope.scope ? scope.scope.id === scope_id : false
    });

    //eslint-disable-next-line no-debugger
    debugger;
    
    return results;
  });
}
