'use client'

import type { SiteFormValues } from '@/lib/types'

const contexts = [
  ['suburban', 'Suburban / low-rise'],
  ['urban-residential', 'Urban residential'],
  ['town-centre', 'Town centre / high street'],
  ['growth-area', 'Growth area / opportunity area'],
] as const

const ptals = [
  ['low', 'Low'],
  ['medium', 'Medium'],
  ['high', 'High'],
  ['very-high', 'Very high'],
] as const

const uses = [
  ['residential', 'Residential'],
  ['commercial', 'Commercial'],
  ['community', 'Community'],
  ['industrial', 'Industrial'],
  ['vacant', 'Vacant / other'],
] as const

export function SiteForm({
  form,
  setField,
  onLookup,
  onSave,
  onExport,
}: {
  form: SiteFormValues
  setField: <K extends keyof SiteFormValues>(key: K, value: SiteFormValues[K]) => void
  onLookup: () => void
  onSave: () => void
  onExport: () => void
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Site setup</h2>
        <p className="text-sm text-slate-500">Run a mocked site lookup, then refine assumptions.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Site address</label>
          <div className="flex gap-2">
            <input className="w-full rounded-xl border px-3 py-2" value={form.siteAddress} onChange={(e) => setField('siteAddress', e.target.value)} />
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-white" onClick={onLookup}>Lookup</button>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_120px] gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Site area</label>
            <input className="w-full rounded-xl border px-3 py-2" value={form.siteAreaValue} onChange={(e) => setField('siteAreaValue', e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Unit</label>
            <select className="w-full rounded-xl border px-3 py-2" value={form.siteAreaUnit} onChange={(e) => setField('siteAreaUnit', e.target.value as SiteFormValues['siteAreaUnit'])}>
              <option value="acres">Acres</option>
              <option value="ha">Hectares</option>
              <option value="sqm">Sq m</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Borough</label>
            <input className="w-full rounded-xl border px-3 py-2" value={form.borough} onChange={(e) => setField('borough', e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Planning context</label>
            <select className="w-full rounded-xl border px-3 py-2" value={form.context} onChange={(e) => setField('context', e.target.value as SiteFormValues['context'])}>
              {contexts.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Transport accessibility</label>
            <select className="w-full rounded-xl border px-3 py-2" value={form.ptal} onChange={(e) => setField('ptal', e.target.value as SiteFormValues['ptal'])}>
              {ptals.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Existing use</label>
            <select className="w-full rounded-xl border px-3 py-2" value={form.existingUse} onChange={(e) => setField('existingUse', e.target.value as SiteFormValues['existingUse'])}>
              {uses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
        </div>

        <div className="rounded-2xl border p-4">
          <div className="mb-3 text-sm font-medium">Constraints and policy triggers</div>
          {([
            ['heritage', 'Heritage / conservation sensitivity'],
            ['communityUse', 'Community use to retain / replace'],
            ['tallBuildingZone', 'In an identified tall-building location'],
            ['floodRisk', 'Flood-risk constraint'],
            ['protectedEmployment', 'Protected employment use / designation'],
          ] as const).map(([key, label]) => (
            <div key={key} className="mb-2 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
              <span className="text-sm text-slate-600">{label}</span>
              <button className={`rounded-lg px-3 py-1 text-sm ${form[key] ? 'bg-slate-900 text-white' : 'border bg-white'}`} onClick={() => setField(key, !form[key] as never)}>
                {form[key] ? 'Yes' : 'No'}
              </button>
            </div>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Notes</label>
          <textarea className="min-h-[100px] w-full rounded-xl border px-3 py-2" value={form.notes} onChange={(e) => setField('notes', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-white" onClick={onSave}>Save report</button>
          <button className="rounded-xl border px-4 py-2" onClick={onExport}>Export summary</button>
        </div>
      </div>
    </div>
  )
}
