# brianmccrory.github.io

Currently, one repo is publishing to this destination (only one repo is published/visible at one time):
1. Jekyll site "just-the-docs" published on demand using custom pages.yml workflow from separate repo (brianmcc) similar to how brianmcc-site repo was publising to separate domain previously. See the README in that repo for more details.

Not published (removed):
1. Jekyll site for data checked into this repo directory. Github pages auto publishes when commits are pushed to the main branch. 
   * Changed repo Settings -> Pages from Source: "Deploy from a branch" to "GitHub Actions" to turn off the auto-build trigger.
   * Changed repo Settings -> Actions -> Actions permissions -> 
      * [*] Allow brianmccrory, and select non-brianmccrory, actions and reusable workflows
      * Allow specified actions and reusable workflows:
         * `brianmccrory/brianmccrory.github.io/.github/workflows/pages-brianmcc.yml@main,`