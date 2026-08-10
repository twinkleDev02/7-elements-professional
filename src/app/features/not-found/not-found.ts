import { ChangeDetectionStrategy, Component } from '@angular/core';

/** 404 page for the wildcard route. */
@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {}
