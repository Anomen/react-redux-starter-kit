import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import xhrMiddleware from './middlewares/xhrMiddleware';

export default function configureStore (history, xhrClient, initialState = {}) {
  // Compose final middleware and use devtools in debug environment
  let middleware = applyMiddleware(
    thunk,
    routerMiddleware(history),
    xhrMiddleware(xhrClient)
  );

  if (__DEBUG__ && __CLIENT__) {
    const devTools = window.devToolsExtension
      ? window.devToolsExtension()
      : require('containers/DevTools').default.instrument();
    middleware = compose(middleware, devTools);
  }

  // Create final store and subscribe router in debug env ie. for devtools
  const store = middleware(createStore)(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default;

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
