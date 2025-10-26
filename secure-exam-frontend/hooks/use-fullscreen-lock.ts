import { useEffect, useCallback, useRef } from 'react';

interface FullscreenLockOptions {
  onTabSwitch?: () => void;
  onExitAttempt?: () => void;
}

/**
 * Custom hook to enforce fullscreen mode and prevent tab switching during exams
 * 
 * Features:
 * - Prevents users from switching tabs while in fullscreen
 * - Detects and logs tab switch attempts
 * - Prevents exiting fullscreen via ESC key
 * - Monitors for visibility changes
 * - Triggers callbacks on violations
 */
export function useFullscreenLock(options?: FullscreenLockOptions) {
  const isFullscreenRef = useRef(false);
  const tabSwitchCountRef = useRef(0);

  // Enter fullscreen
  const enterFullscreen = useCallback(async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
        isFullscreenRef.current = true;
      } else if ((elem as any).webkitRequestFullscreen) {
        // Safari
        await (elem as any).webkitRequestFullscreen();
        isFullscreenRef.current = true;
      } else if ((elem as any).msRequestFullscreen) {
        // IE11
        await (elem as any).msRequestFullscreen();
        isFullscreenRef.current = true;
      }
      console.log('✅ Entered fullscreen mode');
      return true;
    } catch (error) {
      console.error('❌ Failed to enter fullscreen:', error);
      return false;
    }
  }, []);

  // Exit fullscreen
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        isFullscreenRef.current = false;
        console.log('✅ Exited fullscreen mode');
      } else if ((document as any).webkitFullscreenElement) {
        // Safari
        await (document as any).webkitExitFullscreen();
        isFullscreenRef.current = false;
      } else if ((document as any).msFullscreenElement) {
        // IE11
        await (document as any).msExitFullscreen();
        isFullscreenRef.current = false;
      }
      return true;
    } catch (error) {
      console.error('❌ Failed to exit fullscreen:', error);
      return false;
    }
  }, []);

  // Prevent visibility changes (tab switching)
  const handleVisibilityChange = useCallback(() => {
    if (!isFullscreenRef.current) return;

    if (document.hidden) {
      // User switched to another tab
      tabSwitchCountRef.current++;
      console.warn(`⚠️ Tab switch detected! Count: ${tabSwitchCountRef.current}`);
      
      if (options?.onTabSwitch) {
        options.onTabSwitch();
      }

      // Try to bring window back to focus
      window.focus();
    } else {
      // User returned to this tab
      console.log('✅ User returned to exam tab');
    }
  }, [options]);

  // Prevent ESC key to exit fullscreen
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isFullscreenRef.current) return;

    // ESC key
    if (event.key === 'Escape') {
      event.preventDefault();
      console.warn('⚠️ ESC key pressed - prevented fullscreen exit');
      
      if (options?.onExitAttempt) {
        options.onExitAttempt();
      }
    }

    // Ctrl+Tab or Cmd+Tab (browser tab switching)
    if ((event.ctrlKey || event.metaKey) && event.key === 'Tab') {
      event.preventDefault();
      console.warn('⚠️ Tab switch hotkey detected');
      
      if (options?.onTabSwitch) {
        options.onTabSwitch();
      }
    }
  }, [options]);

  // Prevent Alt+Tab (Windows) and Cmd+Tab (Mac)
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (!isFullscreenRef.current) return;

    // Alt key release (Alt+Tab detected)
    if (event.altKey && event.key === 'Tab') {
      event.preventDefault();
      console.warn('⚠️ Alt+Tab detected');
      window.focus();
      
      if (options?.onTabSwitch) {
        options.onTabSwitch();
      }
    }
  }, [options]);

  // Prevent right-click context menu
  const handleContextMenu = useCallback((event: MouseEvent) => {
    if (!isFullscreenRef.current) return;
    event.preventDefault();
  }, []);

  // Prevent fullscreen exit attempt
  const handleFullscreenChange = useCallback(() => {
    if (!isFullscreenRef.current) return;

    if (!document.fullscreenElement && 
        !(document as any).webkitFullscreenElement && 
        !(document as any).msFullscreenElement) {
      // User tried to exit fullscreen
      console.warn('⚠️ Fullscreen exit attempt detected');
      
      // Re-enter fullscreen
      setTimeout(() => {
        enterFullscreen();
      }, 100);
      
      if (options?.onExitAttempt) {
        options.onExitAttempt();
      }
    }
  }, [enterFullscreen, options]);

  // Setup event listeners
  useEffect(() => {
    if (!isFullscreenRef.current) return;

    // Visibility change (tab switching)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Keyboard events
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Fullscreen change
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    // Context menu (right-click)
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [handleVisibilityChange, handleKeyDown, handleKeyUp, handleFullscreenChange, handleContextMenu]);

  // Get tab switch count
  const getTabSwitchCount = useCallback(() => {
    return tabSwitchCountRef.current;
  }, []);

  // Reset tab switch count
  const resetTabSwitchCount = useCallback(() => {
    tabSwitchCountRef.current = 0;
  }, []);

  return {
    enterFullscreen,
    exitFullscreen,
    isFullscreen: () => isFullscreenRef.current,
    getTabSwitchCount,
    resetTabSwitchCount,
  };
}
