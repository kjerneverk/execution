# AI Agent Guide: Execution

**Role**: You are an AI assistant working with the `execution` package for LLM provider interfaces.

**Goal**: Understand the provider abstraction layer for executing LLM requests across different vendors.

## Core Concept

`execution` defines **interfaces only** - no SDK dependencies. This allows:
- Provider-agnostic code
- Minimal dependency trees
- Easy testing with mocks

Actual implementations are in:
- `execution-openai`
- `execution-anthropic`
- `execution-gemini`

## Key Interfaces

### Provider

```typescript
interface Provider {
  name: string;
  execute(messages: Message[], options: ExecutionOptions): Promise<ProviderResponse>;
  supportsModel?(model: string): boolean;
}
```

### Message

```typescript
interface Message {
  role: "system" | "user" | "assistant" | "developer" | "tool";
  content: string;
  name?: string;
  toolCallId?: string;
}
```

### ExecutionOptions

```typescript
interface ExecutionOptions {
  model: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
  schema?: unknown;
  timeout?: number;
}
```

## Model Registry

```typescript
import { ModelRegistry, getModelFamily, getPersonaRole } from 'execution';

// Get model family
getModelFamily('gpt-4o');        // 'openai'
getModelFamily('claude-3-opus'); // 'anthropic'

// Get persona role (system vs developer)
getPersonaRole('gpt-4o');  // 'system'
getPersonaRole('o1');      // 'developer'

// Register custom model
ModelRegistry.register({
  name: 'my-model',
  family: 'custom',
  personaRole: 'system',
  encoding: 'cl100k_base'
});
```

## Documentation

- [Architecture](./architecture.md): Design decisions
- [Usage](./usage.md): API reference
- [Development](./development.md): Contributing

