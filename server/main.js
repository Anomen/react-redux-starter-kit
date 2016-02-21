import express from 'express';
import _debug from 'debug';
import config from '../config';
import webpackProxyMiddleware from './middleware/webpack-proxy';

Object.keys(config.globals).map((key) => {
  global[key] = config.globals[key];
});
global.__CLIENT__ = false;
global.__SERVER__ = true;

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import HTML from './html';

import configureStore from '../src/redux/configureStore';
import makeRoutes from '../src/routes';

const debug = _debug('app:server');
const paths = config.utils_paths;
const app = express();

// ------------------------------------
// Apply redux-router
// ------------------------------------
app.use(function (req, res) {
  const memoryHistory = createMemoryHistory(req.path);
  const store = configureStore(memoryHistory);
  const history = syncHistoryWithStore(memoryHistory, store);

  // Now that we have the Redux store, we can create our routes. We provide
  // the store to the route definitions so that routes have access to it for
  // hooks such as `onEnter`.
  const routes = makeRoutes(store);

  match({history, routes, location: req.url}, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const component = (
        <Provider store={store}>
          <div style={{ height: '100%' }}>
            <RouterContext {...renderProps}/>
          </div>
        </Provider>
      );

      res.send('<!doctype html>\n' + renderToString(
        <HTML assets={global.webpackIsomorphicTools.assets()}
              component={component}
              store={store}/>
      ));
    }
  });
});

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {
  if (config.proxy && config.proxy.enabled) {
    const options = config.proxy.options;
    app.use(webpackProxyMiddleware(options));
  }

  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(paths.client('static')));
} else {
  debug(
    'Server is being run outside of live development mode. This starter kit ' +
    'does not provide any production-ready server functionality. To learn ' +
    'more about deployment strategies, check out the "deployment" section ' +
    'in the README.'
  );

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(express.static(paths.base(config.dir_dist)));
}

export default app;
