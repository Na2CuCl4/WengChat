import { useState, useRef, useCallback, useEffect } from "react";

import styles from "./file-conversion.module.scss";

import CloseIcon from "../icons/close.svg";
import UploadIcon from "../icons/upload.svg";
import ClearIcon from "../icons/clear.svg";
import FileConversionIcon from "../icons/file-conversion.svg";
import PauseIcon from "../icons/pause.svg";
import DocxIcon from "../icons/docx.svg";
import PptxIcon from "../icons/pptx.svg";
import XlsxIcon from "../icons/xlsx.svg";
import PdfIcon from "../icons/pdf.svg";
import ImageIcon from "../icons/image.svg";
import DownloadIcon from "../icons/download.svg";

import { IconButton } from "./button";
import { InputRange } from "./input-range";
import { List, ListItem, Select, showToast } from "./ui-lib";

import Locale from "../locales";

import { Path } from "../constant";
import { useAppConfig, useAccessStore } from "../store";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../utils/chat";

type FileConversionEngine = "markitdown" | "mineru";
type MinerUBackend = "pipeline" | "vlm-engine" | "hybrid-engine";
type MinerUTier = "flash" | "basic" | "standard" | "advanced";
type ParseMethod = "auto" | "txt" | "ocr";
type OcrLanguage =
  | "ch"
  | "ch_server"
  | "korean"
  | "ta"
  | "te"
  | "ka"
  | "th"
  | "el"
  | "arabic"
  | "east_slavic"
  | "cyrillic"
  | "devanagari";

type FileStatus = "pending" | "converting" | "success" | "error";

interface FileItem {
  id: string;
  name: string;
  size: number;
  status: FileStatus;
  content?: string;
  convertingSince?: number;
  totalElapsed?: number; // seconds, frozen on success
}

const FILE_CONVERSION_ENGINES: Record<FileConversionEngine, string> = {
  markitdown: Locale.FileConversion.Engine.MarkItDownDesc,
  mineru: Locale.FileConversion.Engine.MinerUDesc,
};

const MINERU_BACKEND: Record<MinerUBackend, string> = {
  pipeline: Locale.FileConversion.MinerU.ParseBackend.PipelineDesc,
  "vlm-engine": Locale.FileConversion.MinerU.ParseBackend.VlmEngineDesc,
  "hybrid-engine": Locale.FileConversion.MinerU.ParseBackend.HybridEngineDesc,
};

const PARSE_METHOD: { value: ParseMethod; desc: string }[] = [
  { value: "auto", desc: Locale.FileConversion.MinerU.ParseMethod.Auto },
  { value: "txt", desc: Locale.FileConversion.MinerU.ParseMethod.Txt },
  { value: "ocr", desc: Locale.FileConversion.MinerU.ParseMethod.Ocr },
];

const OCR_LANGUAGES: { value: OcrLanguage; desc: string }[] = [
  { value: "ch", desc: Locale.FileConversion.MinerU.OcrLanguage.Ch },
  {
    value: "ch_server",
    desc: Locale.FileConversion.MinerU.OcrLanguage.ChServer,
  },
  { value: "korean", desc: Locale.FileConversion.MinerU.OcrLanguage.Korean },
  { value: "ta", desc: Locale.FileConversion.MinerU.OcrLanguage.Ta },
  { value: "te", desc: Locale.FileConversion.MinerU.OcrLanguage.Te },
  { value: "ka", desc: Locale.FileConversion.MinerU.OcrLanguage.Ka },
  { value: "th", desc: Locale.FileConversion.MinerU.OcrLanguage.Th },
  { value: "el", desc: Locale.FileConversion.MinerU.OcrLanguage.El },
  { value: "arabic", desc: Locale.FileConversion.MinerU.OcrLanguage.Arabic },
  {
    value: "east_slavic",
    desc: Locale.FileConversion.MinerU.OcrLanguage.EastSlavic,
  },
  {
    value: "cyrillic",
    desc: Locale.FileConversion.MinerU.OcrLanguage.Cyrillic,
  },
  {
    value: "devanagari",
    desc: Locale.FileConversion.MinerU.OcrLanguage.Devanagari,
  },
];

