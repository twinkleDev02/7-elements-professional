import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '@core/services/api.service';
import { Paginated } from '@shared/models/api-response.model';
import { Product, ProductFilter } from '@shared/models/product.model';

/**
 * Data access for the product feature. Scoped to this feature rather than to
 * `core`, so it is loaded with the product chunk and stays out of the initial
 * bundle. Provided in root so a cached instance survives navigation away and
 * back.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = inject(ApiService);

  list(filter: ProductFilter = {}): Observable<Paginated<Product>> {
    return this.api.get<Paginated<Product>>('products', {
      params: {
        ...(filter.concern ? { concern: filter.concern } : {}),
        ...(filter.search ? { search: filter.search } : {}),
        ...(filter.featuredOnly ? { featured: true } : {}),
      },
    });
  }

  getBySlug(slug: string): Observable<Product> {
    return this.api.get<Product>(`products/${slug}`);
  }
}
