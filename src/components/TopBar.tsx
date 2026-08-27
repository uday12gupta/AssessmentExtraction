import {
  ArrowLeft,
  Bell,
  CircleHelp,
  Sparkles,
  MoreHorizontal,
  UserCircle,
} from "lucide-react";
import type { Section } from "@/components/Sidebar";

interface TopBarProps {
  section: Section;
  onBack: () => void;
}

const sectionLabels: Record<Section, string> = {
  home: "Home",
  classroom: "My Classroom",
  assignments: "Assignments",
  exams: "Exams",
  library: "My Library",
};

export function TopBar({ section, onBack }: TopBarProps) {
  return (
    <header className="flex h-[62px] items-center justify-between border-b border-[#e9e9e7] bg-white px-5 sm:px-8">
      <div className="flex items-center gap-3 text-[#949490]">
        <button onClick={onBack} className="transition hover:text-[#3b3b39]">
          <ArrowLeft size={20} className="text-[#3b3b39]" />
        </button>
        <span className="text-[14px] text-[#a1a19d]">|</span>
        <span className="text-[14px] font-medium text-[#3b3b39]">{sectionLabels[section]}</span>
      </div>
      <div className="flex items-center gap-4 text-[#797976]">
        <CircleHelp size={19} strokeWidth={1.8} className="cursor-pointer transition hover:text-[#3b3b39]" />
        <Bell size={19} strokeWidth={1.8} className="cursor-pointer transition hover:text-[#3b3b39]" />
        <Sparkles size={19} strokeWidth={1.8} className="cursor-pointer text-[#767674] transition hover:text-[#3b3b39]" />
        <div className="flex items-center gap-2 border-l border-[#ededeb] pl-4 text-[#353533]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4c7a9] text-[#7f462f]">
            <UserCircle size={20} />
          </div>
          <span className="hidden text-[13px] font-semibold sm:inline">Madhur Rastogi</span>
          <MoreHorizontal size={16} className="cursor-pointer transition hover:text-[#3b3b39]" />
        </div>
      </div>
    </header>
  );
}
