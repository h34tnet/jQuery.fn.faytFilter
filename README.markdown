# jQuery.faytFilter

Adds a find-as-you-type filter to select-elements.

**Update:** I just noticed it also works for all other elements like OLs and ULs. D'oh!

## Usage

    $('SELECT').faytFilter();
    $('SELECT').faytFilter(options);

## Options 

    options = {
      insert:         'after',        // "before", "after", $-selector string or $-object
      method :        'plain',        // methods: "plain", "wildcard" (* for zero or more and ? for exactly one), "strictwildcard" (the same with "^wildcard$"), "regexp" ("a.+b") or custom function
      showMatches :   false,          // shows the match count; false: don't show, function: call user defined function, $-object: write there, $-selector string: match and write
      caseSensitive : false,          // case sensitive match, true|false
      cssClass:       'faytFilter',   // css class for the text field (default '.faytFilter')
      delay:          100             // keyUp delay in ms 
    };

### Custom function

options.method takes a function(filter, opts), where filter is the filter text and opts are the options, that returns another function that takes the text of the element.

The inner function should return true if it matches or false otherwise.

    $('SELECT').faytFilter({
        // matches the beginnings of a word
        method: function (filter, opts) {
            filter = opts.caseSensitive ? filter : filter.toLowerCase();
            return function (text) {
                var ttc = opts.caseSensitive ? text : text.toLowerCase();
                return ttc.substr(0, filter.length) == filter;
            }
        }    
    });

