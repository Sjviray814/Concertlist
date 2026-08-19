"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ConcertInput } from "@/lib/supabase/types";

function revalidateAll() {
  revalidatePath("/sets");
  revalidatePath("/rankings");
  revalidatePath("/compare");
}

export async function createConcert(input: ConcertInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase.from("concerts").insert({ ...input, user_id: user.id });
  if (error) return { error: error.message };

  revalidateAll();
  return {};
}

export async function updateConcert(id: string, input: ConcertInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase.from("concerts").update(input).eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidateAll();
  return {};
}

export async function deleteConcert(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase.from("concerts").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidateAll();
  return {};
}
