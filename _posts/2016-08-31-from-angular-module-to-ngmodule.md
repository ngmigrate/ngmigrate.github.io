---
layout: post
permalink: /from-angular-module-to-ngModule
title: From angular.module to ngModule
author: toddmotto
path: 2016-08-31-from-angular-module-to-ngmodule.md
tags: modules
version: 2.0.0-rc.5
intro: In this guide, you'll learn how angular.module in Angular 1.x compares to ngModule in Angular 2.
---

Angular 1.x has relied heavily on module support at the framework level to give us a clear way to organize our application into logical units. With the release of Angular 2 RC5, the concept of framework level support for modules was reintroduced via `ngModule`.

## Table of Contents

<div class="contents" markdown="1">
* [Angular 1.x](#angular-1x)
  * [Root Module](#root-module)
  * [Child Module](#child-module)
  * [Final 1.x code](#final-1x-code)
* [Angular 2](#angular-2)
  * [Root Component](#root-component)
  * [Child Component](#child-component)
  * [Final 2 code](#final-2-code)
</div>

## Angular 1.x

The best way to learn about modules in Angular 1.x, is to examine the relationship between a parent module and a child module. Once the pattern is identified, it will repeat itself indefinitely as your application grows.

### Root Module

All non-trivial Angular 1.x applications will bootstrap with a root module within an `ng-app` declaration in the main HTML file. In its simplest form, we will call `angular.module` and pass in two parameters. The first parameter being a string identifier that we can use to reference our newly created module and an array of dependencies for that module.

If `angular.module` is called with the second parameter, it will create a new module with that key regardless if the module has been previously created or not.

{% highlight javascript %}
angular
  .module('app', []); // This is a setter
{% endhighlight %}

With that in mind, if `angular.module` is called with just the string identifier, it will operate as a getter function and just return the existing module.

{% highlight javascript %}
angular
  .module('app'); // This is a getter
{% endhighlight %}

We are going to create a new module called `app` and initialize it with zero dependencies to start out with. With our module declared, we will chain on a call to `angular.component` to attach `AppComponent` to our `app` module.

{% highlight javascript %}
const AppComponent = {
  template: `
    <h1>Root Component</h1>
  `
};

angular
  .module('app', [])
  .component('app', AppComponent);
{% endhighlight %}

To ensure that our application bootstraps with the `app` module, we will add `ng-app="app"` to our body tag. Within the `body` tag, we will also initialize the `AppComponent` by adding an `app` element to the page.

{% highlight html %}
<body ng-app="app">
  <app></app>
</body>
{% endhighlight %}

We now have a completely bootstrapped Angular application with a top level module that we can attach various items to.

### Child Module

As an application begins to grow, we will want to organize not only our file structure by feature but also organize it the same way at the framework level. To illustrate this, we are going to introduce a contacts feature that contains a single component. The first step is to declare our `contacts` module using the setter syntax and with no dependencies. Then we will attach the `ContactsComponent` to that module using the `angular.component` method.

{% highlight javascript %}
const ContactsComponent = {
  template: `
    <h3>Contacts go here.</h3>
  `
};

angular
  .module('contacts', [])
  .component('contacts', ContactsComponent);
{% endhighlight %}

Now that we have a new child module, how do we make it available to our root module? Presuming that our source files are being loading properly, we will go to our `app` module declaration and add `contacts` to the array of dependencies in the second parameter. This tells Angular to look for the `contacts` module when it is initializing the `app` module and make all of the `contacts` functionality available.

{% highlight javascript %}
angular
  .module('app', ['contacts'])
  .component('app', AppComponent);
{% endhighlight %}

With the `contacts` module now available, we can update the `AppComponent` to include a `contacts` element within its template.

{% highlight javascript %}
const AppComponent = {
  template: `
    <h1>Root Component</h1>
    <hr>
    <contacts></contaccts>
  `
};

angular
  .module('app', ['contacts'])
  .component('app', AppComponent);
{% endhighlight %}

This is a fairly fundamental technique in Angular 1.x being it is an organizational cornerstone for a scalable architecture. What is interesting is that this concept did not exist in Angular 2 until the release of RC5 and this is what we will examine next.

### Final 1.x code

<iframe src="https://embed.plnkr.co/nGEqK2RxzYldY8Nro2pQ/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

## Angular 2

### Root Component

The main organization mechanism is still the component within Angular 2 but `ngModule` was introduce to make organizing and connecting components together much easier. To parallel our Angular 1.x example, we will start by defining a top-level `AppComponent` that has a selector of `app`.

{% highlight javascript %}
// app.component.ts
import {Component} from '@angular/core';

@Component({
  selector: 'app',
  providers: [],
  template: `
    <h1>Root Component</h1>
  `
})
export class AppComponent {}
{% endhighlight %}

With our `AppComponent` created, we will create an Angular module to provide context for our component and define the relationship it has with the rest of the application. An Angular 2 module follows the same pattern as components, directives, injectables, etc in that it is just an ES6 class with metadata to appropriately decorate it.

We have created an empty class called `AppModule` that will serve as a placeholder for us to use the `@NgModule` decorator. The `@NgModule` decorator takes a configuration object that will typically contain imports, component declarations and if it is a top-level module, a reference to the component we want to bootstrap. In the code below, we are importing `BrowserModule` because this is the context we want to bootstrap our application in; also, we will declare `AppComponent` component and indicate we want to use this as our entry point to bootstrap the module.

{% highlight javascript %}
// app.module.ts
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';

@NgModule({
    imports: [BrowserModule],
    bootstrap: [AppComponent],
    declarations: [AppComponent]
})
export class AppModule {}
{% endhighlight %}

And instead of bootstrapping our top-level component directly, we will instead bootstrap our top-level module which is then responsible for delegating the implementation details. In this case, we know that when `AppModule` is instantiated, that it will in turn, instantiate the `AppComponent`.

{% highlight javascript %}
// main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
{% endhighlight %}

And then within our `index.html` file, we will add our top-level component by adding an `app` element to our page.

{% highlight html %}
<body>
  <app>
    loading...
  </app>
</body>
{% endhighlight %}

### Child Component

As with the first example, we will introduce a contacts feature in the form of a `ContactsComponent` with the selector of `contacts`.

{% highlight javascript %}
// contacts.component.ts
import {Component} from '@angular/core'

@Component({
  selector: 'contacts',
  template: `<h3>Contacts go here.</h3>`
})
export class ContactsComponent { }
{% endhighlight %}

How do we make the `ContactsComponent` available to the rest of the application? We accomplish this by adding it to our `AppModule` so that any other component within that module can consume it. We will import our `ContactsComponent` and then add it to the `declarations` array and that is it!

{% highlight javascript %}
// app.module.ts
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {ContactsComponent} from './contacts.component';

@NgModule({
  imports: [BrowserModule],
  bootstrap: [AppComponent],
  declarations: [AppComponent, ContactsComponent]
})
export class AppModule {}
{% endhighlight %}

This means that we no longer have to manually declare every single dependency at the component level in our Angular 2 application. We can use the `ContactsComponent` within our `AppComponent` by simply adding the `contacts` element to the template.

{% highlight javascript %}
import {Component} from '@angular/core';

@Component({
  selector: 'app',
  providers: [],
  template: `
    <h1>Root Component</h1>
    <contacts></contacts>
  `
})
export class AppComponent {}
{% endhighlight %}

The introduction of `NgModule` provides us with a really clean way to wire up features and dependencies that we were used to in Angular 1.x.

### Final 2 code

<iframe src="https://embed.plnkr.co/2mizCzd1za9EBpzvty7z/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>
