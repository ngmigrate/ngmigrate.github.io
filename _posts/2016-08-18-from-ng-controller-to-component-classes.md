---
layout: post
permalink: /from-ng-controller-to-component-classes
title: From ng-controller to Component Classes
author: simpulton
path: 2016-08-18-from-ng-controller-to-component-classes.md
tags: controllers
version: 2.0.0-rc.5
intro: In this guide you'll learn how to start migrating Angular 1 controllers into Angular 2 component classes.
---

Controllers have been the basic building block of Angular 1.x since the dawn of time. With Angular 2, the essence of the controller still exists, but it has evolved into a more sophisticated life form known as the component class. In this guide, we will start with a historically accurate Angular controller and then step through a series of techniques you can use to make it closely resemble an Angular 2 component class.

## Table of Contents

<div class="contents" markdown="1">
* [Angular 1.x](#angular-1x)
  * [Controllers with .controller()](#controllers-with-controller)
  * [Migrating to controllerAs](#migrating-to-controlleras)
  * [Extracting the Controller](#extracting-the-controller)
  * [Using Components](#using-components)
  * [Using Classes](#using-classes)
  * [Using Lifecycle Hooks](#using-lifecycle-hooks)
  * [Final 1.x code](#final-1x-code)
* [Angular 2](#angular-2)
  * [Component Classes](#component-classes)
  * [Final 2 code](#final-2-code)
</div>

## Angular 1.x

## Controllers with .controller()

Originally, Angular controllers were created by using the `angular.controller` method and supplying that method with a string identifier and an inline function that contained all of the controller's logic.

{% highlight javascript %}
angular.module('app')
  .controller('CategoriesListCtrl', function($scope, CategoriesModel) {
    CategoriesModel.getCategories()
      .then(function(result){
        $scope.categories = result;
      });

    $scope.onCategorySelected = function(category) {
      CategoriesModel.setCurrentCategory(category);
    }
  });
{% endhighlight %}

We could then expose properties and methods to our template by attaching them directly to the Angular `$scope` object such as `$scope.categories` in the code above.

To bind a template to a controller, we would add `ng-controller` to the DOM element that we wanted to serve as the view for our controller.

{% highlight html %}
<div ng-controller="CategoriesListCtrl">
    <!-- categories list markup -->
</div>
{% endhighlight %}

To most developers, this separation of imperative logic and declarative markup was a fairly progressive concept especially in the context of jQuery development.

## Migrating to controllerAs

Angular introduced the `controller as` syntax which allowed developers to favor a more class-like structure and in most cases, tucked `$scope` entirely into the background. Instead of exposing methods and properties via the `$scope` object, we can attach them directly to the controller instance. Notice that `$scope.categories` has been changed to `this.categories` and the `onCategorySelected` method is now attached to `this`.

{% highlight javascript %}
angular.module('app')
  .controller('CategoriesListCtrl', function(CategoriesModel) {
    CategoriesModel.getCategories()
      .then(function(result){
        this.categories = result;
      });

    this.onCategorySelected = function(category) {
      CategoriesModel.setCurrentCategory(category);
    }
  });
{% endhighlight %}

We must also update our `ng-controller` definition to `CategoriesListCtrl as categoriesListCtrl`.

{% highlight html %}
<div ng-controller="CategoriesListCtrl as categoriesListCtrl">
    <!-- categories list markup -->
</div>
{% endhighlight %}

Favoring the `controller as` syntax offers a few immediate advantages. One, our controllers acquire a universal quality as they are less Angular code and more vanilla JavaScript. Secondly, we are setting the stage to convert our controllers into ES6 classes which Angular 2 uses heavily.

## Extracting the Controller

Our controller is currently tucked away in the `angular.controller` method as an inline function. The next thing that we need to do is to extract it into a stand-alone function. We will declare a new function called `CategoriesListCtrl` and move our inline function into it.

{% highlight javascript %}

function CategoriesListCtrl(CategoriesModel) {
  CategoriesModel.getCategories()
    .then(function(result){
      this.categories = result;
    });

  this.onCategorySelected = function(category) {
    CategoriesModel.setCurrentCategory(category);
  }
}

angular.module('app')
  .controller('CategoriesListCtrl', CategoriesListCtrl);
{% endhighlight %}

We then reference it directly within our `module.controller` method by name as you can see in the code above. Not only are we continuing our path towards vanilla JavaScript, but the code we are using to wire up our application has become a lot easier to read.

## Using Components

Because Angular 2 is entirely predicated on the concept of component driven development, we are going to refactor our controller to live inside of a component instead of attaching it directly to the DOM with `ng-controller`. To encapsulate our controller within a component, we just need to create a component configuration object that we will use to declare our component; we do this by using the `module.component` method. There are additional options that we can use when declaring our component but in this case, we just need to define a `template`, `controller` and `controllerAs` property.

{% highlight javascript %}
function CategoriesListCtrl(CategoriesModel) {
  CategoriesModel.getCategories()
    .then(function(result){
      this.categories = result;
    });

  this.onCategorySelected = function(category) {
    CategoriesModel.setCurrentCategory(category);
  }
}

var CategoriesList = {
  template: '<div><!-- categories list markup --></div>',
  controller: CategoriesListCtrl,
  controllerAs: 'CategoriesListCtrl'
}

angular.module('app')
  .component('categoriesList', CategoriesList);
{% endhighlight %}

We would then move whatever HTML that we declared `ng-controller` into the `template` property on our component configuration object. Then we replace that DOM element entirely with the HTML selector that matches our component which in this case is `<categories-list></categories-list>`.

{% highlight html %}
<categories-list></categories-list>
{% endhighlight %}

## Using Classes

At this point, we are quite close to the general shape of an Angular 2 component, but we can make the line between the two almost indistinguishable by converting our controller into an ES6 class. The most important thing to remember when making the transition to ES6 classes is that dependency injection happens at the constructor, and you need to assign your dependencies to instance variables if you are going to reference them outside the constructor.

For instance, we are injecting `CategoriesModel` into our class but unless we assign it to `this.CategoriesModel`, it will only be scoped to the constructor and nothing more. We are also using [ng-annotate](https://github.com/olov/ng-annotate) to help with strict dependency injection syntax which is why we have `'ngInject';` as the first line of our constructor.

{% highlight javascript %}
class CategoriesListCtrl {
  constructor(CategoriesModel) {
    'ngInject';

    this.CategoriesModel = CategoriesModel;
    this.CategoriesModel.getCategories()
      .then(result => this.categories = result);
  }

  onCategorySelected(category) {
    this.CategoriesModel.setCurrentCategory(category);
  }
}

const CategoriesList = {
  template: '<div><!-- categories list markup --></div>',
  controller: CategoriesListCtrl,
  controllerAs: 'categoriesListCtrl'
};

angular.module('app')
    .component('categoriesList', CategoriesList)
  ;
{% endhighlight %}

## Using Lifecycle Hooks

It is considered best practice to keep our constructors free of any initialization logic as it is possible that some of our properties that we acquire via bindings may not be ready when the constructor is called. Angular 2 introduced the concept of component lifecycle hooks which exposes key events within the lifecycle of a component that we can safely use to execute certain code. These lifecycle hooks were backported to Angular 1.5 and are vital to a stable component composition.

We will define a new method called `$onInit` that implicitly gets called when all of a component's bindings have been initialized. We can then move the `this.CategoriesModel.getCategories` method call from our constructor into this lifecycle method.

{% highlight javascript %}
class CategoriesListCtrl {
  constructor(CategoriesModel) {
    'ngInject';

    this.CategoriesModel = CategoriesModel;
  }

  $onInit() {
    this.CategoriesModel.getCategories()
      .then(result => this.categories = result);
  }

  onCategorySelected(category) {
    this.CategoriesModel.setCurrentCategory(category);
  }
}

const CategoriesList = {
  template: '<div><!-- categories list markup --></div>',
  controller: CategoriesListCtrl,
  controllerAs: 'categoriesListCtrl'
};

angular.module('app')
    .component('categoriesList', CategoriesList)
  ;
{% endhighlight %}

### Final 1.x code

<iframe src="https://embed.plnkr.co/VoVWUYMZ3KllMjWLlwfg/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

## Angular 2

The main difference between the Angular 1.x code that we just refactored and the equivalent Angular 2 component below is how our component is defined. In Angular 1.x, we defined our component as a configuration object that got added to our application with the `angular.component` method. In Angular 2, we are still using a component configuration object, but it is being attached to our application via the `@Component` decorator on top of our `CategoriesList` class.

{% highlight javascript %}
@Component({
  selector: 'categories-list',
  template: `<div>Hello Category List Component</div>`,
  providers: [CategoriesModel]
})
export class CategoriesList {
  constructor(CategoriesModel: CategoriesModel) {
   this.CategoriesModel = CategoriesModel;
  }

  ngOnInit() {
    this.CategoriesModel.getCategories()
      .then(result => this.categories = result);
  }

  onCategorySelected(category) {
    this.CategoriesModel.setCurrentCategory(category);
  }
}
{% endhighlight %}

A few notable differences to call out is that the HTML selector in Angular 1.x is set when you call `angular.component`, while we are explicitly setting it on the `selector` property in Angular 2. Also, the syntax for lifecycle hooks is slightly different as `$onOnit` has become `ngOnInit`. Finally, dependency injection works slightly different and so we are explicitly wiring up our injector by adding a `providers` property to our component decorator and using TypeScript to explicitly type our parameter in the constructor.

Even without migrating, you can start applying Angular 2 patterns to your Angular 1.x code **right now** and your applications will benefit. As you have seen from the steps outlined above, making the actual transition to Angular 2 from an Angular 1.x application becomes almost trivial. There are a few small differences in the details, but the shapes are surprisingly similar.

### Final 2 code

<iframe src="https://embed.plnkr.co/uR1tgldcILr1EUjhw3qX/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>