const EFFORT_OPTIONS: { value: "medium" | "high"; desc: string }[] = [
  {
    value: "medium",
    desc: Locale.FileConversion.MinerU.Effort.MediumDesc,
  },
  {
    value: "high",
    desc: Locale.FileConversion.MinerU.Effort.HighDesc,
  },
];

function formatFileSize(bytes: number): string {
  const n = Number(bytes);
  if (!isFinite(n) || n < 0) return "0 B";
  if (n < 1024) return n + " B";
  if (n < 1048576) return (n / 1024).toFixed(1) + " KB";
  return (n / 1048576).toFixed(1) + " MB";
}

function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

const FILE_ICONS: Record<
  string,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  docx: DocxIcon,
  doc: DocxIcon,
  pptx: PptxIcon,
  ppt: PptxIcon,
  xlsx: XlsxIcon,
  xls: XlsxIcon,
  pdf: PdfIcon,
};

function FileIcon({ ext }: { ext: string }) {
  const Icon = FILE_ICONS[ext] ?? ImageIcon;
  return <Icon className={styles["file-icon"]} />;
}

function MarkItDownSettings() {
  const config = useAppConfig();
  const fc = config.fileConversionConfig;

  return (
    <>
      <HealthCheckSection engine="markitdown" />

      <ListItem
        title={Locale.FileConversion.MarkItDown.EnableDocIntelligence.Title}
        subTitle={Locale.FileConversion.MarkItDown.EnableDocIntelligence.Desc}
      >
        <input
          aria-label={
            Locale.FileConversion.MarkItDown.EnableDocIntelligence.Title
          }
          type="checkbox"
          checked={fc.enableDocIntelligence}
          onChange={(e) => {
            const checked = e.target.checked;
            config.update(
              (c) => (c.fileConversionConfig.enableDocIntelligence = checked),
            );
          }}
        />
      </ListItem>
    </>
  );
}

interface HealthInfo {
  status: string;
  version: string;
  api_version?: "v0" | "v1";
  tiers?: { id: MinerUTier; description: string }[];
  queued_tasks?: number;
  processing_tasks?: number;
  completed_tasks?: number;
  failed_tasks?: number;
}

function HealthCheckSection({
  engine,
  onHealthChange,
}: {
  engine: FileConversionEngine;
  onHealthChange?: (health: HealthInfo | null) => void;
}) {
  const [health, setHealth] = useState<HealthInfo | null>(null);
  const [checking, setChecking] = useState(false);
  const [healthError, setHealthError] = useState("");

  const handleCheckHealth = useCallback(async () => {
    setChecking(true);
    setHealthError("");
    setHealth(null);
    onHealthChange?.(null);
    try {
      const res = await fetch(`/api/health?engine=${engine}`);
      const json = await res.json().catch(() => null);
      if (res.ok && json?.status) {
        setHealth(json);
        onHealthChange?.(json);
      } else {
        setHealthError(
          json?.error ?? Locale.FileConversion.HealthCheck.Unavailable,
        );
      }
    } catch {
      setHealthError(Locale.FileConversion.HealthCheck.Unavailable);
    } finally {
      setChecking(false);
    }
  }, [engine, onHealthChange]);

  useEffect(() => {
    handleCheckHealth();
  }, [handleCheckHealth]);

  const healthSubTitle = health
    ? `${Locale.FileConversion.HealthCheck.Version}: ${health.version}  |  ${
        Locale.FileConversion.HealthCheck.Queueing
      }: ${health.queued_tasks ?? "-"}  |  ${
        Locale.FileConversion.HealthCheck.Processing
      }: ${health.processing_tasks ?? "-"}  |  ${
        Locale.FileConversion.HealthCheck.Completed
      }: ${health.completed_tasks ?? "-"}  |  ${
        Locale.FileConversion.HealthCheck.Failed
      }: ${health.failed_tasks ?? "-"}`
    : healthError
    ? healthError
    : "";

  return (
    <ListItem
      title={Locale.FileConversion.HealthCheck.Title}
      subTitle={healthSubTitle}
    >
      <IconButton
        aria={Locale.FileConversion.HealthCheck.Action}
        text={
          checking
            ? Locale.FileConversion.HealthCheck.Checking
            : Locale.FileConversion.HealthCheck.Action
        }
        type="primary"
        onClick={handleCheckHealth}
      />
    </ListItem>
  );
}

