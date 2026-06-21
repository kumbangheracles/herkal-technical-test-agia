"use client";
import { useStateContext } from "@/hooks/useStateContext";
import { motion } from "framer-motion";
import {
  Cog,
  ArrowRight,
  CheckCircle,
  Wrench,
  Shield,
  Zap,
  Wind,
  Link2,
  Layers,
  PaintBucket,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AutomotiveBgPattern from "../custom-ui/EcommerceBgPattern";

const SPAREPART_CATEGORIES = [
  {
    icon: Wrench,
    title: "Sparepart Mesin",
    desc: "Piston, ring seher, klep, gasket, dan komponen internal mesin lainnya tersedia untuk berbagai tipe motor.",
  },
  {
    icon: Zap,
    title: "Sistem Pengapian",
    desc: "Busi, koil, CDI, dan komponen pengapian original untuk performa mesin yang optimal.",
  },
  {
    icon: Wind,
    title: "Filter & Saringan",
    desc: "Filter udara, filter oli, dan filter bensin untuk menjaga kebersihan sistem bahan bakar dan pelumasan.",
  },
  {
    icon: Link2,
    title: "Rantai & Gear Set",
    desc: "Rantai, gir depan, dan gir belakang berkualitas untuk semua ukuran dan merk motor.",
  },
  {
    icon: Shield,
    title: "Kampas & Sistem Rem",
    desc: "Kampas rem cakram dan tromol, minyak rem, selang rem untuk keamanan pengereman.",
  },
  {
    icon: Layers,
    title: "Body & Aksesoris",
    desc: "Cover body, spion, handle bar, footstep, dan aksesoris motor untuk tampilan dan kenyamanan.",
  },
  {
    icon: PaintBucket,
    title: "Cat & Finishing",
    desc: "Cat semprot, dempul, dan bahan finishing untuk menjaga tampilan motor tetap kinclong.",
  },
  {
    icon: Cog,
    title: "Bearing & Bushing",
    desc: "Bearing roda, bearing setang, dan bushing swing arm untuk kenyamanan dan keamanan berkendara.",
  },
];

const SPAREPART_HIGHLIGHTS = [
  "Stok lengkap semua merk motor",
  "Garansi keaslian produk",
  "Harga kompetitif & transparan",
  "Bisa konsultasi sebelum beli",
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

export const SparepartSubSection = () => {
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
          <Cog size={11} />
          Sparepart Motor
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-foreground leading-tight mb-2">
              Part yang kamu cari <br className="hidden md:block" />
              ada di sini
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
              Stok sparepart lengkap untuk semua merk dan tipe motor. Original
              maupun aftermarket berkualitas semua tersedia dengan harga yang
              jelas dan bisa dikonsultasikan langsung.
            </p>
          </div>
          <div
            onClick={() => {
              (router.push("/"), setIdSection("contact-us"));
            }}
            className="inline-flex cursor-pointer items-center gap-2 bg-foreground text-background rounded-full px-5 py-2.5 text-[13px] font-medium hover:bg-foreground/85 transition-colors shrink-0"
          >
            Tanya Ketersediaan
            <ArrowRight size={13} />
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        {SPAREPART_CATEGORIES.map(({ icon: Icon, title, desc }) => (
          <motion.div
            key={title}
            variants={itemVariants}
            className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 hover:border-foreground/20 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-muted border border-border rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap"
      >
        {SPAREPART_HIGHLIGHTS.map((item) => (
          <div key={item} className="flex items-center gap-2">
            <CheckCircle
              size={13}
              className="text-blue-600 dark:text-blue-400 shrink-0"
            />
            <span className="text-[12px] text-muted-foreground">{item}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
};
