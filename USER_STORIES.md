# Aliaskeep — User stories

**Product:** [PRODUCT.md](./PRODUCT.md)


### Consortium privacy architect

- As a privacy architect, I want to register an off-chain identity vault per data subject pseudonym, so that on-chain records never carry re-identification keys.
- As a privacy architect, I want to allocate link access to a channel member for a defined lawful basis, so that re-identification is purpose-limited and revocable.
- As a privacy architect, I want to execute logical erasure by destroying link material, so that on-chain pseudonyms become irreversibly anonymised for GDPR purposes.

### Channel operator / integration engineer

- As a channel operator, I want API and upload payloads scanned before endorsement, so that comment fields and PDFs do not accidentally write personal data on-chain.
- As an integration engineer, I want Fabric enrollment flows that strip or ZK-prove certificate attributes, so that X.509 personal data does not permanently enter the ledger.

### Privacy counsel

- As privacy counsel, I want an approval gate before new link-allocation policies go live, so that cross-border sharing meets notice and objection requirements.
- As privacy counsel, I want exportable erasure certificates for each completed logical delete, so that I can respond to supervisory authority inquiries.

### Consortium onboarding manager

- As an onboarding manager, I want to block link allocation for a new node until jurisdiction and GDPR role attestations are recorded, so that distributed replication does not outpace legal basis.

### Data subject operations (via controller)

- As a controller operator, I want to trace which consortium members held active links to a subject's pseudonym, so that erasure requests reach every re-identification path.

### Platform administrator

- As a platform administrator, I want negative-path quarantine when classification confidence is low, so that uncertain uploads never default to on-chain storage.
- As a platform administrator, I want alerts when a participant attempts to write identifiers into chaincode keys or values, so that indirect identifiers are caught before endorsement.
