import api from "@/utils/request";

/** Matches guest /service pricing filter: only purchasable when active. */
export function isPackageActiveForPurchase(pkg) {
  if (!pkg) return false;
  if (pkg.is_active === true || pkg.is_active === 1) return true;
  if (typeof pkg.status === "string" && pkg.status.toUpperCase() === "AKTIF") return true;
  return false;
}

export async function fetchHasActivePurchaseablePackage() {
  try {
    const res = await api.get("/packages", { page: 1, limit: 100 });
    if (!res.data?.success) return false;
    const d = res.data.data || {};
    const all = [...(d.topup_koin || []), ...(d.langganan_premium || [])];
    return all.some(isPackageActiveForPurchase);
  } catch {
    return false;
  }
}
