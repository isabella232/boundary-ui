import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { defer } from 'rsvp';
import { v1 } from 'ember-uuid';

const appOrigin = 'serve://dist';
const messageEvent = 'message';

/**
 *  The IPC Service provides a secure way of communicating between
 *  this ember app and electron's main process.
 *  Usage:
 *    @service clientIpc;
 *    this.clientIpc.sendMessage('type', 'name', messsageObject).then(response => console.log('received response', response));
 */
export default class ClientIpcService extends Service {
  constructor() {
    super(...arguments);
    this.channels = new Map();
    this.globalWindow.addEventListener(messageEvent, this.handleMessage.bind(this));
  }

  sendMessage(type, name, data) {
    const message = {
      id: v1(),
      target: 'main',
      type,
      name,
      data
    };

    this.globalWindow.postMessage(JSON.stringify(message), appOrigin);
    return this.trackMessage(message);
  }

  trackMessage(message) {
    const deferred = defer();
    this.channels.set(message.id, deferred);
    return deferred.promise;
  }

  getTrackedMessage(message) {
    return this.channels.get(message.id);
  }

  handleMessage({origin, data: message}) {
    if(origin !== appOrigin) return;
    if(message.target !== 'renderer') return;

    this.resolveMessage(message);
  }

  resolveMessage(message) {
    const deferred = this.getTrackedMessage(message);
    if(deferred) {
      deferred.resolve(message);
      this.channels.delete(message.id);
    }
  }

  get globalWindow() {
    const globalDocument = getOwner(this).lookup('service:-document');
    return globalDocument.defaultView;
  }
}
