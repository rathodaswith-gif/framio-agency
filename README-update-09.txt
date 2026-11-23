FRAMIO update 09: hero tweaks

Run in the VS Code terminal, inside your project folder:

  unzip -o ~/Downloads/framio-update-09-hero.zip -d .
  rm -f public/assets/videos/hero/ora-skin-hair.mp4 public/assets/videos/hero/ora-skin-hair.jpg

Then put it live:

  git add -A
  git commit -m "Hero: remove services line and ORA clip"
  git push origin main

What changes
- The Strategy / Branding / Content / Performance / AI Creative line under the hero is gone.
- The hero showreel now plays 5 clips (the ORA clip is removed from the hero only;
  it stays in the "Work that moves" section).
