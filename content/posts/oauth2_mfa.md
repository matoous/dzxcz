---
title: "Multi-Factor Authentication with OAuth2"
date: 2025-04-28
slug: oauth2_mfa
draft: true
tags: ["writing"]
---

Enhancing Security with RFC 9396 and OAuth 2.0 Step-Up Authentication for Risk-Based MFA

As modern applications increasingly rely on OAuth 2.0 for delegated access and user authorization, the need for adaptive and granular security controls has never been greater—especially when it comes to sensitive or high-risk user actions. Traditional multi-factor authentication (MFA) models often apply the same level of friction to every session, regardless of context. But what if your application could dynamically request stronger authentication only when it matters most?

Enter RFC 9396: OAuth 2.0 Rich Authorization Requests (RAR) and the OAuth 2.0 Step-Up Authentication Challenge Protocol, two powerful specifications that together provide a flexible, standards-based approach to implementing context-aware, risk-based MFA.

In this article, we’ll explore how combining RAR and Step-Up Authentication enables you to prompt users for additional verification only when they're about to perform actions that require a higher level of trust—like changing a password, initiating a wire transfer, or accessing sensitive data. We’ll walk through key concepts, example flows, and implementation patterns that bring this adaptive security model to life.


A Real-World Use Case: Risk-Aware MFA in a Banking App

Imagine a user logs into a banking app to check their balance—no problem, standard session access with their usual credentials is sufficient. But then they attempt to initiate a $10,000 wire transfer. Suddenly, the context changes: the action is sensitive, the risk is higher, and the app needs to make sure the user is really who they say they are. This is the perfect moment to step up authentication.

Instead of applying MFA to every session from the start, the app can use Rich Authorization Requests (RFC 9396) to explicitly describe the high-risk action being requested (e.g., "transaction": { "amount": "10000", "currency": "USD" }) as part of the OAuth 2.0 authorization process. When the authorization server receives this, it can evaluate the requested scope and context, then determine that a stronger assurance is required.

At this point, the authorization server can trigger the Step-Up Authentication Challenge Protocol, issuing a 403 response with a WWW-Authenticate header that signals the client to re-authenticate the user with a stronger method—like biometric verification or a hardware security key.

How It Works: Marrying RFC 9396 and Step-Up Authentication

### 1. Initial Authorization Request

The client initiates an OAuth 2.0 flow, but includes a RAR payload to express the intent of the action:

```
{
  "type": "urn:bank:params:oauth:request:transaction",
  "locations": ["https://api.bank.example/transfer"],
  "actions": ["initiate"],
  "datatypes": ["transaction"],
  "transaction": {
    "amount": "10000",
    "currency": "USD",
    "destination_account": "123456789"
  }
}
```

### 2. Authorization Server Evaluates Risk
Upon receiving the RAR, the server evaluates it against policy—e.g., large transaction + new device = high risk. It determines that higher assurance is required and denies the request with a challenge:

```text
HTTP/1.1 403 Forbidden
WWW-Authenticate: OAuth challenge="step-up", error="interaction_required", 
                  claims="...strong_authentication_claims..."
```
### 3. Client Responds with Step-Up Flow

The client handles the challenge by redirecting the user through a new OAuth authorization flow, this time requiring the user to authenticate with a stronger factor (e.g., FIDO2).

### 4. Token Issued After Sufficient Assurance

Once the step-up is complete, the authorization server issues an access token that now includes the required assurance level (acr claim) and allows the requested action to proceed.

By combining the descriptive power of RAR with the dynamic control of Step-Up Authentication, applications can enforce just-in-time MFA—providing a smoother experience for users and a more intelligent security model for developers.

---

- [Strong customer authentication](https://en.wikipedia.org/wiki/Strong_customer_authentication)
- [RFC 9470 - OAuth 2.0 Step Up Authentication Challenge Protocol](https://www.rfc-editor.org/rfc/rfc9470.html)
- [RFC 9396 - OAuth 2.0 Rich Authorization Requests](https://www.rfc-editor.org/rfc/rfc9396.html)
