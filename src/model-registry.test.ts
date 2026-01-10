import { describe, it, expect, beforeEach } from 'vitest';
import {
    ModelRegistry,
    getModelRegistry,
    resetModelRegistry,
    getPersonaRole,
    getEncoding,
    supportsToolCalls,
    getModelFamily,
    configureModel,
} from './model-registry';

describe('ModelRegistry', () => {
    let registry: ModelRegistry;

    beforeEach(() => {
        registry = new ModelRegistry();
    });

    describe('default configurations', () => {
        it('should recognize GPT-4 models', () => {
            const config = registry.getConfig('gpt-4o');
            
            expect(config.family).toBe('gpt-4');
            expect(config.personaRole).toBe('system');
            expect(config.encoding).toBe('gpt-4o');
        });

        it('should recognize Claude models', () => {
            const config = registry.getConfig('claude-3-opus-20240229');
            
            expect(config.family).toBe('claude');
            expect(config.personaRole).toBe('system');
            expect(config.encoding).toBe('cl100k_base');
        });

        it('should recognize O-series models with developer role', () => {
            const config = registry.getConfig('o1-preview');
            
            expect(config.family).toBe('o-series');
            expect(config.personaRole).toBe('developer');
        });

        it('should recognize Gemini models', () => {
            const config = registry.getConfig('gemini-1.5-pro');
            
            expect(config.family).toBe('gemini');
            expect(config.personaRole).toBe('system');
        });

        it('should fall back to default for unknown models', () => {
            const config = registry.getConfig('unknown-model-xyz');
            
            expect(config.family).toBe('unknown');
            expect(config.personaRole).toBe('system');
        });
    });

    describe('getPersonaRole', () => {
        it('should return system for GPT models', () => {
            expect(registry.getPersonaRole('gpt-4')).toBe('system');
            expect(registry.getPersonaRole('gpt-4-turbo')).toBe('system');
        });

        it('should return developer for O-series', () => {
            expect(registry.getPersonaRole('o1')).toBe('developer');
            expect(registry.getPersonaRole('o3-mini')).toBe('developer');
        });
    });

    describe('getEncoding', () => {
        it('should return gpt-4o for GPT models', () => {
            expect(registry.getEncoding('gpt-4o')).toBe('gpt-4o');
        });

        it('should return cl100k_base for Claude models', () => {
            expect(registry.getEncoding('claude-3-sonnet')).toBe('cl100k_base');
        });
    });

    describe('supportsToolCalls', () => {
        it('should return true for all default models', () => {
            expect(registry.supportsToolCalls('gpt-4o')).toBe(true);
            expect(registry.supportsToolCalls('claude-3-opus')).toBe(true);
            expect(registry.supportsToolCalls('o1')).toBe(true);
        });
    });

    describe('register', () => {
        it('should allow registering custom model configurations', () => {
            registry.register({
                exactMatch: 'my-custom-model',
                personaRole: 'developer',
                encoding: 'cl100k_base',
                family: 'custom',
            });

            const config = registry.getConfig('my-custom-model');
            
            expect(config.family).toBe('custom');
            expect(config.personaRole).toBe('developer');
        });

        it('should allow pattern-based registration', () => {
            registry.register({
                pattern: /^llama/i,
                personaRole: 'system',
                encoding: 'cl100k_base',
                family: 'llama',
            });

            const config = registry.getConfig('llama-3-70b');
            
            expect(config.family).toBe('llama');
        });

        it('should throw if neither pattern nor exactMatch provided', () => {
            expect(() => {
                registry.register({
                    personaRole: 'system',
                    encoding: 'gpt-4o',
                } as any);
            }).toThrow('Model config must have either pattern or exactMatch');
        });
    });

    describe('caching', () => {
        it('should cache config lookups', () => {
            const config1 = registry.getConfig('gpt-4o');
            const config2 = registry.getConfig('gpt-4o');
            
            expect(config1).toBe(config2); // Same object reference
        });

        it('should clear cache on new registration', () => {
            const config1 = registry.getConfig('gpt-4o');
            
            registry.register({
                exactMatch: 'new-model',
                personaRole: 'system',
                encoding: 'gpt-4o',
            });
            
            // Cache should be cleared, but same config returned
            const config2 = registry.getConfig('gpt-4o');
            expect(config1.family).toBe(config2.family);
        });
    });

    describe('reset', () => {
        it('should reset to default configurations', () => {
            registry.register({
                exactMatch: 'custom',
                personaRole: 'developer',
                encoding: 'gpt-4o',
            });
            
            registry.reset();
            
            // Custom model should now fall back to default
            const config = registry.getConfig('custom');
            expect(config.family).toBe('unknown');
        });
    });

    describe('getAllConfigs', () => {
        it('should return all registered configurations', () => {
            const configs = registry.getAllConfigs();
            
            expect(configs.length).toBeGreaterThan(0);
            expect(configs.some(c => c.family === 'gpt-4')).toBe(true);
            expect(configs.some(c => c.family === 'claude')).toBe(true);
        });
    });
});

describe('global registry functions', () => {
    beforeEach(() => {
        resetModelRegistry();
    });

    it('getModelRegistry should return singleton', () => {
        const registry1 = getModelRegistry();
        const registry2 = getModelRegistry();
        
        expect(registry1).toBe(registry2);
    });

    it('getPersonaRole should work with global registry', () => {
        expect(getPersonaRole('gpt-4')).toBe('system');
        expect(getPersonaRole('o1')).toBe('developer');
    });

    it('getEncoding should work with global registry', () => {
        expect(getEncoding('gpt-4o')).toBe('gpt-4o');
    });

    it('supportsToolCalls should work with global registry', () => {
        expect(supportsToolCalls('gpt-4')).toBe(true);
    });

    it('getModelFamily should work with global registry', () => {
        expect(getModelFamily('gpt-4')).toBe('gpt-4');
        expect(getModelFamily('claude-3')).toBe('claude');
    });

    it('configureModel should add to global registry', () => {
        configureModel({
            exactMatch: 'test-model',
            personaRole: 'developer',
            encoding: 'gpt-4o',
            family: 'test',
        });
        
        expect(getModelFamily('test-model')).toBe('test');
    });

    it('resetModelRegistry should create new instance', () => {
        const registry1 = getModelRegistry();
        resetModelRegistry();
        const registry2 = getModelRegistry();
        
        expect(registry1).not.toBe(registry2);
    });
});

