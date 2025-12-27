import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Copy } from 'lucide-react'
import CopyLinkButton from './copy-link-button'

export default async function ProposalSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: proposal } = await supabase
    .from('proposals')
    .select('*, clients(name)')
    .eq('id', id)
    .single()

  if (!proposal) {
    notFound()
  }

  const magicLink = proposal.magic_link_token
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/p/${proposal.magic_link_token}`
    : null

  return (
    <div className="container max-w-2xl py-16">
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div>
          <h1 className="text-3xl font-bold">Proposal Created!</h1>
          <p className="text-muted-foreground mt-2">
            Your proposal for{' '}
            <span className="font-semibold">
              {proposal.clients && typeof proposal.clients === 'object' && 'name' in proposal.clients
                ? proposal.clients.name
                : 'the client'}
            </span>{' '}
            has been created successfully.
          </p>
        </div>

        {/* Magic Link Card */}
        {magicLink && (
          <Card className="text-left">
            <CardHeader>
              <CardTitle>Client Approval Link</CardTitle>
              <CardDescription>
                Share this link with your client to view and accept the proposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-md font-mono text-sm break-all">
                {magicLink}
              </div>
              <CopyLinkButton link={magicLink} />
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="text-left">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <p className="text-sm">
                Send the magic link to your client via email or messaging
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <p className="text-sm">
                Once accepted, payment milestones will be automatically created
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <p className="text-sm">Track payment status in your Cashflow Timeline</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center pt-4">
          <Button variant="outline" asChild>
            <a href="/proposals">View All Proposals</a>
          </Button>
          <Button asChild>
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
