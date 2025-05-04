export interface PrimitiveType {
    type: 'string' | 'number' | 'boolean';
}

interface EnumType<T> extends PrimitiveType {
    enum: T[];
}

export interface StringEnumType extends EnumType<string> {
    type: 'string';
}

export interface NumberEnumType extends EnumType<number> {
    type: 'number';
}

export type ObjectType = {
    type: 'object',
    required: string[];
    properties: Record<string, PrimitiveType | ObjectType | ArrayType>;
    additionalProperties: boolean;
}

export type ArrayType = {
    type: 'array',
    items: ObjectType,
    maxItems?: number;
};