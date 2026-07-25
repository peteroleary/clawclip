# Security & Authentication

> Security protocols, authentication strategies, and authorization rules for ClawClip.

## 1. Authentication

- **Provider**: Firebase Authentication.
- **Supported Methods**: Email/Password, Google OAuth, GitHub OAuth.
- **Session**: Managed securely via JWT tokens by the Firebase Client SDK.

## 2. Authorization (Firestore Rules)

- Users can only read data associated with their `companyId`.
- Admin-level actions (deleting users, changing roles) require custom claims verified on the backend (`paperclip/server`).

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /companies/{companyId} {
      allow read: if request.auth != null && request.auth.token.companyId == companyId;
    }
  }
}
```

## 3. Secrets Management
- Use Vercel Environment Variables for frontend secrets.
- Use Google Cloud Secret Manager for backend agent API keys (e.g. OpenAI/Anthropic keys used by AG-Kit).
- NEVER commit `.env.local` files to source control.
