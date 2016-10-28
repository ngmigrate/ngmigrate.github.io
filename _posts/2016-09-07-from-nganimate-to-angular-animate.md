---
layout: post
permalink: /from-ng-animate-to-angular-2-animate
title: From ngAnimate to Angular 2 animate
author: simpulton
path: 2016-09-01-from-ng-animate-to-angular-2-animate.md
tags: directives
version: 2.0.0
intro: In this guide, you'll learn how to convert a simple CSS animation in Angular 1.x using ngAnimate to an animation in Angular 2.
---

Originally, Angular 1.x was created to help developers build enterprise applications faster. With the introduction of `ngAnimate` written by [Matias Niemelä](http://www.yearofmoo.com/), Angular 1.x suddenly offered something for everyone. Not only could developers create powerful line of business applications, but designers could use Angular to create rich, immersive experiences. Matias took animations to the next level in Angular 2 by rewritting the entire API to give us complete control over ever facet of how our interfaces are animated.

In this lesson, we are going to examine a CSS animation in Angular 1.x and then translate it to work in Angular 2.

## Table of Contents

<div class="contents" markdown="1">
* [Angular 1.x](#angular-1x)
  * [The Angular 1.x Application](#the-angular-1x-application)
  * [Adding an Angular 1.x Animation](#adding-an-angular-1x-animation)
  * [Final 1.x code](#final-1x-code)
* [Angular 2](#angular-2)
  * [The Angular 2 Application](#the-angular-2-application)
  * [Adding an Angular 2 Animation](#adding-an-angular-2-animation)
  * [Final 2 code](#final-2-code)
</div>

## Angular 1.x

Angular 1.x provides animation functionality through the `ngAnimate` module and is entirely class based. The upside to this approach is that it is a non-intrusive process to add animations to an existing Angular application. In most cases, it is as simple as adding a CSS class to your template which we will see in just a moment.

### The Angular 1.x Application

To illustrate animations in Angular 1.x, we are going to build out an application that toggles the visibility of an element when you click a button. Our starting point is an `AppComponent` with an empty `AppController` and template with a `button` and a `div` element for which we want to toggle visibility.

{% highlight javascript %}
class AppController {}

const AppComponent = {
  template: `
    <div class="container">
        <h1>Animations</h1>
        <hr>
        <button type="button" class="btn btn-primary btn-lg">
          Hide
        </button>
        <div class="alert alert-success">
          Animate good times! Come on!
        </div>
    </div>
  `,
  controller: AppController
};

angular.module('app', [])
  .component('app', AppComponent);
{% endhighlight %}

Since we want to toggle the visibility of an element in our template, we will initialize an `isVisible` property in the `$onInit` lifecycle hook. We will then create a `toggleVisibility` method to toggle `this.isVisible` between `true` and `false`.

{% highlight javascript %}
class AppController {
  $onInit() {
    this.isVisible = true;
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}
{% endhighlight %}

We also want to toggle the label of our template button, and so we will add a function to return the appropriate label based on the current value of `this.isVisible`.

{% highlight javascript %}
class AppController {
  $onInit() {
    this.isVisible = true;
  }

  getLabel() {
    return this.isVisible ? 'Hide' : 'Show';
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}
{% endhighlight %}

With our controller in place, we will update our template to utilize our new created functionality. We will add `ng-click` to our button that calls `$ctrl.toggleVisiblity` and bind our button label to whatever value is returned from `$ctrl.getLabel`. We will also add an `ng-if` to our `div` element that will add or remove the element depending on whether or not `$ctrl.isVisible` is `true` or `false`.

{% highlight html %}
<div class="container">
    <h1>Animations</h1>
    <hr>
    <button type="button" class="btn btn-primary btn-lg"
        ng-click="$ctrl.toggleVisibility()">
      {% raw %}{{ $ctrl.getLabel() }}{% endraw %}
    </button>
    <div ng-if="$ctrl.isVisible" class="alert alert-success">
      Animate good times! Come on!
    </div>
</div>
{% endhighlight %}

At this point, we have an entirely working example minus the animations. You can see the entire code up to this point below.

{% highlight javascript %}
class AppController {
  $onInit() {
    this.isVisible = true;
  }

  getLabel() {
    return this.isVisible ? 'Hide' : 'Show';
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}

const AppComponent = {
  template: `
  <div class="container">
    <h1>Animations</h1>
    <hr>
    <button type="button" class="btn btn-primary btn-lg"
        ng-click="$ctrl.toggleVisibility()">
      {% raw %}{{ $ctrl.getLabel() }}{% endraw %}
    </button>
    <div ng-if="$ctrl.isVisible" class="alert alert-success">
      Animate good times! Come on!
    </div>
  </div>
  `,
  controller: AppController
};

angular.module('app', [])
  .component('app', AppComponent);
{% endhighlight %}

### Adding an Angular 1.x Animation

With our functionality completed, we will add an animation that will cause our `div` to fade in and out instead of just blinking on and off the screen. The point worth emphasizing is just how little we will change the existing code to get this working.

Because `ngAnimate` is a separate module from the core framework, we need to add it to our source file and then declare it as a dependency to our main module. We will update our `app` module definition to include `ngAnimate` in the dependencies array. We have just completed change number one.

{% highlight javascript %}
angular.module('app', ['ngAnimate'])
  .component('app', AppComponent);
{% endhighlight %}

Since we want our element to fade in and out, we will add a sufficiently descriptive class to our `div` element. With the addition of our `fade` class, we have completed change number two.

{% highlight html %}
<div ng-if="$ctrl.isVisible" class="fade alert alert-success">
  Animate good times! Come on!
</div>
{% endhighlight %}

We still need to define the application, but this happens outside of the existing Angular application. It is generally a good practice to separate out CSS animations into their own CSS file, and so you will commonly see an `animations.css` file in a project that uses `ngAnimate`.

Within our `animations.css` file, we are going to define our `fade` class and set it to have 100% opacity.

{% highlight css %}
.fade {
  opacity: 1;
}
{% endhighlight %}

Animations in Angular 1.x operate on the concept of animation hooks that we can use to define behavior when certain events happen. You can read about all of these hooks in the [Angular 1.x documentation](https://docs.angularjs.org/api/ngAnimate), but the two we are going to use for our example are `ng-enter` and `ng-leave`. We can define custom styles for each lifecycle hook and its current state. To illustrate this, we will set up the animation transition for both hooks to be `transition:0.5s linear all` as seen in the code below.

{% highlight css %}
.fade {
  opacity: 1;
}

.fade.ng-enter, .fade.ng-leave {
  transition:0.5s linear all;
}
{% endhighlight %}

When an element enters the DOM, the `ng-enter` class establishes the animation starting point and then it transitions to whatever style we define in the `ng-enter-active` style. In this case, we are starting with an `opacity` of `0` and when `ng-enter` has been actively applied aka `ng-enter-active`, it will have an `opacity` of `1`.

{% highlight css %}
.fade.ng-enter {
  opacity:0;
}
.fade.ng-enter.ng-enter-active {
  opacity:1;
}
{% endhighlight %}

When an element leaves the DOM, the process is the same, but we want to reverse the animation. We will start the leave animation with an `opacity` of `1` and will complete the animation with an `opacity` of `0`.

{% highlight css %}
.fade.ng-leave {
  opacity:1;
}
.fade.ng-leave.ng-leave-active {
  opacity:0;
}
{% endhighlight %}

You will notice that the enter and leave animations are exactly the same but in reverse. If we desired, we could stack our classes like so to make it a bit more concise.

{% highlight css %}
.fade {
  opacity: 1;
}

.fade.ng-enter, .fade.ng-leave {
  transition:0.5s linear all;
}

.fade.ng-leave,
.fade.ng-enter.ng-enter-active {
  opacity:1;
}

.fade.ng-enter,
.fade.ng-leave.ng-leave-active {
  opacity:0;
}
{% endhighlight %}

With two small changes to our code and the addition of a few CSS classes, we have gone from something entirely functional to something that not only works well but creates a much better user experience.

### Final 1.x code

<iframe src="https://embed.plnkr.co/v7PAChlzWrNFuZcbqu2e/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

## Angular 2

Animations in Angular 2 have shifted slightly regarding implementation, but the result is that we can exert significantly more control over every facet of our animations. In Angular 1.x, we had a set of predefined hooks that we could use to trigger our animations whereas, in Angular 2, we can define our own triggers. In Angular 1.x, we also had predefined states that we could define our animations within whereas with Angular 2, we can define as many states as we want and how we want to transition between each state. This freedom essentially opens up an endless spectrum of possibilities for us to use in our applications.

### The Angular 2 Application

As a starting point, we will begin with an Angular 2 version of the application we used in the sample above. We have an `AppComponent` with a simple template that has the same `button` and `div` element we want to animate in and out.

{% highlight javascript %}
import { Component } from '@angular/core';

@Component({
  selector: 'app',
  providers: [],
  styles: [],
  template: `
  <div class="container">
    <h1>Animations</h1>
    <hr>
    <button type="button" class="btn btn-primary btn-lg">
      Hide
    </button>
    <div class="alert alert-success">
      Animate good times! Come on!
    </div>
  </div>
  `
})
export class AppComponent { }
{% endhighlight %}

We are going to add a `visibility` property to our component and initialize it to `shown`. We are using a string value instead of boolean `true` or `false` to so that we can interact with our animation trigger in a moment. We will add a `toggleVisibility` method that toggles `this.visibility` between `hidden` and `shown`. While we are at it, we will add our `getLabel` method to toggle our button label.

{% highlight javascript %}
export class AppComponent {
  visibility = 'shown';

  getLabel() {
    return this.visibility == 'shown' ? 'Hide' : 'Show';
  }

  toggleVisibility() {
    this.visibility =
        this.visibility == 'shown'
        ? 'hidden' : 'shown';
  }
}
{% endhighlight %}

We will update our template to call `toggleVisiblity` when the button is clicked and add or remove our element via `*ngIf="visibility=='shown'"`.

{% highlight html %}
<div class="container">
    <h1>Animations</h1>
    <hr>
    <button type="button"
        class="btn btn-primary btn-lg"
        (click)="toggleVisibility()">
      {% raw %}{{ getLabel() }}{% endraw %}
    </button>
    <div *ngIf="visibility=='shown'"
        class="alert alert-success">
      Animate good times! Come on!
    </div>
</div>
{% endhighlight %}

We have now achieved parity with our Angular 1.x example regarding functionality with the code below.

{% highlight javascript %}
import { Component } from '@angular/core';

@Component({
  selector: 'app',
  providers: [],
  styles: [
    `.alert { margin-top: 10px; }`
  ],
  template: `
  <div class="container">
    <h1>Animations</h1>
    <hr>
    <button type="button"
        class="btn btn-primary btn-lg"
        (click)="toggleVisibility()">
      {% raw %}{{ getLabel() }}{% endraw %}
    </button>
    <div *ngIf="visibility=='shown'"
        class="alert alert-success">
      Animate good times! Come on!
    </div>
  </div>
  `
})
export class AppComponent {
  visibility = 'shown';

  getLabel() {
    return this.visibility == 'shown' ? 'Hide' : 'Show';
  }

  toggleVisibility() {
    this.visibility =
        this.visibility == 'shown'
        ? 'hidden' : 'shown';
  }
}
{% endhighlight %}

### Adding an Angular 2 Animation

To complete the circle, we need to add an animation to our Angular 2 application. In Angular 2, there are a few more pieces involved than just importing `ngAnimate`, but the result is a lot more power. We will update our imports to include `trigger`, `state`, `animate`, `transition` and `style`.

{% highlight javascript %}
import { Component, trigger, state, animate, transition, style } from '@angular/core';
{% endhighlight %}

We will also add an animations property to our `@Component` decorator to hold our animations.

{% highlight javascript %}
animations: []
{% endhighlight %}

With our groundwork completed, the very first thing we need to do is to add an animation trigger. This trigger is what we will use to connect our animations to our template. Because we want to toggle the visibility of an element, we will call `trigger` and pass a name of `visibility` for our trigger name.

{% highlight javascript %}
animations: [
    trigger('visibility', [])
]
{% endhighlight %}

We will then remove the `*ngIf` statement from the element below and replace it with `[@visibility]="visibility"`.

{% highlight javascript %}
<div *ngIf="visibility=='shown'"
    class="alert alert-success">
  Animate good times! Come on!
</div>
{% endhighlight %}

We are binding our `@visibility` trigger to whatever value `visibility` is within our component class. We defined only two possible values for the `visibility` property, and we will use them to defined states within our animation.

{% highlight javascript %}
<div [@visibility]="visibility" class="alert alert-success">
  Animate good times! Come on!
</div>
{% endhighlight %}

We will define a state for `shown` and a state for `hidden` and declare custom styles for each state. In the case of our `shown` state, we want an `opacity` of `1` and an `opacity` of `0` if we are in the `hidden` state.

{% highlight javascript %}
animations: [
    trigger('visibility', [
        state('shown', style({
            opacity: 1
        })),
        state('hidden', style({
            opacity: 0
        }))
    ])
]
{% endhighlight %}

At this point, our animation will toggle between our two states, but the visual result is exactly the same as if we were using `*ngIf`. How do transition from one state to another? We accomplish this by adding a `transition` to our `visibility` animation with the this line of code `transition('* => *', animate('.5s'))`. We are using wildcards to indicate that if we are moving from **any** state to **any** other state, we want a half-second animation as the transition.

{% highlight javascript %}
animations: [
    trigger('visibility', [
        state('shown', style({
            opacity: 1
        })),
        state('hidden', style({
            opacity: 0
        })),
        transition('* => *', animate('.5s'))
    ])
]
{% endhighlight %}

We now have a working animation within our application and have completed the transition from an Angular 1.x animation to an Angular 2 animation. You can see the entire component code below.

{% highlight javascript %}
import { Component, trigger, state, animate, transition, style } from '@angular/core';

@Component({
  selector: 'app',
  providers: [],
  styles: [
    `.alert { margin-top: 10px; }`
  ],
  animations: [
    trigger('visibility', [
        state('shown', style({
            opacity: 1
        })),
        state('hidden', style({
            opacity: 0
        })),
        transition('* => *', animate('.5s'))
    ])
  ],
  template: `
  <div class="container">
    <h1>Animations</h1>
    <hr>
    <button type="button"
        class="btn btn-primary btn-lg"
        (click)="toggleVisibility()">
      {% raw %}{{ getLabel() }}{% endraw %}
    </button>
      {% raw %}{{ getLabel() }}{% endraw %}
    </button>
    <div [@visibility]="visibility" class="alert alert-success">
      Animate good times! Come on!
    </div>
  </div>
  `
})
export class AppComponent {
  visibility = 'shown';

  getLabel() {
    return this.visibility == 'shown' ? 'Hide' : 'Show';
  }

  toggleVisibility() {
    this.visibility = this.visibility == 'shown' ? 'hidden' : 'shown';
  }
}
{% endhighlight %}

This lesson provides an introductory example to draw an easy to understand comparison between how animations work in Angular 1.x and Angular 2. We recommend that you check out the [Angular 2 documentation](https://angular.io/docs/ts/latest/guide/animations.html) to get a full sense of the awesome possibilities that Angular 2 animations provide.

### Final 2 code

<iframe src="https://embed.plnkr.co/v7PAChlzWrNFuZcbqu2e/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>
