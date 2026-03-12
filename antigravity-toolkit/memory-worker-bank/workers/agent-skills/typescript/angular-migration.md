# angular-migration
Source: https://antigravity.codes/agent-skills/typescript/angular-migration

## AI Worker Instructions
When the user requests functionality related to angular-migration, follow these guidelines and utilize this context.

## Scraped Content

# angular-migration
```
// main.ts - Bootstrap hybrid appimport { platformBrowserDynamic } from "@angular/platform-browser-dynamic";import { UpgradeModule } from "@angular/upgrade/static";import { AppModule } from "./app/app.module";platformBrowserDynamic()  .bootstrapModule(AppModule)  .then((platformRef) => {    const upgrade = platformRef.injector.get(UpgradeModule);    // Bootstrap AngularJS    upgrade.bootstrap(document.body, ["myAngularJSApp"], { strictDi: true });  });
```
```
// main.ts - Bootstrap hybrid appimport { platformBrowserDynamic } from "@angular/platform-browser-dynamic";import { UpgradeModule } from "@angular/upgrade/static";import { AppModule } from "./app/app.module";platformBrowserDynamic()  .bootstrapModule(AppModule)  .then((platformRef) => {    const upgrade = platformRef.injector.get(UpgradeModule);    // Bootstrap AngularJS    upgrade.bootstrap(document.body, ["myAngularJSApp"], { strictDi: true });  });
```
```
// app.module.tsimport { NgModule } from "@angular/core";import { BrowserModule } from "@angular/platform-browser";import { UpgradeModule } from "@angular/upgrade/static";@NgModule({  imports: [BrowserModule, UpgradeModule],})export class AppModule {  constructor(private upgrade: UpgradeModule) {}  ngDoBootstrap() {    // Bootstrapped manually in main.ts  }}
```
```
// app.module.tsimport { NgModule } from "@angular/core";import { BrowserModule } from "@angular/platform-browser";import { UpgradeModule } from "@angular/upgrade/static";@NgModule({  imports: [BrowserModule, UpgradeModule],})export class AppModule {  constructor(private upgrade: UpgradeModule) {}  ngDoBootstrap() {    // Bootstrapped manually in main.ts  }}
```
```
// Before: AngularJS controllerangular  .module("myApp")  .controller("UserController", function ($scope, UserService) {    $scope.user = {};    $scope.loadUser = function (id) {      UserService.getUser(id).then(function (user) {        $scope.user = user;      });    };    $scope.saveUser = function () {      UserService.saveUser($scope.user);    };  });
```
```
// Before: AngularJS controllerangular  .module("myApp")  .controller("UserController", function ($scope, UserService) {    $scope.user = {};    $scope.loadUser = function (id) {      UserService.getUser(id).then(function (user) {        $scope.user = user;      });    };    $scope.saveUser = function () {      UserService.saveUser($scope.user);    };  });
```
```
// After: Angular componentimport { Component, OnInit } from "@angular/core";import { UserService } from "./user.service";@Component({  selector: "app-user",  template:     <div>      <h2>{{ user.name }}</h2>      <button (click)="saveUser()">Save</button>    </div>  ,})export class UserComponent implements OnInit {  user: any = {};  constructor(private userService: UserService) {}  ngOnInit() {    this.loadUser(1);  }  loadUser(id: number) {    this.userService.getUser(id).subscribe((user) => {      this.user = user;    });  }  saveUser() {    this.userService.saveUser(this.user);  }}
```
```
// After: Angular componentimport { Component, OnInit } from "@angular/core";import { UserService } from "./user.service";@Component({  selector: "app-user",  template:     <div>      <h2>{{ user.name }}</h2>      <button (click)="saveUser()">Save</button>    </div>  ,})export class UserComponent implements OnInit {  user: any = {};  constructor(private userService: UserService) {}  ngOnInit() {    this.loadUser(1);  }  loadUser(id: number) {    this.userService.getUser(id).subscribe((user) => {      this.user = user;    });  }  saveUser() {    this.userService.saveUser(this.user);  }}
```
```
<div>      <h2>{{ user.name }}</h2>      <button (click)="saveUser()">Save</button>    </div>
```
```
// Before: AngularJS directiveangular.module("myApp").directive("userCard", function () {  return {    restrict: "E",    scope: {      user: "=",      onDelete: "&",    },    template:       <div class="card">        <h3>{{ user.name }}</h3>        <button ng-click="onDelete()">Delete</button>      </div>    ,  };});
```
```
// Before: AngularJS directiveangular.module("myApp").directive("userCard", function () {  return {    restrict: "E",    scope: {      user: "=",      onDelete: "&",    },    template:       <div class="card">        <h3>{{ user.name }}</h3>        <button ng-click="onDelete()">Delete</button>      </div>    ,  };});
```
```
<div class="card">        <h3>{{ user.name }}</h3>        <button ng-click="onDelete()">Delete</button>      </div>
```
```
// After: Angular componentimport { Component, Input, Output, EventEmitter } from "@angular/core";@Component({  selector: "app-user-card",  template:     <div class="card">      <h3>{{ user.name }}</h3>      <button (click)="delete.emit()">Delete</button>    </div>  ,})export class UserCardComponent {  @Input() user: any;  @Output() delete = new EventEmitter<void>();}// Usage: <app-user-card [user]="user" (delete)="handleDelete()"></app-user-card>
```
```
// After: Angular componentimport { Component, Input, Output, EventEmitter } from "@angular/core";@Component({  selector: "app-user-card",  template:     <div class="card">      <h3>{{ user.name }}</h3>      <button (click)="delete.emit()">Delete</button>    </div>  ,})export class UserCardComponent {  @Input() user: any;  @Output() delete = new EventEmitter<void>();}// Usage: <app-user-card [user]="user" (delete)="handleDelete()"></app-user-card>
```
```
<div class="card">      <h3>{{ user.name }}</h3>      <button (click)="delete.emit()">Delete</button>    </div>
```
```
// Before: AngularJS serviceangular.module("myApp").factory("UserService", function ($http) {  return {    getUser: function (id) {      return $http.get("/api/users/" + id);    },    saveUser: function (user) {      return $http.post("/api/users", user);    },  };});
```
```
// Before: AngularJS serviceangular.module("myApp").factory("UserService", function ($http) {  return {    getUser: function (id) {      return $http.get("/api/users/" + id);    },    saveUser: function (user) {      return $http.post("/api/users", user);    },  };});
```
```
// After: Angular serviceimport { Injectable } from "@angular/core";import { HttpClient } from "@angular/common/http";import { Observable } from "rxjs";@Injectable({  providedIn: "root",})export class UserService {  constructor(private http: HttpClient) {}  getUser(id: number): Observable<any> {    return this.http.get(/api/users/${id});  }  saveUser(user: any): Observable<any> {    return this.http.post("/api/users", user);  }}
```
```
// After: Angular serviceimport { Injectable } from "@angular/core";import { HttpClient } from "@angular/common/http";import { Observable } from "rxjs";@Injectable({  providedIn: "root",})export class UserService {  constructor(private http: HttpClient) {}  getUser(id: number): Observable<any> {    return this.http.get(/api/users/${id});  }  saveUser(user: any): Observable<any> {    return this.http.post("/api/users", user);  }}
```
```
/api/users/${id}
```
```
// Angular serviceimport { Injectable } from "@angular/core";@Injectable({ providedIn: "root" })export class NewService {  getData() {    return "data from Angular";  }}// Make available to AngularJSimport { downgradeInjectable } from "@angular/upgrade/static";angular.module("myApp").factory("newService", downgradeInjectable(NewService));// Use in AngularJSangular.module("myApp").controller("OldController", function (newService) {  console.log(newService.getData());});
```
```
// Angular serviceimport { Injectable } from "@angular/core";@Injectable({ providedIn: "root" })export class NewService {  getData() {    return "data from Angular";  }}// Make available to AngularJSimport { downgradeInjectable } from "@angular/upgrade/static";angular.module("myApp").factory("newService", downgradeInjectable(NewService));// Use in AngularJSangular.module("myApp").controller("OldController", function (newService) {  console.log(newService.getData());});
```
```
// AngularJS serviceangular.module('myApp').factory('oldService', function() {  return {    getData: function() {      return 'data from AngularJS';    }  };});// Make available to Angularimport { InjectionToken } from '@angular/core';export const OLD_SERVICE = new InjectionToken<any>('oldService');@NgModule({  providers: [    {      provide: OLD_SERVICE,      useFactory: (i: any) => i.get('oldService'),      deps: ['$injector']    }  ]})// Use in Angular@Component({...})export class NewComponent {  constructor(@Inject(OLD_SERVICE) private oldService: any) {    console.log(this.oldService.getData());  }}
```
```
// AngularJS serviceangular.module('myApp').factory('oldService', function() {  return {    getData: function() {      return 'data from AngularJS';    }  };});// Make available to Angularimport { InjectionToken } from '@angular/core';export const OLD_SERVICE = new InjectionToken<any>('oldService');@NgModule({  providers: [    {      provide: OLD_SERVICE,      useFactory: (i: any) => i.get('oldService'),      deps: ['$injector']    }  ]})// Use in Angular@Component({...})export class NewComponent {  constructor(@Inject(OLD_SERVICE) private oldService: any) {    console.log(this.oldService.getData());  }}
```
```
// Before: AngularJS routingangular.module("myApp").config(function ($routeProvider) {  $routeProvider    .when("/users", {      template: "<user-list></user-list>",    })    .when("/users/:id", {      template: "<user-detail></user-detail>",    });});
```
```
// Before: AngularJS routingangular.module("myApp").config(function ($routeProvider) {  $routeProvider    .when("/users", {      template: "<user-list></user-list>",    })    .when("/users/:id", {      template: "<user-detail></user-detail>",    });});
```
```
// After: Angular routingimport { NgModule } from "@angular/core";import { RouterModule, Routes } from "@angular/router";const routes: Routes = [  { path: "users", component: UserListComponent },  { path: "users/:id", component: UserDetailComponent },];@NgModule({  imports: [RouterModule.forRoot(routes)],  exports: [RouterModule],})export class AppRoutingModule {}
```
```
// After: Angular routingimport { NgModule } from "@angular/core";import { RouterModule, Routes } from "@angular/router";const routes: Routes = [  { path: "users", component: UserListComponent },  { path: "users/:id", component: UserDetailComponent },];@NgModule({  imports: [RouterModule.forRoot(routes)],  exports: [RouterModule],})export class AppRoutingModule {}
```
```
<!-- Before: AngularJS --><form name="userForm" ng-submit="saveUser()">  <input type="text" ng-model="user.name" required />  <input type="email" ng-model="user.email" required />  <button ng-disabled="userForm.$invalid">Save</button></form>
```
```
<!-- Before: AngularJS --><form name="userForm" ng-submit="saveUser()">  <input type="text" ng-model="user.name" required />  <input type="email" ng-model="user.email" required />  <button ng-disabled="userForm.$invalid">Save</button></form>
```
```
// After: Angular (Template-driven)@Component({  template:     <form #userForm="ngForm" (ngSubmit)="saveUser()">      <input type="text" [(ngModel)]="user.name" name="name" required>      <input type="email" [(ngModel)]="user.email" name="email" required>      <button [disabled]="userForm.invalid">Save</button>    </form>  })// Or Reactive Forms (preferred)import { FormBuilder, FormGroup, Validators } from '@angular/forms';@Component({  template:     <form [formGroup]="userForm" (ngSubmit)="saveUser()">      <input formControlName="name">      <input formControlName="email">      <button [disabled]="userForm.invalid">Save</button>    </form>  })export class UserFormComponent {  userForm: FormGroup;  constructor(private fb: FormBuilder) {    this.userForm = this.fb.group({      name: ['', Validators.required],      email: ['', [Validators.required, Validators.email]]    });  }  saveUser() {    console.log(this.userForm.value);  }}
```
```
// After: Angular (Template-driven)@Component({  template:     <form #userForm="ngForm" (ngSubmit)="saveUser()">      <input type="text" [(ngModel)]="user.name" name="name" required>      <input type="email" [(ngModel)]="user.email" name="email" required>      <button [disabled]="userForm.invalid">Save</button>    </form>  })// Or Reactive Forms (preferred)import { FormBuilder, FormGroup, Validators } from '@angular/forms';@Component({  template:     <form [formGroup]="userForm" (ngSubmit)="saveUser()">      <input formControlName="name">      <input formControlName="email">      <button [disabled]="userForm.invalid">Save</button>    </form>  })export class UserFormComponent {  userForm: FormGroup;  constructor(private fb: FormBuilder) {    this.userForm = this.fb.group({      name: ['', Validators.required],      email: ['', [Validators.required, Validators.email]]    });  }  saveUser() {    console.log(this.userForm.value);  }}
```
```
<form #userForm="ngForm" (ngSubmit)="saveUser()">      <input type="text" [(ngModel)]="user.name" name="name" required>      <input type="email" [(ngModel)]="user.email" name="email" required>      <button [disabled]="userForm.invalid">Save</button>    </form>
```
```
<form [formGroup]="userForm" (ngSubmit)="saveUser()">      <input formControlName="name">      <input formControlName="email">      <button [disabled]="userForm.invalid">Save</button>    </form>
```
```
Phase 1: Setup (1-2 weeks)- Install Angular CLI- Set up hybrid app- Configure build tools- Set up testingPhase 2: Infrastructure (2-4 weeks)- Migrate services- Migrate utilities- Set up routing- Migrate shared componentsPhase 3: Feature Migration (varies)- Migrate feature by feature- Test thoroughly- Deploy incrementallyPhase 4: Cleanup (1-2 weeks)- Remove AngularJS code- Remove ngUpgrade- Optimize bundle- Final testing
```
```
Phase 1: Setup (1-2 weeks)- Install Angular CLI- Set up hybrid app- Configure build tools- Set up testingPhase 2: Infrastructure (2-4 weeks)- Migrate services- Migrate utilities- Set up routing- Migrate shared componentsPhase 3: Feature Migration (varies)- Migrate feature by feature- Test thoroughly- Deploy incrementallyPhase 4: Cleanup (1-2 weeks)- Remove AngularJS code- Remove ngUpgrade- Optimize bundle- Final testing
```
Navigating the transition from AngularJS to modern Angular can be a daunting, multi-faceted challenge. This agent skill serves as your indispensable guide, breaking down complex migration strategies into manageable steps. Whether you're considering a full rewrite, an incremental hybrid approach, or a vertical slice migration, this tool provides expert insights. It tackles critical aspects like transforming directives into components, modernizing dependency injection, and re-architecting routing systems, ensuring a smooth and efficient upgrade path for your legacy applications. Leverage best practices to confidently evolve your codebase into a contemporary, performant Angular ecosystem.

# When to Use This Skill
- •Seamlessly transitioning a large AngularJS application to modern Angular using an incremental strategy.
- •Establishing a hybrid runtime environment for AngularJS and Angular to coexist during migration.
- •Converting legacy AngularJS directives, controllers, and services into contemporary Angular components and providers.
- •Updating and modernizing the dependency injection and routing systems within an evolving Angular codebase.

# Pro Tips
- 💡Prioritize migrating core services and shared utilities first to establish a stable foundation before tackling UI components.
- 💡Implement thorough end-to-end tests for both AngularJS and Angular parts of your hybrid app to catch regressions early.
- 💡Leverage the Angular CLI for creating new components and modules, ensuring adherence to best practices and a consistent project structure.

