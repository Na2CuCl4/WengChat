export type MinerUApiVersion = "v0" | "v1";
export type MinerUTier = "flash" | "basic" | "standard" | "advanced";

export interface MinerUHealth {
  status: string;
  version: string;
  api_version: MinerUApiVersion;
  queued_tasks?: number;
  processing_tasks?: number;
  completed_tasks?: number;
  failed_tasks?: number;
}

export interface MinerUTierInfo {
  id: MinerUTier;
  description: string;
  current_model?: string | null;
}

export type MinerUResult = { markdown: string } | { zip: ArrayBuffer };

const TERMINAL_JOB_STATUSES = new Set([
  "completed",
  "partial",
  "failed",
  "canceled",
]);
const V1_TIERS = new Set<MinerUTier>([
  "flash",
  "basic",
  "standard",
  "advanced",
]);

function baseUrl(server: string) {
  return server.replace(/\/+$/, "");
}

function formString(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value : undefined;
}

function errorMessage(json: any, fallback: string) {
  const error = json?.error;
  return (
    (typeof error === "string" ? error : error?.message) ??
    json?.detail?.message ??
    (typeof json?.detail === "string" ? json.detail : undefined) ??
    json?.msg ??
    fallback
  );
}

async function jsonResponse(res: Response, fallback: string) {
  const json = await res.json().catch(() => null);
  if (!res.ok || !json) throw new Error(errorMessage(json, fallback));
  return json;
}

export function getMinerUApiVersion(version: string): MinerUApiVersion {
  if (/^3\.4\./.test(version)) return "v0";
  if (/^4\.0\./.test(version)) return "v1";
  throw new Error(`Unsupported MinerU version: ${version}`);
}

export function getMinerUV1Tier(
  tier?: string,
  backend = "hybrid-engine",
  effort = "medium",
): MinerUTier {
  if (tier) {
    if (V1_TIERS.has(tier as MinerUTier)) return tier as MinerUTier;
    throw new Error(`Unsupported MinerU tier: ${tier}`);
  }
  if (backend === "pipeline") return "basic";
  if (backend === "vlm-engine") return "advanced";
  return effort === "high" ? "standard" : "basic";
}

export async function getMinerUHealth(
  server: string,
  signal?: AbortSignal,
): Promise<MinerUHealth> {
  for (const path of ["/health", "/v1/health"]) {
    let res: Response;
    try {
      res = await fetch(`${baseUrl(server)}${path}`, { signal });
    } catch (error) {
      if ((error as Error).name === "AbortError") throw error;
      continue;
    }
    const json = await res.json().catch(() => null);
    if (!res.ok || typeof json?.version !== "string") continue;
    return {
      ...json,
      api_version: getMinerUApiVersion(json.version),
    };
  }
  throw new Error("MinerU health check failed");
}

export async function getMinerUTiers(
  server: string,
  signal?: AbortSignal,
): Promise<MinerUTierInfo[]> {
  const res = await fetch(`${baseUrl(server)}/v1/tiers`, { signal });
  const json = await jsonResponse(res, "Failed to load MinerU tiers");
  return Array.isArray(json.data)
    ? json.data.filter(
        (tier: any) =>
          V1_TIERS.has(tier?.id) && typeof tier?.description === "string",
      )
    : [];
}

