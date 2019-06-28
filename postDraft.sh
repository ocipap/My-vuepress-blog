#!/bin/bash

if [ $# -eq 1 ]; then
  mv docs/_draft/$1.md docs/posts/$1.md
  echo "post $1 draft file"
else
  mv docs/_draft/* docs/posts/.
  echo "post all draft file"
fi
