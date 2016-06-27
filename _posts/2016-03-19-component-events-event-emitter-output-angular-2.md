---
layout: post
permalink: /component-events-event-emitter-output-angular-2
title: Component events with EventEmitter and "Output" in Angular 2
author: toddmotto
path: 2016-03-19-component-events-event-emitter-output-angular-2.md
tags: modules controllers filters
---

Angular 2 Components have a far better way of notifying parent Components that something has happened via events. There is no longer two-way data binding in Angular 2 in the same way we knew it in Angular 1.x, it's designed around a uni-directional data flow system that adopts a much more reasonable approach to application development. Let's finalise the basics of parent-child and child-parent communication.

This tutorial will cover local Component events using the `EventEmitter` API and `@Output` decorator, which follows nicely from the previous article on [passing data in Angular 2 Components](/passing-data-angular-2-components-input). For the purposes of this article we'll be continuing to use the Counter Component we built in the [first article](/creating-your-first-angular-2-component) - so familiarise yourself with this first.

## Angular 1.x

For those coming from an Angular 1.x background, this concept could look a little like this with the `.directive()` API and `$rootScope` events:

{% highlight javascript %}
function counter($rootScope) {
  return {
    scope: {},
    bindToController: {
      counterValue: '='
    },
    controller() {
      this.counterValue = this.counterValue || 0;
      this.increment = function () {
        this.counterValue++;
        $rootScope.$emit('counterValueChange', {
          value: this.counterValue
        });
      }
      this.decrement = function () {
        this.counterValue--;
        $rootScope.$emit('counterValueChange', {
          value: this.counterValue
        });
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

The key ingredient using `$rootScope.$emit('counterValueChange', {});` which fires an event, where we could use `$rootScope.$on('counterValueChange')` to listen to the event and run a callback once it's fired.

Let's investigate the Angular 2 way.

## Parent "Listener"

Let's take our parent Component we know well by now and setup a function called `myValueChange` on the `class` that we want to invoke when we bind it to our `CounterComponent`'s API':

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
  myValueChange(event) {
    console.log(event);
  }
}
{% endhighlight %}

On the `class AppComponent` we've declared `myValueChange` which accepts `event` as an argument. Next we need to create a custom attribute name on the `<counter>` Component to hook this function into, let's call it `counterChange`:

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
      <counter [counterValue]="myValue" (counterChange)="myValueChange($event);"></counter>
    </div>
  `,
  directives: [CounterComponent]
})
export class AppComponent {
  public myValue:number = 2;
  myValueChange(event) {
    console.log(event);
  }
}
{% endhighlight %}

Note how we've used `(counterChange)` with parentheses around it, this tells Angular that this is an event binding, similar to `(click)`. Now we need to mirror this API inside the `CounterComponent`.

### @Output and EventEmitter

This is where we need to use Angular 2's `@Output()` decorator. We import `Output` from the Angular core, and inside the `class `CounterComponent` add the goodness:

{% highlight javascript %}
// counter.component.ts
import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'counter',
  styles: [`
    // omitted
  `],
  template: `
    // omitted
  `
})
export class CounterComponent {
  @Input() counterValue = 0;
  @Output() counterChange = new EventEmitter();
  increment() {
    this.counterValue++;
    this.counterChange.emit({
      value: this.counterValue
    })
  }
  decrement() {
    this.counterValue--;
    this.counterChange.emit({
      value: this.counterValue
    })
  }
}
{% endhighlight %}

Note how `@Output counterChange` is set to a `new` instance of `EventEmitter`, this `@Output` decorator makes the `counterChange` property available as an event binding like we saw in the above template `(counterChange)`.

## EventEmitter API

Nearly there, we would like to tell the parent Component that the `counterChange` event has happened when the child Component actually updates the value, which as we know happens on a `click` event. Let's emit an event there, as it seems a logical place to do so:

{% highlight javascript %}
// counter.component.ts
...
export class CounterComponent {
  @Input() counterValue = 0;
  @Output() counterChange = new EventEmitter();
  increment() {
    this.counterValue++;
    this.counterChange.emit({
      value: this.counterValue
    })
  }
  decrement() {
    this.counterValue--;
    this.counterChange.emit({
      value: this.counterValue
    })
  }
}
{% endhighlight %}

Note that I'm emitting an Object with a property of `value`, you don't have to do this however it looks nicer when using the event in a callback in the parent (`event.value` being more explicit).

Our parent Component can now fetch the `$event` Object, as we've passed it into the template using `(counterChange)="myValueChange($event);"`.

{% highlight javascript %}
// app.component.ts
...
export class AppComponent {
  public myValue:number = 2;
  myValueChange(event) {
    // result: { value: <number> }
    console.log(event);
  }
}
{% endhighlight %}

And that's it! Let's take a look at the rendered Component, you can also dig through the source files in Plunker:

<iframe src="//embed.plnkr.co/Zz0DERCJqHcHUnLhHBrm" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

## Without @Output decorator

Like with `@Input` and `inputs: []` in the previous article, we have the same capabilities with `@Output`. The `@Component` decorator is rather awesome, and provides us an `outputs` property, which is an Array of `@Output` equivalents that we wish to use inside the particular Component. Refactoring the above code we can do this:

{% highlight javascript %}
import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'counter',
  styles: [`
    // omitted for brevity
  `],
  template: `
    // omitted for brevity
  `,
  outputs: ['counterChange']
})
export class CounterComponent {
  @Input() counterValue = 0;
  public counterChange = new EventEmitter();
  increment() {
    this.counterValue++;
    this.counterChange.emit({
      value: this.counterValue
    })
  }
  decrement() {
    this.counterValue--;
    this.counterChange.emit({
      value: this.counterValue
    })
  }
}
{% endhighlight %}

Here's a working version of that:

<iframe src="//embed.plnkr.co/3N3pPMfm4aPSHNz6YgE1" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

### Custom public property naming

One thing we might want to keep internally inside `CounterComponent` is a property name such as `counterChange`, however expose a different property name to be able to listen to. Let's say I want to expose `change` as the property name that the event is bound to, so we'd use `<counter (change)="myValueChange($event);"></counter>` instead of `<counter (counterChange)="myValueChange($event);"></counter>`, we can do that by passing a custom String into the `@Output` decorator:

{% highlight javascript %}
import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'counter',
  styles: [`
    // omitted
  `],
  template: `
    // omitted
  `
})
export class CounterComponent {
  @Input('init') counterValue = 0;
  @Output('change') counterChange = new EventEmitter();
  increment() {
    this.counterValue++;
    this.counterChange.emit({
      value: this.counterValue
    })
  }
  decrement() {
    this.counterValue--;
    this.counterChange.emit({
      value: this.counterValue
    })
  }
}
{% endhighlight %}

Demo:

<iframe src="//embed.plnkr.co/6cTWAR1urPZiIBdx81k8" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

We can also achieve the same thing with the `outputs: []` property by setting the value of `['counterChange:change']`:

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
  outputs: ['counterChange:change']
})
export class CounterComponent {
  public counterValue = 0;
  increment() {
    this.counterValue++;
    this.counterChange.emit({
      value: this.counterValue
    })
  }
  decrement() {
    this.counterValue--;
    this.counterChange.emit({
      value: this.counterValue
    })
  }
}
{% endhighlight %}

The rule for this one is `internalProp:externalProp`, in this case `counterChange:change`.

Altogether the `CounterComponent` has the following properties for `@Input` and `@Output` based on the above custom property setups:

{% highlight html %}
<counter [init]="myValue" (change)="myValueChange($event);"></counter>
{% endhighlight %}
