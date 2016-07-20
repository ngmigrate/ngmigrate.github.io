---
layout: post
permalink: /from-ng-repeat-to-ng-for
title: From ng-repeat to ngFor
author: toddmotto
path: 2016-07-18-from-ng-repeat-to-ng-for.md
tags: directives
version: 2.0.0-rc.4
intro: In this guide you'll learn how to use ngFor, the Angular 2 equivalent for ng-repeat.
---

The `ng-repeat` Directive in Angular 1.x allows us to iterate over a collection of data and print out DOM nodes that respond to that data. If the data changes, the DOM changes as well. In this guide we'll be converting an Angular 1.x `ng-repeat` Directive across to Angular 2's `ngFor` Directive.

## Table of contents

<div class="contents" markdown="1">
* [Angular 1.x](#angular-1x)
  * [Using ng-repeat](#using-ng-repeat)
  * [Using $index and track by](#using-index-and-track-by)
  * [Final 1.x code](#final-1x-code)
* [Angular 2](#angular-2)
  * [Using ngFor](#using-ngfor)
  * [Using index and trackBy](#using-index-and-trackby)
  * [Final 2 code](#final-2-code)
</div>

## Angular 1.x

In Angular 1.x, using `ng-repeat` is pretty simple, we pass the Directive some data and it automagically renders out for us, let's take a look!

### Using ng-repeat

Before we can get the `ng-repeat` Directive working, we need some data inside a `controller` bound to the `component`:

{% highlight javascript %}
const app = {
  controller() {
    this.groceries = [{
      id: 0, label: 'Butter'
    },{
      id: 1, label: 'Apples'
    },{
      id: 2, label: 'Paprika'
    },{
      id: 3, label: 'Potatoes'
    },{
      id: 4, label: 'Oatmeal'
    },{
      id: 5, label: 'Spaghetti'
    },{
      id: 6, label: 'Pears'
    },{
      id: 7, label: 'Bacon'
    }];
  }
};

angular
  .module('app')
  .component('app', app);
{% endhighlight %}

Next up we can create some methods to the `controller` and assign the `template` with an unordered list to make way for our `ng-repeat` and upcoming click functions:

{% highlight javascript %}
const app = {
  template: `
    <div>
      Grocery selected: {{ $ctrl.selectedGrocery.label }}
      <ul>
        <li>
          <a href=""></a>
        </li>
      </ul>
    </div>
  `,
  controller() {
    this.groceries = [{...}];
    this.selectGrocery = (grocery) => {
      this.selectedGrocery = grocery;
    };
    this.selectGrocery(this.groceries[0]);
  }
};
{% endhighlight %}

Then, we need to assign `ng-repeat` to the `<li>` which serves as the template to be cloned for each item in the dataset, followed by an `ng-click` to pass each `grocery` into the `selectGrocery` method:

{% highlight javascript %}
const app = {
  template: `
    <div>
      Grocery selected: {% raw %}{{ $ctrl.selectedGrocery.label }}{% endraw %}
      <ul>
        <li ng-repeat="grocery in $ctrl.groceries">
          <a href="" ng-click="$ctrl.selectGrocery(grocery);">
            {% raw %}{{ grocery.label }}{% endraw %}
          </a>
        </li>
      </ul>
    </div>
  `,
  ...
};
{% endhighlight %}

That's it for rendering with `ng-repeat`, let's take a look at `$index` and the `track by` expression.

### Using $index and track by

The `$index` property is automatically provided to us on each `ng-repeat`'s `$scope` Object, we can print out each index for the collection with ease:

{% highlight javascript %}
const app = {
  template: `
    ...
        <li ng-repeat="grocery in $ctrl.groceries">
          <a href="" ng-click="$ctrl.selectGrocery(grocery);">
            {% raw %}{{ grocery.label }}{% endraw %} {% raw %}{{ $index }}{% endraw %}
          </a>
        </li>
    ...
  `,
  ...
};
{% endhighlight %}

If you've noted already, each Object inside the `this.groceries` Array has an `id` property, which in this case indicates that these are unique properties sent back from the server. These unique keys allow us to use the `track by` clause inside an `ng-repeat` to prevent Angular re-rendering an entire collection. What it does instead is cleverly only re-render the DOM nodes that require rendering again, rather than destroying and recreating the DOM tree each time. It's simple to use and works as an extension to `ng-repeat`'s value:

{% highlight javascript %}
const app = {
  template: `
    ...
        <li ng-repeat="grocery in $ctrl.groceries track by grocery.id">
          <a href="" ng-click="$ctrl.selectGrocery(grocery);">
            {% raw %}{{ grocery.label }}{% endraw %} {% raw %}{{ $index }}{% endraw %}
          </a>
        </li>
    ...
  `,
  ...
};
{% endhighlight %}

So you can see here that we've added `track by grocery.id` at the end of the repeat syntax. We can also use `track by $index` as well. The `ng-repeat` Directive also exposes `$first`, `$middle`, `$last`, `$even` and `$odd` properties, [see the documentation](https://docs.angularjs.org/api/ng/directive/ngRepeat) for more.

You can also pass in a tracking function:

{% highlight javascript %}
const app = {
  template: `
    ...
        <li ng-repeat="grocery in $ctrl.groceries track by trackByGrocery(grocery)">
          <a href="" ng-click="$ctrl.selectGrocery(grocery);">
            {% raw %}{{ grocery.label }}{% endraw %} {% raw %}{{ $index }}{% endraw %}
          </a>
        </li>
    ...
  `,
  ...
};
{% endhighlight %}

### Final 1.x code

<iframe src="https://embed.plnkr.co/3PwShL15MWfWvTziuYeS/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

## Angular 2

The Angular 2 implementation of the `ng-repeat` is called `ngFor`, purposely in camelCase. The syntax is pretty similar whereby we can iterate over a collection. Angular 2 uses `of` instead of `in` with `ngFor` to align with the [ES2015 `for...of` loop](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/for...of).

### Using ngFor

Assuming we use the same data as in the Angular 1.x example, we can declare `this.groceries` in the class constructor:

{% highlight javascript %}
interface Grocery {
  id: number;
  label: string;
}

export default class App {
  public groceries: Grocery[];
  constructor() {
    this.groceries = [{
      id: 0, label: 'Butter'
    },{
      id: 1, label: 'Apples'
    },{
      id: 2, label: 'Paprika'
    },{
      id: 3, label: 'Potatoes'
    },{
      id: 4, label: 'Oatmeal'
    },{
      id: 5, label: 'Spaghetti'
    },{
      id: 6, label: 'Pears'
    },{
      id: 7, label: 'Bacon'
    }];
    this.selectGrocery(this.groceries[0]);
  }
  selectGrocery(grocery: Grocery) {
    this.selectedGrocery = grocery;
  }
}
{% endhighlight %}

Then bind `ngFor` as follows, declaring block scoping with `let`:

{% highlight javascript %}
@Component({
  selector: 'my-app',
  template: `
    <div>
      Grocery selected: {{ selectedGrocery.label }}
      <ul>
        <li *ngFor="let grocery of groceries;">
          <a href="#" (click)="selectGrocery(grocery);">
            {% raw %}{{ grocery.label }}{% endraw %}
          </a>
        </li>
      </ul>
    </div>
  `
})
export default class App {...}
{% endhighlight %}

Nice and easy. What is the leading `*` infront of `*ngFor` you might ask? Check out [this section](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#-and-lt-template-gt-) of the documentation for more details, it's essentially sugar syntax for using `<template>` elements.

### Using index and trackBy

Instead of `$index` (in Angular 1.x) being readily available in the template, we need to actually assign it a variable before we use it:

{% highlight javascript %}
@Component({
  selector: 'my-app',
  template: `
    <div>
      Grocery selected: {{ selectedGrocery.label }}
      <ul>
        <li *ngFor="let grocery of groceries; let i = index;">
          <a href="#" (click)="selectGrocery(grocery);">
            {% raw %}{{ grocery.label }}{% endraw %} {% raw %}{{ i }}{% endraw %}
          </a>
        </li>
      </ul>
    </div>
  `
})
export default class App {...}
{% endhighlight %}

There's a change from Angular 1.x where by using an Object form with `track by X` is no longer allowed, it must be a function, so we'll add `trackByGrocery` to the `App` class (arguments are automatically provided):

{% highlight javascript %}
@Component({
  selector: 'my-app',
  template: `
    <div>
      Grocery selected: {{ selectedGrocery.label }}
      <ul>
        <li *ngFor="let grocery of groceries; let i = index; trackBy: trackByGrocery;">
          <a href="#" (click)="selectGrocery(grocery);">
            {% raw %}{{ grocery.label }}{% endraw %} {% raw %}{{ i }}{% endraw %}
          </a>
        </li>
      </ul>
    </div>
  `
})
export default class App {
  ...
  trackByGrocery: (index: number, grocery: Grocery): number => grocery.id;
  ...
}
{% endhighlight %}

Altogether now:

{% highlight javascript %}
import {Component} from '@angular/core';

interface Grocery {
  id: number;
  label: string;
}

@Component({
  selector: 'my-app',
  template: `
    <div>
      Grocery selected: {{ selectedGrocery.label }}
      <ul>
        <li *ngFor="let grocery of groceries; let i = index; trackBy: trackByGrocery;">
          <a href="#" (click)="selectGrocery(grocery);">
            {% raw %}{{ grocery.label }}{% endraw %} {% raw %}{{ i }}{% endraw %}
          </a>
        </li>
      </ul>
    </div>
  `
})
export default class App {
  public groceries: Grocery[];
  constructor() {
    this.groceries = [{
      id: 0, label: 'Butter'
    },{
      id: 1, label: 'Apples'
    },{
      id: 2, label: 'Paprika'
    },{
      id: 3, label: 'Potatoes'
    },{
      id: 4, label: 'Oatmeal'
    },{
      id: 5, label: 'Spaghetti'
    },{
      id: 6, label: 'Pears'
    },{
      id: 7, label: 'Bacon'
    }];
    this.selectGrocery(this.groceries[0]);
  }
  selectGrocery(grocery: Grocery) {
    this.selectedGrocery = grocery;
  }
  trackByGrocery: (index: number, grocery: Grocery): number => grocery.id;
}
{% endhighlight %}

### Final 2 code

<iframe src="https://embed.plnkr.co/rMdwdFk5mdBlcX6BK92j/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>
