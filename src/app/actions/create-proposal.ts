'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { Inserts } from '@/types/supabase'

const proposalSchema = z.object({
  clientId: z.string().min(1, 'Kunde ist erforderlich'),
  title: z.string().min(1, 'Projekttitel ist erforderlich'),
  totalBudget: z.number().positive('Budget muss größer als 0 sein'),
  startDate: z.string(),
  paymentTerm: z.enum(['50-50', 'upfront', 'milestones']),
})

type PaymentTerm = '50-50' | 'upfront' | 'milestones'

function generateMagicToken(): string {
  return crypto.randomUUID().replace(/-/g, '')
}

function calculateMilestones(totalBudget: number, paymentTerm: PaymentTerm, startDate: string) {
  const milestones: Array<{
    title: string
    amount: number
    description: string | null
    due_date: string | null
  }> = []

  if (paymentTerm === '50-50') {
    const half = totalBudget / 2
    milestones.push({
      title: 'Anzahlung (50%)',
      amount: half,
      description: '50% Anzahlung',
      due_date: startDate,
    })
    milestones.push({
      title: 'Abschluss (50%)',
      amount: half,
      description: '50% bei Projektabschluss',
      due_date: null,
    })
  } else if (paymentTerm === 'upfront') {
    milestones.push({
      title: 'Vollzahlung (100%)',
      amount: totalBudget,
      description: '100% Vorauszahlung',
      due_date: startDate,
    })
  } else if (paymentTerm === 'milestones') {
    const firstThird = totalBudget * 0.33
    const secondThird = totalBudget * 0.33
    const finalThird = totalBudget * 0.34

    milestones.push({
      title: 'Start (33%)',
      amount: firstThird,
      description: '33% bei Projektstart',
      due_date: startDate,
    })
    milestones.push({
      title: 'Mitte (33%)',
      amount: secondThird,
      description: '33% zur Projektmitte',
      due_date: null,
    })
    milestones.push({
      title: 'Abschluss (34%)',
      amount: finalThird,
      description: '34% bei Projektabschluss',
      due_date: null,
    })
  }

  return milestones
}

export async function createProposal(formData: FormData) {
  const supabase = await createClient()

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
    clientId: formData.get('clientId') as string,
    title: formData.get('title') as string,
    totalBudget: parseFloat(formData.get('totalBudget') as string),
    startDate: formData.get('startDate') as string,
    paymentTerm: formData.get('paymentTerm') as PaymentTerm,
  }

  const validated = proposalSchema.parse(rawData)

  // Generate magic link token
  const magicToken = generateMagicToken()

  // 1. Create the proposal
  const proposalInsert: Inserts<'proposals'> = {
    user_id: userId,
    client_id: validated.clientId,
    title: validated.title,
    total_amount: validated.totalBudget,
    status: 'draft',
    magic_link_token: magicToken,
  }

  const { data: proposal, error: proposalError } = await supabase
    .from('proposals')
    .insert(proposalInsert)
    .select()
    .single()

  if (proposalError || !proposal) {
    throw new Error('Fehler beim Erstellen des Angebots: ' + proposalError?.message)
  }

  // 2. Create the project (linked to proposal)
  const projectInsert: Inserts<'projects'> = {
    user_id: userId,
    client_id: validated.clientId,
    proposal_id: proposal.id,
    name: validated.title,
    budget: validated.totalBudget,
    status: 'active',
    start_date: validated.startDate,
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert(projectInsert)
    .select()
    .single()

  if (projectError || !project) {
    throw new Error('Fehler beim Erstellen des Projekts: ' + projectError?.message)
  }

  // 3. Calculate and create payment milestones
  const milestones = calculateMilestones(
    validated.totalBudget,
    validated.paymentTerm,
    validated.startDate
  )

  const milestonesToInsert: Inserts<'payment_milestones'>[] = milestones.map((m) => ({
    project_id: project.id,
    title: m.title,
    amount: m.amount,
    description: m.description,
    due_date: m.due_date,
    status: 'pending',
  }))

  const { error: milestonesError } = await supabase
    .from('payment_milestones')
    .insert(milestonesToInsert)

  if (milestonesError) {
    throw new Error('Fehler beim Erstellen der Meilensteine: ' + milestonesError.message)
  }

  revalidatePath('/proposals')
  redirect(`/proposals/${proposal.id}/success`)
}
