'use client'

import { useMemo, useState } from 'react'
import { Building2, Car, Home, PoundSterling, Ruler, TrendingUp, Trees } from 'lucide-react'
import { MetricCard } from '@/components/metric-card'
import { SiteForm } from '@/components/site-form'
import { ReportPanel } from '@/components/report-panel'
import { ComparableList } from '@/components/comparable-list'
import { buildAssessment } from '@/lib/assessment'
import { getMockConsultants, mockLookup } from '@/lib/mock-lookup'
import type { SiteFormValues } from '@/lib/types'
import { round } from '@/lib/utils'

const initialForm: SiteFormValues = {
  siteAddress: '55 Nigel Road, SE15 4NP',
  siteAreaValue: '0.391',
  siteAreaUnit: 'acres',
  borough: 'Southwark',
  context: 'urban-residential',
  ptal: 'medium',
  existingUse: 'community',
  heritage: false,
  communityUse: true,
  tallBuildingZone: false,
  floodRisk: false,
  protectedEmployment: false,
  notes: 'Former church / community-related site near Peckham. User wants a quick development potential recommendation.',
}

export default function Page() {
  const [form, setForm] = useState<SiteFormValues>(initialForm)
  const [lookup, setLookup] = useState(mockLookup(initialForm.siteAddress, initialForm.borough))
  const [savedReports, setSavedReports] = useState<Array<{ id: number; address: string; density: string; homes: string; height: string; viability: number }>>([])

  const result = useMemo(() => buildAssessment(form), [form])
  const consultants = lookup.consultants || getMockConsultants()

  const setField = <K extends keyof SiteFormValues,>(key: K, value: SiteFormValues[K]) => setForm((prev) => ({ ...prev, [key]: value }))

  const runLookup = () => {
    const data = mockLookup(form.siteAddress, form.borough)
    setLookup(data)
    setForm((prev) => ({ ...prev, ptal: data.ptal, context: data.context, heritage: data.conservation, communityUse: data.communityUse, tallBuildingZone: data.tallBuildingZone, floodRisk: data.floodRisk, protectedEmployment: data.protectedEmployment }))
  }

  const saveReport = () => {
    setSavedReports((prev) => [{ id: Date.now(), address: form.siteAddress, density: `${result.recommendedLowDensity}-${result.recommendedHighDensity} u/ha`, homes: `${result.lowUnits}-${result.highUnits}`, height: result.headlineHeight, viability: result.viabilityScore }, ...prev].slice(0, 6))
  }

  const exportSummary = () => {
    const summary = [
      'Development appraisal summary',
      `Site: ${form.siteAddress}`,
      `Area: ${round(result.areaHa, 3)} ha`,
      `Recommended density: ${result.recommendedLowDensity}-${result.recommendedHighDensity} u/ha`,
      `Target homes: ~${result.targetUnits}`,
      `Suggested height: ${result.headlineHeight}`,
      `Indicative parking: ${result.parking.recommendedCarSpaces}-${result.parking.maxCarSpaces} spaces`,
      `Indicative amenity: ${result.amenity.privateAmenitySqm + result.amenity.communalAmenitySqm} sqm`,
      `GDV: £${result.appraisal.grossDevelopmentValue.toLocaleString()}`,
      `Build cost: £${result.appraisal.buildCost.toLocaleString()}`,
      `Residual land value: £${result.appraisal.residualLandValue.toLocaleString()}`,
    ].join('\n')

    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'development-appraisal-summary.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm text-slate-600 shadow-sm">Development Potential Platform</div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Planning-led site screening starter app</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">This Next.js starter mirrors the canvas prototype, but splits the logic into reusable modules and API routes so you can deploy it and keep building.</p>
          </div>
          <ReportPanel title="What this starter includes">A real Next.js app structure, shared assessment engine, mock lookup layer, starter API routes, database schema sketch, and a working frontend page that you can deploy and extend.</ReportPanel>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <SiteForm form={form} setField={setField} onLookup={runLookup} onSave={saveReport} onExport={exportSummary} />

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
              <MetricCard icon={Ruler} label="Site area" value={`${round(result.areaHa, 3)} ha`} subtext={`${round(result.areaHa * 2.47105, 3)} acres`} />
              <MetricCard icon={TrendingUp} label="Recommended density" value={`${result.recommendedLowDensity}-${result.recommendedHighDensity} u/ha`} subtext={`Sweet spot: ${result.sweetSpotDensity} u/ha`} />
              <MetricCard icon={Home} label="Estimated unit range" value={`${result.lowUnits}-${result.highUnits} homes`} subtext={`Target scheme: ~${result.targetUnits} homes`} />
              <MetricCard icon={Building2} label="Suggested height" value={result.headlineHeight} subtext="Contextual envelope" />
              <MetricCard icon={Car} label="Indicative parking" value={`${result.parking.recommendedCarSpaces}-${result.parking.maxCarSpaces} spaces`} subtext={`Disabled: ${result.parking.disabledSpaces}`} />
              <MetricCard icon={Trees} label="Amenity space" value={`${result.amenity.privateAmenitySqm + result.amenity.communalAmenitySqm} sqm`} subtext={`Private: ${result.amenity.privateAmenitySqm} · Communal: ${result.amenity.communalAmenitySqm}`} />
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <ReportPanel title="Executive summary">{form.siteAddress} appears capable of supporting a scheme around {result.headlineHeight} at approximately {result.sweetSpotDensity} units per hectare, suggesting around {result.targetUnits} homes under the current assumptions.</ReportPanel>
                <ReportPanel title="Comparable schemes"><ComparableList items={lookup.comparableApprovals} /></ReportPanel>
                <ReportPanel title="Parking and amenity">Parking: {result.parking.recommendedCarSpaces}-{result.parking.maxCarSpaces} spaces. Amenity: {result.amenity.privateAmenitySqm + result.amenity.communalAmenitySqm} sqm total. Child play allowance: {result.amenity.childPlaySqm} sqm.</ReportPanel>
              </div>

              <div className="space-y-4">
                <ReportPanel title="Appraisal headline">
                  <div className="grid gap-3">
                    <MetricCard icon={PoundSterling} label="GDV" value={`£${result.appraisal.grossDevelopmentValue.toLocaleString()}`} subtext={`£${result.appraisal.gdvPerSqm.toLocaleString()}/sqm`} />
                    <MetricCard icon={TrendingUp} label="Residual land value" value={`£${result.appraisal.residualLandValue.toLocaleString()}`} subtext={`Profit target: £${result.appraisal.targetProfit.toLocaleString()}`} />
                  </div>
                </ReportPanel>
                <ReportPanel title="Consultant team">{Object.entries(consultants).slice(0, 4).map(([discipline, firms]) => `${discipline}: ${firms.map((f) => f.name).join(', ')}`).join(' • ')}</ReportPanel>
                <ReportPanel title="Saved reports">{savedReports.length ? savedReports.map((item) => `${item.address} · ${item.height} · ${item.density}`).join(' • ') : 'No saved reports yet.'}</ReportPanel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
