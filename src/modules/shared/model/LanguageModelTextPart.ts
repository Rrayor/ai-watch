/**
 * A language model response part containing a piece of text, returned from a {@link LanguageModelChatResponse}.
 */
export class LanguageModelTextPart {
  /**
   * The text content of the part.
   */
  value: string;

  /**
   * Construct a text part with the given content.
   * @param value The text content of the part.
   */
  constructor(value: string) {
    this.value = value;
  }
}
