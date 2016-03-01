export default (config, argv) => ({
  'process.env': {
    'NODE_ENV': JSON.stringify(config.env)
  },
  'NODE_ENV': config.env,
  '__DEV__': config.env === 'development',
  '__PROD__': config.env === 'production',
  '__TEST__': config.env === 'test',
  '__DEBUG__': config.env === 'development' && !argv.no_debug,
  '__DEBUG_NEW_WINDOW__': !!argv.nw,
  '__BASENAME__': JSON.stringify(process.env.BASENAME || ''),

  // These configs are exposed in the runtime of the server and client
  '__CONFIG__': {
    'server_host': config.server_host,
    'server_port': config.server_port,
    'server_base': `http://${config.server_host}:${config.server_port}`,

    'api_host': config.api_host,
    'api_port': config.api_port,
    'api_base': `http://${config.api_host}:${config.api_port}`
  }
});
