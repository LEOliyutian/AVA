# Git Release & Tag Management Guide

This guide explains how to version your project using Git tags and GitHub Releases.

## 1. What are Tags?
Tags are like bookmarks in your project's history. They are used to mark specific points as "Releases" (e.g., `v1.0.0`, `v1.1.0`).

## 2. Version Numbering (Semantic Versioning)
We recommend using **Semantic Versioning** (`vMAJOR.MINOR.PATCH`):
- **MAJOR** (v1.0.0): Big changes, potentially breaking backward compatibility.
- **MINOR** (v1.1.0): New features added in a backward-compatible way.
- **PATCH** (v1.0.1): Bug fixes only.

## 3. How to Create a Tag

### Step 1: Check current status
Make sure you have committed all your changes.
```bash
git status
```

### Step 2: Create the tag
Run the following command in your terminal. Replace `v1.0.0` with your desired version number.
```bash
# Syntax: git tag -a <version> -m "<Description>"
git tag -a v0.1.0 -m "Initial beta release with updated HomePage"
```

### Step 3: Push the tag to GitHub
Tags are not pushed automatically with `git push`. You must push them explicitly.
```bash
# Push a specific tag
git push origin v0.1.0

# OR Push ALL tags at once
git push origin --tags
```

## 4. Managing Tags

### List all tags
```bash
git tag -n
```

### Delete a Release (Tag)
If you made a mistake (e.g., tagged the wrong commit):

**1. Delete the local tag:**
```bash
git tag -d v0.1.0
```

**2. Delete the remote tag (on GitHub):**
```bash
git push origin :refs/tags/v0.1.0
```

## 5. GitHub Releases (Best Practice)
After pushing a tag, go to your GitHub repository:
1.  Click on **Tags**.
2.  Click on the specific tag (e.g., `v0.1.0`).
3.  Click **Create release from tag**.
4.  Add a title and description (Release Notes).
5.  Click **Publish release**.

This will create a downloadable `.zip` of your source code for that version.