async function parseV0(
  server: string,
  file: File,
  form: FormData,
  signal?: AbortSignal,
): Promise<MinerUResult> {
  const outForm = new FormData();
  outForm.append("files", file);

  const fields: Record<string, string> = {
    ocrLanguage: "lang_list",
    minerUBackend: "backend",
    parseMethod: "parse_method",
    enableTableRecognition: "table_enable",
    enableInlineFormulaRecognition: "formula_enable",
    enableImageAnalysis: "image_analysis",
    effort: "effort",
    return_images: "return_images",
    response_format_zip: "response_format_zip",
    maxPages: "end_page_id",
  };
  for (const [input, output] of Object.entries(fields)) {
    const value = formString(form, input);
    if (value) outForm.append(output, value);
  }

  const res = await fetch(`${baseUrl(server)}/file_parse`, {
    method: "POST",
    body: outForm,
    signal,
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(errorMessage(json, "MinerU conversion failed"));
  }

  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  if (
    !contentType.includes("application/json") &&
    !contentType.includes("text/")
  ) {
    return { zip: await res.arrayBuffer() };
  }

  const json = await res.json();
  const firstFile = Array.isArray(json?.file_names) ? json.file_names[0] : "";
  const markdown = json?.results?.[firstFile]?.md_content;
  if (typeof markdown !== "string") {
    throw new Error(
      errorMessage(json, "MinerU returned unexpected response structure"),
    );
  }
  return { markdown };
}

async function parseV1(
  server: string,
  file: File,
  form: FormData,
  signal?: AbortSignal,
): Promise<MinerUResult> {
  const base = baseUrl(server);
  const mimeType = file.type || "application/octet-stream";
  const uploadRes = await fetch(`${base}/v1/uploads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      bytes: file.size,
      mime_type: mimeType,
      purpose: "parse",
    }),
    signal,
  });
  let upload = await jsonResponse(uploadRes, "MinerU upload creation failed");

  if (upload.status !== "completed") {
    if (
      typeof upload.upload_url !== "string" ||
      typeof upload.id !== "string"
    ) {
      throw new Error("MinerU returned an invalid upload response");
    }
    const contentRes = await fetch(new URL(upload.upload_url, `${base}/`), {
      method: "PUT",
      headers: upload.upload_headers ?? { "Content-Type": mimeType },
      body: file,
      signal,
    });
    if (!contentRes.ok) {
      const json = await contentRes.json().catch(() => null);
      throw new Error(errorMessage(json, "MinerU file upload failed"));
    }
    const completeRes = await fetch(
      `${base}/v1/uploads/${upload.id}/complete`,
      {
        method: "POST",
        signal,
      },
    );
    upload = await jsonResponse(completeRes, "MinerU upload completion failed");
  }

  const fileId = upload?.file?.id;
  if (typeof fileId !== "string") {
    throw new Error("MinerU upload did not return a file ID");
  }

  const returnZip = formString(form, "response_format_zip") === "true";
  const maxPages = formString(form, "maxPages");
  const fileEntry: Record<string, any> = {
    source: { type: "file_id", file_id: fileId },
  };
  if (maxPages) fileEntry.page_range = `1~${maxPages}`;

  const jobRes = await fetch(`${base}/v1/parse/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      files: [fileEntry],
      tier: getMinerUV1Tier(
        formString(form, "minerUTier"),
        formString(form, "minerUBackend"),
        formString(form, "effort"),
      ),
      output_formats: [returnZip ? "zip" : "markdown"],
    }),
    signal,
  });
  let job = await jsonResponse(jobRes, "MinerU job submission failed");
  if (typeof job?.job_id !== "string") {
    throw new Error("MinerU job did not return a job ID");
  }

  for (let attempt = 0; !TERMINAL_JOB_STATUSES.has(job.status); attempt++) {
    if (attempt >= 600) throw new Error("MinerU conversion timed out");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const pollRes = await fetch(`${base}/v1/parse/jobs/${job.job_id}`, {
      signal,
    });
    job = await jsonResponse(pollRes, "MinerU job polling failed");
  }

  const fileResult = job?.files?.[0];
  if (fileResult?.status !== "completed") {
    throw new Error(errorMessage(fileResult, `MinerU job ${job.status}`));
  }
  const format = returnZip ? "zip" : "markdown";
  const outputFileId = fileResult?.output_files?.[format]?.file_id;
  if (typeof outputFileId !== "string") {
    throw new Error(`MinerU job did not return ${format} output`);
  }

  const outputRes = await fetch(`${base}/v1/files/${outputFileId}/content`, {
    signal,
  });
  if (!outputRes.ok) {
    const json = await outputRes.json().catch(() => null);
    throw new Error(errorMessage(json, "MinerU output download failed"));
  }
  return returnZip
    ? { zip: await outputRes.arrayBuffer() }
    : { markdown: await outputRes.text() };
}

export async function parseMinerU(
  server: string,
  file: File,
  form: FormData,
  signal?: AbortSignal,
): Promise<MinerUResult> {
  const health = await getMinerUHealth(server, signal);
  return health.api_version === "v0"
    ? parseV0(server, file, form, signal)
    : parseV1(server, file, form, signal);
}
