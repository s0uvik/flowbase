# Local Webhook Testing with Ngrok

When developing locally, third-party services (like payment gateways, external APIs, etc.) cannot send webhooks to your `localhost`. To solve this, we use **ngrok** to create a secure tunnel and expose our local development server to the internet.

## Prerequisites

1. Download and install [ngrok](https://ngrok.com/download).
2. Sign up for a free ngrok account and get your authentication token from the dashboard.
3. Authenticate your local ngrok installation:
   ```bash
   ngrok config add-authtoken <your-auth-token>
   ```

## Starting ngrok

1. Start your local development server (usually running on port 3000):

   ```bash
   npm run dev
   ```

2. Open a new terminal window and start ngrok, pointing it to your local server's port. To preserve your URL across restarts, use the `--url` flag to assign a static domain (you will get then domain from ngrok dashboard):

   ```bash
   ngrok http --url=geognostic-kylie-unpanoplied.ngrok-free.dev 3000
   ```

3. ngrok will output a session status screen. Look for the **"Forwarding"** secure URL (which will be `https://geognostic-kylie-unpanoplied.ngrok-free.dev` from the command above).

## Configuring Webhooks

1. Copy the `https` Forwarding URL provided by ngrok.
2. Go to the third-party service dashboard where you configure your webhooks.
3. Paste the ngrok URL and append your application's specific webhook endpoint path.
   - _Example:_ `https://<your-ngrok-url>.ngrok-free.dev/api/webhooks/...`

## Configuring Trusted Origins

Since you are accessing the application from a different domain, authentication services (like `better-auth`), CORS policies, and CSRF protection might block requests.

Make sure to add your ngrok URL to your trusted origins (e.g., in `src/lib/auth.ts`):

```typescript
// Example from src/lib/auth.ts
export const auth = betterAuth({
  // ...
  trustedOrigins: [
    "https://geognostic-kylie-unpanoplied.ngrok-free.dev", // Add your ngrok URL here
    "http://localhost:3000",
  ],
});
```

## Updating Environment Variables

If your application uses environment variables for self-referential links or redirects (such as `NEXT_PUBLIC_APP_URL`), update your `.env` file to temporarily use the ngrok URL:

```env
NEXT_PUBLIC_APP_URL=https://<your-ngrok-url>.ngrok-free.dev
```

> **💡 Pro Tip:** By using the `--url` flag, your ngrok URL will remain the exact same (`https://geognostic-kylie-unpanoplied.ngrok-free.dev`) every time you restart the ngrok process. This saves you from having to update your third-party webhook dashboards, trusted origins, and `.env` file!
