---
layout: post
permalink: /passing-data-angular-2-components-input
title: Passing data into Angular 2 Components with "Input"
author: Todd Motto
path: 2016-03-18-passing-data-angular-2-components-input.md
tags: directives controllers
---

Static Components can be great, however most Components have the need for data to be passed in and out of them. Usually we would pass data into a Component, the Component would go to work, and let the parent Component know something has changed, passing back the changed value.

This tutorial will cover passing data into a Component. For the purposes of this article we'll be using the Counter Component we built in the previous one, so if you've not dived in and learned how to create a Component in Angular 2, [check that out here](/creating-your-first-angular-2-component) or play with the below Plunker, as we'll be using the same source code to continue building.

<iframe src="//embed.plnkr.co/JqDECa0EdvvASzIS3Pvl" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

### Angular 1.x

For those coming from an Angular 1.x background, this concept looks a little like this with the `.directive()` API:

{% highlight javascript %}
function counter() {
  return {
    scope: {},
    bindToController: {
      counterValue: '='
    },
    controller() {
      this.counterValue = this.counterValue || 0;
      this.increment = function () {
        this.counterValue++;
      }
      this.decrement = function () {
        this.counterValue--;
      }
    },
    template: `
      <div class="counter">
        <div class="counter__container">
          <button ng-click="$ctrl.decrement();" class="counter__button">
            -
          </button>
          <input type="text" class="counter__input" ng-model="$ctrl.counterValue">
          <button ng-click="$ctrl.increment();" class="counter__button">
            +
          </button>
        </div>
      </div>
    `
  };
}
angular
  .module('app')
  .directive('counter', counter);
{% endhighlight %}

The key ingredient using `bindToController` to pass `counterValue` in.

Let's investigate the Angular 2 way.

### Parent Data

Using the same concept above with `bindToController`, which relies on parent data, we need to tell Angular 2 what is coming into our Component. We'll need a parent Component (like we already have from the previous article called `AppComponent`), where we can set some initial data:

{% highlight javascript %}
// app.component.ts
import {Component} from 'angular2/core';
import {CounterComponent} from './counter.component';

@Component({
  selector: 'my-app',
  styles: [`
    .app {
      display: block;
      text-align: center;
      padding: 25px;
      background: #f5f5f5;
    }
  `],
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `,
  directives: [CounterComponent]
})
export class AppComponent {
  public myValue:number = 2;
}
{% endhighlight %}

On the `class AppComponent` we've declared `myValue` with the type `number` and value of `2`. Next we need to create a custom attribute name on the `<counter>` Component to pass this initial data into, let's call it `counterValue`:

{% highlight javascript %}
// app.component.ts
import {Component} from 'angular2/core';
import {CounterComponent} from './counter.component';

@Component({
  selector: 'my-app',
  styles: [`
    .app {
      display: block;
      text-align: center;
      padding: 25px;
      background: #f5f5f5;
    }
  `],
  template: `
    <div class="app">
      <counter [counterValue]="myValue"></counter>
    </div>
  `,
  directives: [CounterComponent]
})
export class AppComponent {
  public myValue:number = 2;
}
{% endhighlight %}

Note how we've used `[counterValue]` with square brackets around it, this tells Angular what property to bind to. This value corresponds with the internal `counterValue` property inside our `CounterComponent`:

{% highlight javascript %}
// counter.component.ts
...
export class CounterComponent {
  public counterValue:number = 0;
  increment() {
    this.counterValue++;
  }
  decrement() {
    this.counterValue--;
  }
}
...
{% endhighlight %}

### @Input decorator for property bindings

Let's focus on `public counterValue:number = 0;` now, it's currently an inner value of the `CounterComponent`, however we would ideally like to set the initial data and keep a bound reference from the parent. This is where we need to use Angular 2's `@Input()` decorator. We import `Input` from the Angular core, and inside the `class CounterComponent` it's a simple switch out:

{% highlight javascript %}
import {Component, Input} from 'angular2/core';

@Component({
  selector: 'counter',
  styles: [`
    // omitted for brevity
  `],
  template: `
    // omitted for brevity
  `
})
export class CounterComponent {
  @Input() counterValue = 0;
  increment() {
    this.counterValue++;
  }
  decrement() {
    this.counterValue--;
  }
}
{% endhighlight %}

Note how `@Input counterValue` sets a default value of `0`, which means if no data is passed in then this value will be used instead.

And that's it! Let's take a look at the rendered Component, you can also dig through the source files in Plunker:

<iframe src="//embed.plnkr.co/zFzyTcAJAJ1UAhDr1U3k" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

### Without @Input decorator

Let's dive a little deeper. Using `@Input` is a preferred approach, however we don't _have_ to use it. The `@Component` decorator is rather awesome, and provides us an `inputs` property, which is an Array of `@Input` equivalents that we wish to use inside the particular Component. Refactoring the above code we can do this:

{% highlight javascript %}
import {Component} from 'angular2/core';

@Component({
  selector: 'counter',
  styles: [`
    // omitted for brevity
  `],
  template: `
    // omitted for brevity
  `,
  inputs: ['counterValue']
})
export class CounterComponent {
  public counterValue = 0;
  increment() {
    this.counterValue++;
  }
  decrement() {
    this.counterValue--;
  }
}
{% endhighlight %}

Here's a working version of that:

<iframe src="//embed.plnkr.co/v9P0NYUT9l5zxNq9pED3" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

### Custom public property naming

One thing we might want to keep internally inside `CounterComponent` is a property name such as `counterValue`, however expose a different property name to be able to bind to. Let's say I want to expose `init` as the property name to bind to, so we'd use `<counter [init]=""></counter>` instead of `<counter [counterValue]=""></counter>`, we can do that by passing a custom String into the `@Input` decorator:

{% highlight javascript %}
import {Component, Input} from 'angular2/core';

@Component({
  selector: 'counter',
  styles: [`
    // omitted for brevity
  `],
  template: `
    // omitted for brevity
  `
})
export class CounterComponent {
  @Input('init') counterValue = 0;
  increment() {
    this.counterValue++;
  }
  decrement() {
    this.counterValue--;
  }
}
{% endhighlight %}

Demo:

<iframe src="//embed.plnkr.co/QtrBJ1SOYdXiuO49R91u" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

We can also achieve the same thing with the `inputs: []` property by setting the value of `['counterValue:init']`:

{% highlight javascript %}
import {Component} from 'angular2/core';

@Component({
  selector: 'counter',
  styles: [`
    // omitted for brevity
  `],
  template: `
    // omitted for brevity
  `,
  inputs: ['counterValue:init']
})
export class CounterComponent {
  public counterValue = 0;
  increment() {
    this.counterValue++;
  }
  decrement() {
    this.counterValue--;
  }
}
{% endhighlight %}

The rule for this one is `internalProp:externalProp`, in this case `counterValue:init`. Demo:

<iframe src="//embed.plnkr.co/I6zaiA8kVcY06tTZSUyE" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

### Next steps

Wouldn't it be great to be notified of changes when the internal `counterValue` (inside `CounterComponent`) has changed? Well, instead of `@Input`, we can use `@Output` and `EventEmitter` - [let's explore in the next tutorial](/component-events-event-emitter-output-angular-2).
