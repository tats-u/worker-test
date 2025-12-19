/** @jsxImportSource solid-js */
import { createSignal, onMount, onCleanup, Show } from 'solid-js'
import './App.css'
import TestWorker from './worker?worker'
import { decodeNamedCharacterReference } from 'decode-named-character-reference'

interface DecoderSuccess {
  input: string;
  result: string | null;
}

function App() {
  const [input, setInput] = createSignal('')
  const [result, setResult] = createSignal<DecoderSuccess | null>(null)
  const [useWorker, setUseWorker] = createSignal(true)
  let worker: Worker | null = null

  onMount(() => {
    // Initialize Worker
    worker = new TestWorker()
    worker.onmessage = (event) => {
      setResult(event.data as DecoderSuccess)
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
    if (!res) return null
    if (!res.result) return null
    const codePoint = res.result.codePointAt(0)
    if (codePoint == null) return null

    const codePointLabel = codePoint.toString(16).toUpperCase().padStart(4, "0")
    return {
      input: res.input,
      codePoint: `U+${codePointLabel}`,
      character: res.result,
    }
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


      <Show when={getDisplayResult()}
        fallback={
          <p style="'margin-top': '2rem'">
            <Show when={input()} fallback={<span style="'font-style': 'italic'">No input</span>}>
              No corresponding character found: {input()}
            </Show>
          </p>
        }>
        {(d) => (
          <div style="'margin-top': '2rem'; padding: '1rem'; 'background-color': '#f5f5f5'; 'border-radius': '4px'">
            <p>
              <strong>Input:</strong> {d().input}
            </p>
            <p>
              <strong>Code Point:</strong> {d().codePoint}
            </p>
            <p>
              <strong>Character:</strong> <span style="'font-size': '2rem'">{d().character}</span>
            </p>
          </div>
        )}
      </Show>
    </div>
  )
}

export default App
