---
layout: post
permalink: /from-ui-router-to-component-router
title: From ui-router to Component Router
author: simpulton
path: 2016-12-03-from-ui-router-to-component-router.md
tags: routing
version: 2.0.0
intro: In this guide you'll learn how to use the component router, the Angular 2 equivalent for ui-router.
---

Routing in Angular 2 has finally stabilized with the introduction of the latest component router which allows us to map components directly to routes. In this guide, we'll be converting an Angular 1.x application using `ui-router` to an Angular 2 application using the component router.

## Table of contents

<div class="contents" markdown="1">
* [Angular 1.x](#angular-1x)
  * [Using ui-router](#using-ui-router)
  * [Final 1.x code](#final-1x-code)
* [Angular 2](#angular-2)
  * [Using Component Router](#using-component-router)
  * [Final 2 code](#final-2-code)
</div>

## Angular 1.x

Angular 1.x ships with a routing solution known as `ngRoute` which is fairly limited in its capabilities. The standard solution is to use `ui-router` which is exponentially more powerful and full-featured. For the sake of being relevant, we are going to skip `ngRoute` and use `ui-router` as our reference point when comparing against Angular 2. 

### Using ui-router

We will start with a basic application that has a top-level component named `AppComponent` and two subcomponents named `UsersComponent` and `WidgetsComponent`. The `AppComponent` exists as a entry point for our two subcomponents and is quite simplistic as you can see in the code below.

{% highlight javascript %}
function AppComponentCtrl() {}

var AppComponent = {
  bindings: {},
  templateUrl: 'app.component.html',
  controller: AppComponentCtrl
}

angular
  .module('sampleApp')
  .component('myApp', AppComponent);
{% endhighlight %}

The only thing worth noting is that in the `AppComponent` template, we are using HTML selectors to instantiate our components.

{% highlight html %}
<div class="row">
  <my-users></my-users>
  <my-widgets></my-widgets>
</div>
{% endhighlight %}

Let us examine one of the subcomponents so that we can form a complete picture as we are getting started. In our `UsersComponent`, we have a `title` property that we are setting in the controller so that we can bind to it in the template.

{% highlight javascript %}
function UsersComponentCtrl() {
  this.title = 'Users';
}
  
var UsersComponent = {
  bindings: {},
  templateUrl: 'users.component.html',
  controller: UsersComponentCtrl
}

angular
  .module('sampleApp')
  .component('myUsers', UsersComponent);
{% endhighlight %}

And in our template, we displaying the value of the property by binding to `$ctrl.title`.

{% highlight html %}
<div class="col-sm-12">
  <h1 class="jumbotron">{% raw %}{{{% endraw %}$ctrl.title{% raw %}}}{% endraw %}</h1>
</div>
{% endhighlight %}

 The structure and purpose of the `WidgetsComponent` is exactly the same and so we will move on to adding in `ui-router` to our application. First, we need to include a reference to the `ui-router` resource in our application which is going to vary depending on how you have your project set up. In our example, we are loading `ui-router` via the CDN in our `index.html` file.
 
 Once we have a valid reference to the `ui-router` resource, we need to make it available to our application. We accomplish this by adding it as a submodule dependency as we are declaring our main module. 
 
{% highlight javascript %}
angular.module('sampleApp', ['ui.router']);
{% endhighlight %}

With our foundation in place, let us start to build out some routes that we can use to navigate to either the users component or widgets component. We are going to define our routes as objects that take three properties. The `name` property is what we will use to identify and navigate to our routes, the `url` property is the URL representation of the route and the `component` property is the component we want to instantiate when we navigate to a specific route.

{% highlight javascript %}
var usersState = {
    name: 'users',
    url: '/users',
    component: 'myUsers'
  },
  widgetsState = {
    name: 'widgets',
    url: '/widgets',
    component: 'myWidgets'
  };
{% endhighlight %}

Because routes affect how the entire application relates to itself, we need to declare our routes as soon as possible. This is why routes are defined within a `config` method that is called during the configuration phase of an Angular 1.x application. To this end, we will create a `config` function and inject in `$stateProvider` to help set up our routes.

{% highlight javascript %}
function config($stateProvider) {
  $stateProvider
    .state(usersState)
    .state(widgetsState);
}
{% endhighlight %}

We will call `$stateProvider.state` and pass in our route objects that we previously created. Because `$stateProvider.state` returns a reference to `$stateProvider`, we can chain our calls together as we have done in the code above. To protect ourselves against rogue URLs, we are also going to inject `$urlRouterProvider` and call `$urlRouterProvider.otherwise` to set up a fallback if a valid route is not found.

{% highlight javascript %}
function config($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state(usersState)
    .state(widgetsState);
    
  $urlRouterProvider.otherwise('/');
}
{% endhighlight %}

With our `config` function complete, we will add it to our application by calling `module.config` and passing in our method.

{% highlight javascript %}
angular
  .module('sampleApp')
  .config(config)
  .component('myApp', AppComponent);
{% endhighlight %}

We can now remove the hard-coded references to our subcomponents in the template and replace them with the `ui-view` directive. When the user or widgets route is matched, `ui-router` will instantiate and insert the appropriate component into the `ui-view` directive.

{% highlight html %}
<div class="row">
  <ui-view></ui-view>
</div>
{% endhighlight %}

Technically, routes can be activated by typing them into the address bar but eventually we are going to want to navigate to a route. Just as we can activate a route via the address bar, we can navigate to the URL using an anchor tag and setting the `href` property. There is a much easier way to do this using the `ui-sref` directive that is provided by `ui-router`. This allows us to navigate to the state name and `ui-router` will fill in the URL for us.

{% highlight html %}
<div class="row">
  <div class="col-sm-12 actions">
    <a ui-sref="users" class="btn btn-primary">Users</a>
    <a ui-sref="widgets" class="btn btn-warning">Widgets</a>
  </div>
  <ui-view></ui-view>
</div>
{% endhighlight %}

We can also keep track of the active route and use the `ui-sref-active` directive to apply a CSS class to our element if it represents the currently activated route. In this case, we are attaching an `active` class that provides additional styling to make it easier to visually distinguish what route we are currently on.

{% highlight html %}
<div class="row">
  <div class="col-sm-12 actions">
    <a ui-sref-active="active" ui-sref="users" class="btn btn-primary">Users</a>
    <a ui-sref-active="active" ui-sref="widgets" class="btn btn-warning">Widgets</a>
  </div>
  <ui-view></ui-view>
</div>
{% endhighlight %}

For reference, we can see the entire `config` method below with its route definitions. 

{% highlight javascript %}
function AppComponentCtrl() {}

var AppComponent = {
  bindings: {},
  templateUrl: 'app.component.html',
  controller: AppComponentCtrl
}

var usersState = {
    name: 'users',
    url: '/users',
    component: 'myUsers'
  },
  widgetsState = {
    name: 'widgets',
    url: '/widgets',
    component: 'myWidgets'
  };

function config($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state(usersState)
    .state(widgetsState);
    
  $urlRouterProvider.otherwise('/');
}

angular
  .module('sampleApp')
  .config(config)
  .component('myApp', AppComponent);
{% endhighlight %}

### Final 1.x code

<iframe src="http://embed.plnkr.co/1DOo5w2ORHkJcGjfuOmK/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="400"></iframe>

## Angular 2

We are now going to embark upon the same adventure as before but with an Angular 2 application. We will start by examining an application with two subcomponents and then refactor the application to use the component router. 

### Using Component Router

In our top-level module, we are importing `AppComponent`, `UsersComponent` and `WidgetsComponent` and bootstrapping with the `AppComponent`.

{% highlight javascript %}
@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, UsersComponent, WidgetsComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
{% endhighlight %}

In our `AppComponent`, we are adding our two subcomponents with the `my-users` and `my-widgets` selectors in our template. This will serve as our starting point so that we can introduce the component router into our application.

{% highlight javascript %}
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <div class="row">
    <my-users></my-users>
    <my-widgets></my-widgets>
  </div> 
  `
})
export class AppComponent { }
{% endhighlight %}

It is considered best practice to break your routes out into a separate module so that they are easier to maintain. In light of this, we will create a new module called `AppRoutingModule` and import `Routes` and `RouterModule`. In our `imports` field, we are going to call `RouterModule.forRoot` and pass in our `routes` array. This returns a full configured module that contains not only the routes for our module but the router service itself. We will also export the configured `RouterModule` so that it is available for the rest of the application.

{% highlight javascript %}
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
{% endhighlight %}

We have created an empty `routes` array that we need to build. Our `routes` array will contain route configuration information for each route we want to expose. This works fairly similar to our `ui-router` implementation in that we are mapping a `path` to a `component`. The one caveat is that the component router uses `history.pushState` by default and so we need to set a `base` tag in our `index.html` so that our paths can be properly resolved. This will change based on your implementation but a common configuration is `<base href="/">`. 

{% highlight javascript %}
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { WidgetsComponent } from './widgets.component';

const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'widgets', component: WidgetsComponent },
  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
{% endhighlight %}

We have also added a fallback route that will redirect us to the root of our application if no route is matched.

With our `AppRoutingModule` in place, we will import it into our main module and add it to the `imports` field so it is available to the rest of the application.

{% highlight javascript %}
@NgModule({
  imports:      [ BrowserModule, FormsModule, AppRoutingModule ],
  declarations: [ AppComponent, UsersComponent, WidgetsComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
{% endhighlight %}

We are then able to replace our selector references with `router-outlet` in our template. This will serve as the entry point for our components to be loaded when a route is matched.

{% highlight javascript %}
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <div class="row">
    <router-outlet></router-outlet>
  </div>  
  `
})
export class AppComponent { }
{% endhighlight %}

To navigate to a specific route, we can use the `routerLink` directive in our template to accomplish this task. Because our routes are fairly static, we will reference them as string values but check the [documentation](https://angular.io/docs/ts/latest/api/router/index/RouterLink-directive.html) if you need to generate a dynamic link. 

{% highlight javascript %}
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <div class="row">
    <div class="col-sm-12 actions">
      <a routerLink="users" class="btn btn-primary">Users</a>
      <a routerLink="widgets" class="btn btn-warning">Widgets</a>
    </div>
    <router-outlet></router-outlet>
  </div>  
  `
})
export class AppComponent { }
{% endhighlight %}

Just as we used `ui-sref-active` in our Angular 1.x application to apply CSS based on the current route, we can use `routerLinkActive` to do the same think in Angular 2. 

{% highlight javascript %}
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <div class="row">
    <div class="col-sm-12 actions">
      <button routerLinkActive="active" routerLink="users" class="btn btn-primary">Users</button>
      <button routerLinkActive="active" routerLink="widgets" class="btn btn-warning">Widgets</button>
    </div>
    <router-outlet></router-outlet>
  </div>  
  `
})
export class AppComponent { }
{% endhighlight %}

### Final 2 code

<iframe src="http://embed.plnkr.co/1HTkmvFo3wyCJ5hJSYPt/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="400"></iframe>
