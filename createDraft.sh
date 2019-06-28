#!/bin/bash

templete="---\ntype: PostLayout\ntitle: "$1"\nsubtitle: \ncategory: \nthumbnail: /default/thumbnail.png\nmeta:\n  - name: description\n\tcontent: "$1"\ndate: "$(date +%Y)-$(date +%m)-$(date +%d)"\n---"

echo -e ${templete} > docs/_draft/$(date +%Y)-$(date +%m)-$(date +%d)-$1.md
echo "create file"