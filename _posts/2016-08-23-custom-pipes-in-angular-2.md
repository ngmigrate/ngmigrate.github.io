---
layout: post
permalink: /custom-pipes-angular-2
title: Creating a custom filter (pipe) in Angular 2
author: toddmotto
path: 2016-08-23-custom-pipes-in-angular-2.md
tags: filters
version: 2.0.0-rc.5
intro: In this guide you'll learn how to create a pipe to filter a single value.
---

Filters are a fantastic way of returning new collections of data, rather than mutating existing. Filters essentially are just functions, that accept a single value, or collection, and return a new value or collection based on that filter's responsibility. In this guide, we'll be covering how to create a custom pipe that accepts a single value and returns a new value, as well as passing arguments into filter functions.

## Table of contents

<div class="contents" markdown="1">
* [Angular 1.x](#angular-1x)
  * [Creating a custom filter](#creating-a-custom-filter)
  * [Using filters in templates](#using-filters-in-templates)
  * [Passing arguments to filters](#passing-arguments-to-filters)
  * [Filtering in Controllers with $filter()](#filtering-in-controllers-with-filter)
* [Angular 2](#angular-2)
  * [Creating a custom pipe](#creating-a-custom-pipe)
  * [Using pipes in templates](#using-pipes-in-templates)
  * [Passing arguments to pipes](#passing-arguments-to-pipes)
  * [Filtering in Component classes with pipes](#final-2-code)
</div>

## Angular 1.x

In Angular 1.x, creating a filter is simply done by passing a pure function into the `.filter()` API. For this guide, we'll be using an "ordinal" filter, which takes a value such as this:

{% highlight html %}
<!-- template code -->
<p>You came {{ '1' }}</p>
<p>You came {{ '2' }}</p>
{% endhighlight %}

Into this:

{% highlight html %}
<!-- when compiled -->
<p>You came 1st</p>
<p>You came 2nd</p>
{% endhighlight %}

Therefore, our ordinal filter will return a new value with the correct suffix to the number value passed into the filter. Angular's `.filter()` API expects a function, that the first argument is the value the filter was bound to, and returns a new value, for example to demonstrate creating an `uppercase` filter:

{% highlight javascript %}
const uppercase = () => {
  // filter function closure
  // `value` is passed to us
  return value => {
    // do something with the `value`
    var newValue = value.toUpperCase();
    // return a new value
    return newValue;
  };
};

angular
  .module('app')
  .filter('uppercase', uppercase);
{% endhighlight %}

We create the filter function and just pass it off to the `.filter()` API to get it registered.

### Creating a custom filter

Let's get the ball rolling with our custom ordinal filter, I've already written the logic to implement it, and we don't need to focus on the internal details, just the Angular API. So, here's the function for our

{% highlight javascript %}
const ordinal = () => {
  return value => {
    var suffix = '';
    var last = value % 10;
    var specialLast = value % 100;
    if (!value || value < 1) {
      return value;
    }
    if (last === 1 && specialLast !== 11) {
      suffix = 'st';
    } else if (last === 2 && specialLast !== 12) {
      suffix = 'nd';
    } else if (last === 3 && specialLast !== 13) {
      suffix = 'rd';
    } else {
      suffix = 'th';
    }
    return value + suffix;
  };
};

angular
  .module('app')
  .filter('ordinal', ordinal);
{% endhighlight %}

### Using filters in templates

To use the above ordinal filter, all we need to do is use the pipe character inside our expression. For this, we'll create a simple component with an `ng-repeat` to iterate over an Array of numbers to print out `1st`, `2nd`, `3rd` and so on.

{% highlight javascript %}
const app = {
  template: `
    <div>
      <ul>
        <li ng-repeat="num in $ctrl.numbers">
          {% raw %}{{ num | ordinal }}{% endraw %}
        </li>
      </ul>
    </div>
  `,
  controller() {
    this.numbers = [
      1,2,3,4,5,6,7,8,9,10,
      11,12,13,14,15,16,17,18,19,20
    ];
  }
};

angular
  .module('app')
  .component('app', app);
{% endhighlight %}

You can check out the full compiled out demo below, but next we'll dive into passing arguments into filters.

<iframe src="https://embed.plnkr.co/XJk5dgCMMUdiYOh93QSi/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

### Passing arguments to filters

Passing arguments to filters is generally how we'll use them, we want to ensure filters are filtering based on something dynamic. With the `.filter()` API, we can specify further function arguments to be able to pass more information into filters:

{% highlight javascript %}
const ordinal = () => {
  // passing another argument
  return (value, anotherValue) => {
    // do something with `value` and `anotherValue`
    // and return a new value
  };
};

angular
  .module('app')
  .filter('ordinal', ordinal);
{% endhighlight %}

The way we pass arguments into functions inside our templates is as follows:

{% highlight javascript %}
const app = {
  template: `
    <div>
      <input ng-model="searchValue">
      <ul>
        <li ng-repeat="num in $ctrl.numbers">
          {% raw %}{{ num | ordinal:searchValue }}{% endraw %}
        </li>
      </ul>
    </div>
  `,
  ...
};
{% endhighlight %}

In the above example, the `ng-model` value from the `<input>` is being directly captured and passed into the `ordinal` filter as a function, separating the arguments with a `:` colon. This `searchValue` will then directly map across to the function argument `anotherValue` in the previous code example.

### Filtering in Controllers with $filter()

We also have the ability to filter inside the component's controller, using the `$filter` injectable, in this case we can filter the Array of numbers _before_ binding to the view, which means we also remove the `| ordinal` pipe value from the template as well:

{% highlight javascript %}
const app = {
  template: `
    <div>
      <ul>
        <li ng-repeat="num in $ctrl.numbers">
          {% raw %}{{ num }}{% endraw %}
        </li>
      </ul>
    </div>
  `,
  controller($filter) {
    let numbers = [
      1,2,3,4,5,6,7,8,9,10,
      11,12,13,14,15,16,17,18,19,20
    ];
    // iterate the existing collection before binding
    // returns a new filtered collection
    this.numbers = numbers.map(number => $filter('ordinal')(number));
  }
};
{% endhighlight %}

This technique of filtering in a Controller is most favoured in Angular 1.x due to performance reasons, you can [read why here](https://toddmotto.com/use-controller-filters-to-prevent-digest-performance-issues/).

<iframe src="https://embed.plnkr.co/sjy4sdEhkJN59CBNXmFB/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

## Angular 2

For Angular 2, we'll be using the same `ordinal` pipe and demonstrating how to create it. The Angular 2 API isn't as straightforward as Angular 1.x (where we just returned a function that acts as a functional filter). With Angular 2, we need a `class` and sprinkle some decorators, so let's get started!

### Creating a custom pipe

To get setup, we need to import `Pipe` and `PipeTransform` from the Angular 2 core:

{% highlight javascript %}
import { Pipe, PipeTransform } from '@angular/core';
{% endhighlight %}

Next, we need to export and decorator our `class` with the right metadata and also use `implements PipeTransform`:

{% highlight javascript %}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordinal'
})
export class OrdinalPipe implements PipeTransform {

}
{% endhighlight %}

The next step is implementing a method named `transform`, of which is required to create custom Angular 2 pipes. In our case, we are expecting a `number` being passed in and a `string` as the return value:

{% highlight javascript %}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordinal'
})
export class OrdinalPipe implements PipeTransform {
  transform(value: number): string {
    let suffix = '';
    let last = value % 10;
    let specialLast = value % 100;
    if (!value || value < 1) {
      return value;
    }
    if (last === 1 && specialLast !== 11) {
      suffix = 'st';
    } else if (last === 2 && specialLast !== 12) {
      suffix = 'nd';
    } else if (last === 3 && specialLast !== 13) {
      suffix = 'rd';
    } else {
      suffix = 'th';
    }
    return value + suffix;
  }
}
{% endhighlight %}

And that's the Angular 2 equivalent of creating a filter, so let's go implement it inside our component.

### Using pipes in templates

To use our pipe, we can create a component, add our `OrdinalPipe` import to the `@NgModule` inside the `declarations` Array, and we're good to go.

{% highlight javascript %}
import {Component, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {OrdinalPipe} from './ordinal.pipe';

@Component({
  selector: 'my-app',
  template: `
    <div>
      <ul>
        <li *ngFor="let num of numbers">
          {% raw %}{{ num | ordinal }}{% endraw %}
        </li>
      </ul>
    </div>
  `,
})
export class App {
  constructor() {
    this.numbers = [
      1,2,3,4,5,6,7,8,9,10,
      11,12,13,14,15,16,17,18,19,20
    ];
  }
}

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ App, OrdinalPipe ],
  bootstrap: [ App ]
})
export class AppModule {}
{% endhighlight %}

And the live demo:

<iframe src="https://embed.plnkr.co/lf52FfYL6YtAsMd2OCBD/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

We'll save `@NgModule` and other fun stuff above for another guide. Onto the function arguments in custom pipes!

### Passing arguments to pipes

Passing arguments is pretty much the same in Angular 2:

{% highlight javascript %}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordinal'
})
export class OrdinalPipe implements PipeTransform {
  // passing another argument
  transform(value: number, anotherValue: string): string {
    // do something with `value` and `anotherValue`
    // and return a new value
  }
}
{% endhighlight %}

### Filtering in Component classes with pipes

Just like with Angular 1.x when using `$filter()` inside the `controller`, we can do something similar with Angular 2 pipes. First, we need to tell the component that it has a `provider`:

{% highlight javascript %}
...
import {OrdinalPipe} from './ordinal.pipe';
@Component({
  selector: 'my-app',
  template: `
    ...
  `,
  providers: [OrdinalPipe]
})
...
{% endhighlight %}

Then we can use dependency injection to inject the `OrdinalPipe` into the `constructor`, which makes it available privately as `this.pipe`, where we can call `this.pipe.transform()`:

{% highlight javascript %}
export class App {
  constructor(private pipe: OrdinalPipe) {
    let numbers = [
      1,2,3,4,5,6,7,8,9,10,
      11,12,13,14,15,16,17,18,19,20
    ];
    this.numbers = numbers.map(number => this.pipe.transform(number));
  }
}
{% endhighlight %}

<iframe src="https://embed.plnkr.co/Nr9Zx7vGOql4FkatoKYf/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>
