import type { ComparableScheme } from '@/lib/types'

export function ComparableList({ items }: { items: ComparableScheme[] }) {
  if (!items.length) {
    return <div className="rounded-2xl border border-dashed p-4 text-sm text-slate-500">No mock comparables found for this location yet.</div>
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item.ref} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-medium text-slate-900">{item.ref}</div>
            <div className="flex gap-2 text-xs">
              <span className="rounded-full border px-2 py-1">{item.height}</span>
              <span className={`rounded-full px-2 py-1 ${item.decision === 'Approved' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-800'}`}>{item.decision}</span>
            </div>
          </div>
          <div className="mt-2 text-sm text-slate-600">{item.summary}</div>
          <div className="mt-2 text-sm text-slate-500">{item.homes} homes · {item.committee} · {item.vote}</div>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Voted for</div>
              {item.councillorsFor.join(', ')}
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Voted against</div>
              {item.councillorsAgainst.join(', ')}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
