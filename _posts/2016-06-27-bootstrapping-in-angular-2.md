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
    * [Root component](#angular-1x-root-component)
* [Angular 2](#angular-2)
    * [HTML and root element](#html-and-root-element)
    * [ES2015 imports](#bootstrapping-with-angularbootstrap)
    * [Invoking bootstrap](#bootstrapping-with-angularbootstrap)
    * [Root Component](#angular-2-root-component)
</div>

## Angular 1.x

### Bootstrapping with ng-app

Most Angular 1.x apps start with `ng-app`, which typically sits on the `<html>` or `<body>` tag of your application:

{% highlight html %}
<!doctype html>
<html ng-app="app">
  <head>
    <title>Angular 1.x</title>
    <script src="angular.js"></script>
    <script src="app.js"></script>
    <script src="app.component.js"></script>
  </head>
  <body>
    <my-app>
      Loading...
    </my-app>
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

### Angular 1.x Root Component

When bootstrapping a "Hello world" in Angular 1.x, we'll need a root element. This element is the root container for our app, which we can create like so using the `.component()` method:

{% highlight javascript %}
// app.component.js
var myApp = {
  template: `
    <div>
      {% raw %}{{ $ctrl.text }}{% endraw %}
    </div>
  `,
  controller: function () {
    this.$onInit = function () {
      this.message = 'Hello world';
    };
  }
};
angular
  .module('app')
  .component('myApp', myApp);
{% endhighlight %}

That's "Hello world" status in Angular 1.x, so let's continue to Angular 2!

## Angular 2

When it comes to Angular 2 bootstrapping, there are some notable changes. First, the shift to TypeScript, and as such ES2015 modules, the second is that `ng-app` is no longer with us. There is also a new addition to bootstrapping, a root component/container for our app. Let's roll through these and learn how to bootstrap in Angular 2.

For the purposes of the following code snippets, we're going to assume you've [setup Angular 2](https://angular.io/docs/ts/latest/quickstart.html) to cut out all the boilerplate stuff, we'll focus on the bootstrapping phase.

### HTML and root element

Just like with Angular 1.x, we need some HTML setup with our scripts, of which I'm going to be just using some CDN links, when you're developing you'll want to use local ones.

{% highlight html %}
<!doctype html>
<html>
  <head>
    <title>Angular 2</title>
    <script src="//npmcdn.com/zone.js@0.6.12/dist/zone.js"></script>
    <script src="//npmcdn.com/reflect-metadata@0.1.3/Reflect.js"></script>
    <script src="//npmcdn.com/systemjs@0.19.31/dist/system.js"></script>
    <script src="//npmcdn.com/typescript@1.8.10/lib/typescript.js"></script>
    <script>
    System.config({
      //use typescript for compilation
      transpiler: 'typescript',
      //typescript compiler options
      typescriptOptions: {
        emitDecoratorMetadata: true
      },
      //map tells the System loader where to look for things
      map: {
        app: "./src",
        '@angular': 'https://npmcdn.com/@angular',
        'rxjs': 'https://npmcdn.com/rxjs@5.0.0-beta.6'
      },
      //packages defines our app package
      packages: {
        app: {
          main: './main.ts',
          defaultExtension: 'ts'
        },
        '@angular/core': {
          main: 'bundles/core.umd.js',
          defaultExtension: 'js'
        },
        '@angular/compiler': {
          main: 'bundles/compiler.umd.js',
          defaultExtension: 'js'
        },
        '@angular/common': {
          main: 'bundles/common.umd.js',
          defaultExtension: 'js'
        },
        '@angular/platform-browser-dynamic': {
          main: 'bundles/platform-browser-dynamic.umd.js',
          defaultExtension: 'js'
        },
        '@angular/platform-browser': {
          main: 'bundles/platform-browser.umd.js',
          defaultExtension: 'js'
        },
        rxjs: {
          defaultExtension: 'js'
        }
      }
    });
    System
      .import('app')
      .catch(console.error.bind(console));
    </script>
  </head>
  <body>
    <my-app>
      Loading...
    </my-app>
  </body>
</html>
{% endhighlight %}

You'll ideally want to use [System.js](https://github.com/systemjs/systemjs) or [Webpack](https://webpack.github.io/) to load your application, we're using System.js as you can see above. We're not going to go into details as to how System.js works, as this is an Angular migration guide.

Note how we're also using `<my-app>` just like in the Angular 1.x example too, which gives us the absolute base we need to get started with Angular. However,

### First Component

You may have already seen above that we have a custom element named `<my-app>` with `Loading...` inside, which gets replaced after Angular 2 bootstraps our application. This is our first component, and Angular 2 is _all_ about components!

To create a Component, we need to talk to the `Component` decorator inside the Angular core, so let's setup a file inside `/app` called `app.component.ts`.

Inside `app.component.ts`, we need to import the aforementioned `Component` from `angular2/core`, which serves as our first task:

{% highlight javascript %}
// app.component.ts
import {Component} from 'angular2/core';
{% endhighlight %}

Perfect, now we have `Component` available! Before we can use the `Component` decorator however, we need to create an ES2015 Class for us to decorate. This is nice and easy, we'll call this Class `AppComponent`:

{% highlight javascript %}
// app.component.ts
import {Component} from 'angular2/core';

class AppComponent {

}
{% endhighlight %}

Now onto the `Component` decorator! This one is nice and easy, we add it above the Class we want to decorate, however to actually use it we need to use `@Component` rather than just `Component`:

{% highlight javascript %}
// app.component.ts
import {Component} from 'angular2/core';

@Component()
class AppComponent {

}
{% endhighlight %}

Next up, we need to pass in some options to our `@Component` declaration, remember the `<my-app>` element? This is where we tell Angular 2 that we're creating a custom element and what name it is through the `selector` property:

{% highlight javascript %}
// app.component.ts
import {Component} from 'angular2/core';

@Component({
  selector: 'my-app'
})
class AppComponent {

}
{% endhighlight %}

Our Component won't do much right now, so we need to give it a template to almost reach "Hello world!" status:

{% highlight javascript %}
// app.component.ts
import {Component} from 'angular2/core';

@Component({
  selector: 'my-app',
  template: `
    <div>
      Hello world!
    </div>
  `
})
class AppComponent {

}
{% endhighlight %}

Last but not least, as our Component exists inside `app.component.ts`, we need to be able to import it into other files, for this we need to use ES2015 `export` syntax and export the Class:

{% highlight javascript %}
// app.component.ts
import {Component} from 'angular2/core';

@Component({
  selector: 'my-app',
  template: `
    <div>
      Hello world!
    </div>
  `
})
export class AppComponent {

}
{% endhighlight %}

And we're done, our first Component is cooked and ready to go. Now let's bootstrap it.

### Bootstrapping the app

Angular 2 bootstrapping is nothing like bootstrapping apps in Angular 1.x. In Angular 1 we could use the `ng-app` Directive, and give it a value such as `ng-app="myApp"`, or use the `angular.bootstrap` method which allows for asynchronous bootstrapping.

In Angular 2 we need to `import` the `bootstrap` method from inside Angular 2. The place we need to fetch the `bootstrap` method is `angular2/platform/browser`.

Looping back real quick to the beginning where we told System.js to look for `main.ts`, so far it doesn't exist, so this is our next task!

Let's create `main.ts` and import that beloved `bootstrap` method:

{% highlight javascript %}
// main.ts
import {bootstrap} from 'angular2/platform/browser';
{% endhighlight %}

That was easy, what's next? Well, we can't Bootstrap a Component that doesn't exist, so we need to import our previously created `AppComponent`, nice and easy:

{% highlight javascript %}
// main.ts
import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app.component';
{% endhighlight %}

Awesome, now `AppComponent` exists in our `main.ts` file, the final piece of the puzzle is bootstrapping the `AppComponent` with a simple function call:

{% highlight javascript %}
// main.ts
import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app.component';

bootstrap(AppComponent);
{% endhighlight %}

And you're done!
