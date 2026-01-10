/**
 * Execution Package - Model Registry
 *
 * Provides a flexible, user-configurable system for model detection and configuration.
 */

import { DEFAULT_LOGGER, wrapLogger, type Logger } from './logger.js';
import type { ModelConfig, PersonaRole, TokenizerEncoding } from './types.js';

/**
 * Model registry for managing model configurations
 */
export class ModelRegistry {
    private configs: ModelConfig[];
    private cache: Map<string, ModelConfig>;
    private logger: Logger;

    constructor(logger?: Logger) {
        this.configs = [];
        this.cache = new Map();
        this.logger = wrapLogger(logger || DEFAULT_LOGGER, 'ModelRegistry');

        // Register default configurations
        this.registerDefaults();
    }

    /**
     * Register default model configurations
     */
    private registerDefaults(): void {
        // Default fallback (Registered first so it ends up last with unshift)
        this.register({
            pattern: /.*/,
            personaRole: 'system',
            encoding: 'gpt-4o',
            supportsToolCalls: true,
            family: 'unknown',
            description: 'Default fallback configuration',
        });

        // Claude family (uses 'system' role)
        this.register({
            pattern: /^claude/i,
            personaRole: 'system',
            encoding: 'cl100k_base',
            supportsToolCalls: true,
            family: 'claude',
            description: 'Claude family models',
        });

        // O-series models (uses 'developer' role)
        this.register({
            pattern: /^o\d+/i,
            personaRole: 'developer',
            encoding: 'gpt-4o',
            supportsToolCalls: true,
            family: 'o-series',
            description: 'O-series reasoning models',
        });

        // GPT-4 family (uses 'system' role)
        this.register({
            pattern: /^gpt-4/i,
            personaRole: 'system',
            encoding: 'gpt-4o',
            supportsToolCalls: true,
            family: 'gpt-4',
            description: 'GPT-4 family models',
        });

        // Gemini family
        this.register({
            pattern: /^gemini/i,
            personaRole: 'system',
            encoding: 'cl100k_base',
            supportsToolCalls: true,
            family: 'gemini',
            description: 'Gemini family models',
        });

        this.logger.debug('Registered default model configurations');
    }

    /**
     * Register a model configuration
     */
    register(config: ModelConfig): void {
        if (!config.pattern && !config.exactMatch) {
            throw new Error('Model config must have either pattern or exactMatch');
        }

        this.configs.unshift(config);
        this.cache.clear();

        this.logger.debug('Registered model config', {
            family: config.family,
            pattern: config.pattern?.source,
            exactMatch: config.exactMatch,
        });
    }

    /**
     * Get configuration for a model
     */
    getConfig(model: string): ModelConfig {
        if (this.cache.has(model)) {
            return this.cache.get(model)!;
        }

        for (const config of this.configs) {
            if (config.exactMatch && config.exactMatch === model) {
                this.cache.set(model, config);
                return config;
            }

            if (config.pattern && config.pattern.test(model)) {
                this.cache.set(model, config);
                return config;
            }
        }

        throw new Error(`No configuration found for model: ${model}`);
    }

    /**
     * Get persona role for a model
     */
    getPersonaRole(model: string): PersonaRole {
        return this.getConfig(model).personaRole;
    }

    /**
     * Get tokenizer encoding for a model
     */
    getEncoding(model: string): TokenizerEncoding {
        return this.getConfig(model).encoding;
    }

    /**
     * Check if model supports tool calls
     */
    supportsToolCalls(model: string): boolean {
        return this.getConfig(model).supportsToolCalls ?? true;
    }

    /**
     * Get model family
     */
    getFamily(model: string): string | undefined {
        return this.getConfig(model).family;
    }

    /**
     * Clear all registered configs and reset to defaults
     */
    reset(): void {
        this.configs = [];
        this.cache.clear();
        this.registerDefaults();
        this.logger.debug('Reset model configurations to defaults');
    }

    /**
     * Clear cache
     */
    clearCache(): void {
        this.cache.clear();
        this.logger.debug('Cleared model configuration cache');
    }

    /**
     * Get all registered configurations
     */
    getAllConfigs(): ModelConfig[] {
        return [...this.configs];
    }
}

// Global registry instance
let globalRegistry: ModelRegistry | null = null;

/**
 * Get the global model registry
 */
export function getModelRegistry(logger?: Logger): ModelRegistry {
    if (!globalRegistry) {
        globalRegistry = new ModelRegistry(logger);
    }
    return globalRegistry;
}

/**
 * Reset the global registry
 */
export function resetModelRegistry(): void {
    globalRegistry = null;
}

/**
 * Helper functions using global registry
 */
export function getPersonaRole(model: string): PersonaRole {
    return getModelRegistry().getPersonaRole(model);
}

export function getEncoding(model: string): TokenizerEncoding {
    return getModelRegistry().getEncoding(model);
}

export function supportsToolCalls(model: string): boolean {
    return getModelRegistry().supportsToolCalls(model);
}

export function getModelFamily(model: string): string | undefined {
    return getModelRegistry().getFamily(model);
}

/**
 * Configure a custom model
 */
export function configureModel(config: ModelConfig): void {
    getModelRegistry().register(config);
}

export default ModelRegistry;

