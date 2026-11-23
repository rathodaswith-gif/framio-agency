FRAMIO update 07: Supabase keep-awake + setup files

Run in the VS Code terminal, inside your project folder:

  unzip -o ~/Downloads/framio-update-07-supabase.zip -d .

New:
  src/app/api/keep-alive/route.ts   tiny daily check that keeps Supabase awake
  vercel.json                       tells Vercel to call it every day at 9:00 AM IST
  .env.example                      template listing the 5 settings the site needs
Updated:
  README.md                         environment variables table matches the code
  schema.sql                        includes the table lock, for any fresh setup

The ping only runs after you add CRON_SECRET in Vercel and deploy.
