/**
 * Classification Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/classification.openapi.types";

// ============================================================================
// Domain Types Export - Domain-specific types only (excludes components/operations)
// ============================================================================
// This file exports domain-specific types for use in main index.ts
// components and operations are NOT exported here to avoid duplicate export errors
// Access components/operations via namespace: domain.types.components

// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type ClassificationDecision = components["schemas"]["ClassificationDecision"];
export type ClassificationScan = components["schemas"]["ClassificationScan"];
export type DisclosureField = components["schemas"]["DisclosureField"];
export type QuarantineItem = components["schemas"]["QuarantineItem"];
export type QuarantineListData = components["schemas"]["QuarantineListData"];
export type QuarantineStatus = components["schemas"]["QuarantineStatus"];
export type StorageMode = components["schemas"]["StorageMode"];
export type UploadDisclosure = components["schemas"]["UploadDisclosure"];
export type ClassificationScanRequest = components["schemas"]["ClassificationScanRequest"];
export type QuarantineActionRequest = components["schemas"]["QuarantineActionRequest"];
export type RiskWaiverRequest = components["schemas"]["RiskWaiverRequest"];
export type UploadDisclosurePublishRequest = components["schemas"]["UploadDisclosurePublishRequest"];
export type Quarantine = operations["listQuarantineItems"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type SubmitClassificationScanRequestInput = NonNullable<operations["submitClassificationScan"]["requestBody"]>["content"]["application/json"];
export type RemediateQuarantineItemRequestInput = NonNullable<operations["remediateQuarantineItem"]["requestBody"]>["content"]["application/json"];
export type WaiveQuarantineItemRequestInput = NonNullable<operations["waiveQuarantineItem"]["requestBody"]>["content"]["application/json"];
export type RejectQuarantineItemRequestInput = NonNullable<operations["rejectQuarantineItem"]["requestBody"]>["content"]["application/json"];
export type PublishUploadDisclosureRequestInput = NonNullable<operations["publishUploadDisclosure"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListQuarantineItemsParams = NonNullable<operations["listQuarantineItems"]["parameters"]["query"]>;
export type GetQuarantineItemParams = operations["getQuarantineItem"]["parameters"]["path"];
export type RemediateQuarantineItemParams = operations["remediateQuarantineItem"]["parameters"]["path"];
export type WaiveQuarantineItemParams = operations["waiveQuarantineItem"]["parameters"]["path"];
export type RejectQuarantineItemParams = operations["rejectQuarantineItem"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type SubmitClassificationScanResponse = operations["submitClassificationScan"]["responses"]["200"]["content"]["application/json"];
export type ListQuarantineItemsResponse = operations["listQuarantineItems"]["responses"]["200"]["content"]["application/json"];
export type GetQuarantineItemResponse = operations["getQuarantineItem"]["responses"]["200"]["content"]["application/json"];
export type RemediateQuarantineItemResponse = operations["remediateQuarantineItem"]["responses"]["200"]["content"]["application/json"];
export type WaiveQuarantineItemResponse = operations["waiveQuarantineItem"]["responses"]["200"]["content"]["application/json"];
export type RejectQuarantineItemResponse = operations["rejectQuarantineItem"]["responses"]["200"]["content"]["application/json"];
export type GetUploadDisclosureResponse = operations["getUploadDisclosure"]["responses"]["200"]["content"]["application/json"];
export type PublishUploadDisclosureResponse = operations["publishUploadDisclosure"]["responses"]["200"]["content"]["application/json"];


