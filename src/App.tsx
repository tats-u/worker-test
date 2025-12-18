import { createSignal, onMount, onCleanup } from 'solid-js'
import './App.css'
import TestWorker from './worker?worker'
import { decodeNamedCharacterReference } from 'decode-named-character-reference'

interface DecoderResult {
  input: string;
  result: string | null;
}

function App() {
  const [input, setInput] = createSignal('')
  const [result, setResult] = createSignal<DecoderResult | null>(null)
  const [useWorker, setUseWorker] = createSignal(true)
  let worker: Worker | null = null

  onMount(() => {
    // Initialize Worker
    worker = new TestWorker()
    worker.onmessage = (event) => {
      setResult(event.data as DecoderResult)
    }
  })
  onCleanup(() => {
    worker?.terminate()
  })

  const handleDecode = () => {
    const text = input().trim()
    if (!text) {
      setResult(null)
      return
    }

    if (useWorker()) {
      worker?.postMessage({ text })
    } else {
      const decoded = decodeNamedCharacterReference(text)
      setResult({ input: text, result: decoded === false ? null : decoded })
    }
  }

  const handleInput = (value: string) => {
    setInput(value)
    if (value.trim()) {
      handleDecode()
    } else {
      setResult(null)
    }
  }

  const getDisplayResult = () => {
    const res = result()
    if (!res || !res.result) return null
    const codePoint = res.result?.codePointAt(0)
    if (codePoint == null) return null

    const codePointLabel = codePoint.toString(16).toUpperCase().padStart(4, "0")
    return {
      input: res.input,
      codePoint: `U+${codePointLabel}`,
      character: res.result,
    }
  }

  const isError = () => {
    const res = result()
    return res && res.result === null
  }

  return (
    <div style="padding: '2rem'; 'max-width': '600px'; margin: '0 auto'">
      <h1>Named Character Reference Decoder</h1>

      <div style="'margin-bottom': '1rem'">
        <label>
          Enter an HTML Named Character Reference:
          <br />
          &amp;<input
            type="text"
            value={input()}
            onInput={(e) => handleInput(e.currentTarget.value)}
            placeholder="e.g., nbsp, amp, hearts"
            style="width: '100%'; padding: '0.5rem'; 'margin-top': '0.5rem'; 'font-size': '1rem'"
          />;
        </label>
      </div>

      <div style="'margin-top': '1rem'">
        <label style="display: 'flex'; 'align-items': 'center'; gap: '0.5rem'">
          <input
            type="checkbox"
            checked={useWorker()}
            onChange={(e) => setUseWorker(e.currentTarget.checked)}
          />
          Use Web Worker
        </label>
      </div>

      {isError() && (
        <div style="'margin-top': '2rem'; padding: '1rem'; 'background-color': '#ffebee'; 'border-radius': '4px'; color: '#c62828'">
          <p>
            <strong>Error:</strong> No matching character reference found for "{result()!.input}"
          </p>
        </div>
      )}

      {getDisplayResult() && (
        <div style="'margin-top': '2rem'; padding: '1rem'; 'background-color': '#f5f5f5'; 'border-radius': '4px'">
          <p>
            <strong>Input:</strong> {getDisplayResult()!.input}
          </p>
          <p>
            <strong>Code Point:</strong> {getDisplayResult()!.codePoint}
          </p>
          <p>
            <strong>Character:</strong> <span style="'font-size': '2rem'">{getDisplayResult()!.character}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default App
