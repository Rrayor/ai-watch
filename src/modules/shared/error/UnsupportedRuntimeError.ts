/**
 * Error thrown when the host runtime is missing required platform APIs.
 *
 * Thrown at module initialization (import-time) to indicate the environment
 * lacks one or more platform capabilities the extension depends on. The
 * current implementation uses `Intl.supportedValuesOf('timeZone')` as an
 * example of such a capability, but the error is intentionally general so
 * it can cover other future platform requirements.
 *
 * This signals a global, unrecoverable runtime mismatch — callers and
 * individual commands do not need to handle this error locally because the
 * extension cannot initialize successfully in that environment.
 */
export class UnsupportedRuntimeError extends Error {
  constructor(message?: string) {
    super(message ?? 'Unsupported runtime');
    this.name = 'UnsupportedRuntimeError';
  }
}
