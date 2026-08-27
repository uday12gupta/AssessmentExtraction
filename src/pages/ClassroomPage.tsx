import { School, Users, GraduationCap, TrendingUp } from "lucide-react";

export function ClassroomPage() {
  const students = [
    { name: "Ananya Sharma", roll: "12", avgScore: "82%", status: "Excellent" },
    { name: "Rohan Verma", roll: "07", avgScore: "64%", status: "Good" },
    { name: "Priya Nair", roll: "19", avgScore: "91%", status: "Excellent" },
    { name: "Karthik Reddy", roll: "03", avgScore: "48%", status: "Needs Support" },
    { name: "Sneha Gupta", roll: "21", avgScore: "76%", status: "Good" },
    { name: "Arjun Patel", roll: "14", avgScore: "55%", status: "Fair" },
  ];

  const statusColor = (status: string) =>
    status === "Excellent" ? "bg-[#e8f3ec] text-[#3c7a45]"
    : status === "Good" ? "bg-[#e8f0fc] text-[#3b6fd4]"
    : status === "Needs Support" ? "bg-[#fff0e9] text-[#ff5f35]"
    : "bg-[#f0f0ef] text-[#6b6b68]";

  return (
    <main className="px-4 pb-12 pt-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-8">
          <h1 className="text-[29px] font-bold tracking-[-0.045em] text-[#292927] sm:text-[36px]">
            My <span className="rounded-md bg-[#e8f3ec] px-2 py-1 text-[#3c7a45]">Classroom</span>
          </h1>
          <p className="mt-2 text-[15px] text-[#666663]">Class 10-B — Delhi Public School, Bokaro Steel City</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Students", value: "32", icon: Users },
            { label: "Class Avg", value: "71%", icon: GraduationCap },
            { label: "Pass Rate", value: "94%", icon: School },
            { label: "Improving", value: "+5%", icon: TrendingUp },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-[#e9e9e7] bg-white p-4 shadow-sm">
              <s.icon size={18} className="text-[#8e8e8b]" strokeWidth={1.8} />
              <p className="mt-2 text-[22px] font-bold text-[#292927]">{s.value}</p>
              <p className="text-[11px] text-[#8e8e8b]">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[#e9e9e7] bg-white shadow-sm overflow-hidden">
          <div className="border-b border-[#e9e9e7] px-5 py-3">
            <h2 className="text-[14px] font-bold text-[#292927]">Student Roster</h2>
          </div>
          <div className="divide-y divide-[#f0f0ef]">
            <div className="grid grid-cols-[1fr_60px_80px_120px] gap-2 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#a1a19d]">
              <span>Student</span>
              <span className="text-center">Roll</span>
              <span className="text-center">Avg</span>
              <span className="text-right">Status</span>
            </div>
            {students.map((s) => (
              <div key={s.roll} className="grid grid-cols-[1fr_60px_80px_120px] items-center gap-2 px-5 py-3 text-[13px] transition hover:bg-[#f9f9f8]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0f0ef] text-[11px] font-bold text-[#6b6b68]">
                    {s.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <span className="truncate font-medium text-[#292927]">{s.name}</span>
                </div>
                <span className="text-center text-[#8e8e8b]">{s.roll}</span>
                <span className="text-center font-semibold text-[#292927]">{s.avgScore}</span>
                <span className="text-right">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusColor(s.status)}`}>{s.status}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
