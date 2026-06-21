import AdminLayout from "@/components/custom-ui/AppAdminLayout";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  ShoppingBag,
  Users,
  PackageCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

const AdminDashboardPage = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profileRole: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    profileRole = profile?.role ?? null;
  }

  const [
    { count: totalProducts },
    { count: totalUsers },
    { count: totalOrders },
    { data: recentOrders },
    { count: pendingOrders },
    { count: completedOrders },
    { count: cancelledOrders },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id, created_at, total_price, status, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("order_items")
      .select("product_id, quantity, products(title)")
      .limit(5),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed"),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "cancelled"),
  ]);

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const statusConfig: Record<
    string,
    { label: string; icon: React.ReactNode; className: string }
  > = {
    pending: {
      label: "Pending",
      icon: <Clock size={12} />,
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    completed: {
      label: "Selesai",
      icon: <CheckCircle2 size={12} />,
      className: "bg-green-50 text-green-700 border-green-200",
    },
    cancelled: {
      label: "Dibatalkan",
      icon: <XCircle size={12} />,
      className: "bg-red-50 text-red-700 border-red-200",
    },
    processing: {
      label: "Diproses",
      icon: <AlertCircle size={12} />,
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
  };

  const statCards = [
    {
      label: "Total Produk",
      value: totalProducts ?? 0,
      icon: <ShoppingBag size={18} />,
      trend: "+12%",
      up: true,
    },
    {
      label: "Total Pengguna",
      value: totalUsers ?? 0,
      icon: <Users size={18} />,
      trend: "+8%",
      up: true,
    },
    {
      label: "Total Pesanan",
      value: totalOrders ?? 0,
      icon: <PackageCheck size={18} />,
      trend: "+23%",
      up: true,
    },
    {
      label: "Konversi",
      value:
        totalOrders && totalUsers
          ? `${((totalOrders / totalUsers) * 100).toFixed(1)}%`
          : "0%",
      icon: <TrendingUp size={18} />,
      trend: "-2%",
      up: false,
    },
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 flex flex-col gap-6 min-h-screen">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Selamat datang kembali — berikut ringkasan toko hari ini.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map(({ label, value, icon, trend, up }) => (
            <div
              key={label}
              className="flex flex-col gap-3 p-4 bg-card border border-border rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-muted text-muted-foreground">
                  {icon}
                </span>
                <span
                  className={`flex items-center gap-0.5 text-[11px] font-medium ${up ? "text-green-600" : "text-red-500"}`}
                >
                  {up ? (
                    <ArrowUpRight size={13} />
                  ) : (
                    <ArrowDownRight size={13} />
                  )}
                  {trend}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-2xl font-semibold tracking-tight">{value}</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Pending",
              count: pendingOrders ?? 0,
              className: "text-yellow-600",
              bg: "bg-yellow-50 border-yellow-200",
            },
            {
              label: "Selesai",
              count: completedOrders ?? 0,
              className: "text-green-600",
              bg: "bg-green-50 border-green-200",
            },
            {
              label: "Dibatalkan",
              count: cancelledOrders ?? 0,
              className: "text-red-500",
              bg: "bg-red-50 border-red-200",
            },
          ].map(({ label, count, className, bg }) => (
            <div
              key={label}
              className={`flex flex-col gap-1 p-3 sm:p-4 rounded-2xl border ${bg}`}
            >
              <p className={`text-xl sm:text-2xl font-semibold ${className}`}>
                {count}
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">Pesanan Terbaru</h2>
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="grid grid-cols-4 px-4 py-2.5 bg-muted/50 border-b border-border">
              {["Pelanggan", "Tanggal", "Total", "Status"].map((h) => (
                <p
                  key={h}
                  className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  {h}
                </p>
              ))}
            </div>
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order: any) => {
                const status =
                  statusConfig[order.status] ?? statusConfig["pending"];
                return (
                  <div
                    key={order.id}
                    className="grid grid-cols-4 items-center px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <p className="text-xs font-medium truncate pr-2">
                      {order.profiles?.full_name ?? "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.created_at)}
                    </p>
                    <p className="text-xs font-medium">
                      {formatRupiah(order.total_price ?? 0)}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border w-fit ${status.className}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Belum ada pesanan.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
