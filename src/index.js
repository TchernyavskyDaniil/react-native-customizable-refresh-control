import React, { useState, useCallback } from 'react';
import { RefreshControl } from 'react-native';
import PropTypes from 'prop-types';

import { useUnmount } from './useUnmount';

export const CustomizableRefreshControl = ({
 callbackError,
 callback,
 callbackParams,
 delay,
 delayCallback,
 controlParams,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const setClearedInterval = useCallback(async () => {
    if (delay) {
      setTimeout(delayCallback, delay)
    }

    if (callback) {
      try {
        await callback(callbackParams)
      } catch (e) {
        callbackError(e)
      }
    }

    cancelRefreshing()
  }, [callback, callbackError, callbackParams, cancelRefreshing, delay, delayCallback]);

  const handleOnRefresh = useCallback(async () => {
    setRefreshing(true);
    await setClearedInterval()
  }, [setClearedInterval]);

  const cancelRefreshing = useCallback(() => setRefreshing(false), []);

  useUnmount(cancelRefreshing);

  return <RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} {...controlParams} />
};

CustomizableRefreshControl.defaultProps = {
  callback: null,
  callbackError: () => {},
  callbackParams: undefined,
  controlParams: {},
  delay: null,
  delayCallback: () => {},
};

CustomizableRefreshControl.propTypes = {
  callback: PropTypes.func,
  callbackError: PropTypes.func,
  callbackParams: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.oneOf([undefined]),
  ]),
  controlParams: PropTypes.object,
  delay: PropTypes.number,
  delayCallback: PropTypes.func,
};
