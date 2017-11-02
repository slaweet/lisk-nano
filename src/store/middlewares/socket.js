import io from '../../utils/socketShim';
import actionTypes from '../../constants/actions';
import { activePeerUpdate } from '../../actions/peers';

let connection;
let forcedClosing = false;

const socketSetup = (store) => {
  let windowIsFocused = true;
  const { ipc } = window;
  if (ipc) {
    ipc.on('blur', () => { windowIsFocused = false; });
    ipc.on('focus', () => { windowIsFocused = true; });
  }

  const ssl = store.getState().peers.data.options.ssl;
  const protocol = ssl ? 'https' : 'http';

  connection = io.connect(`${protocol}://${store.getState().peers.data.currentPeer}:${store.getState().peers.data.port}`);
  connection.on('blocks/change', (block) => {
    store.dispatch({
      type: actionTypes.newBlockCreated,
      data: { block, windowIsFocused },
    });
  });
  connection.on('disconnect', () => {
    if (!forcedClosing) {
      store.dispatch(activePeerUpdate({ online: false }));
    }
  });
  connection.on('reconnect', () => {
    store.dispatch(activePeerUpdate({ online: true }));
  });
};
const closeConnection = () => {
  if (connection) {
    forcedClosing = true;
    connection.close();
    forcedClosing = false;
  }
};

const socketMiddleware = store => (
  next => (action) => {
    switch (action.type) {
      case actionTypes.accountLoggedIn:
        socketSetup(store, action);
        break;
      case actionTypes.accountLoggedOut:
        closeConnection();
        break;
      default: break;
    }
    next(action);
  });

export default socketMiddleware;
