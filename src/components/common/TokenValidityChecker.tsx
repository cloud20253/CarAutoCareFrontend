import React, { useEffect } from 'react';
import { forceCheckTokenValidity } from '../../utils/tokenUtils';

interface TokenValidityCheckerProps {
  children: React.ReactNode;
}

/**
 * Component that checks token validity on mount and sets up periodic checks
 * Place this at the top level of authenticated routes/components
 */
const TokenValidityChecker: React.FC<TokenValidityCheckerProps> = ({ children }) => {
  useEffect(() => {
    // Check token validity immediately when component mounts
    forceCheckTokenValidity();
    
    // Set up periodic token validity check every 30 seconds
    const intervalId = setInterval(() => {
      forceCheckTokenValidity();
    }, 30 * 1000); // 30 seconds
    
    // Clean up interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return <>{children}</>;
};

export default TokenValidityChecker; 