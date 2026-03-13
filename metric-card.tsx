import type { LucideIcon } from 'lucide-react'

export function MetricCard({ icon: Icon, label, value, subtext }: { icon: LucideIcon; label: string; value: string; subtext?: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
          {subtext ? <div className="mt-1 text-sm text-slate-500">{subtext}</div> : null}
        </div>
        <div className="rounded-2xl bg-slate-100 p-3">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
      </div>
    </div>
  )
}
