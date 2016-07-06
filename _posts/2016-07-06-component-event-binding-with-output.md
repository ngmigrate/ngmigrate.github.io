---
layout: post
permalink: /component-event-binding-with-output
title: Component event binding with @Output()
author: toddmotto
path: 2016-07-06-component-event-binding-with-output.md
tags: components
version: 2.0.0-rc.4
intro: In this guide you'll learn how to emit data out of Angular 2 components to a parent component through event binding and EventEmitter.
---

With component architecture, it's an important to design components to contain what we call inputs and outputs. The data enters a component via an input, and leaves the component through an output. This is a small but powerful conceptual change to Angular 1.x's two-way data-binding in which changes automatically propagate to all listeners for that particular binding. Angular 1.x introduced one-way data-flow in the Angular 1.5.x branch, to which mirrors the Angular 2 way of building components. For this guide, we'll be using Angular 1.x's `.component()` method to compare to Angular 2.

This guide continues on from the previous guide of [passing data into components](/component-property-binding-with-input), which is a recommended prerequisite.

## Table of contents

<div class="contents" markdown="1">
* [Angular 1.x](#angular-1x)
* [Angular 2](#angular-2)
* [Final code](#final-code)
</div>

## Angular 1.x

In Angular 1.x, we have multiple ways to emit data via an event binding from a "component". Before Angular 1.5.x, this was done always through the `.directive()` API, which contains `scope` and `bindToController` properties for bindings. In Angular 1.5.x the `.component()` API was introduced and we use a single `bindings` property. To emit an event from a component, we need to use attribute binding.

### Attribute binding

We're following on from the previous article using our `<counter>` component, keeping the attribute bindings in place for passing data into our component, but adding a `controller` with a function to let us know when the component updates the count number.

To use the Component we declare it inside a `template` and use a custom attribute on the element itself, in this case the `count` attribute exists from the previous article, so the new addition here is `on-update` with the registered callback from the `controller`:

{% highlight javascript %}
const app = {
  template: `
    <div>
      My Counter:
      <counter
       count="$ctrl.count"
       on-update="$ctrl.countUpdated($event);"></counter>
    </div>
  `,
  controller() {
    this.count = 2;
    this.countUpdated = (event) => {
      this.count = event.count;
    };
  }
};

angular
  .module('app')
  .component('app', app);
{% endhighlight %}

The number `2` is hardcoded here, however in a real world application would be data-driven. We call this "attribute binding" because Angular 1.x grabs existing HTML and extends it, therefore we use a custom attribute.

### Directive attribute bindings

With Directives we have two ways to pass event callbacks into a Directive, `scope` or `bindToController`, both use the `'&'` syntax which allows us to delegate a function for this purpose.

Let's take the counter Directive and demonstrate event bindings through accessing the `on-update` attribute via `bindToController` (which converts to camelCase in the `bindings` Object):

{% highlight javascript %}
const counter = () => ({
  scope: {},
  bindToController: {
    count: '<',
    onUpdate: '&'
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
{% endhighlight %}

In Directives, we can either use the `bindToController` property and specify an Object of bindings, or use the `scope` property to declare the bindings and alternative `bindToController` syntax:

{% highlight javascript %}
const counter = () => ({
  ...
  scope: {
    count: '<',
    onUpdate: '&'
  },
  bindToController: true
  ...
});
{% endhighlight %}

Both of these make the `onUpdate` property specified as an event binding to be available in the template and controller for calling the function.

### Component attribute bindings

With the `.component()` API, things are similar to the Directive but are much simpler:

{% highlight javascript %}
const counter = {
  bindings: {
    count: '<',
    onUpdate: '&'
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

Let's assume we want to create an internal component property called `onUpdate`, yet want the attribute we bind to be called something different. If we declare an attribute of `updates` instead of `on-update`, we end up with `<counter updates="$ctrl.fn($event);">` instead, and things would look like this:

{% highlight javascript %}
const counter = {
  bindings: {
    ...
    onUpdate: '&updates'
  },
  ...
};

angular
  .module('app')
  .component('counter', counter);
{% endhighlight %}

We use `count` as the _internal_ component reference, but explicitly tell Angular 1.x that the property is coming from `init` and we want one-way data-flow with the `<` syntax prefix.

### Calling delegate methods

Calling these functions is easy as they map directly across to the `bindings` property:

{% highlight javascript %}
const counter = {
  bindings: {
    count: '<',
    onUpdate: '&'
  },
  controller() {
    this.increment = () => {
      this.count++;
      this.onUpdate({
        $event: {
          count: this.count
        }
      });
    }
    this.decrement = () => {
      this.count--;
      this.onUpdate({
        $event: {
          count: this.count
        }
      });
    }
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

Here we pass this Object `{ $event: {} }` into the function's callback, this is to mirror Angular 2's `$event` syntax when being passed data back. So when `this.onUpdate` is invoked it actually passes the data back up to the parent, which is where `$ctrl.countUpdated($event);` is called and passed the data, which is the parent component. Let's move on to the Angular 2 implementation.

## Angular 2

In Angular 2, this concept still applies and we use property binding instead over attributes. There is little difference in the physical appearance of the two, however Angular 2 pre-compiles the templates and accesses JavaScript properties, rather than fetching data from existing HTML attributes - it's a different compile phase.

> Angular 1 uses attribute binding, Angular 2 uses property binding

### Property binding

We can jump to the `CounterComponent` we saw from the previous article:

{% highlight javascript %}
import {Component} from '@angular/core';
import CounterComponent from './counter';

@Component({
  selector: 'my-app',
  template: `
    <div>
      <counter
        [count]="counterValue"
        (update)="counterUpdate($event)"></counter>
    </div>
  `,
  directives: [CounterComponent]
})
export default class App {
  public counterValue: number;
  constructor() {
    this.counterValue = 2;
  }
  counterUpdate(event: object) {
    this.counterValue = event.count;
  }
}
{% endhighlight %}

Notice here how we are using `<counter (update)="counterUpdate($event)">`, which `counterUpdate` is driven from the ES2015 Class. We use `on-update` in Angular 1.x to denote the binding is some kind of an event callback, in Angular 2 the syntax lets us know this for us as it different from input binding square brackets. The normal style brackets are part of Angular 2's template syntax that means we are providing event binding.

### Component property bindings

In Angular 2, we have a more explicit API for defining inputs and outputs for components. For outputs, we have a TypeScript decorator named `@Output()`, which is extremely readable and easy to use. Before we can begin using the decorator we need to import the `Output` and `EventEmitter` APIs from `@angular`:

{% highlight javascript %}
import {Component, Input, Output, EventEmitter} from '@angular/core';

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

The next stage of this is defining the component output via the `@Output()` decorator and invoking a `new` instance of `EventEmitter`. We can then declare this inside the ES2015 Class next to `@Input()`:

{% highlight javascript %}
import {Component, Input} from '@angular/core';

@Component({
  ...
})
export default class CounterComponent {
  @Input() count: number = 0;
  @Output() update = new EventEmitter<any>();
  constructor() {}
  ...
}
{% endhighlight %}

Now, if you think back to the Angular 1.x example where we used `bindings: { onUpdate: '&' }`, this is actually doing the exact same thing and telling Angular 2 where the event output will be coming from.

### Using EventEmitter

To use the `EventEmitter` instance, we need to then reference `update` and then call the `emit` method inside `increment` and `decrement` just like with the Angular 1.x example:

{% highlight javascript %}
import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  ...
})
export default class CounterComponent {
  @Input() count: number = 0;
  @Output() update = new EventEmitter<any>();
  constructor() {}
  increment() {
    this.count++;
    this.update.emit({
      count: this.count
    });
  }
  decrement() {
    this.count--;
    this.update.emit({
      count: this.count
    });
  }
}
{% endhighlight %}

We pass in an Object with a `count` property, just like in the Angular 1.x code, which is also made available to the parent component via `counterUpdate($event)`:

{% highlight javascript %}
import {Component} from '@angular/core';
import CounterComponent from './counter';

@Component({
  ...
})
export default class App {
  ...
  counterUpdate(event: object) {
    this.counterValue = event.count;
  }
}
{% endhighlight %}

### Alternative @Output() syntax

There is also an alternative syntax to using `@Output()` as a decorator, and that's using it as an `outputs` property inside the `@Component()` decorator:

{% highlight javascript %}
import {Component, Input} from '@angular/core';

@Component({
  selector: 'counter',
  ...
  outputs: ['update']
})
export default class CounterComponent {
  ...
}
{% endhighlight %}

This is however a least favoured approach, I'd stick with using TypeScript decorators to make use of types and readability.

### Custom property binding names

In Angular 1.x we can use `bindings: { foo: '&bar' }` syntax to change the binding name to a different internal mapping, in this case `bar` becomes `foo`. We can also do the same with Angular 2's `@Output()` by passing in a String into the decorator defining the name:

{% highlight javascript %}
import {Component, Input} from '@angular/core';

@Component({
  ...
})
export default class CounterComponent {
  @Input('init') count: number = 0;
  @Output('change') update = new EventEmitter<any>();
  constructor() {}
  ...
}
{% endhighlight %}

This would be the equivalent of `<counter (change)="fn($event)">` mapped internally to `update`. Also the `outputs: []` Array by using `:` to separate the mapped name and the property binding:

{% highlight javascript %}
import {Component, Input} from '@angular/core';

@Component({
  selector: 'counter',
  ...
  outputs: ['update:change']
})
export default class CounterComponent {
  ...
}
{% endhighlight %}

These aren't typically advised either, you're best sticking with TypeScript decorators in this case also to keep things String-less and dynamic.

## Final code

You can see in the final code below that incrementing/decrementing the counter also updates the parent through the `@Output()` event:

<iframe src="https://embed.plnkr.co/oPYcWddwCUQM5M8rXbAX/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>
