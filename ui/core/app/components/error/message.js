import Message from 'rose/components/rose/message';

/*
 * Helpful error booleans are attached based on the error status code:
 *
 *   - 401 - `error.isUnauthenticated`:  the session isn't authenticated
 *   - 403 - `error.isForbidden`:  the session is authenticated but does not have
 *            permission to perform the requested action
 *   - 404 - `error.isNotFound`:  the requested resource could not be found
 *   - 500 - `error.isServer`:  an internal server error occurred
 *
 * For an unknown error state, i.e error state not matching to the above defined list:
 *   - unknown - `error.isUnknown`:  an error occurred, but we don't know which or
 *            we don't distinguish it yet
 */

const status_messages = {
  '401': {
    icon: 'disabled',
    title: 'errors.titles.unauthenticated-error',
    subtitle: 'errors.subtitles.unauthenticated-error',
    description: 'errors.descriptions.unauthenticated-error',
  },
  '403': {
    icon: 'disabled',
    title: 'errors.titles.forbidden-error',
    subtitle: 'errors.subtitles.forbidden-error',
    description: 'errors.descriptions.forbidden-error',
  },
  '404': {
    icon: 'help-circle-outline',
    title: 'errors.titles.notfound-error',
    subtitle: 'errors.subtitles.notfound-error',
    description: 'errors.descriptions.notfound-error',
  },
  '500': {
    icon: 'alert-circle-outline',
    title: 'errors.titles.server-error',
    subtitle: 'errors.subtitles.server-error',
    description: 'errors.descriptions.server-error',
  },
  unknown: {
    icon: 'alert-circle-outline',
    title: 'errors.titles.unknown-error',
    subtitle: 'errors.subtitles.unknown-error',
    description: 'errors.descriptions.unknown-error',
  },
};

export default class ErrorMessageComponent extends Message {
  // =methods

  /**
   * Returns an icon name based on error status.
   * @return {string}
   */
  get icon() {
    return this.statusMessage.icon;
  }

  /**
   * Returns a message title based on error status.
   * @return {string}
   */
  get title() {
    return this.statusMessage.title;
  }

  /**
   * Returns a message subtitle of error status prefixed with 'Error'.
   * @return {string}
   */
  get subtitle() {
    return this.statusMessage.subtitle;
  }

  /**
   * Returns an error description based on error status.
   * @return {string}
   */
  get description() {
    return this.statusMessage.description;
  }

  // Disable until help documentation can be linked in.
  /**
   * Returns an route string for help text in message.
   * @return {string}
   */
  // get helpRoute() {
  //   return 'index'
  // }

  /**
   * Returns an object with message details based on error status.
   * Return message for `unknown` error when error status isn't part of
   * predefined message set.
   * @return {object}
   */
  get statusMessage() {
    let status = this.status;
    if (!status_messages[status]) {
      status = 'unknown';
    }
    return status_messages[status];
  }
}
