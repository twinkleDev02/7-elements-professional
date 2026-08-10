import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import { ProductVideo } from '../../product-detail.data';

/**
 * The wash-ritual video.
 *
 * The `<video>` element is only mounted once the play button is pressed, so
 * a 2.6 MB file is never fetched for a visitor who scrolls past. Until then a
 * muted, metadata-only preview renders the clip's own first frame.
 */
@Component({
  selector: 'app-product-video',
  imports: [],
  templateUrl: './product-video.component.html',
  styleUrl: './product-video.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVideoComponent {
  readonly video = input.required<ProductVideo>();

  protected readonly isPlaying = signal(false);

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.product-video__reveal'), { y: 24, stagger: 0.1 });
      revealUp(q('.product-video__frame'), { y: 30, scale: 0.96, duration: 0.95 });
    });
  }

  protected play(): void {
    this.isPlaying.set(true);
  }
}
