'use server'

import { createClient as createSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { Inserts } from '@/types/supabase'

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
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

  if (!user) {
    throw new Error('Not authenticated')
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
    user_id: user.id,
    name: validated.name,
    email: validated.email,
    phone: validated.phone || null,
    company: validated.company || null,
    address: validated.address || null,
    notes: validated.notes || null,
  }

  const { error } = await supabase.from('clients').insert(clientInsert)

  if (error) {
    throw new Error('Failed to create client: ' + error.message)
  }

  revalidatePath('/clients')
  redirect('/clients')
}
