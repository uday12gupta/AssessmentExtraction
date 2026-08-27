import {
  FileText,
  School,
  ClipboardList,
  Library,
  ArrowRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { Section } from "@/components/Sidebar";

interface HomePageProps {
  onNavigate: (section: Section) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const cards: { section: Section; title: string; description: string; icon: typeof FileText; bg: string; iconBg: string }[] = [
    { section: "exams", title: "Exams", description: "Upload question papers & answer sheets for AI grading", icon: FileText, bg: "bg-[#fff0e9]", iconBg: "bg-[#ff5f35]" },
    { section: "assignments", title: "Assignments", description: "Create and manage homework assignments", icon: ClipboardList, bg: "bg-[#e8f0fc]", iconBg: "bg-[#3b6fd4]" },
    { section: "classroom", title: "My Classroom", description: "View student roster and class performance", icon: School, bg: "bg-[#e8f3ec]", iconBg: "bg-[#3c7a45]" },
    { section: "library", title: "My Library", description: "Browse saved question banks and past papers", icon: Library, bg: "bg-[#f3e8fc]", iconBg: "bg-[#7c3aed]" },
  ];

  const stats = [
    { label: "Exams Graded", value: "12", icon: CheckCircle2, color: "text-[#3c7a45]" },
    { label: "Pending Reviews", value: "3", icon: Clock, color: "text-[#ff5f35]" },
    { label: "Avg. Class Score", value: "78%", icon: TrendingUp, color: "text-[#3b6fd4]" },
  ];

  return (
    <main className="px-4 pb-12 pt-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e9e9e7] bg-white px-3 py-1 text-[11px] font-semibold text-[#8e8e8b]">
            <Sparkles size={13} className="text-[#ff5f35]" />
            Welcome back, Madhur
          </div>
          <h1 className="mt-3 text-[29px] font-bold tracking-[-0.045em] text-[#292927] sm:text-[36px]">
            Your <span className="rounded-md bg-[#fff0e9] px-2 py-1 text-[#ff5f35]">teaching dashboard</span>
          </h1>
          <p className="mt-2 text-[15px] text-[#666663]">Quickly access your exams, assignments, and student insights.</p>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-[#e9e9e7] bg-white p-4 shadow-sm">
              <s.icon size={20} className={s.color} strokeWidth={1.8} />
              <p className="mt-2 text-[24px] font-bold text-[#292927]">{s.value}</p>
              <p className="text-[11px] text-[#8e8e8b]">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {cards.map((card) => (
            <button
              key={card.section}
              onClick={() => onNavigate(card.section)}
              className="group flex items-start gap-4 rounded-2xl border border-[#e9e9e7] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#d0d0cd] hover:shadow-md"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bg}`}>
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${card.iconBg} text-white`}>
                  <card.icon size={16} strokeWidth={2} />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-bold text-[#292927]">{card.title}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-[#8e8e8b]">{card.description}</p>
              </div>
              <ArrowRight size={18} className="mt-1 shrink-0 text-[#c4c4c1] transition group-hover:translate-x-1 group-hover:text-[#ff5f35]" />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
