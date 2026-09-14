/**
 * Erasures Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/erasures.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type ErasureCertificate = components["schemas"]["ErasureCertificate"];
export type HolderAck = components["schemas"]["HolderAck"];
export type LogicalErasure = components["schemas"]["LogicalErasure"];
export type LogicalErasureListData = components["schemas"]["LogicalErasureListData"];
export type LogicalErasureStatus = components["schemas"]["LogicalErasureStatus"];
export type PropagationStatus = components["schemas"]["PropagationStatus"];
export type LogicalErasureRequest = components["schemas"]["LogicalErasureRequest"];
export type NudgePropagationRequest = components["schemas"]["NudgePropagationRequest"];
export type Erasure = operations["listLogicalErasures"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type ExecuteLogicalErasureRequestInput = NonNullable<operations["executeLogicalErasure"]["requestBody"]>["content"]["application/json"];
export type NudgeErasurePropagationRequestInput = NonNullable<operations["nudgeErasurePropagation"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListLogicalErasuresParams = NonNullable<operations["listLogicalErasures"]["parameters"]["query"]>;
export type GetLogicalErasureParams = operations["getLogicalErasure"]["parameters"]["path"];
export type GetErasureCertificateParams = operations["getErasureCertificate"]["parameters"]["path"];
export type GetErasurePropagationParams = operations["getErasurePropagation"]["parameters"]["path"];
export type NudgeErasurePropagationParams = operations["nudgeErasurePropagation"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListLogicalErasuresResponse = operations["listLogicalErasures"]["responses"]["200"]["content"]["application/json"];
export type ExecuteLogicalErasureResponse = operations["executeLogicalErasure"]["responses"]["202"]["content"]["application/json"];
export type GetLogicalErasureResponse = operations["getLogicalErasure"]["responses"]["200"]["content"]["application/json"];
export type GetErasureCertificateResponse = operations["getErasureCertificate"]["responses"]["200"]["content"]["application/json"];
export type GetErasurePropagationResponse = operations["getErasurePropagation"]["responses"]["200"]["content"]["application/json"];
export type NudgeErasurePropagationResponse = operations["nudgeErasurePropagation"]["responses"]["200"]["content"]["application/json"];


