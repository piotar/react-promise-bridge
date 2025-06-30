import { Fragment, ReactElement, useState } from 'react';
import { Container } from './components/SystemPromiseBridge';
import { SomeChild } from './components/SomeChild';

export function App(): ReactElement {
    const [isSomeChildVisible, setIsSomeChildVisible] = useState(true);

    return (
        <Fragment>
            <article>
                <h1>Example of Promise Bridge</h1>
                <p>Lorem ipsum dolor sit...</p>
                <nav>
                    <button type="button" onClick={() => setIsSomeChildVisible((prev) => !prev)}>
                        Toggle visible child component
                    </button>
                </nav>
            </article>
            {isSomeChildVisible ? <SomeChild /> : null}
            <Container />
        </Fragment>
    );
}
