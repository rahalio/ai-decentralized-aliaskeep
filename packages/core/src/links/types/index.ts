/**
 * Links Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/links.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type LinkGrant = components["schemas"]["LinkGrant"];
export type LinkGrantListData = components["schemas"]["LinkGrantListData"];
export type LinkGrantStatus = components["schemas"]["LinkGrantStatus"];
export type LinkPolicy = components["schemas"]["LinkPolicy"];
export type LinkPolicyApprovalStatus = components["schemas"]["LinkPolicyApprovalStatus"];
export type LinkPolicyListData = components["schemas"]["LinkPolicyListData"];
export type CounselDecisionRequest = components["schemas"]["CounselDecisionRequest"];
export type LinkGrantCreateRequest = components["schemas"]["LinkGrantCreateRequest"];
export type LinkPolicyCreateRequest = components["schemas"]["LinkPolicyCreateRequest"];
export type RevokeLinkGrantRequest = components["schemas"]["RevokeLinkGrantRequest"];
export type SuspendLinkGrantRequest = components["schemas"]["SuspendLinkGrantRequest"];
export type Grant = operations["listLinkGrants"]["responses"]["200"]["content"]["application/json"]["data"];
export type Policy = operations["listLinkPolicies"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type AllocateLinkGrantRequestInput = NonNullable<operations["allocateLinkGrant"]["requestBody"]>["content"]["application/json"];
export type RevokeLinkGrantRequestInput = NonNullable<operations["revokeLinkGrant"]["requestBody"]>["content"]["application/json"];
export type SuspendLinkGrantRequestInput = NonNullable<operations["suspendLinkGrant"]["requestBody"]>["content"]["application/json"];
export type CreateLinkPolicyRequestInput = NonNullable<operations["createLinkPolicy"]["requestBody"]>["content"]["application/json"];
export type ApproveLinkPolicyRequestInput = NonNullable<operations["approveLinkPolicy"]["requestBody"]>["content"]["application/json"];
export type RejectLinkPolicyRequestInput = NonNullable<operations["rejectLinkPolicy"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListLinkGrantsParams = NonNullable<operations["listLinkGrants"]["parameters"]["query"]>;
export type GetLinkGrantParams = operations["getLinkGrant"]["parameters"]["path"];
export type RevokeLinkGrantParams = operations["revokeLinkGrant"]["parameters"]["path"];
export type SuspendLinkGrantParams = operations["suspendLinkGrant"]["parameters"]["path"];
export type RestoreLinkGrantParams = operations["restoreLinkGrant"]["parameters"]["path"];
export type ListLinkPoliciesParams = NonNullable<operations["listLinkPolicies"]["parameters"]["query"]>;
export type ApproveLinkPolicyParams = operations["approveLinkPolicy"]["parameters"]["path"];
export type RejectLinkPolicyParams = operations["rejectLinkPolicy"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListLinkGrantsResponse = operations["listLinkGrants"]["responses"]["200"]["content"]["application/json"];
export type AllocateLinkGrantResponse = operations["allocateLinkGrant"]["responses"]["201"]["content"]["application/json"];
export type GetLinkGrantResponse = operations["getLinkGrant"]["responses"]["200"]["content"]["application/json"];
export type RevokeLinkGrantResponse = operations["revokeLinkGrant"]["responses"]["200"]["content"]["application/json"];
export type SuspendLinkGrantResponse = operations["suspendLinkGrant"]["responses"]["200"]["content"]["application/json"];
export type RestoreLinkGrantResponse = operations["restoreLinkGrant"]["responses"]["200"]["content"]["application/json"];
export type ListLinkPoliciesResponse = operations["listLinkPolicies"]["responses"]["200"]["content"]["application/json"];
export type CreateLinkPolicyResponse = operations["createLinkPolicy"]["responses"]["201"]["content"]["application/json"];
export type ApproveLinkPolicyResponse = operations["approveLinkPolicy"]["responses"]["200"]["content"]["application/json"];
export type RejectLinkPolicyResponse = operations["rejectLinkPolicy"]["responses"]["200"]["content"]["application/json"];


