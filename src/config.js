/**
 * This file exposes the config parameters of the application, which is a global variable defined by webpack with
 * the DefinePlugin.
 *
 * NOTE: In the client side, the string __CONFIG__ is replaced by webpack by the JSON, so
 * NO GLOBAL VARIABLE is created.
 */
if (typeof window === 'undefined') {
  module.exports = global.__CONFIG__;
} else {
  module.exports = __CONFIG__;
}
