/**
 * Fabric Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/fabric.openapi.types";

// ============================================================================
// Domain Types Export - Domain-specific types only (excludes components/operations)
// ============================================================================
// This file exports domain-specific types for use in main index.ts
// components and operations are NOT exported here to avoid duplicate export errors
// Access components/operations via namespace: domain.types.components

// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type AttributeRisk = components["schemas"]["AttributeRisk"];
export type FabricIdentityProfile = components["schemas"]["FabricIdentityProfile"];
export type FabricProfileListData = components["schemas"]["FabricProfileListData"];
export type FabricRiskLevel = components["schemas"]["FabricRiskLevel"];
export type RecommendedPath = components["schemas"]["RecommendedPath"];
export type FabricEnrollmentScanRequest = components["schemas"]["FabricEnrollmentScanRequest"];
export type RequireFabricPathRequest = components["schemas"]["RequireFabricPathRequest"];
export type Profile = operations["listFabricIdentityProfiles"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type SubmitFabricEnrollmentScanRequestInput = NonNullable<operations["submitFabricEnrollmentScan"]["requestBody"]>["content"]["application/json"];
export type RequireFabricIdentityPathRequestInput = NonNullable<operations["requireFabricIdentityPath"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListFabricIdentityProfilesParams = NonNullable<operations["listFabricIdentityProfiles"]["parameters"]["query"]>;
export type GetFabricIdentityProfileParams = operations["getFabricIdentityProfile"]["parameters"]["path"];
export type RequireFabricIdentityPathParams = operations["requireFabricIdentityPath"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListFabricIdentityProfilesResponse = operations["listFabricIdentityProfiles"]["responses"]["200"]["content"]["application/json"];
export type SubmitFabricEnrollmentScanResponse = operations["submitFabricEnrollmentScan"]["responses"]["201"]["content"]["application/json"];
export type GetFabricIdentityProfileResponse = operations["getFabricIdentityProfile"]["responses"]["200"]["content"]["application/json"];
export type RequireFabricIdentityPathResponse = operations["requireFabricIdentityPath"]["responses"]["200"]["content"]["application/json"];


