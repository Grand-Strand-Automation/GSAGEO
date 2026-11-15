export const SAMPLE_REPORT = {
  domain: "coastalcomfort-hvac.com",
  score: 58,
  headline: "Findable, but not yet recommended",
  summary:
    "AI tools know Coastal Comfort exists and roughly what it does. They rarely name it when someone asks for a recommendation, mainly because service pages are thin and there's no structured business data.",
  pills: [
    { label: "2 strengths", tone: "good" as const },
    { label: "3 gaps", tone: "warn" as const },
    { label: "1 critical issue", tone: "bad" as const },
  ],
  query: "Who's a reliable commercial HVAC company in Myrtle Beach?",
  engines: [
    {
      name: "ChatGPT",
      status: "Mentioned, vague",
      tone: "warn" as const,
      detail: "Named 4th, described only as 'an HVAC company.' No services listed.",
    },
    {
      name: "Google AI Overviews",
      status: "Not cited",
      tone: "bad" as const,
      detail: "Three competitors cited; all have dedicated commercial service pages.",
    },
    {
      name: "Perplexity",
      status: "Cited",
      tone: "good" as const,
      detail: "Linked the homepage and quoted the review count.",
    },
    {
      name: "Microsoft Copilot",
      status: "Not cited",
      tone: "bad" as const,
      detail: "Pulled from Bing; business details there don't match the website.",
    },
  ],
  signals: [
    {
      id: "entity-clarity",
      name: "Entity clarity",
      score: 72,
      description: "Can AI tell who you are, what you do and where?",
      findings: [
        "Business name, city and core trade are clear on the homepage",
        "No About page explaining history or credentials",
      ],
    },
    {
      id: "service-pages",
      name: "Service pages",
      score: 48,
      description: "Does each service have enough specific content to be cited?",
      findings: [
        "One combined Services page for all offerings",
        "No pricing ranges, process or FAQs per service",
      ],
    },
    {
      id: "trust-proof",
      name: "Trust & proof",
      score: 55,
      description: "Reviews, credentials and examples AI can verify.",
      findings: [
        "Strong Google review count is visible",
        "No licenses, certifications or project examples on site",
      ],
    },
    {
      id: "structured-data",
      name: "Structured data",
      score: 30,
      description: "Machine-readable business facts (schema markup).",
      findings: [
        "No LocalBusiness or Service schema found",
        "Hours and service area exist only as plain text",
      ],
    },
    {
      id: "local-signals",
      name: "Local signals",
      score: 66,
      description: "Consistent name, address and phone across the web.",
      findings: [
        "Google Business Profile matches the site",
        "Bing Places listing shows an old phone number",
      ],
    },
    {
      id: "ai-mentions",
      name: "AI mentions",
      score: 40,
      description: "How often AI tools name you for relevant questions.",
      findings: [
        "Cited by 1 of 4 tools for the main query",
        "Not named for maintenance-contract questions",
      ],
    },
  ],
  defaultSignalId: "structured-data",
  priorities: [
    {
      num: "01",
      title: "Give each core service its own page",
      body: 'All services sit on one "Services" page. Separate pages for commercial installs, maintenance contracts and emergency repair give AI tools something specific to cite.',
      tag: "Biggest lift · free to read",
      locked: false,
    },
    {
      num: "02",
      title: "Fix business details on Bing Places",
      body: "Update the outdated phone number and service categories so Copilot and Bing-sourced answers match your website.",
      tag: null,
      locked: true,
    },
    {
      num: "03",
      title: "Add LocalBusiness structured data",
      body: "Publish schema markup for your business name, address, hours and services so AI tools can parse facts without guessing.",
      tag: null,
      locked: true,
    },
  ],
} as const;
