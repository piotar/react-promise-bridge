import { Confirm } from './components/Confirm';
import { Container, open } from './components/SystemPromiseBridge'

export function App() {

  const handleClick = async (message: string) => {
    try {
      await open(<Confirm message={message} />);
      // handle confirm
      console.log('confirmed');
    } catch (e) {
      console.log('cancel confirmation');
    }
  }

  return (
    <div>
      <h1>Example of Promise Bridge</h1>

      <button type='button' onClick={() => open(<p>Mounted component without resolved context</p>)}>Open modal</button>
      <button type='button' onClick={() => handleClick('Confirm message')}>Open confirm modal</button>
      <button type='button' onClick={() => handleClick('Another Confirm message')}>Open another confirm modal</button>

      <Container />
    </div>
  )
}
