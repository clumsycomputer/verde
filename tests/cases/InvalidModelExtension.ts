export type InvalidModelExtensionSchema = [FooDataModel];

interface FooDataModel extends BazTemplateModel<unknown> {}

interface BazTemplateModel<T> {}
