import { Component, ChangeDetectionStrategy } from '@angular/core';

// import { Subscription } from 'rxjs';

import { ProductService } from './product.service';
import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  categories;
  selectedCategoryId = 1;

  // previous assignment with-out async pipe
  // products: Product[] = [];

  // new assignment with async pipe
  // products$: Observable<Product[]>;

  // Declarative Approch
  products$ = this.productService.productsWithCategory$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  // Added For Filtering
  productsSimpleFilter$ = this.productService.productsWithCategory$
    .pipe(
      map(products =>
          products.filter(product =>
              this.selectedCategoryId ? product.categoryId === this.selectedCategoryId : true
            ))
    );

  // un-used removed
  // sub: Subscription;

  constructor(private productService: ProductService) { }

  // Declarative method code got removed

  // ngOnInit(): void {
  //   // Error Handling
  //   this.products$ = this.productService.getProducts()
  //   .pipe(
  //     catchError(err => {
  //       this.errorMessage = err;
  //       return EMPTY;
  //     })
  //   );

    // Below code Not reqieurd if we do Async Pipe

    // this.sub = this.productService.getProducts()
    //   .subscribe(
    //     products => this.products = products,
    //     error => this.errorMessage = error
    //   );

  // Below code Not reqieurd if we do Async Pipe
  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onAdd(): void {
    console.log('Not yet implemented');
  };

  onSelected(categoryId: string): void {
    console.log('Not yet implemented');
  }
}

