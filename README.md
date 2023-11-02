# brianmccrory.github.io

Currently, different repos can be published to this destination (only one repo is published/visible at one time):
1. To build & deploy a repo, go to Actions in this repo and choose which Action workflow to run. 
1. Jekyll site "just-the-docs" published on demand using custom pages.yml workflow from separate repo (brianmcc) similar to how brianmcc-site repo was publising to separate domain previously. See the README in that repo for more details.
1. With any commits to this repo brianmccrory.github.io, the `.github/workflows/jekyll-gh-pages.yml` will automatically run, but that script was changed to have empty build and deploy steps, so that any previous deploys would not be overwritten.
