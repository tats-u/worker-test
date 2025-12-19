import { decodeNamedCharacterReference } from "decode-named-character-reference";

interface DecoderMessage {
  text: string;
}

self.onmessage = (event: MessageEvent<DecoderMessage>) => {
  const { text } = event.data;
  const raw = decodeNamedCharacterReference(text);
  const result = raw === false ? null : raw;
  (self as any).postMessage({ input: text, result });
};

export default {};