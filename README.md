# HDOT UI Tests

A repository containing a Playwright (TypeScript) project with UI tests (POM-based) for the [HDOT website](https://climate-resilience.hidot.hawaii.gov/).

## Installation

Make sure that NodeJS is installed and run:

    $ npm i

within the root folder of the repository.

## Running tests

You can run the tests either locally or via GitHub Actions. They run using 1 worker and against Chromium, Firefox and Webkit (Desktop Safari).

Tests are located in the `tests/e2e.spec.ts` file.

### Locally

After installing, run

    $ npx playwright test

### GitHub Actions (CI)

-   [run-all-tests.yml](https://github.com/nbaldzhiev/playwright-ts-orange-hrm/blob/main/.github/workflows/run-all-test-specs.yml) - Runs all test specs upon manual trigger (`workflow_dispatch`);

The Playwright HTML report is uploaded as a workflow artifact.

The tests are unstable in CI as the app loads very slowly there, so a TODO here is to investigate why and improve the tests when running in a GitHub Actions workflow.

> **_NOTE:_** You need to be a repository collaborator in order to run the workflow.
