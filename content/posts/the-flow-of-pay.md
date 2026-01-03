---
title: "The flow of pay"
date: 2026-01-01
slug: the-flow-of-pay
draft: true
tags: ["payments", "finance", "infrastructure"]
---

The diagram below lays out the moving parts of a “card present” transaction after you tap a card or wallet. It is intentionally high-level so we can reason about responsibilities, the standards they rely on, and where risk/compliance decisions are made.

## Entities in a Contactless Payment

| Entity | Role | Primary specs / interfaces |
| --- | --- | --- |
| Cardholder & credential (plastic, phone, wearable) | Holds PAN + cryptographic keys/tokenized credentials; initiates the payment via NFC | EMV Contactless, EMVCo tokenization, NFC Forum specs |
| Merchant POS + terminal | Captures card data, prompts for amount, encrypts payload | EMV Level 2 kernel, PCI PTS, point-to-point encryption (P2PE) |
| Payment gateway | Terminates merchant connections, normalizes POS messages, handles retries | REST/JSON or ISO 8583 variants, proprietary real-time APIs |
| Acquirer / merchant bank | Provides merchant account, forwards authorization to network, funds the merchant later | ISO 8583 auth messages, ISO 20022 clearing, settlement files |
| Processor (can be part of acquirer or gateway) | Runs switching logic, token vault, fraud screening | Same as acquirer plus internal risk scoring models |
| Card network (Visa/Mastercard/etc.) | Brand rules, routing directory, interchange calculation, message switching | ISO 8583 (authorization), ISO 20022 (clearing), network-specific risk datasets |
| Issuer (cardholder’s bank/fintech) | Decides approve/decline, sets spending limits, posts to cardholder account | Core banking systems, real-time risk models, ISO 8583 responses |
| Regulators & compliance services | Mandate data retention, AML reporting, consumer disclosures | PSD2/SCA (EU), Durbin (US), PCI DSS, AML directives |

## Initiation (Tap to First Hop)

1. **NFC field + EMV cryptogram**  
   The terminal energizes the card/mobile SE. The credential sends an Application Cryptogram (ARQC) that proves card authenticity and embeds a transaction-specific nonce (UN). Mobile wallets add tokenized PANs plus dynamic CVV3 values.
2. **Terminal risk checks**  
   Before it even dials out, the terminal enforces floor limits, offline limits, CVM (cardholder verification method) results, and whether the merchant is allowed to go offline. These rules live in EMV configuration files downloaded from the acquirer.
3. **Encryption & routing setup**  
   PAN/PAN tokens are encrypted using P2PE or DUKPT keys. The terminal wraps everything into a ISO 8583-like payload or proprietary JSON and sends it through the merchant’s network (MPLS, VPN, or TLS over commodity internet) to the gateway or directly to the acquirer.

## Authorization Hop-by-Hop

1. **Gateway normalization**  
   Gateways map a zoo of terminal message formats to the acquirer’s canonical ISO 8583 field layout, add merchant IDs (MID), terminal IDs (TID), MCC, and unique transaction identifiers (STAN/RRN). They also attach telemetry for retries and idempotency.
2. **Acquirer / processor logic**  
   The acquirer enforces merchant-side controls: velocity checks, compliance flags, MCC-specific risk rules, and optional 3DS triggers for digital wallets acting as card-present. Many acquirers outsource the heavy lifting to processors who manage token vaults, BIN routing tables, and connections to each card network.
3. **Card network switching**  
   Networks receive an ISO 8583 authorization request (`MTI 0100/0200`). They enrich it with network-specific data (e.g., Visa’s CVV results), calculate interchange eligibility, then forward to the issuer’s designated endpoint. Routing uses BIN tables and sometimes smart routing for domestic schemes.
4. **Issuer decision**  
   The issuer validates the cryptogram, checks available credit/deposit balance, applies risk and AML models, and decides approve/decline. The response travels back (`MTI 0110/0210`) with response codes (e.g., `00` approved, `05` decline), CVV/CVC results, and any issuer scripts (updates for the card).
5. **Merchant notification**  
   The approval code propagates back through the acquirer/gateway to the terminal, which prints or displays confirmation. Funds are not yet moved—this is only an authorization hold on the cardholder’s account.

Latency goal for the entire authorization loop is sub-1.5 seconds in most markets; terminals usually timeout around 30 seconds with automatic retries or failover to offline fallback if configured.

## Clearing & Settlement (After the Tap)

1. **Batch capture**  
   The merchant’s system batches approved authorizations (tickets) and submits a capture file or API call to the acquirer. Some verticals (ride share, hotels) adjust the final amount before capture.
2. **Clearing files**  
   Acquirers send clearing records via ISO 8583 `MTI 1240` or increasingly ISO 20022 messages (e.g., `pacs.008`) to the network. These include final amounts, tips, adjustments, and interchange qualifiers.
3. **Net settlement**  
   Networks compute interchange and assessments, then orchestrate net settlement over central bank rails (Fedwire, TARGET2) between acquirers and issuers. Merchants receive funds (minus fees) typically T+1 or T+2.
4. **Posting to cardholder**  
   Issuers move the authorization from “pending” to “posted,” assess interest/fees, and expose the transaction in statements or push notifications.

## Standards & Governance Snapshot

* **Messaging:** ISO 8583 still dominates real-time auth, while ISO 20022 is the strategic direction for clearing/settlement. Networks maintain their own flavor (e.g., Mastercard MDS, VisaNet).  
* **Cryptography:** EMV SDA/DDA/CDA for chip, EMV Contactless for NFC, tokenization specs for wallets, DUKPT for terminal key management, TLS mutual auth between institutions.  
* **Risk & compliance:** PCI DSS for data handling, PSD2/RTS for strong customer authentication in Europe, network operating regulations for dispute windows (chargebacks), FTF/AML reporting obligations.  
* **Service levels:** Schemes define uptime, message turnaround, and incident reporting SLAs; merchants/acquirers cascade those requirements to terminal vendors and processors.

## Why the Structure Matters

* **Operational clarity:** Knowing which hop owns a control (fraud, tokenization, AML) keeps integrations lean and surfaces which contracts govern a particular failure.  
* **Standards alignment:** Even when APIs look “modern,” the payload still maps back to ISO 8583/20022 core fields; ignoring them creates reconciliation blind spots.  
* **Future upgrades:** CBDC acceptance, real-time payments integration, or network tokenization all slot into specific layers (issuer vs. network vs. acquirer). Having a clean map means you can replace or augment one hop without rewriting the whole stack.
