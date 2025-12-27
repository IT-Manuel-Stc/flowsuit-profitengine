import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Mail, Phone, Building2 } from 'lucide-react'
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
    <div className="container max-w-6xl py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Kunden</h1>
          <p className="text-muted-foreground mt-2">Verwalte deine Kundenbeziehungen</p>
        </div>
        <Button asChild>
          <Link href="/clients/new">
            <Plus className="w-4 h-4 mr-2" />
            Neuer Kunde
          </Link>
        </Button>
      </div>

      {typedClients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Noch keine Kunden</h3>
            <p className="text-muted-foreground text-center mb-6">
              Leg deinen ersten Kunden an
            </p>
            <Button asChild>
              <Link href="/clients/new">
                <Plus className="w-4 h-4 mr-2" />
                Kunde hinzufügen
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {typedClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{client.name}</CardTitle>
                {client.company && (
                  <CardDescription className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {client.company}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {client.email}
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {client.phone}
                  </div>
                )}
                {client.notes && (
                  <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                    {client.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
