# SonarCloud Implementation Plan

## Information Gathered
- **Project Key**: micko2109
- **Organization Key**: micko2109
- **SONAR_TOKEN**: Already stored as GitHub Secret
- **Existing CI/CD**: `.github/workflows/ci.yml` with build, tests, docker, and deploy jobs
- **Coverage Reports**: Already configured with Jest in `coverage/lcov.info`

## Plan

### 1. Update sonar-project.properties
- Replace placeholder values with actual SonarCloud keys
- Configure proper exclusions and settings

### 2. Create Complete CI/CD Workflow with SonarCloud
- Add SonarCloud analysis job BEFORE tests
- Add quality gate check step
- Make quality gates blocking (prevent deployment if failed)

## Implementation Steps

### Step 1: Update sonar-project.properties
```properties
sonar.projectKey=micko2109
sonar.organization=micko2109
sonar.host.url=https://sonarcloud.io
sonar.sources=.
sonar.exclusions=**/node_modules/**, **/dist/**, **/build/**, **/coverage/**
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.javascript.maximumNewFunctions=0
sonar.javascript.maximumDuplicatedBlocks=0
```

### Step 2: Create Complete GitHub Workflow
- Add `sonarcloud` job before tests
- Add quality gate check using SonarCloud API
- Block deployment if quality gates fail

## Dependent Files to be Edited
1. `/Users/micko/Desktop/rirs-noviprojekat/sonar-project.properties`
2. `/Users/micko/Desktop/rirs-noviprojekat/.github/workflows/ci.yml`

## Followup Steps
1. Commit and push changes to GitHub
2. Trigger a workflow run
3. Verify SonarCloud analysis appears in dashboard
4. Verify quality gates work correctly

