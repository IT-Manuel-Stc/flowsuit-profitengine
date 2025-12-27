import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Copy, ArrowRight, Mail, Calendar, TrendingUp } from 'lucide-react'
import CopyLinkButton from './copy-link-button'
import Link from 'next/link'
import type { Proposal, Client } from '@/types/supabase'

type ProposalWithClient = Proposal & {
  clients: Client | null
}

export default async function ProposalSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: proposal } = await supabase
    .from('proposals')
    .select('*, clients(*)')
    .eq('id', id)
    .single()

  if (!proposal) {
    notFound()
  }

  const typedProposal = proposal as unknown as ProposalWithClient

  const magicLink = typedProposal.magic_link_token
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/p/${typedProposal.magic_link_token}`
    : null

  const clientName = typedProposal.clients?.name || 'den Kunden'

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-500/5">
      <div className="container max-w-3xl mx-auto px-6 py-16">
        {/* Erfolgs-Animation */}
        <div className="text-center space-y-8 mb-12">
          <div className="relative inline-flex">
            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
            <div className="relative rounded-full bg-gradient-to-br from-green-400 to-green-600 p-6 shadow-2xl shadow-green-500/30">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">Angebot erstellt! 🎉</h1>
            <p className="text-xl text-muted-foreground">
              Dein Angebot für <span className="font-semibold text-foreground">{clientName}</span>{' '}
              wurde erfolgreich erstellt.
            </p>
          </div>
        </div>

        {/* Magic Link Karte */}
        {magicLink && (
          <Card className="p-8 border-2 shadow-xl mb-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-xl flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Kunden-Link
                </h3>
                <p className="text-muted-foreground">
                  Teile diesen Link mit deinem Kunden, damit er das Angebot ansehen und annehmen
                  kann.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-xl font-mono text-sm break-all border">
                {magicLink}
              </div>

              <CopyLinkButton link={magicLink} />
            </div>
          </Card>
        )}

        {/* Nächste Schritte */}
        <Card className="p-8 border-2 shadow-xl mb-8">
          <div className="space-y-6">
            <h3 className="font-semibold text-xl">Nächste Schritte</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Link an Kunden senden</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sende den Magic Link per E-Mail oder Messenger an deinen Kunden
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Kunde nimmt Angebot an</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Dein Kunde kann das Angebot online prüfen und mit einem Klick annehmen
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Zahlungsmeilensteine werden aktiv</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tracke alle Zahlungen und behalte den Überblick über deinen Cashflow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Aktionen */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="flex-1 h-14 text-lg rounded-xl">
            <Link href="/proposals/new">
              Weiteres Angebot erstellen
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-xl">
            <Link href="/">Zur Startseite</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
