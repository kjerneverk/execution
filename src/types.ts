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

// ===== TOOL DEFINITION TYPES =====

/**
 * JSON Schema for tool parameters
 */
export interface ToolParameterSchema {
    type: 'object';
    properties: Record<string, {
        type: string;
        description?: string;
        enum?: string[];
        items?: { type: string };
        default?: any;
    }>;
    required?: string[];
    additionalProperties?: boolean;
}

/**
 * Tool definition for LLM function calling
 * Provider-agnostic format that maps to both Anthropic and OpenAI schemas
 */
export interface ToolDefinition {
    /** Unique name for the tool (used in function calls) */
    name: string;
    /** Description of what the tool does (helps LLM decide when to use it) */
    description: string;
    /** JSON Schema defining the tool's parameters */
    parameters: ToolParameterSchema;
}

// ===== STREAMING TYPES =====

/**
 * Type of streaming chunk
 */
export type StreamChunkType = 'text' | 'tool_call_start' | 'tool_call_delta' | 'tool_call_end' | 'usage' | 'done';

/**
 * A chunk from a streaming response
 */
export interface StreamChunk {
    type: StreamChunkType;
    /** Text content delta (for type='text') */
    text?: string;
    /** Tool call information (for tool_call_* types) */
    toolCall?: {
        /** Tool call ID (available on start and end) */
        id?: string;
        /** Index of this tool call in the response */
        index?: number;
        /** Function name (available on start) */
        name?: string;
        /** Arguments delta (for tool_call_delta) */
        argumentsDelta?: string;
    };
    /** Usage information (for type='usage') */
    usage?: {
        inputTokens: number;
        outputTokens: number;
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
    /** Tool definitions for function calling */
    tools?: ToolDefinition[];
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
     * Execute a request against this provider (non-streaming)
     */
    execute(request: Request, options?: ExecutionOptions): Promise<ProviderResponse>;

    /**
     * Execute a request with streaming response
     * Returns an async iterable of chunks
     */
    executeStream?(request: Request, options?: ExecutionOptions): AsyncIterable<StreamChunk>;

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

