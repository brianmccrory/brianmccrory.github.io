#!/bin/sh

filelist="albums-index.org musicians-index.org timeline.org audio-mixes.org"
for i in $filelist; do
  echo "Updating generated/$i"
  cp ~/git/writing/generated/$i ./generated/
done
