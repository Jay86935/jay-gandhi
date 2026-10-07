# Contributing & Push Checklist

To maintain a high-quality, professional Git history, follow this checklist before pushing code to this repository (or any project repository):

## 1. Commit by Logical Step
- [ ] Are your changes broken down into small, logical commits? (e.g., eat: add particle canvas and ix: mobile menu visibility rather than one giant Update files).
- [ ] Did you avoid bundling unrelated changes into a single commit?

## 2. Meaningful Commit Messages
- [ ] Does your commit message clearly state *what* changed and *why*?
- [ ] Are you using standard conventional commits prefix? (eat:, ix:, docs:, style:, efactor:, perf:).

## 3. Code Quality & Performance
- [ ] Did you test the changes locally using a local server?
- [ ] Are all new images optimized (e.g., WebP format, properly sized under 200KB)?
- [ ] Do all new interactive elements have a equestIdleCallback or equivalent deferral so they don't block rendering?
- [ ] Did you verify the site still works with JavaScript disabled or for users with prefers-reduced-motion?

## 4. Documentation
- [ ] If you added a new project to the portfolio, did you update the filter categories and tags?
- [ ] Did you place the high-resolution images in ssets/images/<project-slug>/?
