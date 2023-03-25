import { expect, expectTypeOf, test } from 'vitest';
import { UniqueId } from './UniqueId';

test('Test unique id generator', () => {
    const instance = new UniqueId();
    expectTypeOf(instance.generate).toBeFunction();
    expect(instance.generate()).toEqual(0);
    expect(instance.generate()).toEqual(1);
    expect(instance.generate()).toEqual(2);
});
