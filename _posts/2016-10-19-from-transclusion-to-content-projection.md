---
layout: post
permalink: /from-transclusion-to-content-projection
title: From transclusion to content projection
author: juristr
path: 2016-11-01-from-transclusion-to-content-projection.md
tags: components
version: 2.0.0
intro: In this guide you will learn how to migrate from transclusion to content projection.
---

When you create more advanced components, the simple input and output mechanisms may not suffice. That's where "transclusion", now also known as content projection, comes into play. In this article we're going to explore the concepts behind transclusion in Angular 1.x and how it translates to Angular 2.

## Table of contents

<div class="contents" markdown="1">

- [Angular 1.x](#angular-1x)
    - [Transclusion with `ngTransclude`](#transclusion-with-ngtransclude)
    - [Multi-slot Transclusion](#multi-slot-transclusion)
    - [Optional slots and fallbacks in multi-slot transclusion](#optional-slots-and-fallbacks-in-multi-slot-transclusion)
    - [Manual transclusion](#manual-transclusion)
- [Angular 2](#angular-2)
    - [Content Projection with `ng-content`](#content-projection-with-ng-content)
    - [Multi-slot content projection](#multi-slot-content-projection)
- [Final code](#final-code)

</div>

## Angular 1.x

We previously [learned about binding input properties to our components](/component-property-binding-with-input) in Angular 1.x, which allows us to pass data into a component. In the following example, we pass in a  `title` and `body` property to be rendered by our `collapsible-panel` component.

{% highlight html %}
<collapsible-panel title="Click to collapse" body="Hi there!"></collapsible-panel>
{% endhighlight %}

While this perfectly works, we can definitely do better. What if we want to pass complete HTML parts into the body of our collapsible panel? Or even entire Angular directives.  
In more complex situations it might not be enough to simply use attribute bindings to pass in data, but there's the need for more advanced mechanisms. For that purpose, Angular 1.x has a **concept called "transclusion"**.

A "transcluded component" could be instantiated in our HTML template as follows.

{% highlight html %}
<collapsible-panel title="Click to collapse">
  Hi there!
</collapsible-panel>
{% endhighlight %}

![](/img/collapsible-panel.gif)

Rather than passing the body via an attribute binding, we simply define it as a body of our component, just as you're already accustomed with the plain normal HTML elements. Most interestingly, this mechanism allows us to pass in entire HTML parts, dynamic content or even other directives and components.

{% highlight html %}
Name: {%raw%}{{ $ctrl.person.name }}{%endraw%}

<collapsible-panel title="Address">
  {%raw%}{{ $ctrl.person.name }}{%endraw%} lives at the following address.
  <address-detail address="$ctrl.person.address"></address-detail>
</collapsible-panel>
{% endhighlight %}

### Transclusion with `ngTransclude`

In order to have transclusion work on our component, we have to set the `transclude` property to `true` and use the `ng-transclude` directive in our component's template, which acts as a placeholder for the injected external content.

{% highlight javascript %}
const collapsiblePanelComponent = {
  bindings: {
    title: '<'
  },
  transclude: true,
  template: `
    <div class="panel">
      <div class="panel-heading" ng-click="$ctrl.visible = !$ctrl.visible">
        <h3 class="panel-title">{{ $ctrl.title }}</h3>
      </div>
      <div class="panel-body" ng-if="$ctrl.visible" ng-transclude>
      </div>
    </div>
  `,
  controller() {
    // collapse by default
    this.visible = false;
  }
};

angular
  .module('app')
  .component('collapsiblePanel', collapsiblePanelComponent);
{% endhighlight %}

### Multi-slot Transclusion 

What about transcluding to different destinations? Totally possible, and known as multi-slot or named slot transclusion. Like in our example before, we may want to inject the panel title just like the panel body by making use of transclusion.

{% highlight html %}
<div class="panel">
  <div class="panel-heading" ng-click="$ctrl.visible = !$ctrl.visible">
    <h3 class="panel-title">
      <!-- TRANSCLUDE TITLE CONTENT HERE -->
    </h3>
  </div>
  <div class="panel-body" ng-if="$ctrl.visible" ng-transclude>
    <!-- TRANSCLUDE BODY CONTENT HERE -->
  </div>
</div>
{% endhighlight %}

To enable multi-slot transclusion, we need to change our simple `transclude: true` property definition on our component and assign a configuration object to it.

{% highlight javascript %}
const collapsiblePanelComponent = {
  ...
  transclude: {
    titleSlot: 'span'
  },
  ...
};
{% endhighlight %}

This tells Angular to look for a span element, and transclude it into our `ng-transclude` area with the name `titleSlot`. We obviously need to define that transclusion slot in our template accordingly:

{% highlight html %}
<div class="panel">
  <div class="panel-heading" ng-click="$ctrl.visible = !$ctrl.visible">
    <h3 class="panel-title" ng-transclude="titleSlot">
    </h3>
  </div>
  <div class="panel-body" ng-if="$ctrl.visible" ng-transclude>
  </div>
</div>
{% endhighlight %}

Note, although we could, we don't need to name the body transclusion slot explicitly. It is our default one. Meaning, everything that is matched by our `titleSlot` will go into the title slot, the remaining parts go into the default `ng-transclude` area.

Finally, here's how we can use our multi-slot transcluded component and how the full code of our component.

{% highlight html %}
<collapsible-panel>
    <span class="title">Click me</span>
    Hi there!
</collapsible-panel>
{% endhighlight %}

{% highlight javascript %}
const collapsiblePanelComponent = {
  bindings: {
    title: '<'
  },
  transclude: {
    titleSlot: 'span'
  },
  template: `
    <div class="panel">
      <div class="panel-heading" ng-click="$ctrl.visible = !$ctrl.visible">
        <h3 class="panel-title" ng-transclude="titleSlot"></h3>
      </div>
      <div class="panel-body" ng-if="$ctrl.visible" ng-transclude>
      </div>
    </div>
  `,
  controller() {
    // collapse by default
    this.visible = false;
  }
};

angular
  .module('app')
  .component('collapsiblePanel', collapsiblePanelComponent);
{% endhighlight %}


### Optional slots and fallbacks in multi-slot transclusion

What if we don't want to provide a title? Well, if we don't provide a required transclusion slot, Angular will throw an exception. Often however, we may want to provide a fallback mechanism by showing a default instead. We can define such an optional transclusion slot by appending a `?` in front of its definition, just as you do with optional component input parameters in Angular 1.x.

{% highlight javascript %}
const collapsiblePanelComponent = {
  ...
  transclude: {
    titleSlot: '?span'
  },
  ...
};
{% endhighlight %}

We can then simply define our fallback in the component's template, where normally our transcluded portion would be inserted.

{% highlight javascript %}
const collapsiblePanelComponent = {
  ...
  template: `
    <div class="panel">
      <div class="panel-heading" ng-click="$ctrl.visible = !$ctrl.visible">
        <h3 class="panel-title" ng-transclude="titleSlot">
          Click to expand/collapse
        </h3>
      </div>
      <div class="panel-body" ng-if="$ctrl.visible" ng-transclude>
      </div>
    </div>
  `,
  ...
};
{% endhighlight %}

Whenever `titleSlot` is not defined, we get "Click to expand/collapse" being visualized instead.

### Manual transclusion

Manual transclusion allows to completely control the process of transclusion and adapt it to your needs. Whenever you enable transclusion on your component, you can get a `$transclude` function injected. We can then hook into the transclude function by invoking it and passing in a callback function that takes the transcluded element and the according scope.

{% highlight javascript %}
const collapsiblePanelComponent = {
  transclude: true,
  ...
  controller($element, $transclude) {
    ...
    $transclude((transcludedEl, transScope) => {
      // find .content DOM element from our template and append
      // transcluded elements to it.
      $element.find('.content').append(transcludedEl);
    });
  }
};
{% endhighlight %}

We can completely control where to place the transcluded elements into our component template.

Since in the `$transclude` function we also get the scope of the transcluded content, we can even manipulate it by attaching additional functions and data which can then be consumed by the transcluded parts.

{% highlight javascript %}
const collapsiblePanelComponent = {
  transclude: true,
  ...
  controller($element, $transclude) {
    ...
    $transclude((transcludedEl, transScope) => {
      $element.find('.content').append(transcludedEl);

      // attach the controller's toggle() function to the transcluded scope
      transScope.internalToggle = this.toggle;
    });
  }
};
{% endhighlight %}

From within the transcluded parts, we can then refer to the `internalToggle` function we just added to the transcluded scope before. In this example, a button that is transcluded into our component could thus execute the toggling of the collapsible panel state.

{% highlight html %}
<collapsible-panel>
  <p>Hi there!</p>
  <button ng-click="internalToggle()">Close</button>
</collapsible-panel>
{% endhighlight %}

Just remember to manually destroy the transcluded scope whenever you decide to remove the transcluded content. Otherwise you'll end up with memory leaks.

<iframe src="https://embed.plnkr.co/jrgVYc2i9QSEkIn1EXDj/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="300"></iframe>


## Angular 2

Don't worry, Angular 2 still has transclusion, sort of. It's now called **content projection**. Let's briefly explore the main differences.

> Angular 1 uses `<ng-transclude>`, Angular 2 uses `<ng-content>`

### Content Projection with `ng-content`

Content projection in Angular 2 is enabled by default. We don't have to switch on some property on our component such as in Angular 1. All we have to do is to use the `<ng-content>` directive to mark the place where our content should be projected. Let's translate our previous example of a collapsible panel into Angular 2.

{% highlight javascript %}
@Component({
  selector: 'collapsible-panel',
  template: `
  <div class="panel">
    <div class="panel-heading" (click)="visible = !visible">
      <h3 class="panel-title">
        Click to expand/collapse
      </h3>
    </div>
    <div class="panel-body" *ngIf="visible">
      <ng-content></ng-content>
    </div>
  </div>
  `
})
class CollapsiblePanelComponent {
  visible: false;
}

{% endhighlight %}


### Multi-slot content projection

Just as in Angular 1, we can use the same directive `ng-content` and use a `select` property on it to selectively choose the elements we want to get projected. The selector must be a valid `document.querySelector` expression. 

{% highlight javascript %}
@Component({
  selector: 'collapsible-panel',
  template: `
  <div class="panel">
    <div class="panel-heading" (click)="visible = !visible">
      <h3 class="panel-title">
        <ng-content select="span.title"></ng-content>
      </h3>
    </div>
    <div class="panel-body" *ngIf="visible">
      <ng-content></ng-content>
    </div>
  </div>
  `
})
class CollapsiblePanelComponent {
  visible: false;
}

{% endhighlight %}

## Final code

In this final code you can see a working example of our Angular 2 implementation of a collapsible panel that uses the content projection mechanism.

<iframe src="https://embed.plnkr.co/SP6XNu5aoXorh5jIePdi/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>
