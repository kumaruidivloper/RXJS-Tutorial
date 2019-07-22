import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError, combineLatest, BehaviorSubject, Subject, merge } from 'rxjs';
import { catchError, tap, map, scan, shareReplay } from 'rxjs/operators';

import { Product } from './product';
import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = this.supplierService.suppliersUrl;

  // Declarative Method Approch below removed code added here
  products$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      // map(item => item.price * 1.5),
      // map(products => products.map(product => product.price * 1.5)),

      // Delete For CombineLatest
      // map(products =>
      //   products.map(product => ({
      //     ...product,
      //     price: product.price * 1.5,
      //     searchKey: [product.productName]
      //   }) as Product)
      // ),

      // Removed for mergeMap
      // tap(data => console.log('Products: ', JSON.stringify(data))),
      catchError(this.handleError)
    );


    // Added For CombineLatest
    productsWithCategory$ = combineLatest([
      this.products$,
      this.productCategoryService.productCategories$
    ]).pipe(
      map(([products, categories]) =>
        products.map(product => ({
          ...product,
          price: product.price * 1.5,
          category: categories.find(c => product.categoryId === c.id).name,
          searchKey: [product.productName]
        }) as Product)
    ),
    shareReplay(1)
  );

  private productSelectedSubject = new BehaviorSubject<number>(0);
  productSelectedAction$ = this.productSelectedSubject.asObservable();

  // Added For Selected Value
  selectedProduct$ = combineLatest([
    this.productsWithCategory$,
    this.productSelectedAction$
  ])
      .pipe(
        map(([products, selectedProductId]) =>
          products.find(product => product.id === selectedProductId)
      ),
      tap(product => console.log('selectedProduct', product)),
      shareReplay(1)
      );
        // .pipe(
        //   map(products =>
        //     products.find(product => product.id === 5)
        //     ),
        //   tap(product => console.log('selectedProduct', product))
        // );

  // Added function for Create New product Start
  private productInsertedSubject = new Subject<Product>();
  productInsertedAction$ = this.productInsertedSubject.asObservable();

  productsWithAdd$ = merge(
    this.productsWithCategory$,
    this.productInsertedAction$
  )
  .pipe(
    scan((acc: Product[], value: Product) => [...acc, value])
  );

  selectedProductSuppliers$ = combineLatest([
    this.selectedProduct$,
    this.supplierService.suppliers$
  ]).pipe(
    map(([selectedProduct, suppliers]) =>
      suppliers.filter(supplier => selectedProduct.supplierIds.includes(supplier.id))
    )
  );
  // Added function for Create New product End

  constructor(private http: HttpClient,
              private productCategoryService: ProductCategoryService,
              private supplierService: SupplierService) { }

  selectedProductChanged(selectedProductId: number): void {
    this.productSelectedSubject.next(selectedProductId);
  }

  // Declarative Method Approch below code got removed
  // getProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(this.productsUrl)
  //     .pipe(
  //       tap(data => console.log('Products: ', JSON.stringify(data))),
  //       catchError(this.handleError)
  //     );
  // }

  // Added for AddProduct
  addProduct(newProduct?: Product) {
    newProduct = newProduct || this.fakeProduct();
    this.productInsertedSubject.next(newProduct);
  }

  private fakeProduct() {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
