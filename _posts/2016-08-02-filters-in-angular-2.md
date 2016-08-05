---
layout: post
permalink: /angular-2-filters
title: Using Pipes In Angular 2
author: burkeholland
path: 2016-08-02-pipes-in-angular-2.md
tags: filters
version: 2.0.0-rc.4
intro: In this guide you'll learn how to use the new pipes functionality in Angular 2 that replaces filters from Angular 1.
---

Filters allow a developer to transform or format an item or collection of items in a view without having to actually alter the format or value of the unerlying bound item(s) themselves. An example of this would be formatting date values so that they appear in a certain format when rendered, but are stored in a different format in the application code. 

Angular 2 has the same filter functionality as Angular 1, and it's now referred to as "Pipes". In this guide, we'll review how to use the built-in filters in Angular 1, and which of those same filters are available as pipes in Angular 2.

## Table of contents

<div class="contents" markdown="1">
* [Angular 1.x](#angular-1x)
    * [Using built-in filters](#using-built-in-filters)
    * [OrderBy and Filter](#orderby-and-filter)
    * [Final 1.x Code](#final-1x-code)
* [Angular 2](#angular-2)
  * [OrderBy and Filter pipes](#orderby-and-filter-pipes)
  * [Final 2 code](#final-2-code)
</div> 

## Angular 1.x

In Angular 1.x, we can create a filter by using the `|` character when we want to transform a particular value in a template. 

Filters in Angular 1 are defined simply by putting a `|` on the end of a bound expression or a looping construct - usually `ng-repeat`. That character - the `|` - is called a "pipe", hence the new name "Pipe" in Angular 2. 

For example, suppose we have a list of groceries, and we want to display each grocery on the page. You might imagine that the controller would look something like this...

{% highlight javascript %}
const app = {
  template: `
    <div>
      Grocery selected: {{ $ctrl.selectedGrocery.label }}
      <ul>
        <li ng-repeat="grocery in $ctrl.groceries">
          {% raw %}{{ grocery.label }}{% endraw %}
        </li>
      </ul>
    </div>
  `,
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
{% endhighlight %}

### Using Built-In Filters

Application requirements might dictate that we display each item in all caps. To do this, we can use the built-in `uppercase` filter in Angular by using the pipe character where we display the grocery label.

{% highlight javascript %}
const app = {
  template: `
    <div>
      Grocery selected: {{ $ctrl.selectedGrocery.label }}
      <ul>
        <li ng-repeat="grocery in $ctrl.groceries">
          {% raw %}{{ grocery.label | uppercase }}{% endraw %}
        </li>
      </ul>
    </div>
  `,
  controller() {
    ...
  }
};
{% endhighlight %}

### OrderBy And Filter

It is also possible to assign filters at the collection level. One of the most powerful filters in Angular 1.x is the `orderBy` filter. Suppose we wanted to show these groceries in alphabetical order. Instead of changing the order of the underlying groceries array, we can just use a filter...

{% highlight javascript %}
const app = {
  template: `
    <div>
      Grocery selected: {%raw }{{ $ctrl.selectedGrocery.label }}{% endraw }
      <ul>
        <li ng-repeat="grocery in $ctrl.groceries | orderBy: 'label'">
          <a href="" ng-click="$ctrl.selectGrocery(grocery);">
            {%raw }{{ grocery.label | uppercase }}{% end raw }
          </a>
        </li>
      </ul>
    </div>
  `,
  controller() {
    ...
  }
};
{% endhighlight %}

Model-bound values - such as collections, can also be filtered in Angular 1.x using, well, Filters. This is another extremely useful feature in Angular 1. In the above example, we might want to filter the list while a user types in a filter box. Angular allows us to pass a model value to the filter which automatically gets applied to the collection.

const app = {
  template: `
    <div>
      Filter Groceries: <input ng-model="$ctrl.searchText">
      <ul>
        <li ng-repeat="grocery in $ctrl.groceries | orderBy: 'label' | filter: $ctrl.searchText">
          {{ grocery.label | uppercase }}
        </li>
      </ul>
    </div>
  `,
  controller() {
    ...
  }
};

angular
  .module('app')
  .component('app', app);

Notice in the above example that multiple filters can be chained together using pipes. Pretty nifty, right? We're just scratching the surface of filters here, but if you've used  Angular 1.x, it's likely that you are already aware of the importance of filters in Angular applications. Filters are incredibly powerful and a good understanding of how to use them will exponentially increase your ability to effectively use Angular in your apps.

### Final 1.x code

<iframe src="https://embed.plnkr.co/2vjOoxbaTiJ2FXpm0jrA/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

## Angular 2

As mentioned earlier, **filters are now known as pipes**. They are very similar to how filters in Angular 1.x worked, with some serious caveats that we'll discuss here shortly. Angular 2 has built-in pipes just like the built-in filters in Angular 1. For instance, our uppercase filter from the previous example "just works" in Angular 2.

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
      <ul>
        <li *ngFor="let grocery of groceries">
          {{ grocery.label | uppercase }}
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
  }
}
{% endhighlight %}

### OrderBy And Filter Pipes

Unfortunately, the big caveat with pipes is that they do not include some of the built-in filters that were available before in Angular 1. Specifically, there is no built-in `orderBy` or `filter` pipe in Angular 2. That's too bad because I just used both of those in the previous example.

The reason why these constructs are missing in Angular 2 is [explained in the documentation](https://angular.io/docs/ts/latest/guide/pipes.html#!#no-filter-pipe). Basically, the performance of these filters is not good, and it is now recommended that you do that sort of thing in the component itself, or create a custom pipe. Other articles on this site will get into custom pipes, so for now let's look at how to migrate those missing `orderBy` and `filter` pipes into the component so we still have the same functionality.

First, instead of a looping over the actual array, we can loop over a copy that we can manipulate without actually altering the contents of the original collection. We could do that one of two ways: 1) Loop over a function that returns a sorted array or 2) Use a property getter which returns a ordered and filtered copy. The latter is possible only because we are using TypeScript which supports [property accessors](https://www.typescriptlang.org/docs/handbook/classes.html). Since TypeScript offers us that nicety, we'll use it here in this example.

{% highlight javascript %}
@Component({
  selector: 'my-app',
  template: `
    <div>
     Search Term: <input type="text" [(ngModel)]="searchTerm">
      <ul>
        <li *ngFor="let grocery of orderedGroceries">
          {{ grocery.label | uppercase }}
        </li>
      </ul>
    </div>
  `
})
export default class App {
  searchTerm: string = "";
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
  }
  
  get orderedGroceries {
    var filtered = this.groceries.filter((grocery) => { 
      if (this.searchTerm && this.searchTerm.length > 0) {      
        return grocery.label.toUpperCase().indexOf(this.searchTerm.toUpperCase(), 0) > -1;
      }
      else {
        return true;
      }
    });
    
    return filtered.sort((a, b) => {
      var textA = a.label.toUpperCase();
      var textB = b.label.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;  
    });
  } 
}
{% endhighlight %}

A few items of note in the above code snippet...

* We use the `[(ngModel)]` syntax so that typing updates the filtered collection. The `[]` dictates a "model-to-view" binding, and the `()` dictates a "view-to-model" binding. In this case, we're simply using both to say we want a two-way bind.
* We use arrow functions in the `orderedGroceries` accessor to ensure that `this` always references the main `App` class.
* We make the filter and order case insensitive by always comparing uppercase.
* We filter and then sort. Note that this might not be the most efficient when iterating over large collections.

### Final 2 code

<iframe src="https://embed.plnkr.co/JTl8lhXMZagTFFZ4dBPe/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

This sort of logic really needs to be wrapped up in a custom Pipe so that it can be re-used across other pages and applications. In the next article on filters, we'll look at how to create a custom filter in Angular 1, and then how to do that exact same thing in Angular 2. Make sure you drop your email address in below so you'll know when new tutorials are available.
