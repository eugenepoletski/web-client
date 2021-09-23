export type Reason = { [key: string]: string };

export type JSON = { [key: string]: string | JSON };

export interface ErrorJSON {
  message?: string;
  name: string;
  reason?: JSON;
}

export interface Options {
  message?: string;
  reason?: Reason;
}

export interface ValidationError extends Error {
  reason?: Reason;
  toJSON(): ErrorJSON;
}

export class ValidationError extends Error implements ValidationError {
  constructor(arg: string | Options) {
    let message;

    if (typeof arg === 'string') {
      message = arg;
    }

    if (typeof arg === 'object' && typeof arg.message === 'string') {
      message = arg.message;
    }

    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }

    this.name = 'ValidationError';

    if (typeof message === 'string') {
      this.message = message;
    }

    if (typeof arg === 'string') {
      return;
    }

    if (arg.reason) {
      this.reason = arg.reason;
    }
  }
}
