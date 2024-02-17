export type InvalidModelTemplateSchema = [FooDataModel];

interface FooDataModel extends UnionTemplateModel {}

type UnionTemplateModel = BazTemplateModel & CazTemplateModel;

interface BazTemplateModel {}

interface CazTemplateModel {}
