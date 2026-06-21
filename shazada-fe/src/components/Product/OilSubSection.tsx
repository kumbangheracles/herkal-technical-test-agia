"use client";
import { useStateContext } from "@/hooks/useStateContext";
import { motion } from "framer-motion";
import {
  Droplets,
  ArrowRight,
  CheckCircle,
  Gauge,
  Thermometer,
  RefreshCw,
  ShieldCheck,
  FlaskConical,
  BadgeCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AutomotiveBgPattern from "../custom-ui/EcommerceBgPattern";

const OIL_PRODUCTS = [
  {
    icon: Gauge,
    title: "Oli Mesin 4-Tak",
    desc: "Oli mesin untuk motor 4-tak dari brand Yamalube, AHM, Castrol, Shell, dan Motul tersedia dalam berbagai viskositas.",
  },
  {
    icon: FlaskConical,
    title: "Oli Mesin 2-Tak",
    desc: "Oli samping untuk motor 2-tak berkualitas tinggi agar mesin tetap terlindungi dan asap lebih bersih.",
  },
  {
    icon: RefreshCw,
    title: "Oli Gardan & Transmisi",
    desc: "Oli khusus gardan untuk motor matic dan oli transmisi untuk motor manual agar perpindahan gigi halus.",
  },
  {
    icon: Thermometer,
    title: "Oli Rem (Minyak Rem)",
    desc: "Minyak rem DOT 3 dan DOT 4 original untuk menjaga performa pengereman tetap responsif dan aman.",
  },
  {
    icon: ShieldCheck,
    title: "Oli Garpu (Fork Oil)",
    desc: "Oli suspensi depan untuk menjaga performa shockbreaker tetap empuk dan konsisten di berbagai kondisi jalan.",
  },
  {
    icon: BadgeCheck,
    title: "Oli Original Pabrikan",
    desc: "Tersedia oli resmi Yamalube, AHM Oil, Pertamina Enduro, dan Federal Oil sesuai rekomendasi pabrikan.",
  },
];

const OIL_BRANDS = [
  "Yamalube",
  "AHM Oil",
  "Castrol",
  "Shell Advance",
  "Motul",
  "Pertamina Enduro",
  "Federal Oil",
  "Repsol",
];

const OIL_HIGHLIGHTS = [
  "100% original & bersegel",
  "Semua viskositas tersedia",
  "Gratis cek oli saat servis",
  "Rekomendasi sesuai tipe motor",
];
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  } as const,
};

const OilSubSection = () => {
  const router = useRouter();
  const { setIdSection } = useStateContext();
  return (
    <section className="px-8 py-16 relative">
      <div className="absolute inset-0  -z-10 w-full h-full pointer-events-none select-none text-foreground">
        <AutomotiveBgPattern />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-muted border border-border rounded-full px-3 py-1.5 text-[11px] text-muted-foreground mb-4">
          <Droplets size={11} />
          Oli Motor
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-foreground leading-tight mb-2">
              Oli original, mesin <br className="hidden md:block" />
              lebih awet dan bertenaga
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
              Jangan kompromi soal oli. Kami menyediakan oli original dari brand
              terpercaya untuk semua tipe motor matic, manual, dan sport dengan
              harga yang bersaing.
            </p>
          </div>
          <div
            onClick={() => {
              (router.push("/"), setIdSection("contact-us"));
            }}
            className="inline-flex cursor-pointer items-center gap-2 bg-foreground text-background rounded-full px-5 py-2.5 text-[13px] font-medium hover:bg-foreground/85 transition-colors shrink-0"
          >
            Ganti Oli Sekarang
            <ArrowRight size={13} />
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8"
      >
        {OIL_PRODUCTS.map(({ icon: Icon, title, desc }) => (
          <motion.div
            key={title}
            variants={itemVariants}
            className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 hover:border-foreground/20 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shrink-0">
              <Icon size={16} />
            </div>
            <div>
              <h3 className="text-[13px] font-medium text-foreground mb-1">
                {title}
              </h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Brand pills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-wrap gap-2 mb-4"
      >
        <span className="text-[11px] text-muted-foreground self-center mr-1">
          Brand tersedia:
        </span>
        {OIL_BRANDS.map((brand) => (
          <span
            key={brand}
            className="inline-flex items-center bg-muted border border-border rounded-full px-3 py-1 text-[11px] text-muted-foreground"
          >
            {brand}
          </span>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-muted border border-border rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap"
      >
        {OIL_HIGHLIGHTS.map((item) => (
          <div key={item} className="flex items-center gap-2">
            <CheckCircle
              size={13}
              className="text-cyan-600 dark:text-cyan-400 shrink-0"
            />
            <span className="text-[12px] text-muted-foreground">{item}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default OilSubSection;
