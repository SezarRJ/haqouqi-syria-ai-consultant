@tailwind base;
@tailwind components;
@tailwind utilities;

/* --- FONT IMPORT --- */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

@layer base {
  :root {
    /* FORMAL COLOR PALETTE */
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 221 83% 35%;
    --primary-foreground: 0 0% 98%;
    --secondary: 220 13% 91%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 220 13% 96%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 220 13% 91%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 220 13% 88%;
    --input: 220 13% 88%;
    --ring: 221 83% 45%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Arabic", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    min-height: 100vh;
  }
}

@layer components {
  /* UPDATED: Using modern logical properties for RTL support */
  .chat-message-user {
    /* ms-auto aligns to the right in LTR and to the left in RTL */
    @apply bg-primary text-primary-foreground rounded-xl p-3 max-w-[85%] ms-auto break-words shadow-sm;
  }

  .chat-message-bot {
    /* me-auto aligns to the left in LTR and to the right in RTL */
    @apply bg-card border border-border text-card-foreground rounded-xl p-3 max-w-[85%] me-auto break-words shadow-sm;
  }

  /*
  ==========================================================================
  MOBILE VIEW ENHANCEMENTS
  ==========================================================================
  */
  .mobile-header {
    @apply px-2 py-2 sm:px-4 sm:py-3;
  }

  .mobile-title {
    /* UPDATED: Made font size smaller and !important to force the change */
    @apply text-sm sm:text-base font-semibold !important;
  }

  .mobile-subtitle {
    @apply hidden sm:block text-xs;
  }
  
  .mobile-content-padding {
    @apply p-2 sm:p-4 md:p-6;
  }

  .chat-text {
    @apply text-sm leading-relaxed;
  }
}
