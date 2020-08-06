#!/usr/bin/env bash

export NODE_ENV=test

rm -rf coverage

NODE_ENV=test nyc \
  --exclude 'src/**/*.spec.js' \
  --exclude 'local_modules' \
  npm run test

NODE_ENV=test nyc report --reporter=lcov

sensible-browser coverage/lcov-report/*.html