function MinerUSettings() {
  const config = useAppConfig();
  const fc = config.fileConversionConfig;
  const [health, setHealth] = useState<HealthInfo | null>(null);
  const handleHealthChange = useCallback(
    (value: HealthInfo | null) => setHealth(value),
    [],
  );
  const tiers = health?.tiers ?? [];
  const selectedTier = tiers.some((tier) => tier.id === fc.minerUTier)
    ? fc.minerUTier
    : (["standard", "basic", "advanced", "flash"] as MinerUTier[]).find((id) =>
        tiers.some((tier) => tier.id === id),
      );

  useEffect(() => {
    if (
      health?.api_version === "v1" &&
      selectedTier &&
      fc.minerUTier !== selectedTier
    ) {
      config.update((c) => (c.fileConversionConfig.minerUTier = selectedTier));
    }
  }, [config, fc.minerUTier, health?.api_version, selectedTier]);

  return (
    <>
      <HealthCheckSection engine="mineru" onHealthChange={handleHealthChange} />

      {health?.api_version === "v0" && (
        <>
          <ListItem
            title={Locale.FileConversion.MinerU.ParseBackend.Title}
            subTitle={MINERU_BACKEND[fc.minerUBackend]}
          >
            <Select
              aria-label={Locale.FileConversion.MinerU.ParseBackend.Title}
              value={fc.minerUBackend}
              onChange={(e) => {
                const val = e.target.value as MinerUBackend;
                config.update(
                  (c) => (c.fileConversionConfig.minerUBackend = val),
                );
              }}
            >
              <option value="pipeline">
                {Locale.FileConversion.MinerU.ParseBackend.Pipeline}
              </option>
              <option value="vlm-engine">
                {Locale.FileConversion.MinerU.ParseBackend.VlmEngine}
              </option>
              <option value="hybrid-engine">
                {Locale.FileConversion.MinerU.ParseBackend.HybridEngine}
              </option>
            </Select>
          </ListItem>

          {fc.minerUBackend === "hybrid-engine" && (
            <ListItem
              title={Locale.FileConversion.MinerU.Effort.Title}
              subTitle={EFFORT_OPTIONS.find((o) => o.value === fc.effort)?.desc}
            >
              <Select
                aria-label={Locale.FileConversion.MinerU.Effort.Title}
                value={fc.effort}
                onChange={(e) => {
                  const val = e.target.value as "medium" | "high";
                  config.update((c) => (c.fileConversionConfig.effort = val));
                }}
              >
                {EFFORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </Select>
            </ListItem>
          )}
        </>
      )}

      {health?.api_version === "v1" && selectedTier && (
        <ListItem
          title={Locale.FileConversion.MinerU.Effort.Title}
          subTitle={tiers.find((tier) => tier.id === selectedTier)?.description}
        >
          <Select
            aria-label={Locale.FileConversion.MinerU.Effort.Title}
            value={selectedTier}
            onChange={(e) => {
              const val = e.target.value as MinerUTier;
              config.update((c) => (c.fileConversionConfig.minerUTier = val));
            }}
          >
            {tiers.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.id}
              </option>
            ))}
          </Select>
        </ListItem>
      )}

      {health?.api_version && (
        <ListItem title={Locale.FileConversion.MinerU.MaxPages.Title}>
          <InputRange
            aria={Locale.FileConversion.MinerU.MaxPages.Title}
            title={`${fc.maxPages}`}
            value={fc.maxPages}
            min="1"
            max="1000"
            step="1"
            onChange={(e) => {
              const val = Number(e.target.value);
              config.update((c) => (c.fileConversionConfig.maxPages = val));
            }}
          />
        </ListItem>
      )}

      {health?.api_version === "v0" && (
        <>
          <ListItem
            title={Locale.FileConversion.MinerU.EnableTableRecognition.Title}
            subTitle={Locale.FileConversion.MinerU.EnableTableRecognition.Desc}
          >
            <input
              aria-label={
                Locale.FileConversion.MinerU.EnableTableRecognition.Title
              }
              type="checkbox"
              checked={fc.enableTableRecognition}
              onChange={(e) => {
                const checked = e.target.checked;
                config.update(
                  (c) =>
                    (c.fileConversionConfig.enableTableRecognition = checked),
                );
              }}
            />
          </ListItem>

          <ListItem
            title={
              Locale.FileConversion.MinerU.EnableInlineFormulaRecognition.Title
            }
            subTitle={
              Locale.FileConversion.MinerU.EnableInlineFormulaRecognition.Desc
            }
          >
            <input
              aria-label={
                Locale.FileConversion.MinerU.EnableInlineFormulaRecognition
                  .Title
              }
              type="checkbox"
              checked={fc.enableInlineFormulaRecognition}
              onChange={(e) => {
                const checked = e.target.checked;
                config.update(
                  (c) =>
                    (c.fileConversionConfig.enableInlineFormulaRecognition =
                      checked),
                );
              }}
            />
          </ListItem>

          <ListItem
            title={Locale.FileConversion.MinerU.EnableImageAnalysis.Title}
            subTitle={Locale.FileConversion.MinerU.EnableImageAnalysis.Desc}
          >
            <input
              aria-label={
                Locale.FileConversion.MinerU.EnableImageAnalysis.Title
              }
              type="checkbox"
              checked={fc.enableImageAnalysis}
              onChange={(e) => {
                const checked = e.target.checked;
                config.update(
                  (c) => (c.fileConversionConfig.enableImageAnalysis = checked),
                );
              }}
            />
          </ListItem>

          <ListItem
            title={Locale.FileConversion.MinerU.ParseMethod.Title}
            subTitle={
              PARSE_METHOD.find((m) => m.value === fc.parseMethod)?.desc
            }
          >
            <Select
              aria-label={Locale.FileConversion.MinerU.ParseMethod.Title}
              value={fc.parseMethod}
              onChange={(e) => {
                const val = e.target.value as ParseMethod;
                config.update(
                  (c) => (c.fileConversionConfig.parseMethod = val),
                );
              }}
            >
              {PARSE_METHOD.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.value}
                </option>
              ))}
            </Select>
          </ListItem>

          <ListItem
            title={Locale.FileConversion.MinerU.OcrLanguage.Title}
            subTitle={
              OCR_LANGUAGES.find((l) => l.value === fc.ocrLanguage)?.desc
            }
          >
            <Select
              aria-label={Locale.FileConversion.MinerU.OcrLanguage.Title}
              value={fc.ocrLanguage}
              onChange={(e) => {
                const val = e.target.value as OcrLanguage;
                config.update(
                  (c) => (c.fileConversionConfig.ocrLanguage = val),
                );
              }}
            >
              {OCR_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.value}
                </option>
              ))}
            </Select>
          </ListItem>
        </>
      )}
    </>
  );
}

