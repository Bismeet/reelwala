"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { enquirySelectionEvent } from "@/lib/enquiry-selection";
import s from "./site.module.css";

export default function EnquiryLink({
  children,
  service,
  packageId,
  dark = false,
  plain = false,
}: {
  children: ReactNode;
  service?: string;
  packageId?: string;
  dark?: boolean;
  plain?: boolean;
}) {
  const inHomepage = usePathname() === "/";
  const params = new URLSearchParams();
  if (service) params.set("service", service);
  if (packageId) params.set("package", packageId);
  const href = inHomepage
    ? "/#enquiry"
    : `/workflow${params.size ? `?${params}` : ""}#enquiry`;
  return (
    <Link
      href={href}
      className={plain ? undefined : `${s.button} ${dark ? s.buttonDark : ""}`}
      data-enquiry-service={service}
      data-enquiry-package={packageId}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
          return;
        window.dispatchEvent(
          new CustomEvent(enquirySelectionEvent, {
            detail: { service, packageId },
          }),
        );
      }}
    >
      {children}
      {!plain && <ArrowUpRight size={18} />}
    </Link>
  );
}
