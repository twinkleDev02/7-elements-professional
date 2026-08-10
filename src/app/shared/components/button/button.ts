import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'ghost'
  | 'link'
  | 'inverse'
  | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * The one button in the app. Renders a `<button>`, an internal `<a>` or an
 * external `<a>` depending on which input is set, so a call to action keeps
 * the same look whether it submits a form or navigates.
 *
 * Carries no styles of its own — it composes the global `.btn` classes from
 * `styles/components/_buttons.scss`, which is where the variants are defined.
 */
@Component({
  selector: 'app-button',
  imports: [RouterLink],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  /** Only applies when rendering a `<button>`. */
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  readonly disabled = input(false);
  readonly loading = input(false);
  /** Fills the available width. */
  readonly block = input(false);
  readonly pill = input(false);
  /** Square button with no label — requires `ariaLabel`. */
  readonly iconOnly = input(false);

  /** Internal route. Mutually exclusive with `href`. */
  readonly routerLink = input<string | any[]>();
  /** External URL. Opens in a new tab. */
  readonly href = input<string>();

  /** Required when `iconOnly` is set, or when the label is not descriptive. */
  readonly ariaLabel = input<string>();

  readonly clicked = output<MouseEvent>();

  protected readonly classes = computed(() => {
    const classes = ['btn', `btn--${this.variant()}`];

    if (this.size() !== 'md') {
      classes.push(`btn--${this.size()}`);
    }

    if (this.block()) {
      classes.push('btn--block');
    }

    if (this.pill()) {
      classes.push('btn--pill');
    }

    if (this.iconOnly()) {
      classes.push('btn--icon');
    }

    return classes.join(' ');
  });

  /** A loading button is not interactive, even if `disabled` was not set. */
  protected readonly isDisabled = computed(() => this.disabled() || this.loading());

  protected onClick(event: MouseEvent): void {
    // Anchors have no `disabled` attribute, so the guard has to live here.
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.clicked.emit(event);
  }
}
