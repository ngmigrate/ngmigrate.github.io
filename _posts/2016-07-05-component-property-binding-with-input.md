---
layout: post
permalink: /component-property-binding-with-input
title: Component property binding with @Input()
author: toddmotto
path: 2016-07-05-component-property-binding-with-input.md
tags: components
version: 2.0.0-rc.4
---

With component architecture, it's an important to design components to contain what we call inputs and outputs. The data enters a component via an input, and leaves the component through an output. This is a small but powerful conceptual change to Angular 1.x's two-way data-binding in which changes automatically propagate to all listeners for that particular binding. Angular 1.x introduced one-way data-flow in the Angular 1.5.x branch, to which mirrors the Angular 2 way of building components. For this guide, we'll be using Angular 1.x's `.component()` method to compare to Angular 2.

## Table of contents

<div class="contents" markdown="1">
* [Angular 1.x](#angular-1x)
  * [Attribute binding](#attribute-binding)
  * [Directive attribute bindings](#directive-attribute-bindings)
  * [Component attribute bindings](#component-attribute-bindings)
  * [Custom attribute binding names](#custom-attribute-binding-names)
* [Angular 2](#angular-2)
  * [Property binding](#component-binding)
  * [Component property bindings](#component-property-bindings)
  * [Alternative @Input() syntax](#alternative-input-syntax)
  * [Custom property binding names](##custom-property-binding-names)
* [Final code](#final-code)
</div>

## Angular 1.x

In Angular 1.x, we have multiple ways to pass information into a "component". Before Angular 1.5.x, this was done always through the `.directive()` API, to which contains `scope` and `bindToController` properties for bindings. In Angular 1.5.x the `.component()` API was introduced and we used a single `bindings` property. To pass information to a component, we need to use attribute binding.

### Attribute binding

To use the Component we simple can declare it inside a template and use a custom attribute on the element itself, in this case `count` inside the `bindings` Object maps directly across to the custom attribute declared when using the element:

{% highlight javascript %}
const app = {
  template: `
    <div>
      My Counter:
      <counter count="2"></counter>
    </div>
  `
};

angular
  .module('app')
  .component('app', app);
{% endhighlight %}

The number `2` is hardcoded here, however in a real world application would be data-driven. We call this "attribute binding" because Angular 1.x grabs existing HTML and extends it, therefore we use a custom attribute.

### Directive attribute bindings

With Directives we have two ways to pass data into a Directive, `scope` or `bindToController`. Let's take a simple counter Directive and demonstrate input bindings through accessing the `count` attribute via `bindToController`:

{% highlight javascript %}
const counter = () => ({
  scope: {},
  bindToController: {
    count: '<'
  },
  controllerAs: '$ctrl',
  controller() {
    this.increment = () => this.count++;
    this.decrement = () => this.count--;
  },
  template: `
    <div>
      <button ng-click="$ctrl.decrement()">-</button>
      <input ng-model="$ctrl.count">
      <button ng-click="$ctrl.increment()">+</button>
    </div>
  `
});

angular
  .module('app')
  .directive('counter', counter);
{% endhighlight %}

In Directives, we can either use the `bindToController` property and specify an Object of bindings, or use the `scope` property to declare the bindings and alternative `bindToController` syntax:

{% highlight javascript %}
const counter = () => ({
  ...
  scope: {
    count: '<'
  },
  bindToController: true
  ...
});
{% endhighlight %}

Both of these make the `count` property specified as an input binding to be available in the template and controller for manipulation.

### Component attribute bindings

With the `.component()` API, things are similar to the Directive but are much simpler:

{% highlight javascript %}
const counter = {
  bindings: {
    count: '<'
  },
  controller() {
    this.increment = () => this.count++;
    this.decrement = () => this.count--;
  },
  template: `
    <div>
      <button ng-click="$ctrl.decrement()">-</button>
      <input ng-model="$ctrl.count">
      <button ng-click="$ctrl.increment()">+</button>
    </div>
  `
};

angular
  .module('app')
  .component('counter', counter);
{% endhighlight %}


Note the changes from `scope` and `bindToController` to the new `bindings` property, as well as dropping the `controllerAs` property as `$ctrl` is the new default for `.component()`. Component definitions are also Objects, not functions like Directives are.

### Custom attribute binding names

Let's assume we want to create an internal component property called `count`, yet want the attribute we bind to be called something different. If we declare an attribute of `init` instead so we end up with `<counter init="2">`, things would look like this:

{% highlight javascript %}
const counter = {
  bindings: {
    count: '<init'
  },
  ...
};

angular
  .module('app')
  .component('counter', counter);
{% endhighlight %}

We use `count` as the _internal_ component reference, but explicitly tell Angular 1.x that the property is coming from `init` and we want one-way data-flow with the `<` syntax prefix.

Let's move on to the Angular 2 implementation.

## Angular 2

In Angular 2, this concept still applies and we use property binding instead over attributes. There is little difference in the physical appearance of the two, however Angular 2 pre-compiles the templates and accesses JavaScript properties, rather than fetching data from existing HTML attributes - it's a different compile phase.

> Angular 1 uses attribute binding, Angular 2 uses property binding

### Property binding

In Angular 2, we need a base `my-app` component definition to render the component into:

{% highlight javascript %}
import {Component} from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <div></div>
  `
})
export default class App {
  public counterValue: number;
  constructor() {
    this.counterValue = 2;
  }
}
{% endhighlight %}

We can then import the `CounterComponent` and use it inside the `template`:

{% highlight javascript %}
import {Component} from '@angular/core';
import CounterComponent from './counter';

@Component({
  selector: 'my-app',
  template: `
    <div>
      <counter [count]="counterValue"></counter>
    </div>
  `,
  directives: [CounterComponent]
})
export default class App {
  ...
}
{% endhighlight %}

Notice here how we are using `<counter [count]="counterValue">`, which `counterValue` is driven from the ES2015 Class, however this could also be hardcoded as a String too! The square brackets are part of Angular 2's template syntax that means we are providing input binding.

Another change from Angular 1.x is the fact that before using our components we need to register them inside a `directives` property on the `@Component()` decorator.

{% highlight javascript %}
import {Component} from '@angular/core';
import CounterComponent from './counter';

@Component({
  selector: 'my-app',
  template: `
    <div>
      <counter [count]="counterValue"></counter>
    </div>
  `,
  directives: [CounterComponent]
})
export default class App {
  public counterValue: number;
  constructor() {
    this.counterValue = 2;
  }
}
{% endhighlight %}

### Component property bindings

In Angular 2, we have a more explicit API for defining inputs and outputs for components. For inputs, we have a TypeScript decorator named `@Input()`, which is extremely readable and easy to use. Before we can begin using the decorator, let's define the `CounterComponent` and import the `Input` function from `@angular`:

{% highlight javascript %}
import {Component, Input} from '@angular/core';

@Component({
  selector: 'counter',
  template: `
    <div>
      <button (click)="decrement()">-</button>
      <input [ngModel]="count">
      <button (click)="increment()">+</button>
    </div>
  `
})
export default class CounterComponent {
  constructor() {}
  increment() {
    this.count++;
  }
  decrement() {
    this.count--;
  }
}
{% endhighlight %}

The next stage of this is defining the component input via the `@Input()` decorator, we need to declare this inside the ES2015 Class:

{% highlight javascript %}
import {Component, Input} from '@angular/core';

@Component({
  ...
})
export default class CounterComponent {
  @Input() count: number = 0;
  constructor() {}
  ...
}
{% endhighlight %}

Now, if you think back to the Angular 1.x example where we used `bindings: { count: '<' }`, this is actually doing the exact same thing and telling Angular 2 where the data is coming from, just with some TypeScript sprinkled on top to denote we're expecting it to be of type `number`. The data passed into the component will be readily available as `this.count`, so we can reference it inside our templates!

### Alternative @Input() syntax

There is also an alternative syntax to using `@Input()` as a decorator, and that's using it as an `inputs` property inside the `@Component()` decorator:

{% highlight javascript %}
import {Component, Input} from '@angular/core';

@Component({
  selector: 'counter',
  ...
  inputs: ['count']
})
export default class CounterComponent {
  constructor() {}
  increment() {
    this.count++;
  }
  decrement() {
    this.count--;
  }
}
{% endhighlight %}

This is however a least favoured approach, I'd stick with using TypeScript decorators to make use of types and readability.

### Custom property binding names

In Angular 1.x we can use `bindings: { foo: '<bar' }` syntax to change the binding name to a different internal mapping, in this case `bar` becomes `foo`. We can also do the same with Angular 2's `@Input()` by passing in a String into the decorator defining the name:

{% highlight javascript %}
import {Component, Input} from '@angular/core';

@Component({
  ...
})
export default class CounterComponent {
  @Input('init') count: number = 0;
  constructor() {}
  ...
}
{% endhighlight %}

And also the `inputs: []` Array by using `:` to separate the mapped name and the property binding:

{% highlight javascript %}
import {Component, Input} from '@angular/core';

@Component({
  selector: 'counter',
  ...
  inputs: ['count:init']
})
export default class CounterComponent {
  ...
}
{% endhighlight %}

These aren't typically advised either, you're best sticking with TypeScript decorators in this case also to keep things String-less and dynamic.

## Final code

<iframe src="https://embed.plnkr.co/nkkk0hs0nYoMXo7OZFUW/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>
