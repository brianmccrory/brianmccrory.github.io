#!/bin/sh

filelist="index.org categories.org unified.org timeline.org audio-mixes.org"
for i in $filelist; do
  echo "Updating generated/$i"
  cp ~/git/writing/generated/$i ./generated/
done
