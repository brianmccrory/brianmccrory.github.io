#!/bin/sh

cp ~/git/writing/generated/unified.org ./
cp ~/git/writing/generated/categories.org ./
cp ~/git/writing/generated/audio-mixes.org ./audio.org
emacs -Q --script build-site.el
