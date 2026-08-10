# Shared components

Presentational, feature-agnostic standalone components live here — one folder
each (`button/`, `section-heading/`, `product-card/`, …).

Structure only so far — the components below define their inputs, outputs and
markup, but carry no styling until the finalised design is applied.

| Component      | Selector               |
| -------------- | ---------------------- |
| Button         | `app-button`           |
| SectionTitle   | `app-section-title`    |
| ProductCard    | `app-product-card`     |
| CollectionCard | `app-collection-card`  |
| FeatureCard    | `app-feature-card`     |
| Newsletter     | `app-newsletter`       |

Navbar and Footer are not here — they are shell pieces used once per layout,
so they live in `app/layout/`.

Rules for anything added here:

- Standalone, `ChangeDetectionStrategy.OnPush`, `signal`-based state.
- Inputs via `input()` / `input.required()`, outputs via `output()`.
- No injected feature services and no HTTP — take data in, emit events out.
  Anything that needs to know about the domain belongs in `features/`.
- Styles use `@use 'abstracts' as *;` for shared breakpoints, layers and mixins.
