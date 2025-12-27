'use client'

import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false)

  async function copyToClipboard() {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button onClick={copyToClipboard} className="w-full" size="lg">
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Copied to Clipboard!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" />
          Copy Link to Clipboard
        </>
      )}
    </Button>
  )
}
