"use client";

import { RedirectType, redirect } from "next/navigation";

const NotFound = () => redirect("/", RedirectType.replace);

export default NotFound;
