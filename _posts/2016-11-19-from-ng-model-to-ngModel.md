---
layout: post
permalink: /from-ng-model-to-ngModel
title: From ng-model to ngModel
author: simpulton
path: 2016-11-19-from-ng-model-to-ngModel.md
tags: directives
version: 2.0.0
intro: In this guide you'll learn how to use ngModel, the Angular 2 equivalent for ng-model.
---

The `ng-model` directive in Angular 1.x allows us to create two-way data binding between a form control and a property on scope. In this guide we'll be converting an Angular 1.x `ng-model` directive into Angular 2's `ngModel` directive.

## Table of contents

<div class="contents" markdown="1">
* [Angular 1.x](#angular-1x)
  * [Using ng-model](#using-ng-model)
  * [Final 1.x code](#final-1x-code)
* [Angular 2](#angular-2)
  * [Using ngModel](#using-ngmodel)
  * [Final 2 code](#final-2-code)
</div>

## Angular 1.x

Primarily, we use `ng-model` to keep a form input in sync with a property on scope in Angular 1.x. There are some additional responsibilities that `ng-model` handles but we will start out by focusing on the data binding facet of the directive.  

### Using ng-model

The most common use case for `ng-model` is binding a text input to a property and so we will start there. In our component controller, we will create a `myModel` object with a `username` property that we will bind to.  

{% highlight javascript %}
function AppComponentCtrl() {
  this.myModel = {
    username: 'poweruser'
  }
}
{% endhighlight %}

To bind a text input to our `myModel.username` property, we can define a text input control and just add `ng-model="$ctrl.myModel.username"` to it. Now whenever we type something into our input field, the `myModel.username` property will be updated with the new value. 

{% highlight html %}
<input type="input" ng-model="$ctrl.myModel.username" placeholder="Username">
{% endhighlight %}

We could technically stop here as we have captured the essence of `ng-model` with a few lines of code but let's go a bit further and see the role that `ng-model` plays in the bigger picture. Two-way data binding is a really handy tool to have at our disposal but `ng-model` can also register itself with its parent form and communicate validation behavior and state.

To see this in action, we will wrap our input in a `form` element. We will give our form element a name of `myForm` and our input a name of `username`. Angular uses `name` attributes to register form controls with the form. We will also add a `required` attribute to our input so that we have something to validate against.

{% highlight html %}
<form name="myForm" novalidate>
      <div class="form-group">
        <label for="exampleInput">Username</label>
        <input type="input" name="username" ng-model="$ctrl.myModel.username" required class="form-control" id="exampleInput" placeholder="Username">
      </div>
</form>
{% endhighlight %}

For the sake of illustration, we will add a couple `pre` tags to our template and bind to `$ctrl.model` and `myForm` respectively with the `json` pipe. 

{% highlight html %}
<pre class="highlight">{% raw %}{{{% endraw %}$ctrl.myModel | json{% raw %}}}{% endraw %}</pre>
<pre class="highlight">{% raw %}{{{% endraw %}myForm | json{% raw %}}}{% endraw %}</pre>
{% endhighlight %}

This is a handy trick for serializing an object and displaying it in our template. The current state of `$ctrl.myModel` will look something like the JSON object below.

{% highlight javascript %}
{
  "username": "poweruser"
}
{% endhighlight %}

The output of `myForm` is fairly interesting in that it contains all sorts of information about not only the state of the form such as `$dirty`, `$valid`, `$submitted`, etc but also about the `username` input. If you recall, we added the `name` attribute to our input with the value of `username` which is why we see a `username` property on our form object. Because we have not touched the input, it is an `$untouched` state and currently `$valid` because we are binding it to a property that is not an empty string. 

{% highlight javascript %}
{
  "$error": {},
  "$name": "myForm",
  "$dirty": false,
  "$pristine": true,
  "$valid": true,
  "$invalid": false,
  "$submitted": false,
  "username": {
    "$viewValue": "poweruser",
    "$modelValue": "poweruser",
    "$validators": {},
    "$asyncValidators": {},
    "$parsers": [],
    "$formatters": [
      null
    ],
    "$viewChangeListeners": [],
    "$untouched": true,
    "$touched": false,
    "$pristine": true,
    "$dirty": false,
    "$valid": true,
    "$invalid": false,
    "$error": {},
    "$name": "username",
    "$options": null
  }
}
{% endhighlight %}

If we delete the text inside our input, a few interesting things happen. The first being that `$ctrl.myModel` becomes an empty object because `username` is now an empty string.

{% highlight javascript %}
{}
{% endhighlight %}

More importantly, there is an error on the form object which we can see in the `$error` property. We can also see the error at the form control level so that we if we wanted to set up error messages per control, we would not have to bind to the entire form object. 

{% highlight javascript %}
{
  "$error": {
    "required": [
      {
        "$viewValue": "",
        "$validators": {},
        "$asyncValidators": {},
        "$parsers": [],
        "$formatters": [
          null
        ],
        "$viewChangeListeners": [],
        "$untouched": false,
        "$touched": true,
        "$pristine": false,
        "$dirty": true,
        "$valid": false,
        "$invalid": true,
        "$error": {
          "required": true
        },
        "$name": "username",
        "$options": null
      }
    ]
  },
  "$name": "myForm",
  "$dirty": true,
  "$pristine": false,
  "$valid": false,
  "$invalid": true,
  "$submitted": false,
  "username": {
    "$viewValue": "",
    "$validators": {},
    "$asyncValidators": {},
    "$parsers": [],
    "$formatters": [
      null
    ],
    "$viewChangeListeners": [],
    "$untouched": false,
    "$touched": true,
    "$pristine": false,
    "$dirty": true,
    "$valid": false,
    "$invalid": true,
    "$error": {
      "required": true
    },
    "$name": "username",
    "$options": null
  }
}
{% endhighlight %}

We can also use `ng-model` to bind to other form controls such as `select`, `radio` and `checkbox`. Let's update our `myModel` object with some additional properties so that we can bind to them in our template.

{% highlight javascript %}
function AppComponentCtrl() {
  this.myModel = {
    username: 'poweruser',
    items: [
      { id: 1, label: 'Item One' },
      { id: 2, label: 'Item Two' },
      { id: 3, label: 'Item Three' }
    ],
    selectedItem: null,
    selectedColor: 'red',
    isChecked: true
  }
  
  // Pre-select item
  this.myModel.selectedItem = this.myModel.items[0];
}
{% endhighlight %}

Here is the updated template with additional form controls bound to `myModel` using `ng-model`.

{% highlight html %}
<div class="row">
  <div class="col-sm-6">
    <form name="myForm" novalidate>
      <div class="form-group">
        <label for="exampleInput">Username</label>
        <input type="input" name="username" ng-model="$ctrl.myModel.username" required class="form-control" id="exampleInput" placeholder="Username">
      </div>
      <div class="form-group">
        <label for="exampleSelect">Example select</label>
        <select ng-options="item as item.label for item in $ctrl.myModel.items" 
            ng-model="$ctrl.myModel.selectedItem" class="form-control" id="exampleSelect">
        </select>
      </div>
      <fieldset class="form-group">
        <legend>Radio buttons</legend>
        <div class="form-check">
          <label class="form-check-label">
            <input type="radio" class="form-check-input" ng-model="$ctrl.myModel.selectedColor" name="optionsRadios" value="red"> Red
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input type="radio" class="form-check-input" ng-model="$ctrl.myModel.selectedColor" name="optionsRadios" value="green"> Green
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input type="radio" class="form-check-input" ng-model="$ctrl.myModel.selectedColor" name="optionsRadios" value="blue"> Blue
          </label>
        </div>
      </fieldset>
      <div class="form-check">
        <label class="form-check-label">
          <input type="checkbox" ng-model="$ctrl.myModel.isChecked" class="form-check-input"> Check me out
        </label>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
  <div class="col-sm-6">
    <pre class="highlight">{% raw %}{{{% endraw %}$ctrl.myModel | json{% raw %}}}{% endraw %}</pre>
    <pre class="highlight">{% raw %}{{{% endraw %}myForm | json{% raw %}}}{% endraw %}</pre>
  </div>
</div>
{% endhighlight %}

### Final 1.x code

<iframe src="https://embed.plnkr.co/c5e9zLK5Oel9qyy5uE8O/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="400"></iframe>

## Angular 2

The Angular 2 implementation of the `ng-model` is called `ngModel`, purposely in camelCase. On the surface, the essence of `ngModel` is identical to its Angular 1.x counterpart in that it supplies two-way data binding between the template and the component class. The underlying implementation is completely different and this what we will discuss in the next section.

### Using ngModel

The first fundamental difference between Angular 1.x and Angular 2 is that we need to include the `FormsModule` in our Angular 2 application for forms to even work. Forms functionality was separated from Angular 2 core so that we could compose our application to use alternative forms modules or none at all if our application did not require it. 
 
 To surface the `FormsModule` functionality to our application, we will import it in our in our `AppModule` file and then add it to the `imports` property.

{% highlight javascript %}
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent }   from './app.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
{% endhighlight %}

As in the Angular 1.x version, we need to set up our component class to satisfy our template. We have a `myModel` object with a `username` property that we will bind to.

{% highlight javascript %}
export class AppComponent implements OnInit {
  myModel = {
    username: 'poweruser'
  }
  
  ngOnInit() {}
}
{% endhighlight %}

To set up two-way data binding with `ngModel`, we will add an input to our template and bind to our `username` property with `[(ngModel)]="myModel.username"`. The obvious question is "What is up with the funny syntax around ngModel?" and this is where we completely diverge from how Angular 1.x implemented `ng-model`. 
 
 In Angular 2, we can bind properties on our component to our template using property binding syntax which looks like `[property]="value"`. We can also communicate events from the template to our component using event syntax which looks like `(event)="handler()"`. Each binding is distinctly uni-directional but we can combine them to create bi-directional binding which looks like `[(ngModel)]="property"`. 

{% highlight html %}
<input [(ngModel)]="myModel.username" type="input" class="form-control" placeholder="Username">
{% endhighlight %}

Two-way data binding with `ngModel` is accomplished by combining two one-way data binding mechanisms to create the appearance of two-way data binding. If we tried to use `ngModel` without binding as seen in the code below, our template would just render the text value in the attribute which would be `myModel.username`.      

{% highlight html %}
<input ngModel="myModel.username"
    type="input" class="form-control" placeholder="Username">
{% endhighlight %}

If we add in property binding, the input will render with the value of `myModel.username` which is `poweruser`.

{% highlight html %}
<input [ngModel]="myModel.username" 
    type="input" class="form-control" placeholder="Username">
{% endhighlight %}

The problem is that though we are displaying the property, we have no way of communicating any additional changes back to the component. Fortunately, `ngModel` emits an internal event called `ngModelChange` which we can bind to. By adding `(ngModelChange)="myModel.username = $event"` to our template, we are listening for the `ngModelChange` event and then assigning the value of the `$event` to `myModel.username`.

{% highlight html %}
<input [ngModel]="myModel.username" (ngModelChange)="myModel.username = $event" 
    type="input" class="form-control" placeholder="Username">
{% endhighlight %}

This is slightly verbose and so we can just combine the two bindings together into the more conventional form below.

{% highlight html %}
<input [(ngModel)]="myModel.username" type="input" class="form-control" placeholder="Username">
{% endhighlight %}

Let's register our input with a parent form to see the role that `ngModel` plays outside of just data binding. We have created a form and then created a local template variable called `myForm` with `#myForm="ngForm"`. We also need to add a `name` property to our input so that it is registered with the form and a `required` property so we can validate our input.

{% highlight html %}
<form #myForm="ngForm" novalidate>
  <div class="form-group">
    <label for="exampleInput">Username</label>
    <input name="username" [(ngModel)]="myModel.username" required 
    type="input" class="form-control" id="exampleInput" placeholder="Username">
  </div>
</form>
{% endhighlight %}

To help visualize the state of the form, we will dump `myForm` into our template using the `json` pipe. The value of the form model and the validity of the form model are separated into two properties and so we need to bind `myForm.value` and `myForm.valid` to see them both. 

{% highlight html %}
<pre class="highlight">{% raw %}{{{% endraw %}myForm.value | json{% raw %}}}{% endraw %}</pre>
<pre class="highlight">{% raw %}{{{% endraw %}myForm.valid | json{% raw %}}}{% endraw %}</pre>
{% endhighlight %}

If we deleted everything in the `username` input, `myForm.valid` goes from `true` to `false` which we can then use to perform additional logic. We could, for instance, disable a submit button when the form is in an invalid state which would look something like the code below.
  
{% highlight html %}
<button type="submit" [disabled]="!myForm.valid" class="btn btn-primary">Submit</button>
{% endhighlight %}

We can also use `ngModel` to bind to additional controls such as `select`, `radio` and `checkbox` which you can see in the template below.    

{% highlight html %}
<div class="row">
  <div class="col-sm-6">
    <form #myForm="ngForm" novalidate>
      <div class="form-group">
        <label for="exampleInput">Username</label>
        <input name="usernameManual" [ngModel]="myModel.username" (ngModelChange)="myModel.username = $event" required type="input" class="form-control" id="exampleInput" placeholder="Username">
      </div>      
      <div class="form-group">
        <label for="exampleInput">Username</label>
        <input name="username" [(ngModel)]="myModel.username" required type="input" class="form-control" id="exampleInput" placeholder="Username">
      </div>
      <div class="form-group">
        <label for="exampleSelect1">Example select</label>
        <select name="selectedItem" [(ngModel)]="myModel.selectedItem" class="form-control" id="exampleSelect1">
          <option *ngFor="let item of myModel.items" [ngValue]="item">{{item.label}}</option>
        </select>
      </div>
      <fieldset class="form-group">
        <legend>Radio buttons</legend>
        <div class="form-check">
          <label class="form-check-label">
            <input type="radio" name="selectedColor" class="form-check-input" [(ngModel)]="myModel.selectedColor" value="red"> Red
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input type="radio" name="selectedColor" class="form-check-input" [(ngModel)]="myModel.selectedColor" value="green"> Green
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input type="radio" name="selectedColor" class="form-check-input" [(ngModel)]="myModel.selectedColor" value="blue"> Blue
          </label>
        </div>
      </fieldset>
      <div class="form-check">
        <label class="form-check-label">
          <input type="checkbox"  name="isChecked" [(ngModel)]="myModel.isChecked" class="form-check-input"> Check me out
        </label>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
  <div class="col-sm-6">
    <pre class="highlight"><raw>{% raw %}{{{% endraw %}myModel | json{% raw %}}}{% endraw %}</pre>
    <pre class="highlight"><raw>{% raw %}{{{% endraw %}myForm.value | json{% raw %}}}{% endraw %}</pre>
    <pre class="highlight"><raw>{% raw %}{{{% endraw %}myForm.valid | json{% raw %}}}{% endraw %}</pre>
  </div>
</div>  
{% endhighlight %}

### Final 2 code

<iframe src="http://embed.plnkr.co/tIyMoywczjAAUIeCt7JC/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="400"></iframe>
