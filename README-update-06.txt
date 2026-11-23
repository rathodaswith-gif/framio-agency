FRAMIO update 06 — Start-a-project brief form redesign

Run these two commands in the VS Code terminal, inside your project folder:

  unzip -o ~/Downloads/framio-update-06-form.zip -d .
  rm -rf public/assets/images/form

What changes
- /start-project gets a new design: a live film slate beside the form fills in as the
  client types, claps on every step, and stamps "That's a wrap" when the brief is sent.
- Steps slide in from the direction you're going. Errors shake gently.
  Enter moves to the next step. You can click the progress bar to go back,
  and every answer on the review step has an Edit button.
- The form logic, validation, draft saving and the /api/submissions call are unchanged.

New file:  src/components/brief/BriefSlate.tsx
Removed:   public/assets/images/form (old decorative images, no longer used)
