/**
 * Execution Package
 *
 * Core interfaces and types for LLM execution providers.
 * This package contains no provider-specific dependencies.
 *
 * @packageDocumentation
 */

// Types
export type {
    Role,
    Model,
    PersonaRole,
    TokenizerEncoding,
    Message,
    ToolCall,
    ConversationMessage,
    Request,
    ProviderResponse,
    ExecutionOptions,
    Provider,
    ModelConfig,
} from './types.js';

export { createRequest } from './types.js';

// Logger
export type { Logger } from './logger.js';
export { DEFAULT_LOGGER, wrapLogger, LIBRARY_NAME } from './logger.js';

// Model Registry
export {
    ModelRegistry,
    getModelRegistry,
    resetModelRegistry,
    getPersonaRole,
    getEncoding,
    supportsToolCalls,
    getModelFamily,
    configureModel,
} from './model-registry.js';

/**
 * Package version
 */
export const VERSION = '0.0.1';
