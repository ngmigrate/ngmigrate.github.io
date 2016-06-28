---
layout: post
permalink: /bootstrapping-in-angular-2
title: Bootstrapping in the browser with Angular 2
author: toddmotto
path: 2016-06-27-bootstrapping-in-angular-2.md
tags: bootstrapping
version: 2.0.0-rc.3
---

Angular 1.x allows us to bootstrap our applications in two different ways, using the `ng-app` Directive, or the `angular.bootstrap` method on the `angular` global. Let's explore the Angular 1.x concepts and then dive into how we do the same in Angular 2. For this guide, we'll be bootstrapping in the browser, as Angular 2 also lets us bootstrap in a WebWorker and on the server.

## Table of contents

<div class="contents" markdown="1">
* [Angular 1.x](#angular-1x)
    * [Bootstrapping with ng-app](#bootstrapping-with-ng-app)
    * [Bootstrapping with angular.bootstrap](#bootstrapping-with-angularbootstrap)
* [Angular 2](#angular-2)
    * [ES2015 imports](#bootstrapping-with-angularbootstrap)
    * [Root Component](#bootstrapping-with-angularbootstrap)
    * [Invoking bootstrap](#bootstrapping-with-angularbootstrap)
    * [Bootstrapping with angular.bootstrap](#bootstrapping-with-angularbootstrap)
</div>

## Angular 1.x

### Bootstrapping with ng-app

Most Angular 1.x apps start with `ng-app`, which typically sits on the `<html>` or `<body>` tag of your application:

{% highlight html %}
<html ng-app="app">
  <head>
    <title>Angular 1.x</title>
  </head>
  <body>
    <app>
      Loading...
    </app>
    <script src="angular.js"></script>
    <script src="app.js"></script>
  </body>
</html>
{% endhighlight %}

For `ng-app` to work, however, we actually need to create a "module". A module is essentially a container for logic that's specific to something in our application, such as a feature. The module _name_ needs to correspond to the value passed into `ng-app`, which in this case is just `"app"`. So we create the relevant module name as such:

{% highlight javascript %}
// app.js
angular.module('app', []);
{% endhighlight %}

And that's pretty much it; we have `ng-app` and `angular.module()` as the key ingredients to bootstrapping in this example.

### Bootstrapping with angular.bootstrap

The alternative way to bootstrapping in Angular 1.x is through use of the `angular.bootstrap` method, which is a way to manually bootstrap single, or multiple, Angular 1.x applications. It's the same ingredients as `ng-app` essentially calls the `bootstrap` method for us. So using `angular.bootstrap` gives us that exposed method to be able to manually bootstrap out app.

Again, we'll need an `angular.module()` setup, and then we can bootstrap the application:

{% highlight javascript %}
// app.js
angular.module('app', []);
angular.bootstrap(document.documentElement, ['app']);
{% endhighlight %}

So the `angular.bootstrap` method's first argument is the DOM node you wish to mount your application to, and the second (optional) argument being an Array of module names you wish to bootstrap, which is typically just a single module. There is also a third (optional) argument for invoking our app in `strictDi` mode:

{% highlight javascript %}
// app.js
angular.module('app', []);
angular.bootstrap(document.documentElement, ['app'], {
  strictDi: true
});
{% endhighlight %}

## Angular 2

When it comes to Angular 2 bootstrapping, there are some notable changes. First, the shift to TypeScript, and as such ES2015 modules, the second is that `ng-app` is no longer with us. There is also a new addition to bootstrapping, a root component/container for our app. Let's roll through these and learn how to bootstrap in Angular 2.

For the purposes of the following code snippets, we're going to assume you've [setup Angular 2](https://angular.io/docs/ts/latest/quickstart.html) to cut out all the boilerplate stuff, we'll focus on the bootstrapping phase.

###
