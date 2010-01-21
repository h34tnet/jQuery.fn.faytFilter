# jQuery.faytFilter Plugin

Adds a find-as-you-type filter to elements. It works for elements like SELECT, OLs/ULs, DIVs and many more.

## Usage

    $('SELECT').faytFilter();
    $('SELECT').faytFilter(options);

## Options 

    options = {
      insert:         'after',       // "before", "after", $-selector string or $-object
      method :        'plain',        // methods: "plain", "wildcard" (* for zero or more and ? for exactly one), "strictwildcard" (the same with "^wildcard$"), "regexp" ("a.+b") or custom function
      showMatches :   false,          // shows the match count; false: don't show, function: call user defined function, $-object: write there, $-selector string: match and write
      caseSensitive : false,          // case sensitive match, true|false
      cssClass:       'faytFilter',   // css class for the text field (default '.faytFilter')
      delay:          100             // keyUp delay in ms 
    };

### option.insert
Where the fayt text element should be inserted. Possible values are "before", "after", a jQuery selector ("#myElement') or a jQuery object ($('myElement')).

### option.method
The method used to match the filter against the elements text. 

Possible values are: "plain", "wildcard", "strict wildcard", "regexp" and a custom function.

#### option.method : 'plain'
Just a normal strpos.

#### Custom function as option.method 

options.method takes a function(filter, opts), where filter is the filter text and opts are the options, that returns another function that takes the text of the element.

The inner function should return true if it matches or false otherwise.

    $('SELECT').faytFilter({
        // matches the beginning of a word
        method: function (filter, opts) {
            filter = opts.caseSensitive ? filter : filter.toLowerCase();

            return function (text) {
                var ttc = opts.caseSensitive ? text : text.toLowerCase();
                return ttc.substr(0, filter.length) == filter;
            }
        }    
    });

### option.showMatches
Where the number of matches are displayed. Possible values are either false (don't show), a jQuery element ($('#foo')), a jQuery selector string ('#foo') or a custom function.

Example for a custom function:

    $('#myselect').faytFilter({
        showMatches: function (count) {
            $('#myselectMatchCount').html(count == 0 ? 'no matches found' : count);
        }
    });

### option.caseSensitive
Should matching be case sensitive for the predefined methods? 

*Note:* This parameter doesn't affect custom matching functions!

### option.cssClass
The css class assigned to the faytFilter text element.

### option.delay
The delay in milliseconds between the faytFilter.keyUp event and the filtering actions. This means, the filter isn't updated until no key was pressed for (option.delay) ms.

*Note:* If this is too short, fast typers may experience performance problems if big lists are updated too often.

## Source, demo and licence

* The source can be [found here](http://github.com/schnalle/jQuery.fn.faytFilter)
* The demo can be [found here](http://faytfilter.tapirpirates.net/)
* Licence: [Creative Commons 3.0](http://creativecommons.org/licenses/by/3.0/)