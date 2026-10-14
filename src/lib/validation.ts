import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { devices, genders, packageIds, serviceItems } from "@/content/site";

export function todayInBusinessZone(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: process.env.BUSINESS_TIMEZONE ?? "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
const name = z
  .string()
  .trim()
  .min(2, "Please enter your name.")
  .max(100, "Please use no more than 100 characters.")
  .refine((v) => !/[\x00-\x1f]/.test(v), "Please remove control characters.");
const phone = z
  .string()
  .trim()
  .transform((v, ctx) => {
    const parsed = parsePhoneNumberFromString(v, "IN");
    if (!parsed?.isValid()) {
      ctx.addIssue({
        code: "custom",
        message:
          "Enter a valid phone number, including country code if outside India.",
      });
      return z.NEVER;
    }
    return parsed.number;
  });
const noticeVersion = z.literal("local-preview-v1");
export const enquirySchema = z.object({
  name,
  phone,
  serviceId: z
    .string()
    .refine(
      (v) => serviceItems.some((i) => i.id === v),
      "Choose your event type.",
    ),
  eventDate: z
    .string()
    .refine(
      (v) =>
        /^\d{4}-\d{2}-\d{2}$/.test(v) &&
        !Number.isNaN(Date.parse(v)) &&
        new Date(v).toISOString().slice(0, 10) === v &&
        v >= todayInBusinessZone(),
      "Choose today or a future date.",
    ),
  eventLocation: z
    .string()
    .trim()
    .min(3, "Enter your event location.")
    .max(300, "Please use no more than 300 characters."),
  packageId: z
    .string()
    .refine((v) => packageIds.includes(v), "Choose a valid package.")
    .nullable()
    .optional(),
  noticeVersion,
  sourceRoute: z.enum(["/", "/workflow"]).optional(),
});
const portfolio = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((v, ctx) => {
    if (!v) return undefined;
    const candidate = v.startsWith("@")
      ? `https://instagram.com/${v.slice(1)}`
      : v.startsWith("instagram.com/")
        ? `https://${v}`
        : v;
    try {
      const url = new URL(candidate);
      if (
        !["https:", "http:"].includes(url.protocol) ||
        url.username ||
        url.password
      )
        throw new Error();
      return url.href;
    } catch {
      ctx.addIssue({
        code: "custom",
        message: "Enter a full website URL or Instagram @handle.",
      });
      return z.NEVER;
    }
  });
export const applicationSchema = z.object({
  name,
  phone,
  email: z.email("Enter a valid email address.").max(254),
  gender: z.string().refine((v) => genders.includes(v), "Choose an option."),
  portfolioUrl: portfolio,
  deviceModelId: z
    .string()
    .refine(
      (v) => devices.some((d) => d.id === v),
      "Choose your iPhone model.",
    ),
  locality: z.string().trim().min(2, "Enter your locality.").max(150),
  videoUploadIds: z.array(z.uuid()).max(2, "Choose up to two videos."),
  photoUploadIds: z.array(z.uuid()).length(5, "Upload your five best photos."),
  noticeVersion,
});
export type EnquiryInput = z.infer<typeof enquirySchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
export class AppError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
  }
}
export function parseInput<T>(schema: z.ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const i of result.error.issues) {
      const key = String(i.path[0] ?? "form");
      fields[key] ??= i.message;
    }
    throw new AppError(
      "VALIDATION_ERROR",
      422,
      "Please check the highlighted fields.",
      fields,
    );
  }
  return result.data;
}
