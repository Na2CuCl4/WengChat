/** @jest-environment node */

import { jest } from "@jest/globals";
import {
  getMinerUApiVersion,
  getMinerUHealth,
  getMinerUTiers,
  getMinerUV1Tier,
  parseMinerU,
} from "../app/api/mineru";

describe("MinerU API compatibility", () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => jest.restoreAllMocks());

  test("maps only supported MinerU release lines", () => {
    expect(getMinerUApiVersion("3.4.9")).toBe("v0");
    expect(getMinerUApiVersion("4.0.0")).toBe("v1");
    expect(getMinerUApiVersion("4.0.11")).toBe("v1");
    expect(getMinerUApiVersion("4.0.0a6")).toBe("v1");
    expect(() => getMinerUApiVersion("3.3.2")).toThrow(
      "Unsupported MinerU version: 3.3.2",
    );
    expect(() => getMinerUApiVersion("4.1.0")).toThrow(
      "Unsupported MinerU version: 4.1.0",
    );
  });

  test("keeps the official v0 setting to v1 tier fallback", () => {
    expect(getMinerUV1Tier(undefined, "pipeline", "high")).toBe("basic");
    expect(getMinerUV1Tier(undefined, "vlm-engine", "medium")).toBe("advanced");
    expect(getMinerUV1Tier(undefined, "hybrid-engine", "medium")).toBe("basic");
    expect(getMinerUV1Tier(undefined, "hybrid-engine", "high")).toBe(
      "standard",
    );
    expect(getMinerUV1Tier("flash")).toBe("flash");
  });

  test("reports a reachable but unsupported MinerU version", async () => {
    const originalFetch = global.fetch;
    global.fetch = (async () =>
      ({
        ok: true,
        json: async () => ({ status: "ok", version: "4.1.0" }),
      }) as Response) as typeof fetch;
    try {
      await expect(getMinerUHealth("http://mineru")).rejects.toThrow(
        "Unsupported MinerU version: 4.1.0",
      );
    } finally {
      global.fetch = originalFetch;
    }
  });

  test("rejects unavailable health endpoints", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockResolvedValueOnce(new Response(null, { status: 503 }));
    await expect(getMinerUHealth("http://mineru")).rejects.toThrow(
      "MinerU health check failed",
    );
  });

  test("uses only supported tiers advertised by the server", async () => {
    const tiers = [
      { id: "flash", description: "Fast local text extraction." },
      { id: "standard", description: "Standard parsing for most documents." },
    ];
    jest.spyOn(global, "fetch").mockResolvedValueOnce(
      Response.json({
        data: [...tiers, { id: "unknown", description: "Unsupported" }],
      }),
    );
    await expect(getMinerUTiers("http://mineru")).resolves.toEqual(tiers);
  });

  test.each([1, 10])(
    "limits v0 to %i pages using a zero-based inclusive end page",
    async (maxPages) => {
      const fetchMock = jest
        .spyOn(global, "fetch")
        .mockResolvedValueOnce(
          Response.json({ status: "healthy", version: "3.4.5" }),
        )
        .mockResolvedValueOnce(
          Response.json({
            file_names: ["sample"],
            results: { sample: { md_content: "# Sample" } },
          }),
        );
      const form = new FormData();
      form.set("file", new Blob(["sample"]), "sample.pdf");
      form.set("maxPages", String(maxPages));
      form.set("minerUBackend", "hybrid-engine");
      form.set("effort", "high");
      form.set("enableImageAnalysis", "false");
      await expect(
        parseMinerU("http://mineru", form.get("file") as File, form),
      ).resolves.toEqual({ markdown: "# Sample" });
      const [url, options] = fetchMock.mock.calls[1];
      expect(url).toBe("http://mineru/file_parse");
      expect(options?.method).toBe("POST");
      const submitted = options?.body as FormData;
      expect(submitted.get("end_page_id")).toBe(String(maxPages - 1));
      expect(submitted.get("backend")).toBe("hybrid-engine");
      expect(submitted.get("effort")).toBe("high");
      expect(submitted.get("image_analysis")).toBe("false");
    },
  );

  test.each([
    {
      format: "markdown",
      filename: "sample.pdf",
      mimeType: "application/pdf",
      content: "%PDF-1.7\nsample",
      pageRange: "1-1",
    },
    {
      format: "zip",
      filename: "sample.pdf",
      mimeType: "application/pdf",
      content: "%PDF-1.7\nsample",
      pageRange: "1-1",
    },
    {
      format: "markdown",
      filename: "sample.PDF",
      mimeType: "",
      content: "%PDF-1.7\nsample",
      pageRange: "1-1",
    },
    {
      format: "zip",
      filename: "图片.jpg",
      mimeType: "image/jpeg",
      content: "sample image",
      pageRange: undefined,
    },
    {
      format: "markdown",
      filename: "sample.png",
      mimeType: "image/png",
      content: "sample image",
      pageRange: undefined,
    },
    {
      format: "markdown",
      filename: "sample.docx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      content: "sample document",
      pageRange: undefined,
    },
    {
      format: "zip",
      filename: "image.pdf",
      mimeType: "application/pdf",
      content: "sample image",
      pageRange: undefined,
    },
  ])(
    "uploads, polls and downloads v1 $format for $filename with PDF-only page ranges",
    async ({ format, filename, mimeType, content, pageRange }) => {
      const form = new FormData();
      form.set("file", new Blob([content], { type: mimeType }), filename);
      const file = form.get("file") as File;
      form.set("minerUTier", "standard");
      form.set("maxPages", "1");
      form.set("response_format_zip", String(format === "zip"));
      const output =
        format === "zip" ? new Uint8Array([80, 75, 3, 4]) : "# Sample";
      const fetchMock = jest
        .spyOn(global, "fetch")
        .mockResolvedValueOnce(new Response(null, { status: 404 }))
        .mockResolvedValueOnce(
          Response.json({ status: "ok", version: "4.0.11" }),
        )
        .mockResolvedValueOnce(
          Response.json({
            id: "upload_1",
            status: "pending",
            upload_url: "/v1/uploads/upload_1/content",
            upload_headers: {
              "Content-Type": mimeType || "application/octet-stream",
            },
          }),
        )
        .mockResolvedValueOnce(new Response(null))
        .mockResolvedValueOnce(
          Response.json({ status: "completed", file: { id: "file-source" } }),
        )
        .mockResolvedValueOnce(
          Response.json({ job_id: "job_1", status: "queued" }, { status: 202 }),
        )
        .mockResolvedValueOnce(
          Response.json({
            job_id: "job_1",
            status: "completed",
            files: [
              {
                status: "completed",
                output_files: { [format]: { file_id: "file-output" } },
              },
            ],
          }),
        )
        .mockResolvedValueOnce(new Response(output));

      const result = await parseMinerU("http://mineru/", file, form);
      expect(result).toEqual(
        typeof output === "string"
          ? { markdown: output }
          : { zip: output.buffer },
      );
      expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
        "http://mineru/health",
        "http://mineru/v1/health",
        "http://mineru/v1/uploads",
        "http://mineru/v1/uploads/upload_1/content",
        "http://mineru/v1/uploads/upload_1/complete",
        "http://mineru/v1/parse/jobs",
        "http://mineru/v1/parse/jobs/job_1",
        "http://mineru/v1/files/file-output/content",
      ]);
      expect(JSON.parse(fetchMock.mock.calls[2][1]?.body as string)).toEqual({
        filename,
        bytes: file.size,
        mime_type: mimeType || "application/octet-stream",
        purpose: "parse",
      });
      expect(fetchMock.mock.calls[3][1]).toMatchObject({
        method: "PUT",
        headers: { "Content-Type": mimeType || "application/octet-stream" },
        body: file,
      });
      expect(JSON.parse(fetchMock.mock.calls[5][1]?.body as string)).toEqual({
        files: [
          {
            source: { type: "file_id", file_id: "file-source" },
            ...(pageRange ? { page_range: pageRange } : {}),
          },
        ],
        tier: "standard",
        output_formats: [format],
      });
    },
  );
});
