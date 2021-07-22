import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type PulseReadMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class PulseRead {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<PulseRead, PulseReadMetaData>);
  static copyOf(source: PulseRead, mutator: (draft: MutableModel<PulseRead, PulseReadMetaData>) => MutableModel<PulseRead, PulseReadMetaData> | void): PulseRead;
}