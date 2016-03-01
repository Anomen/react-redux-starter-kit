export default (xhrClient) => ({dispatch, getState}) => (next) => (action) => {
  // If the action is a function, execute it
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }

  const { promise, type, ...rest } = action;

  // If there is no promise in the action, ignore it
  if (!promise) {
    return next(action);
  }

  const REQUEST = type;
  const SUCCESS = REQUEST + '_SUCCESS';
  const FAILURE = REQUEST + '_FAIL';

  // Trigger the action (for loading for instance)
  next({ ...rest, type: REQUEST });

  return promise(xhrClient, dispatch).then(
    (result) => { next({...rest, result: result, type: SUCCESS}); },
    (error) => next({...rest, ...error, type: FAILURE})
  ).catch((error) => next({...rest, ...error, type: FAILURE}));
};
