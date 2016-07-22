---
layout: post
permalink: /angular-2-injectable-service
title: Creating an Angular 2 injectable Service
author: toddmotto
path: 2016-07-21-angular-2-injectable-service.md
tags: services
version: 2.0.0-rc.4
intro: In this guide you'll learn how to create an injectable Service in Angular 2.
---

Services are an abstraction layer that handles our application's business logic, which usually includes communicating with a backend and parsing/returning data or datasets. In Angular 1.x, we had a few different ways of creating a service (`.service()`, `.factory()` and `.provider()`). For this guide we'll be comparing just the `.service()` method against Angular 2 services, if you want to dive into the service versus factory explanation, check out [my blog post](https://toddmotto.com/factory-versus-service) on it.

## Table of contents

<div class="contents" markdown="1">
* [Angular 1.x](#angular-1x)
  * [Service definition](#service-definition)
  * [Service DI](#service-di)
* [Angular 2](#angular-2)
  * [Service setup](#service-setup)
  * [@Injectable() and DI](#injectable-and-di)
  * [Final 2 code](#final-2-code)
</div>

## Angular 1.x

In Angular 1.x, we can create a Service using the `.service()` API, let's dive in!

### Service definition

All we need is a good old ES2015 `class`, which we'll be statically returning an Array of todo Objects. We'll move onto HTTP communication in later guides.

{% highlight javascript %}
class TodoService {
  constructor() {}
  getTodos() {
    return [{
      "id": 1,
      "label": "delectus aut autem",
      "completed": false
    },{
      "id": 2,
      "label": "quis ut nam facilis et officia qui",
      "completed": false
    },{
      "id": 3,
      "label": "fugiat veniam minus",
      "completed": false
    },{
      "id": 4,
      "label": "et porro tempora",
      "completed": true
    },{
      "id": 5,
      "label": "laboriosam mollitia et enim quasi adipisci quia provident illum",
      "completed": false
    }];
  }
}

angular
  .module('app')
  .service('TodoService', TodoService);
{% endhighlight %}

We simply register the service with `.service()` and it's fully available inside the `'app'` module. Any dependencies we want to inject into the service are to be bound inside the `constructor` and marked with `$inject`:

{% highlight javascript %}
class TodoService {
  constructor($http) {
    this.$http = $http;
  }
  getTodos() {
    return [{..},{..},{..},{..},{..}];
  }
}

TodoService.$inject = ['$http'];

angular
  .module('app')
  .service('TodoService', TodoService);
{% endhighlight %}

Pretty simple here. Now, to use the Service inside a Controller for example, we need to utilise Angular's Dependency Injection (DI).

### Service DI

{% highlight javascript %}
const todo = {
  template: `
    <div>
      My Todo List:
      <ul>
        <li ng-repeat="todo in $ctrl.todos">
          {% raw %}{{ todo.label }}{% endraw %}
        </li>
      </ul>
    </div>
  `,
  controller(TodoService) {
    $onInit() {
      this.todos = TodoService.getTodos();
    }
  }
};
{% endhighlight %}

The `TodoService.getTodos();` above is described as demonstrating a synchronous operation, for asynchronous operations we'll return a promise and likely assign the `this.todos` inside the `.then()` promise response, however we'll leave this for another guide on Services.

Notice how we're also using the `$onInit` lifecycle hook for the `controller`, which is the new and correct place for such logic.

## Angular 2

Things are pretty much identical with Angular 2, we also use ES2015 classes!

### Service setup

Let's start with the ES2015 `class` and get it exported, adding the `getTodos` method to the constructor which returns the `Array` of Objects:

{% highlight javascript %}
export default class TodoService {
  constructor() {}
  getTodos(): array {
    return [{
      "id": 1,
      "label": "delectus aut autem",
      "completed": false
    },{
      "id": 2,
      "label": "quis ut nam facilis et officia qui",
      "completed": false
    },{
      "id": 3,
      "label": "fugiat veniam minus",
      "completed": false
    },{
      "id": 4,
      "label": "et porro tempora",
      "completed": true
    },{
      "id": 5,
      "label": "laboriosam mollitia et enim quasi adipisci quia provident illum",
      "completed": false
    }];
  }
}
{% endhighlight %}

Simple enough, what next? Dependency injection!

### @Injectable() and DI

The next stage is using the `@Injectable()` decorator, which we import and simply decorate the class:

{% highlight javascript %}
import {Injectable} from '@angular/core';

@Injectable()
export default class TodoService {
  constructor() {}
  getTodos(): array {
    return [{..},{..},{..},{..},{..}];
  }
}
{% endhighlight %}

Now we need to `import` the Service into our component, as well as the `OnInit` interface, which provides a hook named `ngOnInit` that we'll be using:

{% highlight javascript %}
import {Component, OnInit} from '@angular/core';
import TodoService from './todo.service';

@Component({
  selector: 'todo',
  template: `
    <div>
      My Todo List:
      <ul>
        <li *ngFor="let todo of todos">
          {% raw %}{{ todo.label }}{% endraw %}
        </li>
      </ul>
    </div>
  `
})
export default class CounterComponent implements OnInit {
  constructor() {}
}
{% endhighlight %}

So we import `OnInit`, and on the `class` export declare `implements OnInit`. Now, we'll move onto the constructor injection and assignment of the `getTodos()` Service call:

{% highlight javascript %}
import {Component, OnInit} from '@angular/core';
import TodoService from './todo.service';

@Component({
  selector: 'todo',
  template: `
    <div>
      ...
    </div>
  `
})
export default class CounterComponent implements OnInit {
  public todos: array;
  constructor(public todoService: TodoService) {}
  ngOnInit() {
    this.todos = this.todoService.getTodos();
  }
}
{% endhighlight %}

The `constructor` is the place for creating bindings for injections, not to do any heavy lifting, which is why we implement the lifecycle hook `ngOnInit`. By using TypeScript, we can automatically bind `TodoService` to the `constructor`, which is essentially equivalent to this:

{% highlight javascript %}
export default class CounterComponent implements OnInit {
  ...
  constructor(TodoService) {
    this.todoService = TodoService;
  }
  ...
}
{% endhighlight %}

There's just one step left, and that's registering the Service inside the `@Component`, we do this through the `providers` Array:

{% highlight javascript %}
import {Component, OnInit} from '@angular/core';
import TodoService from './todo.service';

@Component({
  selector: 'todo',
  template: `
    <div>
      ...
    </div>
  `,
  providers: [TodoService]
})
export default class CounterComponent implements OnInit {
  public todos: array;
  constructor(public todoService: TodoService) {}
  ngOnInit() {
    this.todos = this.todoService.getTodos();
  }
}
{% endhighlight %}

And that's it! There are a few more options for `providers` that we'll cover in further guides, which allow us to globally inject Services rather than on the Component level.

### Final 2 code

<iframe src="https://embed.plnkr.co/SiDwEytZPZqFPyonGHp1/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>
