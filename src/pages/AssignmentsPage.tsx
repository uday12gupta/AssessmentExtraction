import { ClipboardList, Plus, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export function AssignmentsPage() {
  const assignments = [
    { title: "Algebra — Quadratic Equations", subject: "Mathematics", due: "Aug 28", status: "active", submissions: 18 },
    { title: "English Essay — Climate Change", subject: "English", due: "Aug 30", status: "active", submissions: 12 },
    { title: "Physics Lab Report — Optics", subject: "Physics", due: "Aug 22", status: "completed", submissions: 30 },
    { title: "History — Mughal Empire Timeline", subject: "History", due: "Aug 20", status: "completed", submissions: 28 },
    { title: "Chemistry — Periodic Table Quiz", subject: "Chemistry", due: "Sep 2", status: "active", submissions: 5 },
  ];

  const statusConfig = {
    active: { label: "Active", icon: Clock, bg: "bg-[#fff0e9]", text: "text-[#ff5f35]" },
    completed: { label: "Completed", icon: CheckCircle2, bg: "bg-[#e8f3ec]", text: "text-[#3c7a45]" },
  } as const;

  return (
    <main className="px-4 pb-12 pt-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[29px] font-bold tracking-[-0.045em] text-[#292927] sm:text-[36px]">
              <span className="rounded-md bg-[#e8f0fc] px-2 py-1 text-[#3b6fd4]">Assignments</span>
            </h1>
            <p className="mt-2 text-[15px] text-[#666663]">Create, track, and review homework assignments</p>
          </div>
          <button className="flex shrink-0 items-center gap-2 rounded-full bg-[#373735] px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_3px_0_#1e1e1d] transition hover:-translate-y-0.5 hover:bg-[#292927]">
            <Plus size={15} /> New
          </button>
        </div>

        <div className="space-y-3">
          {assignments.map((a, i) => {
            const cfg = statusConfig[a.status as keyof typeof statusConfig];
            return (
              <div key={i} className="rounded-2xl border border-[#e9e9e7] bg-white p-5 shadow-sm transition hover:border-[#d0d0cd] hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f0ef] text-[#6b6b68]">
                      <ClipboardList size={18} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-[15px] font-bold text-[#292927]">{a.title}</h3>
                      <p className="mt-0.5 text-[12px] text-[#8e8e8b]">{a.subject} — Due {a.due}</p>
                    </div>
                  </div>
                  <span className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
                    <cfg.icon size={13} /> {cfg.label}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-4 border-t border-[#f0f0ef] pt-3 text-[12px] text-[#8e8e8b]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-[#3c7a45]" />
                    {a.submissions} submissions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-[#ff5f35]" />
                    {32 - a.submissions} pending
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
