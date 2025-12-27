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
    <Button
      onClick={copyToClipboard}
      size="lg"
      className="w-full h-14 text-lg rounded-xl transition-all"
      variant={copied ? 'outline' : 'default'}
    >
      {copied ? (
        <>
          <Check className="w-5 h-5 mr-2 text-green-500" />
          In Zwischenablage kopiert!
        </>
      ) : (
        <>
          <Copy className="w-5 h-5 mr-2" />
          Link kopieren
        </>
      )}
    </Button>
  )
}
