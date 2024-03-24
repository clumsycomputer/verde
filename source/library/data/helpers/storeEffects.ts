import { getStoreEffects } from '../../../imports/ReduxSaga.ts';

const { storeEffects } = getStoreEffects();

export const call = storeEffects.call;