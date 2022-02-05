/**
 * ERRORS
 */
export class CodedError extends Error {
  public code: ERRORS;
  public hideStack: boolean;

  constructor(code: ERRORS, message: string, hideStack = false) {
    super(message);
    this.code = code;
    this.hideStack = hideStack;
    Object.setPrototypeOf(this, CodedError.prototype);
  }
}

export enum ERRORS {
  UNEXPECTED = 'UNEXPECTED',
  NO_SELECTION = 'NO_SELECTION',
}

/**
 * Plugin Interface
 */

export type MessageType = 'create-skeleton';
export interface MessageOption {
  animation?: 'wave' | 'pulse' | 'unset';
  variant?: 'circle' | 'text';
}

export interface PluginMessage {
  type: MessageType;
  option?: MessageOption;
}
