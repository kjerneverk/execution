# execution

Core interfaces and types for LLM execution providers. This package contains **no SDK dependencies** - it only defines the contracts that provider implementations must follow.

## Installation

```bash
npm install execution
```

## Usage

### Types

```typescript
import type { 
  Provider, 
  ProviderResponse, 
  ExecutionOptions, 
  Request, 
  Message,
  Model 
} from 'execution';
```

### Creating Requests

```typescript
import { createRequest } from 'execution';

const request = createRequest('gpt-4o');
request.addMessage({ role: 'system', content: 'You are a helpful assistant.' });
request.addMessage({ role: 'user', content: 'Hello!' });
```

### Model Registry

The model registry provides model-specific configuration:

```typescript
import { 
  getPersonaRole, 
  getEncoding, 
  configureModel,
  ModelRegistry 
} from 'execution';

// Get the persona role for a model (system vs developer)
const role = getPersonaRole('gpt-4o');     // 'system'
const role2 = getPersonaRole('o1-preview'); // 'developer'

// Get tokenizer encoding
const encoding = getEncoding('claude-3-opus'); // 'cl100k_base'

// Register custom model configuration
configureModel({
  pattern: /^my-custom-model/,
  personaRole: 'system',
  encoding: 'gpt-4o',
  family: 'custom',
});
```

### Implementing a Provider

```typescript
import type { Provider, Request, ProviderResponse, ExecutionOptions } from 'execution';

export class MyProvider implements Provider {
  readonly name = 'my-provider';

  supportsModel(model: string): boolean {
    return model.startsWith('my-');
  }

  async execute(request: Request, options?: ExecutionOptions): Promise<ProviderResponse> {
    // Your implementation here
    return {
      content: 'Response text',
      model: options?.model || request.model,
      usage: {
        inputTokens: 100,
        outputTokens: 50,
      },
    };
  }
}
```

## Related Packages

- `execution-openai` - OpenAI provider implementation
- `execution-anthropic` - Anthropic Claude provider implementation  
- `execution-gemini` - Google Gemini provider implementation
- `agentic` - Tool registry and conversation management

## API Reference

### Types

| Type | Description |
|------|-------------|
| `Provider` | Interface for LLM providers |
| `ProviderResponse` | Response from a provider |
| `ExecutionOptions` | Options for execution (apiKey, temperature, etc.) |
| `Request` | LLM request with messages |
| `Message` | A single message in a conversation |
| `Model` | Model identifier (string) |
| `ModelConfig` | Configuration for a model family |
| `PersonaRole` | 'system' or 'developer' |
| `TokenizerEncoding` | Tokenizer encoding type |

### Functions

| Function | Description |
|----------|-------------|
| `createRequest(model)` | Create a new request object |
| `getPersonaRole(model)` | Get persona role for model |
| `getEncoding(model)` | Get tokenizer encoding for model |
| `configureModel(config)` | Register custom model config |
| `getModelRegistry()` | Get the global model registry |

## License

Apache-2.0

<!-- v1.0.0 -->
