#!/bin/bash

npm run build
cd docs/.vuepress/dist
surge --domain=https://papico.surge.sh/