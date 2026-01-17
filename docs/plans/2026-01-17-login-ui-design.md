# Login UI Parity Design

**Goal:** Rebuild the uni-app login page to visually match the iOS `XYLoginView` layout and assets while keeping existing login logic intact.

## Visual Parity Targets

- White background with centered logo (`login_headerImage`) sized ~120×50, top margin ~100.
- Two stacked input rows with left icon + placeholder, underline separator (0.4 height), left/right margin 34, row height 43, spacing 15.
- Password row supports right accessory (security code button when SMS login is enabled; dropdown icon for account history). Default: accessory hidden.
- “Remember password” checkbox under password row (left aligned), icon 17×17, label size 15, spacing like native.
- Primary login button below (height 50, radius 6, color #37A6F1, text “登录”).
- Footer text centered: “版权所有：南京信业” at font size 11, gray (#7F7F7F).
- SMS login toggle exists but default hidden (matches native behavior).

## Assets

Copy from `snmis_group/XYMis/Assets.xcassets/Login` into `snmis_group_uni/src/static/login`:
- `login_headerImage`
- `login_loginName_icon`
- `login_security_icon`
- `login_check_box_select`
- `login_check_box_unselect`
- `Login_up` / `Login_down` (dropdown arrow, if needed)

## Behavior

- Keep existing auth flow (public key → encrypt → login → config fetch).
- “Remember password” persists `ISREMIND_PASSWORD`, `LOGIN_USER_NAME`, `ISREMIND` values and pre-fills on load.
- 5-tap logo hook reserved for IP/port switch (no UI change now).
- Validation mirrors native: require account/password (or mobile/code in SMS mode) before login.

## Testing

- Visual check on iOS and H5 to confirm spacing, icon alignment, underline style.
- Manual check: remember password persistence, login success, SMS mode toggle hidden by default.
