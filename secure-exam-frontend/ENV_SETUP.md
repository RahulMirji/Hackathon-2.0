# Environment Variables Setup

This document explains how to configure the required environment variables for the AI-powered exam system.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# AI API Configuration
AI_API_URL=https://your-ai-provider.com/v1/chat/completions
AI_API_KEY=your_api_key_here
AI_MODEL=your-model-name
AI_PROVIDER=DeepInfra

# Environment
NODE_ENV=development
```

## Variable Descriptions

### AI_API_URL
- **Required**: Yes
- **Description**: The HTTPS endpoint for your AI provider's chat completions API
- **Example**: `https://api.deepinfra.com/v1/chat/completions`
- **Security**: Must use HTTPS in production to prevent interception

### AI_API_KEY
- **Required**: Yes
- **Description**: Your API key for authenticating with the AI provider
- **Security**: Never commit this to version control. Keep it secret.
- **Note**: If you've exposed an API key, rotate it immediately

### AI_MODEL
- **Required**: Yes
- **Description**: The model identifier to use for question generation
- **Example**: `zai-org/GLM-4.6`

### AI_PROVIDER
- **Required**: No (defaults to "DeepInfra")
- **Description**: The name of your AI provider
- **Example**: `DeepInfra`, `OpenAI`, etc.

## Setup Instructions

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and fill in your actual values

3. Verify the configuration:
   - In development, visit `/api/test-ai` to test the connection
   - Check the console for any missing variable warnings

## Security Notes

- **Never commit `.env.local`** to version control (it's in `.gitignore`)
- Use HTTPS endpoints only in production
- Rotate API keys immediately if exposed
- The application will fail to start in production if required variables are missing
- Environment variables are server-only and not exposed to the client

## Production Deployment

When deploying to production:

1. Set all required environment variables in your hosting platform
2. Ensure `NODE_ENV=production`
3. Use HTTPS for `AI_API_URL`
4. The build will fail if required variables are missing

## Troubleshooting

### "Missing required environment variables" error
- Check that all required variables are set in `.env.local`
- Restart the development server after changing environment variables

### API connection failures
- Verify `AI_API_URL` is correct and accessible
- Check that `AI_API_KEY` is valid
- Ensure your network allows HTTPS connections to the AI provider

### Questions not generating
- Check the console for detailed error messages
- Verify the model name in `AI_MODEL` is correct
- Test the API connection using `/api/test-ai` (development only)
