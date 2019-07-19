import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// import { Subscription } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  pageTitle = 'Product List';
  errorMessage = '';
  categories;

  // previous assignment with-out async pipe
  // products: Product[] = [];

  // new assignment with async pipe
  products$: Observable<Product[]>;

  // un-used removed
  // sub: Subscription;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // Error Handling
    this.products$ = this.productService.getProducts()
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );
    // Below code Not reqieurd if we do Async Pipe

    // this.sub = this.productService.getProducts()
    //   .subscribe(
    //     products => this.products = products,
    //     error => this.errorMessage = error
    //   );
  }

  // Below code Not reqieurd if we do Async Pipe
  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    console.log('Not yet implemented');
  }
}
