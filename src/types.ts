/**
 * Execution Package - Core Types
 *
 * Defines the fundamental types for LLM execution across providers.
 */

// ===== ROLE AND MODEL TYPES =====

/**
 * Message role in a conversation
 */
export type Role = 'user' | 'assistant' | 'system' | 'developer' | 'tool';

/**
 * Model identifier - flexible string to support any model
 */
export type Model = string;

/**
 * Model role mapping for persona/system messages
 */
export type PersonaRole = 'system' | 'developer';

/**
 * Tokenizer encoding to use for token counting
 */
export type TokenizerEncoding = 'gpt-4o' | 'cl100k_base' | 'o200k_base';

// ===== MESSAGE TYPES =====

/**
 * A message in a conversation
 */
export interface Message {
    role: Role;
    content: string | string[] | null;
    name?: string;
}

/**
 * Tool call made by the assistant
 */
export interface ToolCall {
    id: string;
    type: 'function';
    function: {
        name: string;
        arguments: string;
    };
}

/**
 * Message in a conversation (compatible with OpenAI format)
 */
export interface ConversationMessage {
    role: 'system' | 'user' | 'assistant' | 'tool' | 'developer';
    content: string | null;
    name?: string;
    tool_calls?: ToolCall[];
    tool_call_id?: string;
}

// ===== REQUEST TYPES =====

/**
 * LLM request interface
 */
export interface Request {
    messages: Message[];
    model: Model;
    responseFormat?: any;
    validator?: any;
    addMessage(message: Message): void;
}

/**
 * Create a new request object
 */
export function createRequest(model: Model): Request {
    const messages: Message[] = [];

    return {
        model,
        messages,
        responseFormat: undefined,
        validator: undefined,
        addMessage: (message: Message) => {
            messages.push(message);
        },
    };
}

// ===== PROVIDER TYPES =====

/**
 * Response from an LLM provider
 */
export interface ProviderResponse {
    content: string;
    model: string;
    usage?: {
        inputTokens: number;
        outputTokens: number;
    };
    toolCalls?: ToolCall[];
}

/**
 * Options for execution
 */
export interface ExecutionOptions {
    apiKey?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    timeout?: number;
    retries?: number;
}

/**
 * Provider interface for LLM execution
 */
export interface Provider {
    /**
     * Provider name (e.g., 'openai', 'anthropic', 'gemini')
     */
    readonly name: string;

    /**
     * Execute a request against this provider
     */
    execute(request: Request, options?: ExecutionOptions): Promise<ProviderResponse>;

    /**
     * Check if this provider supports a given model
     */
    supportsModel?(model: Model): boolean;
}

// ===== MODEL CONFIGURATION =====

/**
 * Configuration for a model or model family
 */
export interface ModelConfig {
    pattern?: RegExp;
    exactMatch?: string;
    personaRole: PersonaRole;
    encoding: TokenizerEncoding;
    supportsToolCalls?: boolean;
    maxTokens?: number;
    family?: string;
    description?: string;
}

