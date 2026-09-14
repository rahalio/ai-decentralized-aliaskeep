/**
 * Reporting Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/reporting.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type ArchitectHomeSummary = components["schemas"]["ArchitectHomeSummary"];
export type LinkAuditReport = components["schemas"]["LinkAuditReport"];
export type ReportJob = components["schemas"]["ReportJob"];
export type ReportJobListData = components["schemas"]["ReportJobListData"];
export type ReportExportCreateRequest = components["schemas"]["ReportExportCreateRequest"];
export type ExportJob = operations["listReportExportJobs"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type CreateReportExportJobRequestInput = NonNullable<operations["createReportExportJob"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type GetLinkAuditReportParams = NonNullable<operations["getLinkAuditReport"]["parameters"]["query"]>;
export type ListReportExportJobsParams = NonNullable<operations["listReportExportJobs"]["parameters"]["query"]>;
export type GetReportExportJobParams = operations["getReportExportJob"]["parameters"]["path"];
export type GetArchitectHomeSummaryParams = NonNullable<operations["getArchitectHomeSummary"]["parameters"]["query"]>;


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type GetLinkAuditReportResponse = operations["getLinkAuditReport"]["responses"]["200"]["content"]["application/json"];
export type ListReportExportJobsResponse = operations["listReportExportJobs"]["responses"]["200"]["content"]["application/json"];
export type CreateReportExportJobResponse = operations["createReportExportJob"]["responses"]["202"]["content"]["application/json"];
export type GetReportExportJobResponse = operations["getReportExportJob"]["responses"]["200"]["content"]["application/json"];
export type GetArchitectHomeSummaryResponse = operations["getArchitectHomeSummary"]["responses"]["200"]["content"]["application/json"];


