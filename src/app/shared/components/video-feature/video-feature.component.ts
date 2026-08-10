import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

/**
 * A framed video block: optional heading, poster state, and a player that is
 * mounted only once the visitor presses play.
 *
 * That deferral is the point — a multi-megabyte file is never fetched for
 * someone who scrolls past. Until then a muted, metadata-only element renders
 * the clip's own first frame, so no stand-in poster image is required.
 *
 * Presentational: it takes a source and emits when playback starts. It never
 * autoplays with sound, because browsers block it and visitors resent it.
 */
@Component({
  selector: 'app-video-feature',
  imports: [],
  templateUrl: './video-feature.component.html',
  styleUrl: './video-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoFeatureComponent {
  readonly src = input.required<string>();
  /** Optional poster frame. Omitted, the clip's first frame stands in. */
  readonly poster = input<string>();

  readonly eyebrow = input<string>();
  readonly title = input<string>();
  readonly description = input<string>();

  /** Any valid `aspect-ratio` value, e.g. `16 / 9` or `21 / 9`. */
  readonly aspectRatio = input('16 / 9');
  /** Constrains the frame; omit for the full container width. */
  readonly maxWidth = input<string>();

  readonly played = output<void>();

  protected readonly isPlaying = signal(false);

  protected play(): void {
    this.isPlaying.set(true);
    this.played.emit();
  }
}
