export const projectFormContent = {
  metadata: {
    title: "Start a Project - FRAMIO",
    description:
      "Start a project with FRAMIO. Share your goals, scope and investment range in a focused five-step brief."
  },
  header: {
    homeAriaLabel: "FRAMIO home",
    statusAriaLabel: "FRAMIO response time",
    status: "Replies within 24 hours",
    backLabel: "Back to website"
  },
  intro: {
    heading: { prefix: "Let’s build something ", accent: "powerful" },
    description:
      "A focused brief gives us the context to recommend the right creative and growth system for your brand.",
    trustAriaLabel: "What to expect",
    trustItems: [
      {
        index: "01",
        title: "Private by default",
        description: "Your details are only used to discuss this project."
      },
      {
        index: "02",
        title: "No-obligation call",
        description: "We’ll recommend the clearest next step first."
      }
    ]
  },
  slate: {
    ariaLabel: "Live summary of your brief",
    production: "Production",
    client: "Client",
    services: "Services",
    goal: "Goal",
    timeline: "Timeline",
    budget: "Budget",
    scene: "Scene",
    take: "Take",
    date: "Date",
    empty: "Not set yet",
    brandFallback: "Your brand",
    wrapped: "That’s a wrap"
  },
  progressAriaLabel: "Project brief progress",
  progressStepPrefix: "Step",
  honeypotLabel: "Do not fill this field",
  progressSteps: [
    { name: "About you", shortLabel: "About" },
    { name: "Services", shortLabel: "Services" },
    { name: "Project", shortLabel: "Project" },
    { name: "Investment", shortLabel: "Budget" },
    { name: "Review", shortLabel: "Review" }
  ],
  about: {
    kicker: "Start the conversation",
    heading: { prefix: "First, let’s get to ", accent: "know you" },
    description:
      "Share the essentials. We’ll use these details only to discuss your project and recommend the right next step.",
    fields: {
      name: { label: "Your name", placeholder: "Enter your name" },
      brand: { label: "Brand / company", placeholder: "Your brand name" },
      email: { label: "Email address", placeholder: "you@brand.com" },
      phone: { label: "Phone number", placeholder: "+91 0000000000" }
    }
  },
  services: {
    kicker: "Build your system",
    heading: { prefix: "What are we building ", accent: "together?" },
    description:
      "Select one or more services. We’ll shape the scope around your real business goal, not force a fixed package.",
    options: [
      { value: "Branding", title: "Branding", description: "Identity, direction and visual language" },
      { value: "Social Media", title: "Social Media", description: "Content systems built for attention" },
      { value: "Performance Marketing", title: "Performance Marketing", description: "Campaigns focused on measurable growth" },
      { value: "Website Design", title: "Website Design", description: "Premium digital experiences that convert" },
      { value: "Video Production", title: "Video Production", description: "Reels, campaigns and cinematic stories" },
      { value: "Creative Design", title: "Creative Design", description: "High-impact visuals and campaigns" },
      {
        value: "Complete Marketing System",
        title: "Complete Marketing System",
        description: "Strategy, content, creative and performance-connected",
        wide: true
      }
    ]
  },
  project: {
    kicker: "The bigger picture",
    heading: { prefix: "Give us the ", accent: "real objective" },
    description:
      "Context helps us think beyond deliverables and build a stronger creative and growth system around your brand.",
    goal: {
      label: "Main goal",
      placeholder: "Choose your main goal",
      options: [
        "Build Brand Awareness",
        "Generate Leads",
        "Increase Sales",
        "Launch a New Brand",
        "Improve Social Media",
        "Build a Premium Website",
        "Not Sure Yet"
      ]
    },
    timeline: {
      label: "When do you want to start?",
      placeholder: "Select a timeline",
      options: ["Immediately", "Within 2 Weeks", "Within 1 Month", "Just Exploring"]
    },
    details: {
      label: "Tell us about your project",
      placeholder:
        "What are you building, what challenge are you solving, and what would a successful outcome look like?",
      maxLength: 1600
    }
  },
  budget: {
    kicker: "Investment level",
    heading: { prefix: "What range feels ", accent: "right?" },
    description:
      "This helps us recommend an approach that is realistic, focused and capable of delivering the outcome you want.",
    options: [
      { index: "A", value: "₹10K – ₹25K", title: "₹10K – ₹25K", description: "Focused creative support" },
      { index: "B", value: "₹25K – ₹50K", title: "₹25K – ₹50K", description: "Campaign or growth sprint" },
      { index: "C", value: "₹50K – ₹1L", title: "₹50K – ₹1L", description: "Integrated creative system" },
      { index: "D", value: "₹1L – ₹3L", title: "₹1L – ₹3L", description: "Growth-focused partnership" },
      { index: "E", value: "₹3L+", title: "₹3L+", description: "Large-scale brand or campaign" },
      {
        index: "F",
        value: "Let FRAMIO Recommend",
        title: "Let FRAMIO Recommend",
        description: "We’ll shape the best-fit scope"
      }
    ]
  },
  review: {
    kicker: "Final review",
    heading: { prefix: "Your brief is ", accent: "ready" },
    description: "Check the essentials below. Use Edit to change anything before you send it.",
    labels: {
      name: "Name",
      brand: "Brand",
      services: "Services",
      goal: "Goal",
      timeline: "Timeline",
      budget: "Investment",
      contact: "Contact",
      projectDetails: "Project"
    },
    emptyValue: "-",
    valueSeparator: " • ",
    privacy: "Your information stays private and is used only to discuss your project.",
    editLabel: "Edit"
  },
  actions: {
    saved: "Progress saves on this device",
    saving: "Saving…",
    restored: "Draft restored",
    unavailable: "Draft saving is unavailable",
    back: "Back",
    continue: "Continue",
    submit: "Send brief",
    submitting: "Sending…"
  },
  success: {
    kicker: "Brief received",
    heading: { prefix: "That’s a wrap. ", accent: "Your brief is in." },
    description: "We’ll review your brief and contact you within 24 hours with the clearest next step.",
    homeLabel: "Back to FRAMIO",
    whatsappLabel: "WhatsApp us",
    whatsappHref:
      "https://wa.me/919494029070?text=Hi%20FRAMIO%2C%20I%27ve%20submitted%20a%20project%20brief.",
    anotherLabel: "Submit another brief"
  },
  validation: {
    nameRequired: "Enter your name.",
    brandRequired: "Enter your brand or company name.",
    emailRequired: "Enter your email address.",
    emailInvalid: "Enter a valid email address.",
    phoneRequired: "Enter your phone number.",
    phoneInvalid: "Enter a valid phone number.",
    servicesRequired: "Select at least one service to continue.",
    goalRequired: "Choose your main goal.",
    timelineRequired: "Choose a project timeline.",
    detailsRequired: "Tell us a little about your project.",
    budgetRequired: "Select a budget range to continue.",
    submitFailed: "We couldn’t send your brief. Please try again or contact FRAMIO on WhatsApp."
  },
  footer: { legalName: "FRAMIO", items: ["Hyderabad, India", "Creative × Growth × AI"] },
  noScript: {
    prefix: "JavaScript is required for the multi-step project brief. Please email ",
    email: "framioagency.india@gmail.com"
  }
} as const;
