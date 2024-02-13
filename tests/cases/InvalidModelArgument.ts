export type InvalidModelArgumentSchema = [FooDataModel];

interface FooDataModel extends BazTemplateModel<unknown> {}

interface BazTemplateModel<T> {}
