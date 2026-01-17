# Login UI Parity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current uni login page UI with a pixel-aligned version of the iOS `XYLoginView`, including assets, spacing, and “remember password” behavior.

**Architecture:** Keep existing login logic intact, only swap layout and add local remember-password persistence. Assets copied into `src/static/login` and referenced from the login page.

**Tech Stack:** uni-app (Vue 3, TypeScript), Pinia, uni.storage.

### Task 1: Add login assets

**Files:**
- Create: `snmis_group_uni/src/static/login/` (images copied)

**Step 1: Copy assets from iOS project**

Copy from `snmis_group/XYMis/Assets.xcassets/Login/*` into `snmis_group_uni/src/static/login/`:
- `login_headerImage` → `login_headerImage@2x.png` / `login_headerImage@3x.png`
- `login_loginName_icon` → `login_loginName_icon@2x.png` / `login_loginName_icon@3x.png`
- `login_security_icon` → `login_security_icon@2x.png` / `login_security_icon@3x.png`
- `login_check_box_select` → `login_check_box_select@2x.png` / `login_check_box_select@3x.png`
- `login_check_box_unselect` → `login_check_box_unselect@2x.png` / `login_check_box_unselect@3x.png`
- (Optional) `Login_up` / `Login_down` for dropdown arrow

**Step 2: Commit**

Skip (worktree only).

### Task 2: Rebuild login page layout

**Files:**
- Modify: `snmis_group_uni/src/pages/login/index.vue`

**Step 1: Replace template with iOS-aligned layout**

Structure:
- Top logo image (120×50, margin-top 100)
- Two input rows (height 43, margins 34 left/right, 15 spacing)
- Underline separator (0.4 height) per row
- Remember password row under password input (icon 17×17, font 15)
- Login button (height 50, radius 6, color #37A6F1)
- Footer text centered at bottom

**Step 2: Implement remember-password storage**

Use keys:
- `ISREMIND_PASSWORD` (boolean)
- `LOGIN_USER_NAME` (string)
- `ISREMIND` (password string)

On load:
- If remembered, prefill loginName/password.
On toggle:
- Save flag; if turning off, clear stored password.

**Step 3: Keep SMS toggle hidden**

Retain existing SMS logic but set `securityBtn` hidden by default.

**Step 4: Add 5-tap hook on logo**

Attach tap handler; for now, call `handleChangeIP()` placeholder (no UI changes).

**Step 5: Commit**

Skip (worktree only).

### Task 3: Verification

**Step 1: Run unit tests**

Run: `cd snmis_group_uni && pnpm test`
Expected: PASS.

**Step 2: Manual visual check**

Run: `pnpm dev:h5`
Verify spacing, icons, button, footer text align with iOS layout.

**Step 3: Commit**

Skip (worktree only).
