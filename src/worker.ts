import { decodeNamedCharacterReference } from "decode-named-character-reference";

interface DecoderMessage {
  text: string;
}

self.onmessage = (event: MessageEvent<DecoderMessage>) => {
  const { text } = event.data;
  const result = decodeNamedCharacterReference(text);
  self.postMessage({ input: text, result });
};