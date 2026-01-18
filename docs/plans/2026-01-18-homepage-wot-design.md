# Home Page EP/EO Sections Design

## Overview
This design focuses on replicating the Flutter home page Environmental Protection (EP) and Equipment Operation (EO) sections in Uni-app using Wot Design Uni components. The goal is UI parity with the existing Flutter layout, while keeping data flow consistent with the current Uni home page. Data is sourced from legacy endpoints and normalized before rendering. UI must avoid horizontal scrolling and match the existing visual hierarchy.

## Options Considered
1. **Wot Card + Swiper (Recommended)**: Use `wd-card`, `wd-divider`, `wd-tag`, and `wd-swiper` to mirror the Flutter carousel pattern. Pros: consistent with existing Wot usage and layout parity. Cons: requires careful slot usage and height handling.
2. **Custom View + CSS Grid**: Build the layout with plain `<view>` elements and custom styles. Pros: full control. Cons: diverges from Wot component usage and increases styling risk.
3. **Reuse Existing Indicator List**: Adapt the current indicator list component. Pros: faster reuse. Cons: poor parity with Flutter and limited layout flexibility.

## Recommended Approach
Option 1 is the best fit: Wot components match the current component style and allow the swiper-based layout that already exists in Flutter.

## Component Design
- **WorkEnvironmentalProtection.vue**
  - `wd-card` title “环保指标” with `wd-tag` for equipment status.
  - `wd-swiper` iterates equipment items; each slide shows 6 metrics in a 2-column grid.
- **WorkEquipmentOperation.vue**
  - `wd-card` title “设备运行” with status tag and boiler icon.
  - 12 metrics grid with placeholders for turbine-type items to keep layout stable.

## Data Flow & Error Handling
- Fetch EP/EO in `src/pages/index/index.vue` using `legacyRequest`.
- Parse with `parseLegacyResponse`, normalize via `normalizeEnvironmentalItems` and `normalizeEquipmentItems`.
- Use `--` placeholder for missing values; fall back to empty arrays on request failure.

## Assets & Testing
- Copy `home_boiler.png` into `src/static/work`.
- Update `src/utils/assets.spec.ts` to cover the new asset.
- Add unit tests for components and page wiring; run `pnpm test -- src/pages/index`.
