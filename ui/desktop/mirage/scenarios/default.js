export default function(server) {

  // Create a global scope
  const globalScope = server.create('scope', {
    id: 'global',
    type: 'global',
    name: 'Global'
  });

  // Create an org scope and project scopes within
  server.createList('scope', 3, {
    type: 'org',
    scope: { id: globalScope.id, type: globalScope.type }
  }, 'withChildren');

}
