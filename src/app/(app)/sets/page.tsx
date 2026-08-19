import { createClient } from "@/lib/supabase/server";
import SetsClient from "@/components/SetsClient";

export default async function SetsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: concerts } = await supabase
    .from("concerts")
    .select("*")
    .eq("user_id", user!.id)
    .order("date", { ascending: false });

  return <SetsClient concerts={concerts ?? []} />;
}
