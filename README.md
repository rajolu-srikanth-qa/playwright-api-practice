# Playwright API Testing Practice

![API Tests](https://github.com/rajolu-srikanth-qa/playwright-api-practice/actions/workflows/playwright.yml/badge.svg)

API test suite for the Restful-Booker practice API, built with Playwright and TypeScript.

## What's covered
- CRUD flow: create, read, update (PUT and PATCH), delete
- Negative tests: wrong credentials, missing token, invalid token, missing fields
- Schema validation with zod
- Reusable helpers and shared test data
- CI with GitHub Actions

## Run locally
```bash
npm install
npx playwright test
```
