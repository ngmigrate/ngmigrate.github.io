---
layout: post
permalink: /from-ng-switch-to-ngSwitch
title: From ng-switch to ngSwitch
author: toddmotto
path: 2016-10-28-from-ng-switch-to-ngSwitch.md
tags: directives
version: 2.0.0
intro: In this guide you'll learn how to use ngSwitch, the Angular 2 equivalent for ng-switch.
---

The `ng-switch` directive in Angular 1.x allows us to dynamically control what DOM element is visible based on some pre-defined condition. When the value being evaluated changes, we are essentially switching what DOM element we want to make visible. In this guide we'll be converting an Angular 1.x `ng-switch` directive into Angular 2's `ngSwitch` directive.

## Table of contents

<div class="contents" markdown="1">
* [Angular 1.x](#angular-1x)
  * [Using ng-switch](#using-ng-switch)
  * [Final 1.x code](#final-1x-code)
* [Angular 2](#angular-2)
  * [Using ngSwitch](#using-ngswitch)
  * [Expanding ngSwitch](#expanding-ngswitch)
  * [Final 2 code](#final-2-code)
</div>

## Angular 1.x

In Angular 1.x, we will use `ng-switch` to dynamically toggle between layouts based on our selection. It works very much like a common `switch` statement in programming and so let's get started!

### Using ng-switch

Before we can use the `ng-switch` directive in our template, we need to first set up our controller with the correct properties and methods. We have a `currentView` property to keep track of our current view and a `setCurrentView` method to set the current view. We also have a `turtles` collection that we will use within our `ng-switch` statement to render a list of turtles.

{% highlight javascript %}
const switchApp = {
  bindings: {},
  templateUrl: 'app.component.html',
  controller: class AppComponentCtrl {
    constructor($window) {
      this.$window = $window;
    }
    $onInit() {
      this.currentView;
      this.turtles = [
        {name: 'Michelangelo',  link: '...', thumb: '...', description: '...'},
        {name: 'Donatello',     link: '...', thumb: '...', description: '...'},
        {name: 'Leonardo',      link: '...', thumb: '...', description: '...'},
        {name: 'Raphael',       link: '...', thumb: '...', description: '...'}
      ];
    }
    setCurrentView(view) {
      this.currentView = view;
    }
    navigate(url) {
      $window.open(url);
    }
  }
}

angular
  .module('switchApp')
  .component('switchApp', switchApp);
{% endhighlight %}

With our foundation in place, let's check out how we will set the current view within our template. We have a toolbar with three buttons that when clicked, call `$ctrl.setCurrentView` with the view that the user wants to see. The user can select between a list view, a dense list view or a grid view which will cause the collection to be rendered differently for each selection.

{% highlight html %}
<md-toolbar class="md-whiteframe-3dp">
  <div class="md-toolbar-tools">
    The Turtles
    <span class="toolbar-spacer"></span>
    <md-button ng-click="$ctrl.setCurrentView('list')" class="md-accent">LIST</md-button>
    <md-button ng-click="$ctrl.setCurrentView('dense')" class="md-accent">DENSE LIST</md-button>
    <md-button ng-click="$ctrl.setCurrentView('grid')" class="md-accent">GRID</md-button>
  </div>
</md-toolbar>
{% endhighlight %}

And this is where we introduce the `ng-switch` directive into our template. We want to switch the visibility of our DOM elements based on the value of `$ctrl.currentView` and so we will create a `div` element and add `ng-switch="$ctrl.currentView"` to it. There are two sub-directives when using `ng-switch` and those are `ng-switch-when` and `ng-switch-default`. We have also added three containers to hold our layout variations and added the `ng-switch-when` directive to each one with the criteria for when it should be shown. For instance, when the user clicks the `GRID` button, it will set `$ctrl.currentView` to `grid` which will in turn, active the `ng-switch-when="grid"` directive.  


{% highlight html %}
<div ng-switch="$ctrl.currentView">

  <md-list ng-switch-when="list">
    <!-- LIST MARKUP -->
  </md-list>

  <md-list ng-switch-when="dense" class="md-dense">
    <!-- DENSE MARKUP -->
  </md-list>

  <md-grid-list ng-switch-when="grid" md-cols="2" md-row-height="2:2">
    <!-- GRID MARKUP -->
  </md-grid-list>

  <h3 ng-switch-default>Please select a layout above</h3>

</div>
{% endhighlight %}

We also are using `ng-switch-default` to display a default element when no criteria is met within the preceding `ng-switch-when` directives.

For demonstration purposes, you can see the entirety of the template below.

{% highlight html %}
<md-toolbar class="md-whiteframe-3dp">
  <div class="md-toolbar-tools">
    The Turtles
    <span class="toolbar-spacer"></span>
    <md-button ng-click="$ctrl.setCurrentView('list')" class="md-accent">LIST</md-button>
    <md-button ng-click="$ctrl.setCurrentView('dense')" class="md-accent">DENSE LIST</md-button>
    <md-button ng-click="$ctrl.setCurrentView('grid')" class="md-accent">GRID</md-button>
  </div>
</md-toolbar>

<div class="container">
  <div ng-switch="$ctrl.currentView">
    <md-list ng-switch-when="list">
      <div ng-repeat="turtle in $ctrl.turtles">
        <md-list-item class="md-2-line" ng-href="{% raw %}{{turtle.link}}{% endraw %}" target="_blank">
          <img class="md-avatar" ng-src="{% raw %}{{turtle.thumb}}{% endraw %}" alt="{% raw %}{{turtle.name}}{% endraw %}">
          <div class="md-list-item-text" layout="column">
            <h3>{% raw %}{{turtle.name}}{% endraw %}</h3>
            <p>{% raw %}{{turtle.description}}{% endraw %}</p>
          </div>
        </md-list-item>
        <md-divider></md-divider>
      </div>
    </md-list>

    <md-list ng-switch-when="dense" class="md-dense" >
      <div ng-repeat="turtle in $ctrl.turtles">
        <md-list-item class="md-2-line" ng-href="{% raw %}{{turtle.link}}{% endraw %}" target="_blank">
          <img class="md-avatar" ng-src="{% raw %}{{turtle.thumb}}{% endraw %}" alt="{% raw %}{{turtle.name}}{% endraw %}">
          <div class="md-list-item-text">
            <h3>{% raw %}{{turtle.name}}{% endraw %}</h3>
            <p>{% raw %}{{turtle.description}}{% endraw %}</p>
          </div>
        </md-list-item>
        <md-divider></md-divider>
      </div>
    </md-list>

    <md-grid-list ng-switch-when="grid" md-cols="2" md-row-height="2:2" >
      <md-grid-tile ng-click="$ctrl.navigate(turtle.link)" ng-href="{% raw %}{{turtle.link}}{% endraw %}" target="_blank" ng-style="{'background': 'url(' + turtle.thumb + ')'}" ng-repeat="turtle in $ctrl.turtles">
       <span class="description">{% raw %}{{turtle.description}}{% endraw %}</span>
       <md-grid-tile-footer>
         <h3 class="name">{% raw %}{{turtle.name}}{% endraw %}</h3>
       </md-grid-tile-footer>
      </md-grid-tile>
    </md-grid-list>

    <h3 ng-switch-default>Please select a layout above</h3>
  </div>
</div>
{% endhighlight %}

### Final 1.x code

<iframe src="https://embed.plnkr.co/Q6r4yDCziffKG4BinrlC/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

## Angular 2

The Angular 2 implementation of the `ng-switch` is called `ngSwitch`, purposely in camelCase. The implementation is almost exactly the same with a few variations in naming conventions.

### Using ngSwitch

As in the Angular 1.x version, we need to set up our component class to satisfy our template. We have a `currentView` property to keep track of our current view and a `setCurrentView` method to set the `currentView` property. We also have a `turtles` collection for use within the `ngSwitch` blocks.

{% highlight javascript %}
@Component({
  selector: 'switch-app',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  currentView: string;
  turtles: Turtle[] = [
    {name: 'Michelangelo',  link: '...', thumb: '...', description: '...'},
    {name: 'Donatello',     link: '...', thumb: '...', description: '...'},
    {name: 'Leonardo',      link: '...', thumb: '...', description: '...'},
    {name: 'Raphael',       link: '...', thumb: '...', description: '...'}
  ];

  setCurrentView(view) {
    this.currentView = view;
  }
}
{% endhighlight %}

Within our toolbar, we have three buttons that capture the `click` event and calls `setCurrentView` with the appropriate view the user has selected.

{% highlight html %}
<md-toolbar class="md-elevation-z3">
  The Turtles
  <span class="toolbar-spacer"></span>
  <button (click)="setCurrentView('list')" md-button color="accent">LIST</button>
  <button (click)="setCurrentView('dense')" md-button color="accent">DENSE LIST</button>
  <button (click)="setCurrentView('grid')" md-button color="accent">GRID</button>
</md-toolbar>
{% endhighlight %}

And this is where things get interesting. Because of the new binding syntax in Angular 2, we need to bind the value of `currentView` to the `ngSwitch` directive using attribute binding as seen here `[ngSwitch]="currentView"`. The naming convention has changed from `ng-switch-when` to `ngSwitchCase` and pay close to attention to the fact that we are evaluating this as a string. You will also notice that we are using a `*` within our template, which we will explain in the next section.

{% highlight html %}
<div [ngSwitch]="currentView">
  <md-nav-list *ngSwitchCase="'list'">
    <!-- LIST MARKUP -->
  </md-nav-list>

  <md-nav-list *ngSwitchCase="'dense'" dense>
    <!-- DENSE MARKUP -->
  </md-nav-list>

  <md-grid-list *ngSwitchCase="'grid'" cols="2">
    <!-- GRID MARKUP -->
  </md-grid-list>

  <h3 *ngSwitchDefault>Please select a layout above</h3>
</div>
{% endhighlight %}

We also have the ability to display a default element if no criteria is met using the `ngSwitchDefault` directive.

For reference, here is the template in its entirety.    

{% highlight html %}
<md-toolbar class="md-elevation-z3">
  The Turtles
  <span class="toolbar-spacer"></span>
  <button (click)="setCurrentView('list')" md-button color="accent">LIST</button>
  <button (click)="setCurrentView('dense')" md-button color="accent">DENSE LIST</button>
  <button (click)="setCurrentView('grid')" md-button color="accent">GRID</button>
</md-toolbar>

<div style="padding: 10px">
  <div [ngSwitch]="currentView">
    <md-nav-list *ngSwitchCase="'list'">
      <div *ngFor="let turtle of turtles">
        <a md-list-item [href]="turtle.link" target="_blank">
          <img md-list-avatar [src]="turtle.thumb" alt="...">
          <h3 md-line> {% raw %}{{turtle.name}}{% endraw %} </h3>
          <p md-line>
            <span> {% raw %}{{turtle.description}}{% endraw %} </span>
          </p>
        </a>
        <md-divider></md-divider>
      </div>
    </md-nav-list>

    <md-nav-list *ngSwitchCase="'dense'" dense>
      <div *ngFor="let turtle of turtles">
        <a md-list-item [href]="turtle.link" target="_blank">
          <img md-list-avatar [src]="turtle.thumb" alt="...">
          <h3 md-line> {% raw %}{{turtle.name}}{% endraw %} </h3>
          <p md-line>
            <span> {% raw %}{{turtle.description}}{% endraw %} </span>
          </p>
        </a>
        <md-divider></md-divider>
      </div>
    </md-nav-list>

    <md-grid-list *ngSwitchCase="'grid'" cols="2" >
       <a [href]="turtle.link" target="_blank" *ngFor="let turtle of turtles">
         <md-grid-tile [style.background]="'url(' + turtle.thumb + ')'">
             <span class="name">{% raw %}{{turtle.name}}{% endraw %}</span>
             <span class="description">{% raw %}{{turtle.description}}{% endraw %}</span>
         </md-grid-tile>
       </a>
    </md-grid-list>

    <h3 *ngSwitchDefault>Please select a layout above</h3>
  </div>
</div>
{% endhighlight %}

### Expanding ngSwitch

Angular 2 uses the `*` operator as a convenience operator to abstract how templates are compiled under the hood. Built-in directives that perform DOM manipulation implicitly use the `template` tag to insert elements. Because this is a bit more verbose, the `*` operator was introduced as syntactic sugar to save time and space. There is nothing that is keeping us from using the expanded syntax and in fact, it would look something like this.

{% highlight html %}
<div [ngSwitch]="currentView">
  <template [ngSwitchCase]="'list'">
    <md-nav-list>
      <!-- LIST MARKUP -->
    </md-nav-list>
  </template>

  <template [ngSwitchCase]="'dense'">
    <md-nav-list dense>
      <!-- DENSE MARKUP -->
    </md-nav-list>
  </template>

  <template [ngSwitchCase]="'grid'">
    <md-grid-list cols="2">
      <!-- GRID MARKUP -->
    </md-grid-list>
  </template>

  <template ngSwitchDefault>
    <h3>Please select a layout above</h3>
  </template>
</div>
{% endhighlight %}

This is what gets generated by the Angular 2 compiler at runtime but thanks to the `*` operator, the burden of having to write this out is alleviated.

### Final 2 code

<iframe src="https://embed.plnkr.co/1jHqFbcTtsZl5kPVVIqK/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>
