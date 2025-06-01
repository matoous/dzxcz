---
title: "Privacy Pass: Anonymous Authorization for the Modern Web"
date: 2025-05-01
slug: privacy_pass
draft: true
tags: ["writing", "tech"]
---

**Privacy Pass** is a cryptographic protocol designed to enable users to prove authorization or legitimacy to a server without compromising their privacy. At its core, Privacy Pass allows clients to present anonymous tokens that are cryptographically signed by a trusted issuer — without revealing their identity or allowing the issuer or verifier to link activity across sessions.

Originally developed to reduce the friction of CAPTCHA challenges for legitimate users (such as in Cloudflare’s implementation), Privacy Pass has evolved into a general-purpose mechanism for anonymous credentials that are verifiable and unlinkable.

Privacy Pass sets to solve issues such as:

- Reduces UX friction: Instead of solving repeated CAPTCHAs, users can earn tokens once and redeem them multiple times.
- Preserves anonymity: Issuers cannot correlate which client redeemed a token, and verifiers cannot link different token redemptions.
- Supports anti-abuse systems: Especially in bot and spam prevention, where frictionless but effective gating is required.
- Enables privacy-preserving access control: Particularly relevant in contexts like anonymous reputation, email relay access, or SSO.

## Specification

In 2024, the IETF standardized Privacy Pass in a trio of interlocking RFCs: RFC 9576, RFC 9577, and RFC 9578. Each plays a distinct role in codifying the protocol.

### [RFC 9576 - The Privacy Pass Architecture](https://www.rfc-editor.org/rfc/rfc9576.html)

RFC 9576 outlines the overall architecture and system model of Privacy Pass. It provides a high-level view of the protocol and the roles of each actor, laying the groundwork for the other RFCs.

Core components defined:

- Client: The entity seeking authorization (e.g., a browser or custom device).
- Issuer: The trusted party that issues signed, anonymous tokens.
- Attester (optional): A third-party that verifies client legitimacy and helps the issuer make decisions.
- Origin/Verifier: The service accepting the token (e.g., Cloudflare Turnstile).

Protocol Phases:

- Token issuance: The client blinds a token, sends it to the issuer, and receives a blind signature.
- Token redemption: The client unblinds and presents the token to the origin/verifier.

Security and Privacy Properties:

- Unlinkability between issuance and redemption.
- Rate limiting of issuance (e.g., using public metadata or cryptographic proofs).
- Trust model and key distribution between parties.
- RFC 9576 is the blueprint — it defines how the system works in concept and structure.

### [RFC 9577 - The Privacy Pass HTTP Authentication Scheme](https://www.rfc-editor.org/rfc/rfc9577.html)

RFC 9577 standardizes the cryptographic protocol for the issuance phase of Privacy Pass using Verifiable Oblivious Pseudorandom Functions (VOPRFs). It is an instantiation of the abstract model from RFC 9576.

Key Features:

- Based on Oblivious Pseudorandom Functions (OPRFs) from the VOPRF draft (using elliptic curves and hashing).
- Supports batch issuance: clients can request multiple tokens in a single request.
- Ensures blindness: issuers cannot link a signed token to a specific issuance request.
- Includes proof-of-possession to prevent token forgery or misissuance.

Protocol Steps:

- The client generates a blinded version of the token input.
- The issuer computes a VOPRF evaluation on the blinded input.
- The client unblinds the result and obtains a usable token.
- RFC 9577 defines how tokens are securely and privately issued.

### [RFC 9578  - Privacy Pass Issuance Protocols](https://www.rfc-editor.org/rfc/rfc9578.html)

RFC 9578 describes how Privacy Pass is implemented on the web using HTTP(S). It specifies a standardized HTTP API for both token issuance and redemption, ensuring interoperability between clients, issuers, and verifiers.

Key Components:

- Token issuance endpoint:
	- HTTP POST to /privacy-pass/token-issuance
	- Carries blinded inputs in a defined binary format.
- Token redemption endpoint:
	- HTTP POST to the origin (or verifier) including token in request headers or body.

HTTP Binding Format:

- Uses structured binary formats (CBOR/HPKE) for compactness and efficiency.
- Includes headers for issuer origin, token type, and public metadata.

Security Requirements:

- Must use TLS 1.3+.
- Issuers must be authenticated and known to clients.
- Mitigations for replay attacks and token abuse are defined.
- RFC 9578 is the practical interface — it turns the cryptographic protocol into real HTTP requests used in production.

🔄 How These RFCs Fit Together
RFC	Focus Area	Purpose
9576	Architecture	Defines roles, flows, and security goals
9577	Issuance Protocol	Cryptographic details of token issuance
9578	HTTP API Binding	Real-world deployment over HTTP(S)

Together, they form a complete and standardized ecosystem for building privacy-preserving, verifiable token systems across the web.

---

- [Zero-knowledge proof](https://en.wikipedia.org/wiki/Zero-knowledge_proof)
- [Privacy Pass: upgrading to the latest protocol version](https://blog.cloudflare.com/privacy-pass-standard/)
- [Privacy Pass](https://privacypass.github.io/)
- [RFC 9497 - Oblivious Pseudorandom Functions (OPRFs) Using Prime-Order Groups](https://www.rfc-editor.org/info/rfc9497)
