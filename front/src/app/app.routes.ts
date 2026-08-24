import { Routes } from '@angular/router';
export const routes: Routes = [
	{ path: '', loadComponent: () => import('../home').then((module) => module.Home) },
	{ path: 'credential', loadComponent: () => import('../credential/credential').then((module) => module.Credential) },
	{ path: 'register', loadComponent: () => import('../register/register').then((module) => module.Register) },
	{ path: 'cart', loadComponent: () => import('../cart/cart').then((module) => module.Cart) },
	{ path: '**', redirectTo: '' },
];
