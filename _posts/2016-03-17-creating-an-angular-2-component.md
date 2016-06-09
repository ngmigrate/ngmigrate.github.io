---
layout: post
permalink: /creating-your-first-angular-2-component
title: Creating your first Angular 2 Component
author: Todd Motto
path: 2016-03-17-creating-an-angular-2-component.md
tags: controllers
---

This is a beginner level tutorial to ease you into Angular 2, although there are many resources online to create Components, these articles exist as part of a series. This article will guide you through So let's get started with creating a Component in Angular 2!

For the purposes of this tutorial, we'll be creating a counter Component that allows for incrementing and decrementing of values via buttons, which changes the value of an `<input>`.

Before creating your first Component however, you'll need to learn how to [Bootstrap an Angular 2 application](/bootstrap-angular-2-hello-world), you can then proceed with this article.

### Creating a Component with @Component

In Angular 2, there's a heavy push and recommendation towards using TypeScript and it's superset features, in this case we're going to be using TypeScript and it's decorators (such as `@Component`), which are just functions prefixed with an `@` symbol.

First thing after bootstrapping your application, we'll need to import some funky stuff from Angular's core. Let's create a file called `app.component.ts` and add some boilerplate code:

{% highlight javascript %}
// app.component.ts
import {Component} from 'angular2/core';

export class AppComponent {

}
{% endhighlight %}

This code serves as an absolute base and root Component in Angular 2, which is how we architect Angular 2 apps. This Component is named `AppComponent` and we'll pass this off into the `bootstrap` method to instantiate the app. It doesn't do much right now, so let's add the imported `{Component}` decorator:

{% highlight javascript %}
// app.component.ts
import {Component} from 'angular2/core';

@Component({
  selector: 'my-app',
  styles: [`
    .app {

    }
  `],
  template: `
    <div class="app">
      Hello world!
    </div>
  `
})
export class AppComponent {

}
{% endhighlight %}

Nice and easy, we now have a base Component. Everything in Angular 2 is a Component and essentially creates a nested architecture of child Components. So, we need to create an actual Component to use in our `AppComponent`.

### Counter Component

For this example, we'll create a simple `CounterComponent`, which will allow the user to increment and decrement a single value inside an `<input>`.

Let's create a new file called `counter.component.ts` and setup the new `CounterComponent`. Note how with our new `CounterComponent`, inside the `@Component` decorator the `selector` property has the value of `counter`. This value corresponds to the HTML element's name when declaring it in our templates elsewhere. In Angular 1.x the way we registered Directives/Components was down to the name we passed into the `.directive()` or `.component()` methods, such as '.directive('counter', fn)'. Let's take a look:

{% highlight javascript %}
// counter.component.ts
import {Component} from 'angular2/core';

@Component({
  selector: 'counter',
  styles: [`
    .counter {

    }
  `],
  template: `
    <div class="counter">

    </div>
  `
})
export class CounterComponent {

}
{% endhighlight %}

We're familiar with a Component boilerplate now and can start filling in the essential gaps we need to render our `<input>` with some increment/decrement logic:

{% highlight javascript %}
// counter.component.ts
import {Component} from 'angular2/core';

@Component({
  selector: 'counter',
  styles: [`
    .counter {
      position: relative;
    }
    .counter__input {
      border: 0;
      border-radius: 3px;
      height: 30px;
      max-width: 100px;
      text-align: center;
    }
    .counter__button {
      outline: 0;
      cursor: pointer;
      height: 30px;
      width: 30px;
      border: 0;
      border-radius: 3px;
      background: #0088cc;
      color: #fff;
    }
  `],
  template: `
    <div class="counter">
      <div class="counter__container">
        <button (click)="decrement();" class="counter__button">
          -
        </button>
        <input type="text" class="counter__input" [value]="counterValue">
        <button (click)="increment();" class="counter__button">
          +
        </button>
      </div>
    </div>
  `
})
export class CounterComponent {
  public counterValue:number = 0;
  increment() {
    this.counterValue++;
  }
  decrement() {
    this.counterValue--;
  }
}
{% endhighlight %}

Here we have a `styles` property, which is an Array with a single String inside, which contains our styles for the particular Component.

### Using a Component inside another Component

We have two Components, but how do we tell Angular to use them? Let's head back to the `app.component.ts` file and import our new `CounterComponent`:

{% highlight javascript %}
// app.component.ts
import {Component} from 'angular2/core';
import {CounterComponent} from './counter.component';

@Component({
  selector: 'my-app',
  styles: [`
    .app {

    }
  `],
  template: `
    <div class="app">
      Hello world!
    </div>
  `
})
export class AppComponent {

}
{% endhighlight %}

Easy, now `CounterComponent` is available for Angular 2 to use. But, one difference here between Angular 1.x and Angular 2 is that we need to tell Angular 2's dependency injection system to use specific dependencies. To use our `CounterComponent` inside `AppComponent` we need to specify an Array named `directives` on the `@Component` decorator:

{% highlight javascript %}
// app.component.ts
import {Component} from 'angular2/core';
import {CounterComponent} from './counter.component';

@Component({
  selector: 'my-app',
  styles: [`
    .app {

    }
  `],
  template: `
    <div class="app">
      Hello world!
    </div>
  `,
  directives: [
    CounterComponent
  ]
})
export class AppComponent {

}
{% endhighlight %}

Finally, we can now declare our `<counter></counter>` as a custom element inside our `AppComponent` template:

{% highlight javascript %}
// app.component.ts
import {Component} from 'angular2/core';
import {CounterComponent} from './counter.component';

@Component({
  selector: 'my-app',
  styles: [`
    .app {

    }
  `],
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `,
  directives: [
    CounterComponent
  ]
})
export class AppComponent {

}
{% endhighlight %}

And that's it, we've learned how to create and include another Component inside a Component using `directives` and declaring it inside our template. The final output can be found here in a Plunker, try it out!

<iframe src="//embed.plnkr.co/JqDECa0EdvvASzIS3Pvl" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

### Next steps

Now we've learned how to do the basics, let's move on and learn how to [pass data into Angular 2 Components with "Input"](passing-data-angular-2-components-input).
