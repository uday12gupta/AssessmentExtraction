import {
  ScanText,
  Sparkles,
  Grid2X2,
  School,
  ClipboardList,
  FileText,
  Library,
  PanelLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Section = "home" | "classroom" | "assignments" | "exams" | "library";

interface SidebarProps {
  active: Section;
  onNavigate: (section: Section) => void;
}

const navItems: { label: string; section: Section; icon: LucideIcon }[] = [
  { label: "Home", section: "home", icon: Grid2X2 },
  { label: "My Classroom", section: "classroom", icon: School },
  { label: "Assignments", section: "assignments", icon: ClipboardList },
  { label: "Exams", section: "exams", icon: FileText },
  { label: "My Library", section: "library", icon: Library },
];

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[260px] flex-col border-r border-[#e9e9e7] bg-white px-5 py-5 lg:flex">
      <div className="flex items-center justify-between px-1">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#2d2d2b] text-white shadow-sm">
            <ScanText size={18} strokeWidth={2.7} />
          </div>
          <span className="text-[20px] font-bold tracking-[-0.04em] text-[#272725]">VedaAI</span>
        </button>
        <PanelLeft size={16} className="text-[#989896]" />
      </div>

      <div className="mt-10 flex w-full items-center justify-center gap-2 rounded-full border-[3px] border-[#ff7652] bg-[#353533] px-4 py-2.5 text-[13px] font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
        <Sparkles size={15} />
        AI Teacher's Toolkit
      </div>

      <nav className="mt-10 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.section}
            onClick={() => onNavigate(item.section)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${
              active === item.section
                ? "bg-[#eeeeed] text-[#343432]"
                : "text-[#8e8e8b] hover:bg-[#f6f6f5] hover:text-[#4b4b48]"
            }`}
          >
            <item.icon size={17} strokeWidth={1.8} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto rounded-xl bg-[#f0f0ef] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white text-[#75a879] shadow-sm">
            <School size={23} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold text-[#41413e]">Delhi Public School</p>
            <p className="mt-0.5 truncate text-[11px] text-[#8e8e8b]">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
