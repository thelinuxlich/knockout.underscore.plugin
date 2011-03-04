/*!
 * Knockout Underscore plugin
 * http://github.com/thelinuxlich/knockout.underscore.plugin
 *
 * Copyright 2011, Alisson Cavalcante Agiani
 * Licensed under the MIT license.
 * http://github.com/thelinuxlich/knockout.underscore.plugin/MIT-LICENSE.txt
 *
 * Date: Thu Mar 03 09:00:29 2011 -0300
*/
ko.observableArray = function (initialValues) {
    var result = new ko.observable(initialValues);

    ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
        result[methodName] = function () {
            var underlyingArray = result();
            var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
            result.valueHasMutated();
            return methodCallResult;
        };
    });

   result.slice = function () {
        var underlyingArray = result();
        return underlyingArray[methodName].apply(underlyingArray, arguments);
    };

    /* Underscore cool stuff */
    result.each = function(iterator,context) {
      _.each(result(),iterator,context);
      result.valueHasMutated();
    };

    result.map = function(iterator,context) {
        return _.each(result(),iterator,context);
    };

    result.reduce = function(iterator,context) {
      return _.reduce(result(),iterator,context);
    };

    result.reduceRight = function(iterator,context) {
      return _.reduceRight(result(),iterator,context);
    };

    result.detect = function(iterator,context) {
      return _.detect(result(),iterator,context);
    };

    result.select = function(iterator,context) {
      return _.select(result(),iterator,context);
    };

    result.select_ = function(iterator,context) {
      return result(_.select(result(),iterator,context));
    };

    result.reject = function(iterator,context) {
      return _.reject(result(),iterator,context);
    };

    result.reject_ = function(iterator,context) {
      return result(_.reject(result(),iterator,context));
    };

    result.all = function(iterator,context) {
      return _.all(result(),iterator,context);
    };

    result.any = function(iterator,context) {
      return _.any(result(),iterator,context);
    };

    result.include = function(value) {
      return _.include(result(),value);
    };

    result.invoke = function(methodName,arguments) {
      return _.invoke(result(),methodName,arguments);
    };

    result.invoke_ = function(methodName,arguments) {
      return result(_.invoke(result(),methodName,arguments));
    };

    result.pluck = function(propertyName) {
      return _.pluck(result(),propertyName);
    };

    result.max = function(iterator,context) {
      return _.max(result(),iterator,context);
    };

    result.min = function(iterator,context) {
      return _.min(result(),iterator,context);
    };

    result.sortBy = function(iterator,context) {
      return _.sortBy(result(),iterator,context);
    };

    result.sortBy_ = function(iterator,context) {
      return result(_.sortBy(result(),iterator,context));
    };

    result.sortedIndex = function(value,iterator) {
        return _.sortedIndex(result(),value,iterator);
    };

    result.size = function() {
        return _.size(result());
    };

    result.first = function(n) {
      return _.first(result(),n);
    };

    result.rest = function(index) {
      return _.rest(result(),index);
    };

    result.rest_ = function(index) {
      return result(_.rest(result(),index));
    };

    result.last = function() {
      return _.last(result());
    };

    result.compact = function() {
      return _.compact(result());
    };

    result.compact_ = function() {
      return result(_.compact(result()));
    };

    result.flatten = function() {
      return _.flatten(result());
    };

    result.flatten_ = function() {
      return result(_.flatten(result()));
    };

    result.without = function(values) {
      return _.without(result(),values);
    };

    result.without_ = function(values) {
      return result(_.without(result(),values));
    };

    result.uniq = function(isSorted) {
      return _.uniq(result(),isSorted);
    };

    result.uniq_ = function(isSorted) {
      return result(_.uniq(result(),isSorted));
    };

    result.intersect = function(array) {
      return _.intersect(result(),array);
    };

    result.intersect_ = function(array) {
      return result(_.intersect(result(),array));
    };

    result.zip = function(arrays) {
      return _.zip(result(),arrays);
    };

    result.zip_ = function(arrays) {
      return result(_.zip(result(),arrays));
    };

    result.indexOf = function(value,isSorted) {
      return _.indexOf(result(),value,isSorted);
    };

    result.lastIndexOf = function(value,isSorted) {
      return _.lastIndexOf(result(),value,isSorted);
    };

    /* end of Underscore wrappers */

    /* Some small optimizations added to the standard methods */

    result.remove = function (valueOrPredicate) {
        var underlyingArray = result();
        var remainingValues = [];
        var removedValues = [];
        var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        var j = underlyingArray.length;
        for (var i = 0; i < j; i++) {
            var value = underlyingArray[i];
            if (!predicate(value))
                remainingValues[remainingValues.length] = value;
            else
                removedValues[removedValues.length] = value;
        }
        result(remainingValues);
        return removedValues;
    };

    result.removeAll = function (arrayOfValues) {
        // If you passed zero args, we remove everything
        if (arrayOfValues === undefined) {
            var allValues = result();
            result([]);
            return allValues;
        }

        // If you passed an arg, we interpret it as an array of entries to remove
        if (!arrayOfValues)
            return [];
        return result.remove(function (value) {
            return _.indexOf(arrayOfValues, value) >= 0;
        });
    };

    result.destroy = function (valueOrPredicate) {
        var underlyingArray = result();
        var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        var i = underlyingArray.length - 1;
        do {
            var value = underlyingArray[i];
            if (predicate(value))
                underlyingArray[i]["_destroy"] = true;
        } while(i--);
        result.valueHasMutated();
    };

    result.destroyAll = function (arrayOfValues) {
        // If you passed zero args, we destroy everything
        if (arrayOfValues === undefined)
            return result.destroy(function() { return true });

        // If you passed an arg, we interpret it as an array of entries to destroy
        if (!arrayOfValues)
            return [];
        return result.destroy(function (value) {
            return _.indexOf(arrayOfValues, value) >= 0;
        });
    };

    result.replace = function(oldItem, newItem) {
        var index = result.indexOf(oldItem);
        if (index >= 0) {
            result()[index] = newItem;
            result.valueHasMutated();
        }
    };

    /* Export new Underscore wrappers */
    ko.exportProperty(result, "each", result.each);
    ko.exportProperty(result, "map", result.map);
    ko.exportProperty(result, "reduce", result.reduce);
    ko.exportProperty(result, "reduceRight", result.reduceRight);
    ko.exportProperty(result, "detect", result.detect);
    ko.exportProperty(result, "select", result.select);
    ko.exportProperty(result, "reject", result.reject);
    ko.exportProperty(result, "all", result.all);
    ko.exportProperty(result, "any", result.any);
    ko.exportProperty(result, "include", result.include);
    ko.exportProperty(result, "invoke", result.invoke);
    ko.exportProperty(result, "pluck", result.pluck);
    ko.exportProperty(result, "max", result.max);
    ko.exportProperty(result, "min", result.min);
    ko.exportProperty(result, "sortBy", result.sortBy);
    ko.exportProperty(result, "sortedIndex", result.sortedIndex);
    ko.exportProperty(result, "size", result.size);
    ko.exportProperty(result, "first", result.first);
    ko.exportProperty(result, "rest", result.rest);
    ko.exportProperty(result, "last", result.last);
    ko.exportProperty(result, "compact", result.compact);
    ko.exportProperty(result, "flatten", result.flatten);
    ko.exportProperty(result, "without", result.without);
    ko.exportProperty(result, "uniq", result.uniq);
    ko.exportProperty(result, "intersect", result.intersect);
    ko.exportProperty(result, "zip", result.zip);
    ko.exportProperty(result, "lastIndexOf", result.lastIndexOf);

    /* Destructive methods(changes the array) */
    ko.exportProperty(result, "select_", result.select_);
    ko.exportProperty(result, "reject_", result.reject_);
    ko.exportProperty(result, "invoke_", result.invoke_);
    ko.exportProperty(result, "sortBy_", result.sortBy_);
    ko.exportProperty(result, "rest_", result.rest_);
    ko.exportProperty(result, "compact_", result.compact_);
    ko.exportProperty(result, "flatten_", result.flatten_);
    ko.exportProperty(result, "without_", result.without_);
    ko.exportProperty(result, "uniq_", result.uniq_);
    ko.exportProperty(result, "intersect_", result.intersect_);
    ko.exportProperty(result, "zip_", result.zip_);

    /* Knockout methods */
    ko.exportProperty(result, "remove", result.remove);
    ko.exportProperty(result, "removeAll", result.removeAll);
    ko.exportProperty(result, "destroy", result.destroy);
    ko.exportProperty(result, "destroyAll", result.destroyAll);
    ko.exportProperty(result, "indexOf", result.indexOf);


    return result;
}

ko.exportSymbol('ko.observableArray', ko.observableArray);

