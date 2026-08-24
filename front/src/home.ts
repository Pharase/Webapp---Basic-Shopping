import { Component } from '@angular/core';
import { ProductList } from './product/product-list';

@Component({
    selector: 'app-home',
    imports: [ProductList],
    templateUrl: './home.html',
})
export class Home {}
