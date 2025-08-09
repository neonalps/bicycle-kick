import { ValueWithModifier } from "@src/model/internal/stats-query-modifier";

export function parseValueWithModifier(input: string): ValueWithModifier {
    const parsedNumber = Number(input);
    if (!isNaN(parsedNumber)) {
        return {
            modifier: '=',
            value: parsedNumber,
        }
    } else {
        if (input.startsWith('+')) {
            return {
                modifier: '>=',
                value: Number(input.substring(1)),
            }
        }
    }

    throw new Error(`Failed to parse value with modifier: ${input}`);
}