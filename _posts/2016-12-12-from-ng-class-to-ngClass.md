---
layout: post
permalink: /from-ng-class-to-ngClass
title: From ng-class to ngClass
author: juristr
path: 2016-12-12-from-ng-class-to-ngClass.md
tags: directives
version: 2.0.0
intro: In this guide you'll learn how to use ngClass, the Angular 2 equivalent for ng-class.
---

The `ng-class` directive in Angular 1.x allows you to dynamically add CSS classes based on a configuration object. This is a special key-value object, where the "key" is the CSS class and the "value" the corresponding boolean condition, determining whether the CSS class should be applied or not. In this guide we will convert an Angular 1.x `ng-class` directive into Angular 2's `ngClass` directive.

## Table of contents

<div class="contents" markdown="1">
* [Angular 1.x](#angular-1x)
  * [Using ng-class](#using-ng-class)
  * [ng-class variations: passing a string or array of strings](#ng-class-variations-passing-a-string-or-array-of-strings)
  * [Final 1.x code](#final-1x-code)
* [Angular 2](#angular-2)
  * [Using ngClass](#using-ngclass)
  * [Binding single CSS classes](#binding-single-css-classes)
  * [Final 2 code](#final-2-code)
</div>

## Angular 1.x

In Angular 1.x we use the `ng-class` to dynamically add CSS classes based on some user-defined settings.

### Using ng-class

To use the `ng-class` directive, let's first set up our component controller with a couple of properties. Moreover, within our template, we use a some checkboxes to dynamically toggle the values of these properties.

{% highlight javascript %}
const AppComponent = {
  template: `
    <div>
      <label><input type="checkbox" ng-model="$ctrl.isStrike"> Strike</label>
      <label><input type="checkbox" ng-model="$ctrl.isBold"> Bold</label>
      <label><input type="checkbox" ng-model="$ctrl.isHighlight"> Highlight</label>
    </div>
  `,
  controller: class AppComponent {
    isStrike = false;
    isBold = false;
    isHighlight = false;
  }
};
{% endhighlight %}

For each of them we define a corresponding CSS class in our `style.css` file which we load in our app.

{% highlight css %}
.bold {
  font-weight: bold;
}

.highlight {
  background-color: yellow;
}

.strike {
  text-decoration: line-through;
}
{% endhighlight %}

Finally, we add a `<div>` block at the very top of our component's template to which we want to add or remove a CSS class, depending on the value of our three properties. This is where `ng-class` comes into play. We can pass it a configuration object that has the following structure:

{% highlight javascript %}
{
  'css-class-name': booleanValue
}
{% endhighlight %}

Whenever `booleanValue` is equal to `true`, `css-class-name` gets applied to the corresponding DOM element, otherwise it will be removed. In our specific example this translates to the following code:

{% highlight html %}
<div ng-class="{ bold: $ctrl.isBold, strike: $ctrl.isStrike, highlight: $ctrl.isHighlight }">
  Hello, NgMigrate!
</div>
{% endhighlight %}

If `$ctrl.isBold` evaluates to `true`, the CSS class `bold` would be added to the `<div>`.

### ng-class variations: passing a string or array of strings

While the previous approach is the most used and also preferred one, `ng-class` also allows us to pass in a single string value, which directly represents the CSS class to be applied to our element:

{% highlight javascript %}
const AppComponent = {
  template: `
    <h1>ng-class Demo</h1>
    <div ng-class="$ctrl.style">
      Hello, NgMigrate!
    </div>
  `,
  controller: class AppComponent {
    style = 'bold';
  }
};
{% endhighlight %}

Alternatively, we can even pass in an array of CSS classes:

{% highlight javascript %}
const AppComponent = {
  template: `
    <h1>ng-class Demo</h1>
    <div ng-class="[$ctrl.styleBold, $ctrl.styleHighlighted]">
      Hello, NgMigrate!
    </div>
  `,
  controller: class AppComponent {
    styleBold = 'bold';
    styleHighlighted = 'highlight';
  }
};
{% endhighlight %}

### Final 1.x code

<iframe src="https://embed.plnkr.co/v6G4aCY01hzbAxHpMoBB/?show=src/app,preview&deferRun" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="450"></iframe>

## Angular 2

Translating the `ng-class` directive into Angular 2 is actually quite straightforward. It is called `ngClass`, purposely using the camel casing, as all of Angular 2's directives do. The implementation is almost exactly equivalent, with a few variations though.

### Using ngClass

We have a component with the same properties as we used in our Angular 1 example:

{% highlight javascript %}
@Component({})
export class App {
  isStrike = false;
  isBold = false;
  isHighlight = false;
}
{% endhighlight %}

Also, we again use some checkboxes to set the values of our properties. Just as in Angular 1, we use Angular 2's corresponding `ngModel` to establish a data binding between the HTML controls and our properties. Note that we have to import the `FormsModule` for doing so.

{% highlight javascript %}
import { NgModule, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'my-app',
  template: `
    <div>
      <label><input type="checkbox" [(ngModel)]="isStrike"> Strike</label>
      <label><input type="checkbox" [(ngModel)]="isBold"> Bold</label>
      <label><input type="checkbox" [(ngModel)]="isHighlight"> Highlight</label>
    </div>
  `,
})
export class App {}

@NgModule({
  imports: [ FormsModule, ... ]
  ...
})
{% endhighlight %} 

Finally, we add our `<div>` to our template and use the `ngClass` directive just as we did in the Angular 1 example:

{% highlight html %}
<div [ngClass]="{ bold: isBold, strike: isStrike, highlight: isHighlight }">
  Hello, NgMigrate!
</div>
{% endhighlight %}

The `[]` brackets are used in Angular 2 templates to indicate an input property binding. Moreover for referencing our component properties, we don't have to use any `$ctrl` prefix, since in Angular 2 the templates are directly scoped to their corresponding component class.

### Limitations

There are a few limitations compared to Angular 1, as we cannot for instance pass in a string value or an array of strings to `ngClass`.

### Binding single CSS classes

However, Angular 2 allows us to bind single CSS values based on a boolean condition with this alternative syntax. Whenever `isHighlighted` is equal to `true`, the CSS class `highlighted` would be added.

{% highlight html %}
<div [class.highlighted]="isHighlighted">
    Hello, NgMigrate!
</div>
{% endhighlight %}

### Final 2 code

<iframe src="https://embed.plnkr.co/ATk6CJObhdMBwSZkgY71/?show=src/app,preview&deferRun" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="450"></iframe>
