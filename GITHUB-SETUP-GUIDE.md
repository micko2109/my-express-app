# 🚀 GitHub Setup Guide - CI/CD Pipeline

This guide explains what you need to do on GitHub to complete the assignment.

---

## 📋 GitHub Repository Setup

### Step 1: Create `production` Branch

```bash
# Create production branch from main
git checkout -b production

# Push to GitHub
git push origin production

# Switch back to main
git checkout main
```

**Alternative via GitHub Web UI:**
1. Go to your repository on GitHub
2. Click on the branch dropdown (shows "main")
3. Type "production" and select "Create branch: production"

---

### Step 2: Configure GitHub Secrets

Go to: **Settings → Secrets and variables → Actions**

Add the following secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `DOCKER_HUB_USERNAME` | Your Docker Hub username | Used to login to Docker Hub |
| `DOCKER_HUB_PASSWORD` | Your Docker Hub password OR access token | Used to push Docker images |

**How to find/create Docker Hub credentials:**
1. Go to [Docker Hub](https://hub.docker.com)
2. Login to your account
3. Go to **Account Settings → Security**
4. Create a new access token OR use your password

---

### Step 3: Configure GitHub Environments

Go to: **Settings → Environments**

#### 3.1 Create "Development" Environment
1. Click **New environment**
2. Name: `Development`
3. Configure as shown below:
   - ✅ No protection rules (no required reviewers)
   - ✅ No deployment branches selected (or allow `main`)
4. Click **Configure environment**

#### 3.2 Create "Production" Environment
1. Click **New environment**
2. Name: `Production`
3. Configure as shown below:
   - ✅ **Required reviewers**: Select yourself (1 reviewer)
   - ✅ **Deployment branches**: 
     - Select "Selected branches"
     - Add "production" branch
     - Optionally add a rule for "main" branch
4. Click **Configure environment**

**Screenshots reference:**
```
Development:
├── Environment name: Development
└── Protection rules: None

Production:
├── Environment name: Production
├── Protection rules:
│   └── Required reviewers: @yourusername (1)
└── Deployment branches:
    └── Selected branches: production
```

---

### Step 4: Enable GitHub Pages

1. Go to: **Settings → Pages**
2. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** / **(root)**
   - Folder: **/ (root)**
3. Click **Save**

> ⚠️ Note: GitHub Pages will be automatically enabled when the workflow runs for the first time.

---

### Step 5: Verify GitHub Actions Workflow

1. Go to: **Actions** tab
2. You should see the workflow "CI/CD Pipeline - GitHub Pages & Environments"
3. Click on the workflow to see progress

---

## 🔄 How the Pipeline Works

### On `main` branch push:
```
1. Build → 2. Tests → 3. GitHub Pages → 4. Docker (dev tag) → 5. Verify
                                                              ↓
                                                    Development Environment
```

### On `production` branch push:
```
1. Build → 2. Tests → 3. Docker (prod tag) → 4. Wait for Approval → 5. Production
                                                        ↓
                                              Manual approval required
```

---

## ✅ Verification Checklist

After setting up, verify everything works:

- [ ] **GitHub Pages**: Visit `https://<yourusername>.github.io/<repo-name>/`
- [ ] **Docker Hub**: Check your Docker Hub repository for `dev` and `prod` tags
- [ ] **Environments**: Check the "Environments" tab in your repository
- [ ] **GitHub Actions**: All jobs should pass with green checkmarks

---

## 🐛 Troubleshooting

### "Docker login failed"
- Check your `DOCKER_HUB_USERNAME` and `DOCKER_HUB_PASSWORD` secrets
- Make sure the password is correct (try using an access token instead)

### "Environment not found"
- Make sure you created the environments in **Settings → Environments**
- Environment names are case-sensitive (use "Development" and "Production")

### "GitHub Pages not deploying"
- Check that the workflow ran successfully
- Ensure GitHub Pages is enabled in repository settings
- Wait 2-3 minutes after the workflow completes

### "Permission denied" errors
- Make sure the repository is not a fork (or fork has correct permissions)
- Check that you're not using a read-only token

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments)
- [GitHub Pages](https://docs.github.com/en/pages)
- [Docker Hub](https://docs.docker.com/docker-hub/)

---

## 📝 Notes for Submission

For your assignment submission, provide:
1. ✅ Link to GitHub Pages site
2. ✅ Screenshot of GitHub Environments (Development & Production)
3. ✅ Screenshot of Docker Hub repository with both `dev` and `prod` tags
4. ✅ Link to successful GitHub Actions workflow run

Good luck! 🚀

