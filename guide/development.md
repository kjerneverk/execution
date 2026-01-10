# Development

## Setup

```bash
npm install
npm run build
npm test
```

## Project Structure

```
execution/
├── src/
│   └── index.ts      # All exports
├── tests/
├── guide/
├── package.json
└── tsconfig.json
```

## Adding Model Patterns

In `src/index.ts`:

```typescript
ModelRegistry.registerPattern(/^new-model-/, {
  family: "custom",
  personaRole: "system",
  supportsTools: true
});
```

## Testing

```bash
npm test
npm run test:coverage
```

## Releasing

1. Update version in `package.json`
2. Create GitHub release
3. npm-publish workflow handles the rest

