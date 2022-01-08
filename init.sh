#!/bin/bash
mkdir dist
cp token.json ./dist 
cp handler.json ./dist
npm run build