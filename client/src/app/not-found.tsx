"use client";

import { RedirectType, redirect } from "next/navigation";

export default function NotFound() {
  redirect("/", RedirectType.replace);
}
