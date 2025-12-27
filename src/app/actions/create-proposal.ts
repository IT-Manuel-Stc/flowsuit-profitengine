'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const proposalSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  title: z.string().min(1, 'Project title is required'),
  totalBudget: z.number().positive('Budget must be greater than 0'),
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
      title: 'Deposit (50%)',
      amount: half,
      description: '50% upfront payment',
      due_date: startDate,
    })
    milestones.push({
      title: 'Completion (50%)',
      amount: half,
      description: '50% upon project completion',
      due_date: null, // To be set upon completion
    })
  } else if (paymentTerm === 'upfront') {
    milestones.push({
      title: 'Full Payment (100%)',
      amount: totalBudget,
      description: '100% upfront payment',
      due_date: startDate,
    })
  } else if (paymentTerm === 'milestones') {
    const firstThird = totalBudget * 0.33
    const secondThird = totalBudget * 0.33
    const finalThird = totalBudget * 0.34 // Extra cent goes to final

    milestones.push({
      title: 'Start (33%)',
      amount: firstThird,
      description: '33% at project start',
      due_date: startDate,
    })
    milestones.push({
      title: 'Midpoint (33%)',
      amount: secondThird,
      description: '33% at project midpoint',
      due_date: null,
    })
    milestones.push({
      title: 'Completion (34%)',
      amount: finalThird,
      description: '34% upon project completion',
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

  if (!user) {
    throw new Error('Not authenticated')
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
  const { data: proposal, error: proposalError } = await supabase
    .from('proposals')
    .insert({
      user_id: user.id,
      client_id: validated.clientId,
      title: validated.title,
      total_amount: validated.totalBudget,
      status: 'draft',
      magic_link_token: magicToken,
    })
    .select()
    .single()

  if (proposalError || !proposal) {
    throw new Error('Failed to create proposal: ' + proposalError?.message)
  }

  // 2. Create the project (linked to proposal)
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      client_id: validated.clientId,
      proposal_id: proposal.id,
      name: validated.title,
      budget: validated.totalBudget,
      status: 'active',
      start_date: validated.startDate,
    })
    .select()
    .single()

  if (projectError || !project) {
    throw new Error('Failed to create project: ' + projectError?.message)
  }

  // 3. Calculate and create payment milestones
  const milestones = calculateMilestones(
    validated.totalBudget,
    validated.paymentTerm,
    validated.startDate
  )

  const milestonesToInsert = milestones.map((m) => ({
    project_id: project.id,
    title: m.title,
    amount: m.amount,
    description: m.description,
    due_date: m.due_date,
    status: 'pending' as const,
  }))

  const { error: milestonesError } = await supabase
    .from('payment_milestones')
    .insert(milestonesToInsert)

  if (milestonesError) {
    throw new Error('Failed to create milestones: ' + milestonesError.message)
  }

  revalidatePath('/proposals')
  redirect(`/proposals/${proposal.id}/success`)
}
