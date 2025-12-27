import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Mail, Phone, Building2, User } from 'lucide-react'
import Link from 'next/link'
import type { Client } from '@/types/supabase'

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  const typedClients = (clients || []) as Client[]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Kunden</h1>
            <p className="text-lg text-muted-foreground">
              {typedClients.length} {typedClients.length === 1 ? 'Kunde' : 'Kunden'}
            </p>
          </div>
          <Button asChild size="lg" className="rounded-xl shadow-lg hover:shadow-xl transition-all">
            <Link href="/clients/new">
              <Plus className="w-5 h-5 mr-2" />
              Neuer Kunde
            </Link>
          </Button>
        </div>

        {/* Content */}
        {typedClients.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full p-12 text-center space-y-6 border-2 border-dashed">
              <div className="w-20 h-20 rounded-2xl bg-muted mx-auto flex items-center justify-center">
                <User className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Noch keine Kunden</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Beginne damit, deinen ersten Kunden anzulegen und starte dann mit der
                  Angebotserstellung.
                </p>
              </div>
              <Button asChild size="lg" className="rounded-xl">
                <Link href="/clients/new">
                  <Plus className="w-5 h-5 mr-2" />
                  Ersten Kunden anlegen
                </Link>
              </Button>
            </Card>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {typedClients.map((client) => (
              <Card
                key={client.id}
                className="group p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50"
              >
                <div className="space-y-4">
                  {/* Header with Avatar */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                        {client.name}
                      </h3>
                      {client.company && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Building2 className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{client.company}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes Preview */}
                  {client.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2 pt-2 border-t">
                      {client.notes}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
