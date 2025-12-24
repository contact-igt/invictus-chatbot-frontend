# Meta Embedded Signup - Environment Variables

Add these environment variables to your `.env` file:

## Required for Meta Embedded Signup

```bash
# Meta App ID (Public - can be exposed to frontend)
NEXT_PUBLIC_META_APP_ID=your_meta_app_id_here

# Embedded Signup Configuration ID (Public - can be exposed to frontend)
NEXT_PUBLIC_EMBEDDED_SIGNUP_CONFIG_ID=your_embedded_signup_config_id_here

# Meta App Secret (Private - backend only, NEVER expose to frontend)
META_APP_SECRET=your_meta_app_secret_here
```

## Existing WhatsApp Configuration

```bash
# WhatsApp Business Account ID
WABA_ID=your_whatsapp_business_account_id

# WhatsApp Access Token
WA_ACCESS_TOKEN=your_whatsapp_access_token
```

## How to Get These Values

1. **NEXT_PUBLIC_META_APP_ID**: Found in your Meta App Dashboard
2. **NEXT_PUBLIC_EMBEDDED_SIGNUP_CONFIG_ID**: Created in Meta App Dashboard > WhatsApp > Embedded Signup
3. **META_APP_SECRET**: Found in Meta App Dashboard > Settings > Basic
4. **WABA_ID**: Retrieved after embedded signup completes
5. **WA_ACCESS_TOKEN**: Retrieved after embedded signup completes

## Security Notes

- ⚠️ **NEVER** commit your `.env` file to version control
- ✅ Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- ✅ `META_APP_SECRET` must remain server-side only
