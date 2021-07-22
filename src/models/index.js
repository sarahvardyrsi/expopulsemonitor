// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { PulseRead } = initSchema(schema);

export {
  PulseRead
};