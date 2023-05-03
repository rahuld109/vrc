// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: 'addStream';
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    addStream: 'MEDIA_ACCESS_GRANTED';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates: 'idle' | 'recording' | 'stopped' | 'stopping';
  tags: never;
}
