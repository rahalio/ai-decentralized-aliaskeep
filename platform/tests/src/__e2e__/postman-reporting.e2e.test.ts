/**
 * Postman-collection 1:1 Vitest tests for reporting (generated)
 *
 * One it() = one API request. Add sample data to vars for e2e runs.
 * Run: pnpm test:e2e or pnpm test:suite:db
 * Requires: API server at baseUrl (default http://localhost:3000)
 */

import { describe, it, expect } from "vitest";

const vars: Record<string, string> = {
  baseUrl: "http://localhost:3000",
  orgId: "test-org",
  accessToken: "",
  consortiumId: "",
  cursor: "",
  jobId: "",
  limit: "",
  period: "",
  pseudonymId: "",
};

function sub(s: string): string {
  return s.replace(/\{\{([^}]+)\}\}/g, (_, k) => vars[k.trim()] ?? "");
}

describe("Postman / reporting (1:1 generated)", () => {

  it("getLinkAuditReport", async () => {
    const url = sub("{{baseUrl}}/v1/reports/link-audit?period={{period}}&consortiumId={{consortiumId}}&pseudonymId={{pseudonymId}}");
    const res = await fetch(url, {
      method: "GET",
      headers: vars.accessToken ? { Authorization: `Bearer ${vars.accessToken}` } : {},
    });
    expect(res.status).toBe(200);
    const j = await res.json(); expect(j).toHaveProperty("data");
  });

  it("listReportExportJobs", async () => {
    const url = sub("{{baseUrl}}/v1/reports/export-jobs?cursor={{cursor}}&limit={{limit}}");
    const res = await fetch(url, {
      method: "GET",
      headers: vars.accessToken ? { Authorization: `Bearer ${vars.accessToken}` } : {},
    });
    expect(res.status).toBe(200);
    const j = await res.json(); expect(j).toHaveProperty("data");
  });

  it("createReportExportJob", async () => {
    const url = sub("{{baseUrl}}/v1/reports/export-jobs");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(vars.accessToken ? { Authorization: `Bearer ${vars.accessToken}` } : {}) },
      body: sub("{\n  \"packType\": \"counsel_pack\",\n  \"period\": \"\",\n  \"consortiumId\": \"newman_consortiumId\",\n  \"pseudonymId\": \"newman_pseudonymId\"\n}"),
    });
    expect(res.status).toBe(201);
    const j = await res.json(); expect(j).toHaveProperty("data");
    if (j?.data?.id) vars['reportExportJobId'] = j.data.id;
  });

  it("getReportExportJob", async () => {
    const url = sub("{{baseUrl}}/v1/reports/export-jobs/{{jobId}}");
    const res = await fetch(url, {
      method: "GET",
      headers: vars.accessToken ? { Authorization: `Bearer ${vars.accessToken}` } : {},
    });
    expect(res.status).toBe(200);
    const j = await res.json(); expect(j).toHaveProperty("data");
  });

  it("getArchitectHomeSummary", async () => {
    const url = sub("{{baseUrl}}/v1/reports/home-summary?consortiumId={{consortiumId}}");
    const res = await fetch(url, {
      method: "GET",
      headers: vars.accessToken ? { Authorization: `Bearer ${vars.accessToken}` } : {},
    });
    expect(res.status).toBe(200);
    const j = await res.json(); expect(j).toHaveProperty("data");
  });
});
