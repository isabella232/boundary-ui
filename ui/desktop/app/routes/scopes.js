import Route from '@ember/routing/route';
import { A } from '@ember/array';

export default class ScopesRoute extends Route {
  // =methods

  /**
   * Load all scopes
   * @return {Promise{[ScopeModel]}}
   */
  model() {
        //eslint-disable-next-line no-debugger
        debugger;
    return this.store.findAll('scope').catch(() => A([]));
  }
}
