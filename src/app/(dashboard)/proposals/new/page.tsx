'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

const proposalFormSchema = z.object({
  clientId: z.string().min(1, 'Please select a client'),
  title: z.string().min(1, 'Project title is required'),
  totalBudget: z.string().min(1, 'Budget is required'),
  startDate: z.string().min(1, 'Start date is required'),
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

  // Load clients
  useEffect(() => {
    async function loadClients() {
      const { data } = await supabase.from('clients').select('*').order('name')
      if (data) setClients(data)
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
    <div className="container max-w-2xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Proposal</h1>
        <p className="text-muted-foreground mt-2">
          Set up a new project proposal with payment terms
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Proposal Details</CardTitle>
            <CardDescription>Enter the project and client information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Client Selection */}
            <div className="space-y-2">
              <Label htmlFor="clientId">Client *</Label>
              <Select onValueChange={(value) => setValue('clientId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} {client.company && `(${client.company})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clientId && (
                <p className="text-sm text-red-500">{errors.clientId.message}</p>
              )}
            </div>

            {/* Project Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Website Redesign"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Total Budget */}
            <div className="space-y-2">
              <Label htmlFor="totalBudget">Total Budget (€) *</Label>
              <Input
                id="totalBudget"
                type="number"
                step="0.01"
                placeholder="5000.00"
                {...register('totalBudget')}
              />
              {errors.totalBudget && (
                <p className="text-sm text-red-500">{errors.totalBudget.message}</p>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input id="startDate" type="date" {...register('startDate')} />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>

            {/* Payment Terms */}
            <div className="space-y-4">
              <Label>Payment Terms *</Label>
              <RadioGroup
                value={paymentTerm}
                onValueChange={(value) =>
                  setValue('paymentTerm', value as '50-50' | 'upfront' | 'milestones')
                }
                className="grid gap-4"
              >
                {/* 50/50 Split */}
                <Card
                  className={`cursor-pointer transition-all ${
                    paymentTerm === '50-50'
                      ? 'border-primary ring-2 ring-primary'
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => setValue('paymentTerm', '50-50')}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <RadioGroupItem value="50-50" id="50-50" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="50-50" className="text-base font-semibold cursor-pointer">
                        50/50 Split
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        50% upfront deposit, 50% upon project completion
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Upfront */}
                <Card
                  className={`cursor-pointer transition-all ${
                    paymentTerm === 'upfront'
                      ? 'border-primary ring-2 ring-primary'
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => setValue('paymentTerm', 'upfront')}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <RadioGroupItem value="upfront" id="upfront" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="upfront" className="text-base font-semibold cursor-pointer">
                        100% Upfront
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Full payment before project starts
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Milestones */}
                <Card
                  className={`cursor-pointer transition-all ${
                    paymentTerm === 'milestones'
                      ? 'border-primary ring-2 ring-primary'
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => setValue('paymentTerm', 'milestones')}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <RadioGroupItem value="milestones" id="milestones" className="mt-1" />
                    <div className="flex-1">
                      <Label
                        htmlFor="milestones"
                        className="text-base font-semibold cursor-pointer"
                      >
                        Three Milestones
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        33% at start, 33% at midpoint, 34% upon completion
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Creating Proposal...' : 'Create Proposal'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
