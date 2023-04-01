import React, { Fragment } from 'react';
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { PromiseBridge } from './PromiseBridge';
import { ContainerDestroyedException } from '../exceptions/ContainerDestroyedException';
import { ContainerLimitReachedException } from '../exceptions/ContainerLimitReachedException';
import { ContainerNotMountedException } from '../exceptions/ContainerNotMountedException';
import { EntryStategy } from '../constants/EntryStategy';
import { MissingEntryIdException } from '../exceptions/MissingEntryIdException';
import { EntryRecreateException } from '../exceptions/EntryRecreateException';
import { EntryExistsException } from '../exceptions/EntryExistsException';
import { usePromiseBridge } from '../hooks/usePromiseBridge';
import { PromiseBridgeException } from '../exceptions/PromiseBridgeException';

const noope = () => void 0;

describe('PromiseBridge', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(noope);
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('should return correct interface', () => {
        const [Container, open] = PromiseBridge.create();
        const { container } = render(React.createElement(Container));
        expect(container.children.length).toBe(0);
        expectTypeOf(open).toBeFunction();
    });

    describe('Container', () => {
        it('should throw exception on multiple instance of Container', () => {
            const [Container] = PromiseBridge.create();
            expect(() =>
                render(
                    React.createElement(Fragment, {}, [
                        React.createElement(Container, { key: 1 }),
                        React.createElement(Container, { key: 2 }),
                    ]),
                ),
            ).toThrowError(ContainerLimitReachedException);
        });

        it('should render multiple instance of Container', () => {
            const [Container, open] = PromiseBridge.create({ isMultiContainer: true });
            const { container } = render(
                React.createElement(Fragment, {}, [
                    React.createElement(Container, { key: 1 }),
                    React.createElement(Container, { key: 2 }),
                    React.createElement(Container, { key: 3 }),
                ]),
            );
            act(() => {
                open(React.createElement('span')).catch(noope);
            });
            expect(container.children.length).toBe(3);
        });
    });

    describe('open', () => {
        it('should throw exception on destroyed Container', () => {
            const [Container, open] = PromiseBridge.create();
            const { unmount } = render(React.createElement(Container));
            const promise = open(React.createElement('div'));
            unmount();
            expect(promise).rejects.toThrowError(ContainerDestroyedException);
        });

        it('should throw exception on invoke open function without mount Container', () => {
            const [, open] = PromiseBridge.create();
            expect(open(React.createElement('div'))).rejects.toThrowError(ContainerNotMountedException);
        });

        it('should append components to Container with default strategy', () => {
            const [Container, open] = PromiseBridge.create();
            const { container } = render(React.createElement(Container));
            act(() => {
                open(React.createElement('div')).catch(noope);
                open(React.createElement('div'), { strategy: EntryStategy.Normal }).catch(noope);
            });
            expect(container).instanceOf(HTMLDivElement);
            expect(container.children.length).toBe(2);
        });

        it('should throw exception without passed id in Recreate strategy', () => {
            const [Container, open] = PromiseBridge.create();
            render(React.createElement(Container));
            // @ts-expect-error
            expect(open(React.createElement('div'), { strategy: EntryStategy.Recreate })).rejects.toThrowError(
                MissingEntryIdException,
            );
        });

        it('should throw exception first promise with the same id in Recreate strategy', () => {
            const [Container, open] = PromiseBridge.create();
            const { unmount } = render(React.createElement(Container));

            const id = 'customId';

            const instanceA = open(React.createElement('div'), { id, strategy: EntryStategy.Recreate });
            const instanceB = open(React.createElement('div'), { id, strategy: EntryStategy.Recreate });

            unmount();
            expect(instanceA).rejects.toThrowError(EntryRecreateException);
            expect(instanceB).rejects.toThrowError(ContainerDestroyedException);
        });

        it('should throw exception without passed id in RejectIfExists strategy', () => {
            const [Container, open] = PromiseBridge.create();
            render(React.createElement(Container));
            // @ts-expect-error
            expect(open(React.createElement('div'), { strategy: EntryStategy.RejectIfExists })).rejects.toThrowError(
                MissingEntryIdException,
            );
        });

        it('should throw exception new one promise with the same id in RejectIfExists strategy', () => {
            const [Container, open] = PromiseBridge.create();
            const { unmount } = render(React.createElement(Container));

            const id = 'customId';

            const instanceA = open(React.createElement('div'), { id, strategy: EntryStategy.RejectIfExists });
            const instanceB = open(React.createElement('div'), { id, strategy: EntryStategy.RejectIfExists });

            unmount();
            expect(instanceA).rejects.toThrowError(ContainerDestroyedException);
            expect(instanceB).rejects.toThrowError(EntryExistsException);
        });

        it('should open component and resolve using inside hook', async () => {
            function MockComponent() {
                const { resolve } = usePromiseBridge();
                return React.createElement('button', {
                    onClick() {
                        resolve('lorem');
                    },
                });
            }

            const [Container, open] = PromiseBridge.create();
            render(React.createElement(Container));
            let instance: Promise<unknown>;

            act(() => {
                instance = open(React.createElement(MockComponent));
            });

            fireEvent.click(screen.getByRole('button'));
            expect(instance!).resolves.toBe('lorem');
        });

        it('should open component and reject using inside hook', async () => {
            function MockComponent() {
                const { reject } = usePromiseBridge();
                return React.createElement('button', {
                    onClick() {
                        reject(new Error('custom error'));
                    },
                });
            }

            const [Container, open] = PromiseBridge.create();
            render(React.createElement(Container));
            let instance: Promise<unknown>;

            act(() => {
                instance = open(React.createElement(MockComponent));
            });

            fireEvent.click(screen.getByRole('button'));
            expect(instance!).rejects.toThrow(Error);
        });

        it('should throw exception when mount passed component outside invoke function of Promise Bridge', async () => {
            function MockComponent() {
                usePromiseBridge();
                return React.createElement('div');
            }

            expect(() => render(React.createElement(MockComponent))).toThrow(PromiseBridgeException);
        });
    });
});
