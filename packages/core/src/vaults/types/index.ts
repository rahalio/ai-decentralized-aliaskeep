/**
 * Vaults Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/vaults.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type IdentityVault = components["schemas"]["IdentityVault"];
export type IdentityVaultListData = components["schemas"]["IdentityVaultListData"];
export type IdentityVaultStatus = components["schemas"]["IdentityVaultStatus"];
export type BindPseudonymRequest = components["schemas"]["BindPseudonymRequest"];
export type FlagDuplicateRequest = components["schemas"]["FlagDuplicateRequest"];
export type IdentityVaultCreateRequest = components["schemas"]["IdentityVaultCreateRequest"];
export type Vault = operations["listIdentityVaults"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type CreateIdentityVaultRequestInput = NonNullable<operations["createIdentityVault"]["requestBody"]>["content"]["application/json"];
export type BindVaultPseudonymRequestInput = NonNullable<operations["bindVaultPseudonym"]["requestBody"]>["content"]["application/json"];
export type FlagVaultDuplicateRequestInput = NonNullable<operations["flagVaultDuplicate"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListIdentityVaultsParams = NonNullable<operations["listIdentityVaults"]["parameters"]["query"]>;
export type GetIdentityVaultParams = operations["getIdentityVault"]["parameters"]["path"];
export type BindVaultPseudonymParams = operations["bindVaultPseudonym"]["parameters"]["path"];
export type FlagVaultDuplicateParams = operations["flagVaultDuplicate"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListIdentityVaultsResponse = operations["listIdentityVaults"]["responses"]["200"]["content"]["application/json"];
export type CreateIdentityVaultResponse = operations["createIdentityVault"]["responses"]["201"]["content"]["application/json"];
export type GetIdentityVaultResponse = operations["getIdentityVault"]["responses"]["200"]["content"]["application/json"];
export type BindVaultPseudonymResponse = operations["bindVaultPseudonym"]["responses"]["200"]["content"]["application/json"];
export type FlagVaultDuplicateResponse = operations["flagVaultDuplicate"]["responses"]["200"]["content"]["application/json"];


