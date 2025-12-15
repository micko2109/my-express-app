# TODO List for Express App Enhancements and CI/CD Setup

## 1. Add New Functionalities to server.js
- [x] Modify books array to include ratings (e.g., add 'ratings' array to each book)
- [x] Add GET /books/:id endpoint
- [x] Add PUT /books/:id endpoint
- [x] Add DELETE /books/:id endpoint
- [x] Add GET /books/search?title=... endpoint
- [x] Add POST /books/:id/rate endpoint
- [x] Add GET /books/stats endpoint

## 2. Update Tests
- [x] Add tests for GET /books/:id (success and error cases)
- [x] Add tests for PUT /books/:id (success, validation, error cases)
- [x] Add tests for DELETE /books/:id (success and error cases)
- [x] Add tests for GET /books/search (success, no results, validation)
- [x] Add tests for POST /books/:id/rate (success, validation, error cases)
- [x] Add tests for GET /books/stats (calculate stats correctly)
- [x] Ensure at least 20 tests total (expand existing if needed)
- [x] Add 10 additional backend tests for edge cases

## 3. Create Frontend
- [x] Create HTML interface (public/index.html)
- [x] Create CSS styling (public/styles.css)
- [x] Create JavaScript functionality (public/app.js)
- [x] Add static file serving to Express server
- [x] Create 10 frontend tests (tests/frontend.test.js)

## 4. Set Up GitHub Actions CI/CD
- [x] Create .github/workflows/ci.yml file
- [x] Configure jobs for backend testing
- [x] Include steps for installing dependencies, running tests, and generating coverage
- [x] Set up artifacts for coverage reports

## 5. Verification
- [x] Run tests locally to ensure they pass (backend tests passing, frontend tests need JSDOM config fix)
- [ ] Check coverage reports
- [ ] Push to GitHub and verify CI/CD pipeline runs
- [ ] Review artifacts and coverage

## Notes
- Focus on backend tests since the app is backend-focused.
- Ensure validations for inputs (e.g., title not empty, rating 1-5).
- Use in-memory data for simplicity.
- Frontend created with basic UI for all API endpoints.
- 10 frontend tests created, but JSDOM environment needs configuration.
