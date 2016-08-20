---
layout: post
permalink: /from-ng-class-to-property-binding
title: From ng-class to Property Binding
author: jeremylikness
path: 2016-08-20-from-ng-class-to-attribute-binding.md
tags: directives
version: 2.0.0-rc.4
intro: In this guide you'll learn how to convert legacy ng-class bindings to use Angular 2.x attribute bindings.
---

The `ng-class` directive in Angular 1.x allows you to provide an expression that controls what classes are applied to a DOM element. When the expressions change, the classes are automatically updated. In this guide we'll be converting an Angular 1.x `ng-class` directive to use the native DOM property binding in Angular 2.0. (Properties are the live DOM properties that
are initialized by attributes.) 

## Table of contents

<div class="contents" markdown="1">
* [Angular 1.x](#angular-1x)
  * [Using ng-class](#using-ng-class)
  * [HTML Markup](#html-markup)
  * [Final 1.x code](#final-1x-code)
* [Angular 2](#angular-2)
  * [The Angular 2 Component](#the-angular-2-component)
  * [String Binding](#string-binding)
  * [Array Binding](#array-binding)
  * [Multiple Expressions](#multiple-expressions)
  * [Final 2 code](#final-2-code)
</div>

## Angular 1.x

In Angular 1.x, you can use `ng-class` in one of three ways: 

1. Expression evaluates to a string of class names 
2. Expression evaluates to an object, with key-value pairs with the keys representing the class and the value representing an expression that will select the class when truthy
3. Expression evaluates to an array and each element can be either (1) or (2)   

### Using ng-class

Let's set up a simple Angular 1.x controller that exposes some data and properties.
It has a toggle to indicate whether a border should be shown, and a cycle to cycle through colors. 

{% highlight javascript %}
var ng = function (app) {
  function Controller() {
    this.toggle = false; 
    this.idx = 0;
    this.backgrounds = ['red', 'green', 'blue'];
    this.borders = ['greenborder', 'redborder', 'blueborder'];
    this.arr = [ this.backgrounds[1], this.borders[2] ];
  }
    
  app.controller('ctrl', Controller);
};

setTimeout(ng(angular.module('ngMigrate', [])), 0);
{% endhighlight %}

Next up we can expose the "current" border and background using read-only JavaScript properties:

{% highlight javascript %}
Object.defineProperty(Controller.prototype, 'background', {
    enumerable: true,
    configurable: false,
    get: function () {
      return this.backgrounds[this.idx];
    }
  });
  
  Object.defineProperty(Controller.prototype, 'border', {
    enumerable: true,
    configurable: false,
    get: function () {
      return this.borders[this.idx];
    }
  });
{% endhighlight %}

Finally we'll expose a method to cycle through: 

{% highlight javascript  %}
  Controller.prototype.cycleAction = function () {
    this.idx = (this.idx + 1) % this.backgrounds.length;
  }
{% endhighlight %}

### HTML Markup 

The HTML markup defines the controller, binds to the toggle property and
cycle function, and exposes the class in different ways: first with an object, next with
examples of string binding, and finally the array binding example.

{% highlight html %}
<body ng-app="ngMigrate">
    <section ng-controller='ctrl as ctrl'>
      <button ng-click='ctrl.cycleAction()'>Cycle</button>
      <input type="checkbox" ng-model='ctrl.toggle'/>Show Border
      <br/><br/>
      <div ng-class="{ 'red': true, 'greenborder' : ctrl.toggle }">Toggle</div>
      <div ng-class="ctrl.background">BG</div>
      <div ng-class="ctrl.border">Border</div>
      <div ng-class="ctrl.arr">Array</div>
    </section>
  </body>
{% endhighlight %}

### Final 1.x code

<iframe src="http://embed.plnkr.co/wg9Z7sWkw9rn6qX1uVby/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

## Angular 2

One of the advantages of Angular 2 is that you can use the template binding syntax to
bind to any DOM property that is exposed. This eliminates dozens of built-in directives. There is no
`ng-class` directive in Angular 2 because you can bind to the expressions directly. Let's take a look at the various approaches: 

### The Angular 2 Component 

First, we'll convert the controller code to a component. Note we can migrate it 
almost "as is." The getters and setters are simplified by the TypeScript
syntax.  

{% highlight typescript %}

export class App {
  constructor() {
    this.toggle = false; 
    this.idx = 0;
    this.backgrounds = ['red', 'green', 'blue'];
    this.borders = ['greenborder', 'redborder', 'blueborder'];
    this.arr = [ this.backgrounds[1], this.borders[2] ];
  }
  
  get background(): string {
    return this.backgrounds[this.idx];
  }
  
  get border(): string {
    return this.borders[this.idx];
  }
  
  public cycle(): void {
    this.idx = (this.idx + 1) % this.backgrounds.length;
  }
}

{% endhighlight %}

### String Binding 

Now that the component is defined, we can take advantage of the
template binding syntax in Angular 2 to set the class. To bind to a DOM
property, you simply wrap it in square braces, like this: 

{% highlight html %}
<div [class]="background">BG</div>
<div [class]="border">Border</div>
{% endhighlight %}

Note that "background" and "border" are expressions evaluated against the component and 
not string literals.

### Array Binding 

Property binding evaluates the expression and passes the result directly
to the property. Therefore, binding to an array will not behave the same as 
it did in Angular 1.x. Instead, you must either expose a method that decomposes 
the array into a string with the classes separated by spaces, or use an expression
like this: 

{% highlight html %}
<div [class]="arr.join(' ')">Array</div>
{% endhighlight %}

Notice the array is joined into a single spring with a space between each class. 

### Multiple Expressions 

For multiple expressions, instead of joining to an object, you can extend
the property binding for the class to class names. When the associated expression is truthy,
the class is added. When the associated expression is falsy, the class is removed.

{% highlight html %}
<div [class.red]="true" [class.greenborder]="toggle">Toggle</div>
{% endhighlight %}

Now you've successfully migrated `ng-class` to direct binding in Angular 2,
addressing all three scenarios the old directive handled.

### Final 2 code

<iframe src="http://embed.plnkr.co/nZZctWSve29QKTCWdRcW/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>