export function FileConversion() {
  const navigate = useNavigate();
  const config = useAppConfig();
  const fc = config.fileConversionConfig;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [converting, setConverting] = useState(false);
  const [packaging, setPackaging] = useState(false);
  const [packagingProgress, setPackagingProgress] = useState(0);
  const [logLines, setLogLines] = useState<string[]>([
    `====== ${Locale.FileConversion.FileList.LogPlaceholder} ======\n`,
  ]);
  const fileRefs = useRef<Map<string, File>>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const fileListRef = useRef<FileItem[]>(fileList);
  fileListRef.current = fileList; // always in sync

  const handleUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const newFiles: FileItem[] = [];
    for (const file of Array.from(files)) {
      const id = Math.random().toString(36).slice(2, 9);
      fileRefs.current.set(id, file);
      newFiles.push({
        id,
        name: file.name,
        size: Number(file.size) || 0,
        status: "pending" as FileStatus,
      });
    }
    setFileList((prev) => [...prev, ...newFiles]);
  }, []);

  const [, setTick] = useState(0);
  useEffect(() => {
    const hasConverting = fileList.some((f) => f.status === "converting");
    if (!hasConverting) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [fileList]);

  // Auto-scroll log panel to bottom
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollTop = logEndRef.current.scrollHeight;
    }
  }, [logLines]);

  function formatElapsed(since: number): string {
    const sec = Math.floor((Date.now() - since) / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function formatElapsedSeconds(totalSec: number): string {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  const addLog = useCallback((message: string) => {
    const now = new Date();
    const time = [
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
      String(now.getSeconds()).padStart(2, "0"),
    ].join(":");
    setLogLines((prev) => [...prev, `[${time}] ${message}`]);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      handleFiles(files);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [handleFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles],
  );

  const handleClearAll = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setConverting(false);
    }
    fileRefs.current.clear();
    setFileList([]);
    setLogLines([
      `====== ${Locale.FileConversion.FileList.LogPlaceholder} ======\n`,
    ]);
  }, []);

  const handleDeleteFile = useCallback((id: string) => {
    fileRefs.current.delete(id);
    setFileList((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleStop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setConverting(false);
  }, []);

  const handleConvert = useCallback(async () => {
    const accessState = useAccessStore.getState();
    if (accessState.needCode && !accessState.accessCode) {
      showToast(Locale.FileConversion.FileList.AccessCodeError);
      return;
    }

    // Dynamic loop: re-reads fileListRef each iteration so hot
    // uploads and deletes during conversion are respected.
    const controller = new AbortController();
    abortRef.current = controller;
    setConverting(true);

    // Reset previously failed files to pending so they are retried this run
    // Must update both the ref (for immediate loop visibility) and state (for UI)
    const resetList = fileListRef.current.map((f) =>
      f.status === "error" ? { ...f, status: "pending" as FileStatus } : f,
    );
    fileListRef.current = resetList;
    setFileList(resetList);

    try {
      while (!controller.signal.aborted) {
        const next = fileListRef.current.find((f) => f.status === "pending");
        if (!next) break;

        const item = next;
        const file = fileRefs.current.get(item.id);
        if (!file) {
          addLog(`${item.name} ${Locale.FileConversion.FileList.Status.error}`);
          setFileList((prev) =>
            prev.map((f) =>
              f.id === item.id ? { ...f, status: "error" as FileStatus } : f,
            ),
          );
          continue;
        }

        const now = Date.now();
        addLog(
          `${Locale.FileConversion.FileList.Status.converting} ${item.name}`,
        );
        setFileList((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  status: "converting" as FileStatus,
                  convertingSince: now,
                }
              : f,
          ),
        );

        try {
          const content = await uploadFile(file, controller.signal, true);
          const elapsed = Math.floor((Date.now() - now) / 1000);
          addLog(
            `${item.name} ${Locale.FileConversion.FileList.Status.success}`,
          );
          setFileList((prev) =>
            prev.map((f) =>
              f.id === item.id
                ? {
                    ...f,
                    status: "success" as FileStatus,
                    content,
                    convertingSince: undefined,
                    totalElapsed: elapsed,
                  }
                : f,
            ),
          );
        } catch (err) {
          if (controller.signal.aborted) {
            addLog(`${Locale.FileConversion.FileList.Stop} ${item.name}`);
            setFileList((prev) =>
              prev.map((f) =>
                f.id === item.id ? { ...f, status: "error" as FileStatus } : f,
              ),
            );
            break;
          }
          const msg = (err as Error).message || "";

          // Auth errors
          if (
            msg.includes("wrong access code") ||
            msg.includes("empty access code")
          ) {
            showToast(Locale.FileConversion.FileList.AccessCodeError);
            addLog(
              `${item.name} ${Locale.FileConversion.FileList.Status.error}，${Locale.FileConversion.FileList.ErrorInfo}：\n${msg}`,
            );
            setFileList((prev) =>
              prev.map((f) =>
                f.id === item.id ? { ...f, status: "error" as FileStatus } : f,
              ),
            );
            break;
          }

          // Conversion errors: network errors → UnknownError, server errors → use msg
          const errorInfo =
            err instanceof TypeError
              ? Locale.FileConversion.FileList.UnknownError
              : msg;
          addLog(
            `${item.name} ${Locale.FileConversion.FileList.Status.error}，${Locale.FileConversion.FileList.ErrorInfo}：\n${errorInfo}`,
          );
          setFileList((prev) =>
            prev.map((f) =>
              f.id === item.id ? { ...f, status: "error" as FileStatus } : f,
            ),
          );
        }
      }
    } finally {
      abortRef.current = null;
      setConverting(false);
    }
  }, [addLog]);

  const handleDownload = useCallback(
    (item: FileItem) => {
      if (!item.content) return;
      const isMinerU = config.fileConversionConfig.engine === "mineru";
      if (isMinerU && item.content.startsWith("blob:")) {
        const a = document.createElement("a");
        a.href = item.content;
        a.download = item.name.replace(/\.[^.]+$/, "") + ".zip";
        a.click();
        return;
      }
      const blob = new Blob([item.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.name.replace(/\.[^.]+$/, "") + ".md";
      a.click();
      URL.revokeObjectURL(url);
    },
    [config.fileConversionConfig.engine],
  );

  const handleDownloadAll = useCallback(async () => {
    const successFiles = fileList.filter(
      (f) => f.status === "success" && f.content,
    );
    if (successFiles.length === 0) return;

    setPackaging(true);
    setPackagingProgress(0);

    try {
      const JSZip = (await import("jszip")).default;
      const outZip = new JSZip();
      const total = successFiles.length;

      for (let i = 0; i < successFiles.length; i++) {
        const item = successFiles[i];

        if (item.content!.startsWith("blob:")) {
          // MinerU: fetch zip blob, extract entries directly to root
          // (MinerU zips already contain a root folder)
          const blob = await fetch(item.content!).then((r) => r.blob());
          const inZip = await JSZip.loadAsync(blob);
          for (const [path, file] of Object.entries(inZip.files)) {
            if (file.dir) continue;
            const data = await file.async("uint8array");
            outZip.file(path, data);
          }
        } else {
          // MarkItDown: add .md file directly to root
          const mdName = item.name.replace(/\.[^.]+$/, "") + ".md";
          outZip.file(mdName, item.content!);
        }

        setPackagingProgress(i + 1);
      }

      // Generate timestamp filename: YYYY-MM-DD HH-MM-SS (X files).zip
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const timestamp =
        `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
          now.getDate(),
        )} ` +
        `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(
          now.getSeconds(),
        )}`;
      const filename = `${timestamp} (${total} ${
        total === 1 ? "file" : "files"
      }).zip`;

      const zipBlob = await outZip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Package download failed:", err);
      showToast(
        config.fileConversionConfig.engine === "mineru"
          ? "打包下载失败"
          : "Package download failed",
      );
    } finally {
      setPackaging(false);
      setPackagingProgress(0);
    }
  }, [fileList, config.fileConversionConfig.engine]);

  const hasConverted = fileList.some((f) => f.status === "success");

  const dropZoneClass = [
    styles["drop-zone"],
    dragOver ? styles["drop-zone-active"] : "",
    fileList.length === 0 ? styles["drop-zone-empty"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <style>{`#file-convert-btn button path{fill:none!important;stroke:white}`}</style>
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">
            {Locale.FileConversion.Title}
          </div>
          <div className="window-header-sub-title">
            {Locale.FileConversion.SubTitle}
          </div>
        </div>
        <div className="window-actions">
          <div className="window-action-button"></div>
          <div className="window-action-button"></div>
          <div className="window-action-button">
            <IconButton
              aria={Locale.UI.Close}
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
            />
          </div>
        </div>
      </div>
      <div className={styles["file-conversion"]}>
        <div className={styles["file-conversion-section"]}>
          <div className={styles["file-conversion-section-header"]}>
            {Locale.FileConversion.Settings}
          </div>
          <List>
            <ListItem
              title={Locale.FileConversion.Engine.Title}
              subTitle={FILE_CONVERSION_ENGINES[fc.engine]}
            >
              <Select
                aria-label={Locale.FileConversion.Engine.Title}
                value={fc.engine}
                onChange={(e) => {
                  const val = e.target.value as FileConversionEngine;
                  config.update((c) => (c.fileConversionConfig.engine = val));
                }}
              >
                <option value="markitdown">
                  {Locale.FileConversion.Engine.MarkItDown}
                </option>
                <option value="mineru">
                  {Locale.FileConversion.Engine.MinerU}
                </option>
              </Select>
            </ListItem>

            {fc.engine === "markitdown" && <MarkItDownSettings />}

            {fc.engine === "mineru" && <MinerUSettings />}
          </List>
        </div>

        <div className={styles["file-conversion-section"]}>
          <div className={styles["file-conversion-section-header"]}>
            {Locale.FileConversion.Conversion}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".docx,.pptx,.xlsx,.pdf,.doc,.ppt,.xls,.md,.txt,.html,.csv,.json,.xml,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <div
            className={dropZoneClass}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className={styles["file-list-actions"]}>
              <IconButton
                icon={<UploadIcon />}
                text={Locale.FileConversion.FileList.Upload}
                bordered
                onClick={handleUpload}
              />
              <IconButton
                icon={<ClearIcon />}
                text={Locale.FileConversion.FileList.ClearAll}
                bordered
                onClick={handleClearAll}
              />
              <div id="file-convert-btn">
                <IconButton
                  icon={converting ? <PauseIcon /> : <FileConversionIcon />}
                  text={
                    converting
                      ? Locale.FileConversion.FileList.Stop
                      : Locale.FileConversion.FileList.Convert
                  }
                  type="primary"
                  onClick={converting ? handleStop : handleConvert}
                />
              </div>
              <IconButton
                icon={<DownloadIcon />}
                text={
                  packaging
                    ? `${
                        Locale.FileConversion.FileList.Packaging
                      } ${packagingProgress}/${
                        fileList.filter(
                          (f) => f.status === "success" && f.content,
                        ).length
                      }`
                    : Locale.FileConversion.FileList.DownloadAll
                }
                bordered
                disabled={!hasConverted || packaging}
                onClick={handleDownloadAll}
              />
            </div>

            <div className={styles["log-panel"]}>
              <div className={styles["log-panel-inner"]} ref={logEndRef}>
                {logLines.map((line, i) => (
                  <div key={i} className={styles["log-line"]}>
                    {line}
                  </div>
                ))}
              </div>
            </div>

            {fileList.length > 0 ? (
              <table className={styles["file-table"]}>
                <thead>
                  <tr>
                    <th>{Locale.FileConversion.FileList.Name}</th>
                    <th>{Locale.FileConversion.FileList.Size}</th>
                    <th>{Locale.FileConversion.FileList.StatusLabel}</th>
                    <th>{Locale.FileConversion.FileList.ActionsLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  {fileList.map((file) => (
                    <tr key={file.id}>
                      <td className={styles["file-name-cell"]}>
                        <div className={styles["file-name-inner"]}>
                          <FileIcon ext={getFileExtension(file.name)} />
                          <span className={styles["file-name-text"]}>
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className={styles["file-size-cell"]}>
                        {formatFileSize(file.size ?? 0)}
                      </td>
                      <td className={styles["file-status-cell"]}>
                        <span
                          className={`${styles["file-status-text"]} ${
                            styles[`status-${file.status}`]
                          }`}
                        >
                          {
                            Locale.FileConversion.FileList.Status[
                              file.status as keyof typeof Locale.FileConversion.FileList.Status
                            ]
                          }
                          {file.status === "converting" &&
                            file.convertingSince &&
                            ` ${formatElapsed(file.convertingSince)}`}
                          {file.status === "success" &&
                            file.totalElapsed != null &&
                            ` ${formatElapsedSeconds(file.totalElapsed)}`}
                        </span>
                      </td>
                      <td className={styles["file-actions-cell"]}>
                        <div className={styles["file-actions-inner"]}>
                          {file.status === "success" && (
                            <IconButton
                              icon={<DownloadIcon />}
                              onClick={() => handleDownload(file)}
                            />
                          )}
                          <IconButton
                            icon={<CloseIcon />}
                            onClick={() => handleDeleteFile(file.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles["drag-drop-hint"]}>
                {Locale.FileConversion.FileList.DragDropHint}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
