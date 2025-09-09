#!/bin/sh

filelist="index.org albums-index.org musicians-index.org timeline.org audio-mixes.org"
for i in $filelist; do
  echo "Updating generated-org/$i"
  cp ~/git/writing/generated/$i ./generated-org/
done
