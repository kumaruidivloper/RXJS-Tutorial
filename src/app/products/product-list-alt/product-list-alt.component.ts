// import { Component, OnInit, OnDestroy } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
// import { Subscription } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  errorMessage = '';
  // selectedProductId;

  products$ = this.productService.productsWithCategory$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  selectedProduct$ = this.productService.selectedProduct$;
  // products: Product[] = [];
  // sub: Subscription;

  constructor(private productService: ProductService) { }

  // ngOnInit(): void {
  //   this.sub = this.productService.getProducts().subscribe(
  //     products => this.products = products,
  //     error => this.errorMessage = error
  //   );
  // }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onSelected(productId: number): void {
    // console.log('Not yet implemented');
    this.productService.selectedProductChanged(productId);
  }
}
