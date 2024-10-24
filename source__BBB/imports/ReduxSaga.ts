import type {
  ActionPattern,
  Buffer as ChannelBuffer,
  SagaIterator,
  Task,
} from 'https://raw.githubusercontent.com/redux-saga/redux-saga/main/packages/types/types/ts3.6/index.d.ts';
import type { EventChannel, MulticastChannel, SagaMiddleware, SagaMiddlewareOptions } from 'npm:redux-saga';
import __createSagaMiddleware from "npm:redux-saga";
import {
  Tail,
  actionChannel as __actionChannel,
  call as __call,
  fork as __fork,
  put as __put,
  select as __select,
  spawn as __spawn,
  take as __take,
} from 'npm:redux-saga/effects';

type SagaReturnType__OVERRIDE<S extends Function> = S extends (...args: any[]) => SagaIterator<infer RT>
? RT
: S extends (...args: any[]) => Promise<infer RT>
? RT
: S extends (...args: any[]) => infer RT
? RT
: never

export const createSagaMiddleware = __createSagaMiddleware as any as <C extends object>(options?: SagaMiddlewareOptions<C>) => SagaMiddleware<C>;

export function getStoreEffects<
  StoreAction extends ActionBase<string, object>,
  StoreState,
>() {
  const storeEffects = {
    call: function* <SomeFunction extends (...args: any[]) => any>(
      someFunction: SomeFunction,
      ...functionArgs: Parameters<SomeFunction>
    ) {
      return (yield __call<SomeFunction>(
        someFunction,
        ...functionArgs,
      )) as SagaReturnType__OVERRIDE<SomeFunction>;
    },
    fork: function* <SomeFunction extends (...args: any[]) => any>(
      someFunction: SomeFunction,
      ...functionArgs: Parameters<SomeFunction>
    ) {
      return (yield __fork<SomeFunction>(someFunction, ...functionArgs)) as Task;
    },
    spawn: function* <SomeFunction extends (...args: any[]) => any>(
      someFunction: SomeFunction,
      ...functionArgs: Parameters<SomeFunction>
    ) {
      return (yield __spawn<SomeFunction>(
        someFunction,
        ...functionArgs,
      )) as Task;
    },
    put: function* <SomeStoreAction extends StoreAction>(
      someAction: SomeStoreAction,
    ) {
      return (yield __put<SomeStoreAction>(someAction)) as void;
    },
    select: function* <
      SomeFunction extends (state: StoreState, ...args: any[]) => any,
    >(
      storeSelector: SomeFunction,
      ...selectorArgs: Tail<Parameters<SomeFunction>>
    ) {
      return (yield __select(storeSelector, ...selectorArgs)) as ReturnType<
        typeof storeSelector
      >;
    },
    takeAction: function* <TargetAction extends StoreAction>(
      actionPattern: StoreActionPattern<StoreAction, TargetAction>,
    ) {
      return (yield __take<TargetAction>(
        actionPattern as ActionPattern<TargetAction>,
      )) as TargetAction;
    },
    takeActionFromChannel: function* <ChannelAction extends StoreAction>(
      actionChannel: MulticastChannel<ChannelAction>,
    ) {
      return (yield __take(actionChannel)) as ChannelAction;
    },
    takeEvent: function* <SomeEvent extends EventBase<string, object>>(
      takeableChannel: EventChannel<SomeEvent>,
    ) {
      return (yield __take<SomeEvent>(takeableChannel)) as SomeEvent;
    },
    actionChannel: function* <ChannelAction extends StoreAction>(
      channelActionPattern: StoreActionPattern<StoreAction, ChannelAction>,
      channelBuffer: ChannelBuffer<ChannelAction>,
    ) {
      return (yield __actionChannel(
        channelActionPattern as ActionPattern<ChannelAction>,
        channelBuffer,
      )) as MulticastChannel<ChannelAction>;
    },
  };
  return { storeEffects };
}

type StoreActionPattern<
  StoreAction extends ActionBase<string, object>,
  TargetAction extends StoreAction,
> =
  | TargetAction['type']
  | GuardPredicate<StoreAction, TargetAction>
  | Array<TargetAction['type'] | GuardPredicate<StoreAction, TargetAction>>;

type GuardPredicate<
  PredicateArgument,
  PredicateGuard extends PredicateArgument,
> = (
  somePredicateArgument: PredicateArgument,
) => somePredicateArgument is PredicateGuard;

export interface ActionBase<
  ActionType extends string,
  ActionPayload extends object,
> {
  type: ActionType;
  actionPayload: ActionPayload;
}

export interface EventBase<
  EventType extends string,
  EventPayload extends object,
> {
  eventType: EventType;
  eventPayload: EventPayload;
}

export type ChannelEventEmitter<
  SomeChannelEvent extends EventBase<string, object>,
> = (input: SomeChannelEvent) => void;
