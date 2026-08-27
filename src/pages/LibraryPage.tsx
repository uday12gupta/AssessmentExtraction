import { Library, BookOpen, FileText, Search } from "lucide-react";

export function LibraryPage() {
  const resources = [
    { title: "CBSE Class 10 — Mathematics Question Bank", type: "Question Bank", subject: "Mathematics", items: 240 },
    { title: "Science — Previous Year Papers (2020-2024)", type: "Past Papers", subject: "Science", items: 20 },
    { title: "English Literature — Chapter Notes", type: "Notes", subject: "English", items: 15 },
    { title: "Social Science — Map Work Collection", type: "Worksheets", subject: "Social Science", items: 32 },
    { title: "Physics — Formula Reference Sheet", type: "Reference", subject: "Physics", items: 8 },
    { title: "Chemistry — Reaction Practice Set", type: "Practice Set", subject: "Chemistry", items: 45 },
  ];

  const typeIcon: Record<string, typeof BookOpen> = {
    "Question Bank": FileText,
    "Past Papers": FileText,
    "Notes": BookOpen,
    "Worksheets": BookOpen,
    "Reference": Library,
    "Practice Set": FileText,
  };

  return (
    <main className="px-4 pb-12 pt-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-8">
          <h1 className="text-[29px] font-bold tracking-[-0.045em] text-[#292927] sm:text-[36px]">
            My <span className="rounded-md bg-[#f3e8fc] px-2 py-1 text-[#7c3aed]">Library</span>
          </h1>
          <p className="mt-2 text-[15px] text-[#666663]">Browse saved question banks, past papers, and teaching resources</p>
        </div>

        <div className="mb-6 flex items-center gap-2 rounded-full border border-[#e9e9e7] bg-white px-4 py-2.5 shadow-sm">
          <Search size={17} className="text-[#a1a19d]" />
          <input
            type="text"
            placeholder="Search resources by subject or title..."
            className="w-full bg-transparent text-[13px] text-[#292927] outline-none placeholder:text-[#a1a19d]"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {resources.map((r, i) => {
            const Icon = typeIcon[r.type] || BookOpen;
            return (
              <div key={i} className="group flex items-start gap-4 rounded-2xl border border-[#e9e9e7] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d0d0cd] hover:shadow-md cursor-pointer">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3e8fc] text-[#7c3aed]">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[14px] font-bold leading-snug text-[#292927]">{r.title}</h3>
                  <p className="mt-1.5 text-[12px] text-[#8e8e8b]">{r.subject}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-[#f0f0ef] px-2.5 py-1 text-[10px] font-semibold text-[#6b6b68]">{r.type}</span>
                    <span className="text-[11px] text-[#a1a19d]">{r.items} items</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
