export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container max-w-7xl mx-auto px-6 py-16 lg:py-24">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Deine Profit Engine
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
            Willkommen bei
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              FlowSuit
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Verwalte Kunden, erstelle Angebote und behalte den Überblick über deine Projekte –
            alles an einem Ort.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <a
              href="/clients/new"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Ersten Kunden anlegen
            </a>
            <a
              href="/proposals/new"
              className="px-8 py-4 bg-card border-2 rounded-xl font-semibold hover:bg-muted transition-all hover:scale-105"
            >
              Angebot erstellen
            </a>
          </div>
        </div>

        {/* Quick Stats/Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Kunden verwalten</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Behalte alle Kontakte an einem Ort und greife schnell auf wichtige Infos zu.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Angebote erstellen</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professionelle Angebote mit flexiblen Zahlungskonditionen in Minuten.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Profit tracken</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Behalte deine Finanzen im Blick und optimiere deinen Cashflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
