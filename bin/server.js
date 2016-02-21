// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
import WebpackIsomorphicTools from 'webpack-isomorphic-tools';
import config from '../config';
import _debug from 'debug';

global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../build/webpack-isomorphic-tools'))
  .development(true)
  .server('.', () => {
    const server = require('../server/main').default;

    const debug = _debug('app:bin:server');
    const port = config.server_port;
    const host = config.server_host;

    server.listen(port);
    debug(`Server is now running at ${host}:${port}.`);
  });
