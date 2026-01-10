# Architecture

## Design Philosophy

### No SDK Dependencies

This package contains **only interfaces and utilities**. No vendor SDKs are included:

- ✅ Type definitions
- ✅ Model registry
- ✅ Utility functions
- ❌ OpenAI SDK
- ❌ Anthropic SDK
- ❌ Google AI SDK

### Provider Pattern

Each provider is a separate package that implements the `Provider` interface:

```
execution (interfaces)
    ↓
    ├── execution-openai (openai SDK)
    ├── execution-anthropic (@anthropic-ai/sdk)
    └── execution-gemini (@google/generative-ai)
```

### Model Registry

Central configuration for model capabilities:

- **Family detection**: Which provider handles which model
- **Persona role mapping**: `system` vs `developer` role
- **Capability flags**: Vision, tools, etc.
- **Pattern matching**: Handle model variants

## Module Structure

```
src/
└── index.ts          # All exports in one file
    ├── Message types
    ├── ExecutionOptions
    ├── ProviderResponse
    ├── Provider interface
    ├── ModelConfig
    ├── ModelRegistry
    └── Utility functions
```

## Type Flow

```
Message[] + ExecutionOptions
        ↓
    Provider.execute()
        ↓
   ProviderResponse
```

