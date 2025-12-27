'use server'

import { createClient as createSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { Inserts } from '@/types/supabase'

const clientSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

export async function createClient(formData: FormData) {
  const supabase = await createSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // DEV MODE: Use a dummy user ID if not authenticated
  const userId = user?.id || '00000000-0000-0000-0000-000000000000'

  if (!user) {
    console.warn('⚠️ DEV MODE: No user authenticated, using dummy user ID')
  }

  // Parse and validate form data
  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string || undefined,
    company: formData.get('company') as string || undefined,
    address: formData.get('address') as string || undefined,
    notes: formData.get('notes') as string || undefined,
  }

  const validated = clientSchema.parse(rawData)

  // Create the client
  const clientInsert: Inserts<'clients'> = {
    user_id: userId,
    name: validated.name,
    email: validated.email,
    phone: validated.phone || null,
    company: validated.company || null,
    address: validated.address || null,
    notes: validated.notes || null,
  }

  const { error } = await supabase.from('clients').insert(clientInsert)

  if (error) {
    throw new Error('Fehler beim Erstellen des Clients: ' + error.message)
  }

  revalidatePath('/clients')
  redirect('/clients')
}
