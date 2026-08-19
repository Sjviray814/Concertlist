"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const username = String(formData.get("username") || "").trim();

  if (!/^[a-z0-9_]{3,20}$/i.test(username)) {
    redirect(`/signup?error=${encodeURIComponent("Username must be 3-20 characters: letters, numbers, underscore only.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?next=%2Fsets&notice=" + encodeURIComponent("Check your email to confirm your account, then log in."));
}
