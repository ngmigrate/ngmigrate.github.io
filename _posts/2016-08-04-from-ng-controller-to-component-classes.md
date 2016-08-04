---
layout: post
permalink: /from-ng-controller-to-component-classes
title: From ng-controller to Component Classes
author: simpulton
path: 2016-08-04-from-ng-controller-to-component-classes.md
tags: controllers
version: 2.0.0-rc.4
intro: In this guide you'll learn how to start migrating Angular 1 controllers into Angular 2 component classes.
---

## Table of contents

<div class="contents" markdown="1">
* [Angular 1.x](#angular-1x)
  * [Controllers with .controller()](#controllers-with-controller)
  * [Migrating to controllerAs](#migrating-to-controlleras)
  * [Extracting the Controller](#extracting-the-controller)
  * [Using Components](#using-components)
  * [Using Classes](#using-classes)
  * [Using Lifecycle Hooks](#using-lifecycle-hooks)
  * [Final 1.x code](#final-1x-code)
* [Angular 2](#angular-2)
  * [Component Classes](#component-classes)
  * [Final 2 code](#final-2-code)
</div>

## Angular 1.x

## Controllers with .controller()

{% highlight javascript %}
angular.module('app')
  .controller('CategoriesListCtrl', function($scope, CategoriesModel) {
    CategoriesModel.getCategories()
      .then(function(result){
        $scope.categories = result;
      });

    $scope.onCategorySelected = function(category) {
      CategoriesModel.setCurrentCategory(category);
    }
  });
{% endhighlight %}

{% highlight html %}
<div ng-controller="CategoriesListCtrl">
    <!-- categories list markup -->
</div>
{% endhighlight %}

## Migrating to controllerAs

{% highlight javascript %}
angular.module('app')
  .controller('CategoriesListCtrl', function(CategoriesModel) {
    CategoriesModel.getCategories()
      .then(function(result){
        this.categories = result;
      });

    this.onCategorySelected = function(category) {
      CategoriesModel.setCurrentCategory(category);
    }
  });
{% endhighlight %}

{% highlight html %}
<div ng-controller="CategoriesListCtrl as categoriesListCtrl">
    <!-- categories list markup -->
</div>
{% endhighlight %}

## Extracting the Controller

{% highlight javascript %}

function CategoriesListCtrl(CategoriesModel) {
  CategoriesModel.getCategories()
    .then(function(result){
      this.categories = result;
    });

  this.onCategorySelected = function(category) {
    CategoriesModel.setCurrentCategory(category);
  }
}

angular.module('app')
  .controller('CategoriesListCtrl', CategoriesListCtrl);
{% endhighlight %}

## Using Components

{% highlight javascript %}
function CategoriesListCtrl(CategoriesModel) {
  CategoriesModel.getCategories()
    .then(function(result){
      this.categories = result;
    });

  this.onCategorySelected = function(category) {
    CategoriesModel.setCurrentCategory(category);
  }
}

var CategoriesList = {
  template: '<div><!-- categories list markup --></div>',
  controller: CategoriesListCtrl,
  controllerAs: 'CategoriesListCtrl'
}

angular.module('app')
  .controller('CategoriesListCtrl', CategoriesListCtrl)
  .component('categoriesList', CategoriesList);
{% endhighlight %}

{% highlight html %}
<categories-list></categories-list>
{% endhighlight %}

## Using Classes

{% highlight javascript %}
class CategoriesListCtrl {
  constructor(CategoriesModel) {
    'ngInject';

    this.CategoriesModel = CategoriesModel;
    this.CategoriesModel.getCategories()
      .then(result => this.categories = result);
  }

  onCategorySelected(category) {
    this.CategoriesModel.setCurrentCategory(category);
  }
}

const CategoriesList = {
  template: '<div><!-- categories list markup --></div>',
  controller: CategoriesListCtrl,
  controllerAs: 'categoriesListCtrl'
};

angular.module('app')
    .component('categoriesList', CategoriesList)
  ;
{% endhighlight %}

## Using Lifecycle Hooks

{% highlight javascript %}
class CategoriesListCtrl {
  constructor(CategoriesModel) {
    'ngInject';

    this.CategoriesModel = CategoriesModel;
  }

  $onInit() {
    this.CategoriesModel.getCategories()
      .then(result => this.categories = result);
  }

  onCategorySelected(category) {
    this.CategoriesModel.setCurrentCategory(category);
  }
}

const CategoriesList = {
  template: '<div><!-- categories list markup --></div>',
  controller: CategoriesListCtrl,
  controllerAs: 'categoriesListCtrl'
};

angular.module('app')
    .component('categoriesList', CategoriesList)
  ;
{% endhighlight %}

### Final 1.x code

<iframe src="https://embed.plnkr.co/YOUR_URL/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>

## Angular 2

{% highlight javascript %}
@Component({
  selector: 'categories-list',
  template: `<div><!-- categories list markup --></div>`
})
export default class CategoriesList implements OnInit {
  constructor(CategoriesModel) {
    this.CategoriesModel = CategoriesModel;
  }

  ngOnInit() {
    this.CategoriesModel.getCategories()
      .then(result => this.categories = result);
  }

  onCategorySelected(category) {
    this.CategoriesModel.setCurrentCategory(category);
  }
}
{% endhighlight %}

### Final 2 code

<iframe src="https://embed.plnkr.co/YOUR_URL/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>
