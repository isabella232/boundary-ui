const { ipcRenderer } = require('electron');

const emberAppOrigin = 'serve://dist';
const messageEvent = 'message';

// Register for events once electron begins to load pages
process.once('loaded', () => {
  // Handle events sent directly to message event and forward it to main process.
  const messageHandler = ({origin, data: message}) => {
    // Only handle events from known origin
    if(origin !== emberAppOrigin) return;
    // Convert message string to json
    message = parseJson(message);
    // Only forward events to known target
    if(message.target.match(/(main)/i)) sendToMain(message);
  }

  window.addEventListener(messageEvent, messageHandler);

  // Handle events received from main process and forward it to renderer.
  ipcRenderer.on(messageEvent, (event, {id, type, name, data: message}) => {
    const messageData = {
      target: 'renderer',
      id,
      type,
      name,
      message
    };

    window.postMessage(messageData, emberAppOrigin);
  });

  // Send event to main process
  const sendToMain = ({id, target, type, name, data: message}) => {
    message = parseJson(message);
    const messageData = {
      id: String(id),
      target: String(target),
      type: String(type),
      name: String(name),
      message: message
    }

    ipcRenderer.send(messageEvent, messageData);
  };
});

const parseJson = (data) => {
  if(typeof data === "string") data = JSON.parse(data);
  return data;
};
