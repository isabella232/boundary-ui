import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ScopesScopeAuthMethodsAuthMethodAccountsAccountSettingsRoute extends Route {

  // =services

  @service intl;
  @service notify;

  // =actions

  /**
   * Set password for current account.
   * @param {AccountModel} account
   * @param {string} password
   */
  @action
  async setPassword(account) {
    try {
      await account.setPassword();
      await this.replaceWith('scopes.scope.auth-methods.auth-method.accounts.account.settings');
      this.notify.success(
        this.intl.t('notify.save-success')
      );
    } catch (error) {
      // TODO: replace with translated strings
      this.notify.error(error.message, { closeAfter: null });
    }
  }

  /**
   * Redirect to hosts as if nothing ever happened.
   */
  @action
  cancel() {
    this.replaceWith('scopes.scope.auth-methods.auth-method.accounts.account.settings');
  }
}
