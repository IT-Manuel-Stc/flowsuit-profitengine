'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { createProposal } from '@/app/actions/create-proposal'
import { type Client } from '@/types/supabase'
import Link from 'next/link'
import { ArrowLeft, Check, Euro, Calendar, Users } from 'lucide-react'

const proposalFormSchema = z.object({
  clientId: z.string().min(1, 'Bitte wähle einen Kunden'),
  title: z.string().min(1, 'Projekttitel ist erforderlich'),
  totalBudget: z.string().min(1, 'Budget ist erforderlich'),
  startDate: z.string().min(1, 'Startdatum ist erforderlich'),
  paymentTerm: z.enum(['50-50', 'upfront', 'milestones']),
})

type ProposalFormData = z.infer<typeof proposalFormSchema>

export default function NewProposalPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      paymentTerm: '50-50',
    },
  })

  const paymentTerm = watch('paymentTerm')
  const totalBudget = watch('totalBudget')

  // Berechne Vorschau der Zahlungen
  const budgetNum = parseFloat(totalBudget) || 0
  const paymentPreview = {
    '50-50': [
      { label: 'Anzahlung', amount: budgetNum * 0.5 },
      { label: 'Abschluss', amount: budgetNum * 0.5 },
    ],
    upfront: [{ label: 'Vollzahlung', amount: budgetNum }],
    milestones: [
      { label: 'Start', amount: budgetNum * 0.33 },
      { label: 'Mitte', amount: budgetNum * 0.33 },
      { label: 'Abschluss', amount: budgetNum * 0.34 },
    ],
  }

  useEffect(() => {
    async function loadClients() {
      const { data } = await supabase.from('clients').select('*').order('name')
      if (data) setClients(data as Client[])
    }
    loadClients()
  }, [])

  async function onSubmit(data: ProposalFormData) {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('clientId', data.clientId)
    formData.append('title', data.title)
    formData.append('totalBudget', data.totalBudget)
    formData.append('startDate', data.startDate)
    formData.append('paymentTerm', data.paymentTerm)

    await createProposal(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container max-w-4xl mx-auto px-6 py-12">
        {/* Zurück-Button */}
        <Button variant="ghost" asChild className="mb-8 -ml-4">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-10 space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Neues Angebot erstellen</h1>
          <p className="text-lg text-muted-foreground">
            Erstelle ein professionelles Angebot mit flexiblen Zahlungskonditionen.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-8">
            {/* Projektdetails */}
            <Card className="p-8 border-2 shadow-xl">
              <div className="space-y-6">
                <div className="pb-4 border-b">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Projektdetails
                  </h3>
                </div>

                {/* Kunde */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Kunde *</Label>
                  {clients.length === 0 ? (
                    <Card className="p-6 text-center border-dashed border-2">
                      <p className="text-muted-foreground mb-4">Noch keine Kunden vorhanden</p>
                      <Button asChild variant="outline">
                        <Link href="/clients/new">Ersten Kunden anlegen</Link>
                      </Button>
                    </Card>
                  ) : (
                    <Select onValueChange={(value) => setValue('clientId', value)}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Kunde auswählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id} className="py-3">
                            <span className="font-medium">{client.name}</span>
                            {client.company && (
                              <span className="text-muted-foreground ml-2">({client.company})</span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.clientId && (
                    <p className="text-sm text-red-500">{errors.clientId.message}</p>
                  )}
                </div>

                {/* Projekttitel */}
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-base font-medium">
                    Projekttitel *
                  </Label>
                  <Input
                    id="title"
                    placeholder="z.B. Website Redesign, Logo-Entwicklung..."
                    className="h-12 text-base"
                    {...register('title')}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Budget */}
                  <div className="space-y-3">
                    <Label htmlFor="totalBudget" className="text-base font-medium flex items-center gap-2">
                      <Euro className="w-4 h-4" />
                      Gesamtbudget *
                    </Label>
                    <Input
                      id="totalBudget"
                      type="number"
                      step="0.01"
                      placeholder="5.000,00"
                      className="h-12 text-base"
                      {...register('totalBudget')}
                    />
                    {errors.totalBudget && (
                      <p className="text-sm text-red-500">{errors.totalBudget.message}</p>
                    )}
                  </div>

                  {/* Startdatum */}
                  <div className="space-y-3">
                    <Label htmlFor="startDate" className="text-base font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Startdatum *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      className="h-12 text-base"
                      {...register('startDate')}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-500">{errors.startDate.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Zahlungskonditionen */}
            <Card className="p-8 border-2 shadow-xl">
              <div className="space-y-6">
                <div className="pb-4 border-b">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Euro className="w-5 h-5 text-primary" />
                    Zahlungskonditionen
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Wähle aus, wie die Zahlung aufgeteilt werden soll
                  </p>
                </div>

                <RadioGroup
                  value={paymentTerm}
                  onValueChange={(value) =>
                    setValue('paymentTerm', value as '50-50' | 'upfront' | 'milestones')
                  }
                  className="space-y-4"
                >
                  {/* 50/50 */}
                  <label
                    className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentTerm === '50-50'
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'hover:border-muted-foreground/50'
                    }`}
                  >
                    <RadioGroupItem value="50-50" className="mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold text-base">50/50 Aufteilung</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        50% Anzahlung bei Projektstart, 50% bei Abschluss
                      </p>
                    </div>
                  </label>

                  {/* Vorauszahlung */}
                  <label
                    className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentTerm === 'upfront'
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'hover:border-muted-foreground/50'
                    }`}
                  >
                    <RadioGroupItem value="upfront" className="mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold text-base">100% Vorauszahlung</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Komplette Zahlung vor Projektbeginn
                      </p>
                    </div>
                  </label>

                  {/* Meilensteine */}
                  <label
                    className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentTerm === 'milestones'
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'hover:border-muted-foreground/50'
                    }`}
                  >
                    <RadioGroupItem value="milestones" className="mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold text-base">Drei Meilensteine</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        33% Start, 33% Mitte, 34% Abschluss
                      </p>
                    </div>
                  </label>
                </RadioGroup>

                {/* Zahlungsvorschau */}
                {budgetNum > 0 && (
                  <div className="mt-6 p-5 rounded-xl bg-muted/50 border">
                    <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                      Zahlungsübersicht
                    </h4>
                    <div className="space-y-2">
                      {paymentPreview[paymentTerm].map((payment, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-muted-foreground">{payment.label}</span>
                          <span className="font-semibold">
                            {payment.amount.toLocaleString('de-DE', {
                              style: 'currency',
                              currency: 'EUR',
                            })}
                          </span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2 flex justify-between items-center font-semibold">
                        <span>Gesamt</span>
                        <span className="text-lg">
                          {budgetNum.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Aktionen */}
            <div className="flex gap-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1 h-14 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading || clients.length === 0}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Angebot wird erstellt...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Angebot erstellen
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" size="lg" className="h-14 px-8 rounded-xl" asChild>
                <Link href="/">Abbrechen</Link>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
