# jQuery.faytFilter

Adds a find-as-you-type filter to select-elements.

## Usage:

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
