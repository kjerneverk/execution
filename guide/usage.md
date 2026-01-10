# Usage

## Installation

```bash
npm install execution
```

## Creating Messages

```typescript
import { Message } from 'execution';

const messages: Message[] = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Hello!' }
];
```

## Using with Providers

```typescript
import { Message, ExecutionOptions } from 'execution';
import { OpenAIProvider } from 'execution-openai';

const provider = new OpenAIProvider();

const response = await provider.execute(messages, {
  model: 'gpt-4o',
  temperature: 0.7,
  maxTokens: 1000
});

console.log(response.content);
console.log(response.usage?.totalTokens);
```

## Model Detection

```typescript
import { getModelFamily, getPersonaRole, supportsVision } from 'execution';

// Detect provider
const family = getModelFamily('gpt-4o'); // 'openai'

// Get correct role
const role = getPersonaRole('o1'); // 'developer' (not 'system'!)

// Check capabilities
if (supportsVision('gpt-4o')) {
  // Can include images
}
```

## Custom Models

```typescript
import { ModelRegistry } from 'execution';

ModelRegistry.register({
  name: 'my-local-llm',
  family: 'custom',
  personaRole: 'system',
  encoding: 'cl100k_base',
  supportsTools: false
});

// Now works with utility functions
getModelFamily('my-local-llm'); // 'custom'
```

## Pattern Registration

```typescript
ModelRegistry.registerPattern(/^llama-/, {
  family: 'custom',
  personaRole: 'system'
});

// Matches any llama- model
getModelFamily('llama-3-70b'); // 'custom'
```

