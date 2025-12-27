'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/app/actions/create-client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'

const clientFormSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

type ClientFormData = z.infer<typeof clientFormSchema>

export default function NewClientPage() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
  })

  async function onSubmit(data: ClientFormData) {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    if (data.phone) formData.append('phone', data.phone)
    if (data.company) formData.append('company', data.company)
    if (data.address) formData.append('address', data.address)
    if (data.notes) formData.append('notes', data.notes)

    await createClient(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container max-w-3xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-8 -ml-4">
          <Link href="/clients">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zu Kunden
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-10 space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Neuen Kunden anlegen</h1>
          <p className="text-lg text-muted-foreground">
            Erfasse alle wichtigen Informationen zu deinem Kunden.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="p-8 md:p-10 border-2 shadow-xl">
            <div className="space-y-8">
              {/* Required Fields */}
              <div className="space-y-6">
                <div className="pb-4 border-b">
                  <h3 className="font-semibold text-lg">Pflichtangaben</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Diese Felder müssen ausgefüllt werden
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-base font-medium">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Max Mustermann"
                      className="h-12 text-base"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-red-500" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-medium">
                      E-Mail *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="max@beispiel.de"
                      className="h-12 text-base"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-red-500" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Optional Fields */}
              <div className="space-y-6">
                <div className="pb-4 border-b">
                  <h3 className="font-semibold text-lg">Weitere Informationen</h3>
                  <p className="text-sm text-muted-foreground mt-1">Optional, aber empfohlen</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-base font-medium">
                      Telefon
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+49 123 456789"
                      className="h-12 text-base"
                      {...register('phone')}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="company" className="text-base font-medium">
                      Firma
                    </Label>
                    <Input
                      id="company"
                      placeholder="Beispiel GmbH"
                      className="h-12 text-base"
                      {...register('company')}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="address" className="text-base font-medium">
                    Adresse
                  </Label>
                  <Input
                    id="address"
                    placeholder="Musterstraße 123, 12345 Musterstadt"
                    className="h-12 text-base"
                    {...register('address')}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-base font-medium">
                    Notizen
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Weitere Informationen zum Kunden..."
                    rows={4}
                    className="text-base resize-none"
                    {...register('notes')}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 h-12 text-base rounded-xl shadow-lg hover:shadow-xl transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Wird erstellt...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Kunde erstellen
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 rounded-xl"
                  asChild
                >
                  <Link href="/clients">Abbrechen</Link>
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  )
}
