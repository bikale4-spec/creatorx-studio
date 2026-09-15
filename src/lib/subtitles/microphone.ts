import type { MicPermissionState } from './types';

export type MicTestResult = {
  permission: MicPermissionState;
  message: string;
  success: boolean;
};

export async function checkMicPermission(): Promise<MicPermissionState> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return 'unavailable';
  }

  try {
    if (navigator.permissions?.query) {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      if (result.state === 'granted') return 'granted';
      if (result.state === 'denied') return 'denied';
    }
  } catch {
    // permissions.query not supported for microphone — fall through to getUserMedia
  }

  return 'unknown';
}

export async function requestMicrophoneAccess(): Promise<MicTestResult> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return {
      permission: 'unavailable',
      message: 'Microphone access is not available in this environment. The page must be served over HTTPS.',
      success: false,
    };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return {
      permission: 'granted',
      message: 'Microphone connected',
      success: true,
    };
  } catch (err) {
    const error = err as DOMException;
    let message: string;

    switch (error.name) {
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        message = 'Microphone permission was denied. Click the microphone icon in your browser address bar to allow access, then try again.';
        return { permission: 'denied', message, success: false };

      case 'NotFoundError':
      case 'DevicesNotFoundError':
        message = 'No microphone was found on this device. Connect a microphone and try again.';
        return { permission: 'unavailable', message, success: false };

      case 'NotReadableError':
      case 'TrackStartError':
        message = 'Your microphone is in use by another application. Close it and try again.';
        return { permission: 'unavailable', message, success: false };

      case 'OverconstrainedError':
      case 'ConstraintNotSatisfiedError':
        message = 'No microphone matches the requested constraints.';
        return { permission: 'unavailable', message, success: false };

      case 'SecurityError':
        message = 'Microphone access is blocked. The page must be served over HTTPS or localhost.';
        return { permission: 'denied', message, success: false };

      case 'AbortError':
        message = 'Microphone access was interrupted. Please try again.';
        return { permission: 'unknown', message, success: false };

      default:
        message = `Microphone error: ${error.name || 'Unknown'} — ${error.message || 'Could not access microphone.'}`;
        return { permission: 'unknown', message, success: false };
    }
  }
}
