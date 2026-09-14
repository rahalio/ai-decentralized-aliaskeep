/**
 * Participants Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/participants.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type FabricIdentityMode = components["schemas"]["FabricIdentityMode"];
export type GdprRole = components["schemas"]["GdprRole"];
export type OnboardingStatus = components["schemas"]["OnboardingStatus"];
export type Participant = components["schemas"]["Participant"];
export type ParticipantListData = components["schemas"]["ParticipantListData"];
export type ParticipantAttestRequest = components["schemas"]["ParticipantAttestRequest"];
export type ParticipantCreateRequest = components["schemas"]["ParticipantCreateRequest"];
export type ParticipantRevokeRequest = components["schemas"]["ParticipantRevokeRequest"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type OnboardParticipantRequestInput = NonNullable<operations["onboardParticipant"]["requestBody"]>["content"]["application/json"];
export type AttestParticipantRequestInput = NonNullable<operations["attestParticipant"]["requestBody"]>["content"]["application/json"];
export type RevokeParticipantRequestInput = NonNullable<operations["revokeParticipant"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListParticipantsParams = NonNullable<operations["listParticipants"]["parameters"]["query"]>;
export type GetParticipantParams = operations["getParticipant"]["parameters"]["path"];
export type AttestParticipantParams = operations["attestParticipant"]["parameters"]["path"];
export type RevokeParticipantParams = operations["revokeParticipant"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListParticipantsResponse = operations["listParticipants"]["responses"]["200"]["content"]["application/json"];
export type OnboardParticipantResponse = operations["onboardParticipant"]["responses"]["201"]["content"]["application/json"];
export type GetParticipantResponse = operations["getParticipant"]["responses"]["200"]["content"]["application/json"];
export type AttestParticipantResponse = operations["attestParticipant"]["responses"]["200"]["content"]["application/json"];
export type RevokeParticipantResponse = operations["revokeParticipant"]["responses"]["200"]["content"]["application/json"];


