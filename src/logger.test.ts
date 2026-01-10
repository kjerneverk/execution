import { describe, it, expect, vi } from 'vitest';
import { DEFAULT_LOGGER, wrapLogger, LIBRARY_NAME, type Logger } from './logger';

describe('logger', () => {
    describe('LIBRARY_NAME', () => {
        it('should be execution', () => {
            expect(LIBRARY_NAME).toBe('execution');
        });
    });

    describe('DEFAULT_LOGGER', () => {
        it('should have all required methods', () => {
            expect(typeof DEFAULT_LOGGER.debug).toBe('function');
            expect(typeof DEFAULT_LOGGER.info).toBe('function');
            expect(typeof DEFAULT_LOGGER.warn).toBe('function');
            expect(typeof DEFAULT_LOGGER.error).toBe('function');
            expect(typeof DEFAULT_LOGGER.verbose).toBe('function');
            expect(typeof DEFAULT_LOGGER.silly).toBe('function');
        });

        it('should have a name property', () => {
            expect(DEFAULT_LOGGER.name).toBe('default');
        });
    });

    describe('wrapLogger', () => {
        it('should wrap a logger with prefixed messages', () => {
            const messages: string[] = [];
            const mockLogger: Logger = {
                name: 'mock',
                debug: (msg: string) => messages.push(`debug: ${msg}`),
                info: (msg: string) => messages.push(`info: ${msg}`),
                warn: (msg: string) => messages.push(`warn: ${msg}`),
                error: (msg: string) => messages.push(`error: ${msg}`),
                verbose: (msg: string) => messages.push(`verbose: ${msg}`),
                silly: (msg: string) => messages.push(`silly: ${msg}`),
            };

            const wrapped = wrapLogger(mockLogger, 'TestModule');
            
            wrapped.info('Test message');
            
            expect(messages[0]).toContain('[execution]');
            expect(messages[0]).toContain('[TestModule]');
            expect(messages[0]).toContain('Test message');
        });

        it('should work without a name', () => {
            const messages: string[] = [];
            const mockLogger: Logger = {
                name: 'mock',
                debug: (msg: string) => messages.push(msg),
                info: (msg: string) => messages.push(msg),
                warn: (msg: string) => messages.push(msg),
                error: (msg: string) => messages.push(msg),
                verbose: (msg: string) => messages.push(msg),
                silly: (msg: string) => messages.push(msg),
            };

            const wrapped = wrapLogger(mockLogger);
            
            wrapped.debug('Debug message');
            
            expect(messages[0]).toContain('[execution]');
            expect(messages[0]).toContain('Debug message');
        });

        it('should throw if logger is missing required methods', () => {
            const incompleteLogger = {
                name: 'incomplete',
                debug: () => {},
                // Missing other methods
            };

            expect(() => {
                wrapLogger(incompleteLogger as any);
            }).toThrow('Logger is missing required methods');
        });

        it('should pass through all log levels', () => {
            const calls: { level: string; message: string }[] = [];
            const mockLogger: Logger = {
                name: 'mock',
                debug: (msg: string) => calls.push({ level: 'debug', message: msg }),
                info: (msg: string) => calls.push({ level: 'info', message: msg }),
                warn: (msg: string) => calls.push({ level: 'warn', message: msg }),
                error: (msg: string) => calls.push({ level: 'error', message: msg }),
                verbose: (msg: string) => calls.push({ level: 'verbose', message: msg }),
                silly: (msg: string) => calls.push({ level: 'silly', message: msg }),
            };

            const wrapped = wrapLogger(mockLogger);
            
            wrapped.debug('debug msg');
            wrapped.info('info msg');
            wrapped.warn('warn msg');
            wrapped.error('error msg');
            wrapped.verbose('verbose msg');
            wrapped.silly('silly msg');
            
            expect(calls).toHaveLength(6);
            expect(calls[0].level).toBe('debug');
            expect(calls[1].level).toBe('info');
            expect(calls[2].level).toBe('warn');
            expect(calls[3].level).toBe('error');
            expect(calls[4].level).toBe('verbose');
            expect(calls[5].level).toBe('silly');
        });

        it('should pass additional arguments', () => {
            const args: any[][] = [];
            const mockLogger: Logger = {
                name: 'mock',
                debug: (...a: any[]) => args.push(a),
                info: (...a: any[]) => args.push(a),
                warn: (...a: any[]) => args.push(a),
                error: (...a: any[]) => args.push(a),
                verbose: (...a: any[]) => args.push(a),
                silly: (...a: any[]) => args.push(a),
            };

            const wrapped = wrapLogger(mockLogger);
            
            wrapped.info('Message', { extra: 'data' }, 123);
            
            expect(args[0]).toHaveLength(3);
            expect(args[0][1]).toEqual({ extra: 'data' });
            expect(args[0][2]).toBe(123);
        });

        it('should return a wrapped logger with name property', () => {
            const mockLogger: Logger = {
                name: 'mock',
                debug: () => {},
                info: () => {},
                warn: () => {},
                error: () => {},
                verbose: () => {},
                silly: () => {},
            };

            const wrapped = wrapLogger(mockLogger);
            
            expect(wrapped.name).toBe('wrapped');
        });
    });
});

