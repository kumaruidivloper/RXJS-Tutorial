import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ProductService } from '../product.service';
import { catchError, map, filter } from 'rxjs/operators';
import { EMPTY, Subject, combineLatest } from 'rxjs';
import { Product } from '../product';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  // pageTitle = 'Product Detail';
  private errorMessageSubject = new Subject<string>();
  errorMessage = '';

  // Stream-1 product
  product$ = this.productService.selectedProduct$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  // Stream-2 product-Title
  pageTitle$ = this.product$
      .pipe(
        map((p: Product) => p ? `Product Detail for: ${p.productName}` : null )
      );

  // Stream-3 product-Supplier
  productSuppliers$ = this.productService.selectedProductSuppliers$
  .pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  // Combining Stream-1/2/3
  vm$ = combineLatest([
    this.product$,
    this.productSuppliers$,
    this.pageTitle$
  ])
    .pipe(
      filter(([product]) => Boolean(product)),
      map(([product, productSuppliers, pageTitle]) =>
        ({ product, productSuppliers, pageTitle }))
    );


  constructor(private productService: ProductService) { }

}
