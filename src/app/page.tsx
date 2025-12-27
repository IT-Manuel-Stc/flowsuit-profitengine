import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, TrendingDown, Users, FileText, ArrowUpRight, Euro, Wallet, PiggyBank } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Daten laden
  const { data: clients } = await supabase.from('clients').select('*')
  const { data: proposals } = await supabase.from('proposals').select('*')
  const { data: projects } = await supabase.from('projects').select('*')
  const { data: milestones } = await supabase.from('payment_milestones').select('*')

  const clientCount = clients?.length || 0
  const proposalCount = proposals?.length || 0
  const activeProjects = projects?.filter(p => p.status === 'active').length || 0
  
  // Berechne Gesamtbudget aus Projekten
  const totalBudget = projects?.reduce((sum, p) => sum + (Number(p.budget) || 0), 0) || 0
  
  // Berechne bezahlte und offene Beträge
  const paidAmount = milestones?.filter(m => m.status === 'paid').reduce((sum, m) => sum + (Number(m.amount) || 0), 0) || 0
  const pendingAmount = milestones?.filter(m => m.status === 'pending').reduce((sum, m) => sum + (Number(m.amount) || 0), 0) || 0

  return (
    <div className="min-h-screen">
      <div className="container max-w-7xl mx-auto px-6 py-8">
        {/* Hero Header Card */}
        <Card className="bg-[#025864] text-white p-8 mb-8 border-0 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-white/70 text-sm font-medium mb-2">Gesamtumsatz</p>
              <div className="flex items-baseline gap-3">
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                  {totalBudget.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                </h1>
                {totalBudget > 0 && (
                  <span className="inline-flex items-center gap-1 text-[#00D47E] text-lg font-semibold">
                    <TrendingUp className="w-5 h-5" />
                    aktiv
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-[#00D47E] hover:bg-[#00c070] text-[#025864] font-semibold rounded-xl px-6">
                <Link href="/clients/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Kunde
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl px-6">
                <Link href="/proposals/new">
                  <FileText className="w-4 h-4 mr-2" />
                  Angebot
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Einnahmen */}
          <Card className="p-6 shadow-lg border-0 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Einnahmen</p>
                <p className="text-3xl font-bold text-[#025864]">
                  {paidAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                </p>
                <p className="text-sm text-[#00D47E] font-medium mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Bezahlt
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#00D47E]/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#00D47E]" />
              </div>
            </div>
          </Card>

          {/* Ausstehend */}
          <Card className="p-6 shadow-lg border-0 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Ausstehend</p>
                <p className="text-3xl font-bold text-[#025864]">
                  {pendingAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                </p>
                <p className="text-sm text-amber-500 font-medium mt-2 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  Offen
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </Card>

          {/* Projekte */}
          <Card className="p-6 shadow-lg border-0 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Aktive Projekte</p>
                <p className="text-3xl font-bold text-[#025864]">{activeProjects}</p>
                <p className="text-sm text-gray-400 font-medium mt-2">
                  von {projects?.length || 0} gesamt
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#025864]/10 flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-[#025864]" />
              </div>
            </div>
          </Card>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Kunden */}
          <Card className="p-6 shadow-lg border-0 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#025864]/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#025864]" />
                </div>
                <h3 className="font-semibold text-lg text-[#025864]">Kunden</h3>
              </div>
              <Link href="/clients" className="text-sm text-[#00D47E] font-medium flex items-center gap-1 hover:underline">
                Alle anzeigen
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-[#025864]">{clientCount}</span>
              <span className="text-gray-500">Kunden gesamt</span>
            </div>
            {clientCount === 0 ? (
              <Button asChild className="w-full bg-[#025864] hover:bg-[#034956] rounded-xl">
                <Link href="/clients/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Ersten Kunden anlegen
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className="w-full rounded-xl border-[#025864] text-[#025864] hover:bg-[#025864]/5">
                <Link href="/clients/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Neuen Kunden anlegen
                </Link>
              </Button>
            )}
          </Card>

          {/* Angebote */}
          <Card className="p-6 shadow-lg border-0 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00D47E]/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#00D47E]" />
                </div>
                <h3 className="font-semibold text-lg text-[#025864]">Angebote</h3>
              </div>
              <span className="text-sm text-gray-400">Letzte 30 Tage</span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-[#025864]">{proposalCount}</span>
              <span className="text-gray-500">Angebote erstellt</span>
            </div>
            <Button asChild className="w-full bg-[#00D47E] hover:bg-[#00c070] text-[#025864] rounded-xl font-semibold">
              <Link href="/proposals/new">
                <Plus className="w-4 h-4 mr-2" />
                Neues Angebot erstellen
              </Link>
            </Button>
          </Card>
        </div>

        {/* Recent Activity Placeholder */}
        <Card className="p-6 shadow-lg border-0 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-[#025864]">Letzte Aktivitäten</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg text-sm">
                ⚡ Filter
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg text-sm">
                ↕ Sortieren
              </Button>
            </div>
          </div>
          
          {(proposals?.length || 0) === 0 && (clients?.length || 0) === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">Noch keine Aktivitäten vorhanden</p>
              <Button asChild className="bg-[#025864] hover:bg-[#034956] rounded-xl">
                <Link href="/clients/new">Jetzt starten</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Beispiel-Einträge basierend auf echten Daten */}
              {clients?.slice(0, 3).map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#025864] flex items-center justify-center text-white font-semibold">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-[#025864]">{client.name}</p>
                      <p className="text-sm text-gray-500">Kunde angelegt</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#00D47E]/10 text-[#00D47E]">
                    Neu
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
