import { CSSProperties, useState } from "react";
import { useDisposePromiseBridge } from "@piotar/react-promise-bridge";
import { ColorPicker } from "./ColorPicker";
import { open } from "./SystemPromiseBridge";

export function SomeChild(): JSX.Element {
    const [style, setStyle] = useState<CSSProperties | undefined>();
    const { signal } = useDisposePromiseBridge();

    const handleColorPickerClick = async () => {
        try {
            const color = await open<string>(<ColorPicker value={style?.color} />, { signal });
            console.log('selected color', color);
            setStyle({ color });
        } catch (error) {
            console.warn(error instanceof Error ? error.message : error);
        }
    };

    return <article style={style}>
        <nav>
            <button type="button" onClick={handleColorPickerClick}>
                Open color picker
            </button>
        </nav>
        <p>Lorem ipsum dolor sit...</p>
    </article>;
}