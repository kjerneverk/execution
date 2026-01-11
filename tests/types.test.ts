import { describe, it, expect } from 'vitest';
import { createRequest } from '../src/types';
import type { Message, Request, Provider, ProviderResponse, ExecutionOptions } from '../src/types';

describe('types', () => {
    describe('createRequest', () => {
        it('should create a request with the given model', () => {
            const request = createRequest('gpt-4o');
            
            expect(request.model).toBe('gpt-4o');
            expect(request.messages).toEqual([]);
            expect(request.responseFormat).toBeUndefined();
            expect(request.validator).toBeUndefined();
        });

        it('should allow adding messages', () => {
            const request = createRequest('claude-3-opus');
            
            const message: Message = {
                role: 'user',
                content: 'Hello, world!',
            };
            
            request.addMessage(message);
            
            expect(request.messages).toHaveLength(1);
            expect(request.messages[0]).toEqual(message);
        });

        it('should allow adding multiple messages', () => {
            const request = createRequest('gemini-1.5-pro');
            
            request.addMessage({ role: 'system', content: 'You are helpful' });
            request.addMessage({ role: 'user', content: 'Hi' });
            request.addMessage({ role: 'assistant', content: 'Hello!' });
            
            expect(request.messages).toHaveLength(3);
            expect(request.messages[0].role).toBe('system');
            expect(request.messages[1].role).toBe('user');
            expect(request.messages[2].role).toBe('assistant');
        });
    });

    describe('type definitions', () => {
        it('should correctly type Message', () => {
            const message: Message = {
                role: 'user',
                content: 'Test content',
                name: 'test-user',
            };
            
            expect(message.role).toBe('user');
            expect(message.content).toBe('Test content');
            expect(message.name).toBe('test-user');
        });

        it('should allow array content in Message', () => {
            const message: Message = {
                role: 'assistant',
                content: ['Part 1', 'Part 2'],
            };
            
            expect(Array.isArray(message.content)).toBe(true);
        });

        it('should allow null content in Message', () => {
            const message: Message = {
                role: 'assistant',
                content: null,
            };
            
            expect(message.content).toBeNull();
        });

        it('should correctly type ProviderResponse', () => {
            const response: ProviderResponse = {
                content: 'Response text',
                model: 'gpt-4o-2024-01-01',
                usage: {
                    inputTokens: 100,
                    outputTokens: 50,
                },
            };
            
            expect(response.content).toBe('Response text');
            expect(response.model).toBe('gpt-4o-2024-01-01');
            expect(response.usage?.inputTokens).toBe(100);
        });

        it('should correctly type ExecutionOptions', () => {
            const options: ExecutionOptions = {
                apiKey: 'test-key',
                model: 'gpt-4',
                temperature: 0.7,
                maxTokens: 1000,
                timeout: 30000,
                retries: 3,
            };
            
            expect(options.temperature).toBe(0.7);
            expect(options.maxTokens).toBe(1000);
        });
    });
});

