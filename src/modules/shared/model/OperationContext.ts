/**
 * Holds contextual information for each operation performed by the user or the AI.
 *
 * Use this class to collect informational messages (such as default/fallback usage)
 * during the execution of a command or operation. Pass an instance of this context
 * to all functions that may want to report info to the user or LLM.
 */
export class OperationContext {
  /**
   * Internal array of informational messages collected during the operation.
   */
  private _info: string[];

  /**
   * Returns all informational messages collected so far.
   */
  get info(): string[] {
    return this._info;
  }

  /**
   * Creates a new, empty operation context.
   */
  constructor() {
    this._info = [];
  }

  /**
   * Adds an informational message to the context.
   *
   * @param message - The message to add (e.g., about a default or fallback used)
   */
  public addInfo(message: string): void {
    this._info.push(message);
  }
}
