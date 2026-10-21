import { cacheLife } from "next/cache";

/** Cached server-side so the prerendered shell stays static yet rolls over yearly. */
export async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
