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

export type MessageType = 'create-skeleton' | 'preview-code';
export interface SkeletonOption {
  animation?: 'wave' | 'pulse' | 'unset';
  variant?: 'circle' | 'text';
}

export interface PluginMessage {
  type: MessageType;
  option?: SkeletonOption;
}

export interface PluginEvent<T> extends Event {
  data: {
    pluginId: string;
    pluginMessage: {
      type: MessageType;
      payload: T;
    };
  };
}
