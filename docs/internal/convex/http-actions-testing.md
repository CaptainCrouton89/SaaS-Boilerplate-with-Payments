# Convex HTTP Actions Testing and Troubleshooting

This document provides comprehensive guidance for testing and debugging Convex HTTP actions, including critical domain requirements and common issues.

## Critical Domain Requirements

### HTTP Actions vs API Endpoints

Convex uses different domains for different types of endpoints:

- **HTTP Actions**: `https://<deployment-name>.convex.site`
- **Query/Mutation API**: `https://<deployment-name>.convex.cloud/api/query`

**❌ Common Mistake**: Using `.convex.cloud` for HTTP actions will result in 404 errors.

**✅ Correct Usage**:
```bash
# HTTP Actions (defined in convex/http.ts)
curl https://acoustic-mule-30.convex.site/stripe/webhook

# Query API calls  
curl https://acoustic-mule-30.convex.cloud/api/query \
  -d '{"path": "products:getProducts", "args": {}, "format": "json"}' \
  -X POST -H "Content-Type: application/json"
```

## Testing HTTP Actions with curl

### Basic GET Request
```bash
curl -X GET https://<deployment-name>.convex.site/your-endpoint
```

### POST Request with JSON Data
```bash
curl -X POST https://<deployment-name>.convex.site/your-endpoint \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### Testing with Headers
```bash
curl -X POST https://<deployment-name>.convex.site/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token" \
  -H "Custom-Header: value" \
  -d '{"data": "test"}'
```

### Verbose Output for Debugging
```bash
curl -X POST https://<deployment-name>.convex.site/endpoint \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  -v \
  -w "\nStatus: %{http_code}\n"
```

## Debugging Workflow

### 1. Check Deployment and Function Visibility

- Verify functions are deployed in the [Convex dashboard](https://dashboard.convex.dev/deployment/functions)
- Ensure there's an entry called `http` for HTTP actions
- Check that your HTTP actions are defined in exactly `http.js` or `http.ts`

### 2. Verify No Build Errors

```bash
# Check for TypeScript errors
npx convex dev

# Look for errors in terminal output
# TypeScript errors block code sync by default
```

### 3. Confirm Correct URL Structure

**File naming**: `convex/http.ts` (exact name required)

**Router setup**:
```typescript
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/your-endpoint",
  method: "POST", 
  handler: httpAction(async (ctx, request) => {
    return new Response("OK", { status: 200 });
  }),
});

export default http;
```

### 4. Test with Simple Endpoint

Create a test endpoint to verify basic HTTP routing:

```typescript
// In convex/http.ts
http.route({
  path: "/test",
  method: "GET",
  handler: httpAction(async () => {
    return new Response("Test endpoint working!", { status: 200 });
  }),
});
```

Test it:
```bash
curl https://<deployment-name>.convex.site/test
# Should return: "Test endpoint working!"
```

### 5. Check Logs

Monitor the [logs page](https://dashboard.convex.dev/deployment/logs) in your dashboard to see if requests are reaching your backend.

## Common Issues and Solutions

### 404 Errors

**Symptom**: All HTTP action requests return 404

**Causes & Solutions**:
1. **Wrong domain**: Using `.convex.cloud` instead of `.convex.site`
   ```bash
   # ❌ Wrong
   curl https://deployment.convex.cloud/endpoint
   
   # ✅ Correct  
   curl https://deployment.convex.site/endpoint
   ```

2. **File naming**: HTTP actions must be in exactly `http.ts` or `http.js`
   
3. **Export issues**: Ensure you're exporting the router as default:
   ```typescript
   export default http;
   ```

4. **TypeScript errors**: Check for compilation errors blocking deployment

### Function Not Found in Dashboard

**Solutions**:
- Verify file is named exactly `convex/http.ts`
- Check for TypeScript compilation errors
- Ensure proper export structure
- Restart `npx convex dev`

### Authentication Issues

**External curl requests vs website**: If endpoints work from your website but fail with curl, this is often due to missing authentication headers that your website automatically includes.

**For webhooks**: This is usually expected behavior - external services like Stripe will include proper authentication.

## Stripe Webhook Specific Issues

### Async Crypto Operations

**Issue**: `SubtleCryptoProvider cannot be used in a synchronous context`

**Solution**: Use the async version for signature verification:
```typescript
// ❌ Wrong
const event = stripe.webhooks.constructEvent(body, signature, secret);

// ✅ Correct
const event = await stripe.webhooks.constructEventAsync(body, signature, secret);
```

### Webhook URL Configuration

**Development setup**:
```bash
# Correct webhook forwarding
stripe listen --forward-to https://deployment-name.convex.site/stripe/webhook
```

**Package.json script**:
```json
{
  "dev:stripe": "stripe listen --forward-to https://deployment-name.convex.site/stripe/webhook"
}
```

## Testing Queries and Mutations

For non-HTTP endpoints, use the API format:

```bash
curl https://<deployment-name>.convex.cloud/api/query \
  -d '{"path": "tableName:functionName", "args": {}, "format": "json"}' \
  -X POST -H "Content-Type: application/json"
```

Example:
```bash
curl https://acoustic-mule-30.convex.cloud/api/query \
  -d '{"path": "products:getProducts", "args": {}, "format": "json"}' \
  -X POST -H "Content-Type: application/json"
```

## CORS Considerations

For browser-based requests, you may need to handle CORS:

```typescript
http.route({
  path: "/api/endpoint",
  method: "OPTIONS", // Handle preflight
  handler: httpAction(async () => {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});
```

## Quick Reference

### Deployment URLs
- **Dev environment**: `https://acoustic-mule-30.convex.site` (HTTP actions)
- **Dev environment**: `https://acoustic-mule-30.convex.cloud` (API queries)

### Test Commands
```bash
# Test HTTP action
curl https://acoustic-mule-30.convex.site/test

# Test API query  
curl https://acoustic-mule-30.convex.cloud/api/query \
  -d '{"path": "products:getProducts", "args": {}, "format": "json"}' \
  -X POST -H "Content-Type: application/json"

# Test webhook with verbose output
curl -X POST https://acoustic-mule-30.convex.site/stripe/webhook \
  -H "Content-Type: application/json" \
  -H "stripe-signature: test" \
  -d '{"test": "data"}' \
  -v
```

### File Structure
```
convex/
├── http.ts          # HTTP actions (must be exact name)
├── products.ts      # Queries and mutations
└── _generated/      # Auto-generated types
```

## Additional Resources

- [Convex HTTP Actions Documentation](https://docs.convex.dev/functions/http-actions)
- [Convex HTTP API Documentation](https://docs.convex.dev/http-api/)
- [Convex Debugging Guide](https://docs.convex.dev/functions/http-actions#debugging)