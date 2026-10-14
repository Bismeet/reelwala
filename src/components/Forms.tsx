"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import {
  categories,
  devices,
  genders,
  packageIds,
  serviceItems,
  uploadLimits,
} from "@/content/site";
import {
  applicationSchema,
  enquirySchema,
  todayInBusinessZone,
} from "@/lib/validation";
import s from "./forms.module.css";
import {
  enquirySelectionEvent,
  type EnquirySelection,
} from "@/lib/enquiry-selection";

type Errors = Record<string, string>;
type Reply = {
  ok?: boolean;
  reference?: string;
  state?: string;
  message?: string;
  uploadId?: string;
  url?: string;
  error?: { message: string; fields?: Errors };
};
async function api(url: string, body?: unknown, method = "POST", key?: string) {
  const result = await fetch(url, {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(key ? { "Idempotency-Key": key } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30000),
  });
  const data = (await result.json()) as Reply;
  if (!result.ok)
    throw Object.assign(
      new Error(
        data.error?.message ?? "Something went wrong. Please try again.",
      ),
      { fields: data.error?.fields },
    );
  return data;
}
function Field({
  name,
  label,
  optional,
  errors,
  children,
}: {
  name: string;
  label: string;
  optional?: boolean;
  errors: Errors;
  children: React.ReactElement<{ id: string }>;
}) {
  return (
    <div
      className={`${s.field} ${["name", "eventLocation", "portfolioUrl", "locality", "serviceId", "packageId"].includes(name) ? s.wide : ""}`}
    >
      <label htmlFor={children.props.id}>
        {label}
        {optional && <span>Optional</span>}
      </label>
      {children}
      {errors[name] && (
        <p id={`${children.props.id}-error`} className={s.error}>
          {errors[name]}
        </p>
      )}
    </div>
  );
}
function Summary({ errors, scope }: { errors: Errors; scope: string }) {
  return Object.keys(errors).length ? (
    <div role="alert" className={s.summary}>
      <strong>Please check your details.</strong>
      <ul>
        {Object.entries(errors).map(([key, text]) => (
          <li key={key}>
            {key === "form" ? text : <a href={`#${scope}-${key}`}>{text}</a>}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
}
function Notice() {
  return (
    <p className={s.notice}>
      Private preview: use test details. Submissions and chosen files are stored
      on this computer for review. See our{" "}
      <Link href="/#privacy">preview privacy notice</Link>. Submitting does not
      confirm a booking or creator approval.
    </p>
  );
}
function Success({
  creator,
  reference,
  onReset,
}: {
  creator: boolean;
  reference: string;
  onReset: () => void;
}) {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    title.current?.focus();
  }, []);
  return (
    <div className={s.success} role="status" aria-live="polite">
      <span className={s.successIcon}>
        <Check size={24} />
      </span>
      <h2 tabIndex={-1} ref={title} data-scroll-focus="true">
        {creator ? "Your application is saved." : "Your enquiry is saved."}
      </h2>
      <p>
        {creator
          ? "Your details and any completed uploads have been received for review. This does not confirm your selection or a shoot assignment."
          : "Your event details have been received. A booking and availability are confirmed separately."}
      </p>
      <p>
        This preview saves locally. Staff notifications are queued for
        configuration.
      </p>
      <div className={s.reference}>Reference: {reference}</div>
      <button type="button" onClick={onReset} className={s.reset}>
        {creator ? "Start another application" : "Send another enquiry"}
      </button>
    </div>
  );
}
function focusError(form: HTMLFormElement, errors: Errors) {
  const target = Object.keys(errors).find((k) => k !== "form");
  if (target) (form.elements.namedItem(target) as HTMLElement | null)?.focus();
}
const subscribeReady = () => () => {};
function useReady() {
  return useSyncExternalStore(
    subscribeReady,
    () => true,
    () => false,
  );
}
function useSubmission() {
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState("");
  const retry = useRef({ fingerprint: "", key: "" });
  function reset() {
    retry.current = { fingerprint: "", key: "" };
    setReference("");
    setErrors({});
  }
  return {
    errors,
    setErrors,
    busy,
    setBusy,
    reference,
    setReference,
    retry,
    reset,
  };
}
export function EnquiryForm({
  initialService = "",
  initialPackage = "",
}: {
  initialService?: string;
  initialPackage?: string;
}) {
  const state = useSubmission();
  const ready = useReady();
  const { retry: retryRef } = state;
  const minimum = todayInBusinessZone();
  const [selectedService, setSelectedService] = useState(
    serviceItems.some((item) => item.id === initialService)
      ? initialService
      : "",
  );
  const [selectedPackage, setSelectedPackage] = useState(
    packageIds.includes(initialPackage) ? initialPackage : "",
  );
  const { setReference, setErrors } = state;
  useEffect(() => {
    const apply = (selection: EnquirySelection) => {
      if (
        selection.service &&
        serviceItems.some((item) => item.id === selection.service)
      )
        setSelectedService(selection.service);
      if (selection.packageId && packageIds.includes(selection.packageId))
        setSelectedPackage(selection.packageId);
      setReference("");
      setErrors({});
    };
    const query = new URLSearchParams(location.search);
    if (query.has("service") || query.has("package"))
      apply({
        service: query.get("service") ?? undefined,
        packageId: query.get("package") ?? undefined,
      });
    const select = (event: Event) =>
      apply((event as CustomEvent<EnquirySelection>).detail);
    window.addEventListener(enquirySelectionEvent, select);
    return () => window.removeEventListener(enquirySelectionEvent, select);
  }, [setReference, setErrors]);
  if (state.reference)
    return (
      <Success
        creator={false}
        reference={state.reference}
        onReset={state.reset}
      />
    );
  const a = (name: string) => ({
    id: `enquiry-${name}`,
    name,
    "aria-invalid": Boolean(state.errors[name]),
    "aria-describedby": state.errors[name]
      ? `enquiry-${name}-error`
      : undefined,
  });
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (state.busy) return;
    const f = new FormData(form);
    const input = {
      name: f.get("name"),
      phone: f.get("phone"),
      serviceId: f.get("serviceId") || "",
      eventDate: f.get("eventDate"),
      eventLocation: f.get("eventLocation"),
      packageId: f.get("packageId") || null,
      noticeVersion: "local-preview-v1",
      sourceRoute: window.location.pathname === "/workflow" ? "/workflow" : "/",
    };
    const parsed = enquirySchema.safeParse(input);
    if (!parsed.success) {
      const errors: Errors = {};
      parsed.error.issues.forEach((i) => {
        errors[String(i.path[0])] ??= i.message;
      });
      state.setErrors(errors);
      focusError(form, errors);
      return;
    }
    state.setErrors({});
    state.setBusy(true);
    const fingerprint = JSON.stringify(parsed.data);
    if (retryRef.current.fingerprint !== fingerprint)
      retryRef.current = { fingerprint, key: crypto.randomUUID() };
    try {
      const response = await api(
        "/api/enquiries",
        parsed.data,
        "POST",
        retryRef.current.key,
      );
      state.setReference(response.reference!);
    } catch (error) {
      const e = error as Error & { fields?: Errors };
      const errors = e.fields ?? {
        form:
          e.name === "TimeoutError" || e.name === "TypeError"
            ? "We couldn’t confirm whether your enquiry was received. Please retry."
            : e.message,
      };
      state.setErrors(errors);
      focusError(form, errors);
    } finally {
      state.setBusy(false);
    }
  }
  return (
    <form
      method="post"
      className={s.form}
      onSubmit={submit}
      noValidate
      aria-busy={state.busy}
    >
      <h2 className={s.heading}>Tell us what’s happening.</h2>
      <p className={s.intro}>A few details. The beginning of a great story.</p>
      <Summary errors={state.errors} scope="enquiry" />
      <div className={s.grid}>
        <Field name="name" label="Name" errors={state.errors}>
          <input
            {...a("name")}
            autoComplete="name"
            required
            maxLength={100}
            placeholder="Your full name"
          />
        </Field>
        <Field name="phone" label="Phone Number" errors={state.errors}>
          <input
            {...a("phone")}
            type="tel"
            autoComplete="tel"
            required
            placeholder="+91 98765 43210"
          />
        </Field>
        <Field name="eventDate" label="Event Date" errors={state.errors}>
          <input {...a("eventDate")} type="date" required min={minimum} />
        </Field>
        <Field name="serviceId" label="Event Type" errors={state.errors}>
          <select
            {...a("serviceId")}
            required
            value={selectedService}
            onChange={(event) => setSelectedService(event.target.value)}
          >
            <option value="" disabled>
              Select your occasion
            </option>
            {categories.map((c) => (
              <optgroup key={c.id} label={c.label}>
                {c.items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.displayLabel}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field
          name="eventLocation"
          label="Event Location"
          errors={state.errors}
        >
          <input
            {...a("eventLocation")}
            required
            maxLength={300}
            placeholder="Venue, area and city"
          />
        </Field>
        <Field
          name="packageId"
          label="Selected package"
          optional
          errors={state.errors}
        >
          <select
            {...a("packageId")}
            value={selectedPackage}
            onChange={(event) => setSelectedPackage(event.target.value)}
          >
            <option value="">I’d like guidance</option>
            <option value="standard">Standard</option>
            <option value="extended-session">Half Day</option>
            <option value="premium">Premium</option>
          </select>
        </Field>
      </div>
      <Notice />
      <button
        className={s.submit}
        disabled={state.busy || !ready}
        type="submit"
      >
        {state.busy ? "Saving your enquiry…" : "Submit Enquiry"}
        <ArrowUpRight size={18} />
      </button>
    </form>
  );
}

type FileItem = {
  key: string;
  file: File;
  kind: "photo" | "video";
  id?: string;
  progress: number;
  state: "queued" | "uploading" | "inspecting" | "ready" | "failed";
  error?: string;
};
export function CreatorForm() {
  const state = useSubmission();
  const ready = useReady();
  const { retry: retryRef } = state;
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploadError, setUploadError] = useState("");
  const session = useRef<Promise<Reply> | null>(null);
  const active = files.some((f) =>
    ["queued", "uploading", "inspecting"].includes(f.state),
  );
  const a = (name: string) => ({
    id: `creator-${name}`,
    name,
    "aria-invalid": Boolean(state.errors[name]),
    "aria-describedby": state.errors[name]
      ? `creator-${name}-error`
      : undefined,
  });
  function update(key: string, values: Partial<FileItem>) {
    setFiles((items) =>
      items.map((item) => (item.key === key ? { ...item, ...values } : item)),
    );
  }
  async function upload(item: FileItem) {
    try {
      update(item.key, { state: "uploading", error: undefined, progress: 0 });
      session.current ??= api("/api/upload-sessions").catch((error) => {
        session.current = null;
        throw error;
      });
      await session.current;
      const auth = await api("/api/uploads/authorize", {
        kind: item.kind,
        filename: item.file.name,
        byteSize: item.file.size,
        declaredMime:
          item.file.type ||
          (/\.mov$/i.test(item.file.name) ? "video/quicktime" : ""),
      });
      update(item.key, { id: auth.uploadId });
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", auth.url!);
        xhr.setRequestHeader(
          "Content-Type",
          item.file.type || "video/quicktime",
        );
        xhr.timeout = 600000;
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable)
            update(item.key, {
              progress: Math.round((e.loaded / e.total) * 100),
            });
        };
        xhr.onerror = () =>
          reject(new Error("Upload interrupted. Please retry."));
        xhr.ontimeout = () =>
          reject(new Error("Upload timed out. Please retry."));
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(
                new Error("The file could not be uploaded. Please retry."),
              );
        xhr.send(item.file);
      });
      update(item.key, { state: "inspecting", progress: 100 });
      let result = await api(`/api/uploads/${auth.uploadId}/complete`);
      for (
        let attempt = 0;
        result.state === "inspecting" && attempt < 15;
        attempt++
      ) {
        await new Promise((r) => setTimeout(r, 1000));
        result = await api(`/api/uploads/${auth.uploadId}`, undefined, "GET");
      }
      if (result.state !== "ready")
        throw new Error(
          result.message ??
            "The file could not be verified. Remove it and choose another file.",
        );
      update(item.key, { state: "ready" });
    } catch (error) {
      update(item.key, { state: "failed", error: (error as Error).message });
    }
  }
  function choose(kind: "photo" | "video", list: FileList | null) {
    if (!list) return;
    setUploadError("");
    const existing = files.filter((f) => f.kind === kind).length;
    const selected = Array.from(list);
    const limit = uploadLimits[kind];
    if (existing + selected.length > limit.count) {
      setUploadError(`Choose up to ${limit.count} ${kind}s in total.`);
      return;
    }
    const allowed =
      kind === "photo"
        ? ["image/jpeg", "image/png", "image/webp"]
        : ["video/mp4", "video/quicktime"];
    if (
      selected.some(
        (file) =>
          file.size > limit.bytes ||
          !file.size ||
          (!allowed.includes(file.type) &&
            !(kind === "video" && /\.mov$/i.test(file.name))),
      )
    ) {
      setUploadError(
        kind === "photo"
          ? "Choose JPEG, PNG or WebP photos under 10 MB. Export HEIC photos to JPEG first."
          : "Choose MP4 or MOV videos under 100 MB.",
      );
      return;
    }
    if (
      files.reduce((sum, f) => sum + f.file.size, 0) +
        selected.reduce((sum, f) => sum + f.size, 0) >
      uploadLimits.total
    ) {
      setUploadError("Please keep all files together under 250 MB.");
      return;
    }
    const added = selected.map((file) => ({
      key: crypto.randomUUID(),
      file,
      kind,
      progress: 0,
      state: "queued" as const,
    }));
    setFiles((items) => [...items, ...added]);
    added.forEach((item) => void upload(item));
  }
  async function remove(item: FileItem) {
    try {
      if (item.id) await api(`/api/uploads/${item.id}`, undefined, "DELETE");
      setFiles((items) => items.filter((f) => f.key !== item.key));
    } catch (error) {
      setUploadError((error as Error).message);
    }
  }
  async function retry(item: FileItem) {
    try {
      if (item.id) await api(`/api/uploads/${item.id}`, undefined, "DELETE");
      update(item.key, { id: undefined });
      await upload({ ...item, id: undefined });
    } catch (error) {
      setUploadError((error as Error).message);
    }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.busy || active) return;
    const form = event.currentTarget;
    const f = new FormData(form);
    const input = {
      name: f.get("name"),
      phone: f.get("phone"),
      email: f.get("email"),
      gender: f.get("gender") || "",
      portfolioUrl: f.get("portfolioUrl"),
      deviceModelId: f.get("deviceModelId") || "",
      locality: f.get("locality"),
      videoUploadIds: files
        .filter((f) => f.kind === "video" && f.state === "ready")
        .map((f) => f.id!),
      photoUploadIds: files
        .filter((f) => f.kind === "photo" && f.state === "ready")
        .map((f) => f.id!),
      noticeVersion: "local-preview-v1",
    };
    const parsed = applicationSchema.safeParse(input);
    const errors: Errors = {};
    if (!parsed.success)
      parsed.error.issues.forEach((i) => {
        errors[String(i.path[0])] ??= i.message;
      });
    if (files.some((f) => f.state === "failed"))
      errors.form = "Remove or retry the files that could not be uploaded.";
    if (Object.keys(errors).length) {
      state.setErrors(errors);
      focusError(form, errors);
      return;
    }
    state.setErrors({});
    state.setBusy(true);
    const fingerprint = JSON.stringify(parsed.data);
    if (retryRef.current.fingerprint !== fingerprint)
      retryRef.current = { fingerprint, key: crypto.randomUUID() };
    try {
      const result = await api(
        "/api/creator-applications",
        parsed.data,
        "POST",
        retryRef.current.key,
      );
      state.setReference(result.reference!);
      setFiles([]);
      session.current = null;
    } catch (error) {
      const e = error as Error & { fields?: Errors };
      const errors = e.fields ?? {
        form:
          e.name === "TimeoutError" || e.name === "TypeError"
            ? "We couldn’t confirm whether your application was received. Please retry."
            : e.message,
      };
      state.setErrors(errors);
      focusError(form, errors);
    } finally {
      state.setBusy(false);
    }
  }
  if (state.reference)
    return (
      <Success creator reference={state.reference} onReset={state.reset} />
    );
  return (
    <form
      method="post"
      className={s.form}
      onSubmit={submit}
      noValidate
      aria-busy={state.busy}
    >
      <h2 className={s.heading}>Your story starts here.</h2>
      <p className={s.intro}>
        Introduce yourself. Show us how you see the world.
      </p>
      <Summary errors={state.errors} scope="creator" />
      <div className={s.grid}>
        <Field name="name" label="Your Name" errors={state.errors}>
          <input
            {...a("name")}
            required
            maxLength={100}
            autoComplete="name"
            placeholder="Your full name"
          />
        </Field>
        <Field name="phone" label="Mobile Number" errors={state.errors}>
          <input
            {...a("phone")}
            required
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
          />
        </Field>
        <Field name="email" label="Email" errors={state.errors}>
          <input
            {...a("email")}
            required
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </Field>
        <Field name="gender" label="Gender" errors={state.errors}>
          <select {...a("gender")} defaultValue="" required>
            <option value="" disabled>
              Choose an option
            </option>
            {genders.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </Field>
        <Field
          name="deviceModelId"
          label="iPhone You Shoot With"
          errors={state.errors}
        >
          <select {...a("deviceModelId")} defaultValue="" required>
            <option value="" disabled>
              Select your model
            </option>
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          name="portfolioUrl"
          label="Portfolio / Instagram"
          optional
          errors={state.errors}
        >
          <input
            {...a("portfolioUrl")}
            maxLength={500}
            placeholder="Website URL or Instagram @handle"
          />
        </Field>
        <Field name="locality" label="Locality" errors={state.errors}>
          <input
            {...a("locality")}
            required
            maxLength={150}
            placeholder={"Type Your Area Like “Viman Nagar”"}
          />
        </Field>
        {(["video", "photo"] as const).map((kind) => (
          <fieldset className={s.upload} key={kind} disabled={state.busy}>
            <legend>
              {kind === "video"
                ? "Upload any two videos edited by you"
                : "Upload Best 5 pics clicked by you"}
            </legend>
            <p className={s.help}>
              {kind === "video"
                ? "Optional · up to 2 MP4 / MOV files · 100 MB each"
                : "Required · 5 JPEG / PNG / WebP photos · 10 MB each. Export HEIC to JPEG before choosing."}
            </p>
            <div className={s.picker}>
              <label className="sr-only" htmlFor={`creator-${kind}UploadIds`}>
                Choose {kind}s
              </label>
              <input
                id={`creator-${kind}UploadIds`}
                name={`${kind}UploadIds`}
                aria-invalid={!!state.errors[`${kind}UploadIds`]}
                aria-describedby={
                  state.errors[`${kind}UploadIds`]
                    ? `creator-${kind}UploadIds-error`
                    : undefined
                }
                type="file"
                accept={
                  kind === "video"
                    ? "video/mp4,video/quicktime,.mov"
                    : "image/jpeg,image/png,image/webp"
                }
                multiple
                disabled={active || state.busy}
                onChange={(e) => {
                  choose(kind, e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
            {state.errors[`${kind}UploadIds`] && (
              <p id={`creator-${kind}UploadIds-error`} className={s.error}>
                {state.errors[`${kind}UploadIds`]}
              </p>
            )}
            <ul className={s.fileList} aria-live="polite">
              {files
                .filter((f) => f.kind === kind)
                .map((item) => (
                  <li key={item.key} className={s.file}>
                    <span className={s.filename}>
                      {item.file.name}
                      <br />
                      <span className={s.fileStatus}>
                        {item.state === "ready"
                          ? "Ready to submit"
                          : item.state === "inspecting"
                            ? "Checking file…"
                            : item.state === "failed"
                              ? "Upload failed"
                              : `${item.progress}% uploaded`}
                      </span>
                    </span>
                    <div>
                      {item.state === "failed" && (
                        <button type="button" onClick={() => void retry(item)}>
                          Retry
                        </button>
                      )}
                      {!["queued", "uploading", "inspecting"].includes(
                        item.state,
                      ) && (
                        <button
                          type="button"
                          aria-label={`Remove ${item.file.name}`}
                          onClick={() => void remove(item)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {item.state === "uploading" && (
                      <progress
                        max={100}
                        value={item.progress}
                        aria-label={`Uploading ${item.file.name}`}
                      />
                    )}{" "}
                    {item.error && <p className={s.error}>{item.error}</p>}
                  </li>
                ))}
            </ul>
          </fieldset>
        ))}
      </div>
      {uploadError && (
        <p role="alert" className={s.error}>
          {uploadError}
        </p>
      )}
      {active && (
        <p role="status" className={s.pending}>
          Please wait for your files to finish before submitting.
        </p>
      )}
      <Notice />
      <button
        type="submit"
        className={s.submit}
        disabled={state.busy || active || !ready}
      >
        {state.busy ? "Saving your application…" : "Submit Application"}
        <ArrowUpRight size={18} />
      </button>
    </form>
  );
}
