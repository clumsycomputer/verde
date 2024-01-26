export type InvalidBaseItemSchema = [InvalidExtensionItem];

interface InvalidExtensionItem extends InvalidBaseItem<unknown> {}

interface InvalidBaseItem<T> {}
