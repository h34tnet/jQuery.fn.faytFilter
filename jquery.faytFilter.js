/*
 * faytFilter
 * ----------
 * Attaches a Find-as-you-type filter to a select object
 *
 * usage:
 * $('SELECT').faytFilter();
 *
 */

(function($) {
    // extracts the option DOM elements (and other info)
    function getValues(elem) {
        return elem.children().map(function (_, opt) {
            var $opt = $(opt);
            return {
                text:   $opt.text(),
                option: $opt
            }
        });
    }

    // prints the matches somewhere
    function showMatches(where, matchCount) {
        // show the number of matches
        if (typeof where === 'string') {
            // if it's a string, assume it's a jQuery selector
            $(where).html(matchCount);

        } else if (typeof where === 'function') {
            // it's a funtion - call it
            where(matchCount);

        } else if (typeof where === 'object')
            // jQuery match
            where.html(matchCount);
    }

    // // attach the text input
    function attachFilterInput($select, where, faytId) {
        var 
            faytHtml = '<input id="' + faytId + '" type="text" value="">';

        if (where === 'after')
            $select.after(faytHtml);

        else if (where === 'before')
            $select.before(faytHtml);

        else if (typeof where === 'string')
            $(where).get(0).append(faytHtml);

        else if (typeof where === 'object')
            where.append(faytHtml);

        return $('#' + faytId);
    }

    // for the simplified wildcard mode (supporting * and ?) we still use regexps
    // but we have to escape (and translate) the control characters
    function prepareWildcard(filterText, fullLine) {
        if (filterText.length == 0)
            return '.*';
        else
            return (fullLine ? '^' : '') + filterText
                .replace(/\\/g, '\\\\')
                .replace(/\./g, '\\.')
                .replace(/\?/g, '.')
                .replace(/\*/g, '.*')
                .replace(/\+/g, '\\+')
                .replace(/\(/g, '\\(')
                .replace(/\)/g, '\\)')
                .replace(/\[/g, '\\[')
                .replace(/\]/g, '\\]')
                .replace(/\{/g, '\\{')
                .replace(/\}/g, '\\}')
                .replace(/\$/g, '\\$')
                .replace(/\^/g, '\\^') + (fullLine ? '$' : '');
    }

    // the function used for "plain" filtering
    function filterFunctionPlain(filterText, opts) {

        if (opts.caseSensitive == true) filterText = filterText.toLowerCase();

        return function(ttc) {
            return ttc.toLowerCase().indexOf(filterText) !== -1;
        }
    }

    // the function used for "regexp" filtering
    function filterFunctionRegexp(filterText, opts) {
        var regexp;

        try {
            regexp = opts.caseSensitive ? new RegExp(filterText) : new RegExp(filterText, 'i');
        } catch (x) {
            // if an error happened, use an empty regexp instead
            regexp = new RegExp();
        }

        return function(ttc) {
            return regexp.test(ttc);
        }
    }

    // the function generator used for "wildcard" filtering
    function filterFunctionWildcards(filterText, opts) {
        filterText = prepareWildcard(filterText, false);
        var regexp = opts.caseSensitive ? new RegExp(filterText) : new RegExp(filterText, 'i');

        return function(ttc) {
            return regexp.test(ttc);
        }
    }

    // the function generator used for "strictwildcard" filtering
    function filterFunctionStrictWildcards(filterText, opts) {
        filterText = prepareWildcard(filterText, true);
        var regexp = opts.caseSensitive ? new RegExp(filterText) : new RegExp(filterText, 'i');

        return function(ttc) {
            return regexp.test(ttc);
        }
    }

    // this function is called on the keyUp-event in the fayt-textfield
    function filterFunction($select, $tfilter, opts) {
        var 
            filterText = $tfilter.val(),
            ffun = function () {return true;};

        // prepare the filtering function - regexp, strictwildcard, wildcard and plain are predefined
        if (opts.method == 'regexp') {
            ffun = filterFunctionRegexp(filterText, opts);

        } else if (opts.method == 'strictwildcard') {
            ffun = filterFunctionStrictWildcards(filterText, opts);

        } else if (opts.method == 'wildcard') {
            ffun = filterFunctionWildcards(filterText, opts);

        } else if (opts.method == 'plain') {
            ffun = filterFunctionPlain(filterText, opts);

        } else if (typeof opts.method == 'function') {
            ffun = opts.method(filterText, opts);
        }

        // remove all options
        $select.children().remove();
        var matchCount = 0;

        // now, for every option ...
        for (var i=0; i<$select.faytStore.length; i++) {
            var elem   = $select.faytStore[i];

            if (ffun(elem.text)) {
                matchCount += 1;
                $select.append(elem.option);
            }
        }

        showMatches(opts.showMatches, matchCount);
    }

    $.faytFilter = function($select, opts) {
        var id      = $select.attr('id'),
            faytId  = '__fayt_' + id,
            timer   = null;

        // create the text field
        var $filter = attachFilterInput($select, opts.insert, faytId);

        $filter.addClass(opts.cssClass);

        // store the option nodes elsewhere
        // we need them, because we have to filter all nodes, even those 
        // that were sorted out the last time
        $select.faytStore = getValues($select);

        var filterFunc = function () {
            filterFunction($select, $filter, opts);
        }

        // the event fires only of there wasn't a keyup for "opts.timeout" ms, 
        // so fast typing users won't kill the computer
        var timeoutFunc = function () {
            window.clearTimeout(timer);
            timer = window.setTimeout(function () {
                filterFunc();
            }, opts.delay);
        }

        $filter.keyup(timeoutFunc);

        // initialize
        filterFunc();
    }

    // jQuery extension
    $.fn.faytFilter = function (params) {
        // options: params overwrite defaults
        var opts = $.extend({}, $.fn.faytFilter.defaultOpts, params);

        // set'em up
        this.each(function () {
            new $.faytFilter($(this), opts);
        });

        return $;
    }

        // default options
    $.fn.faytFilter.defaultOpts = {
        insert:         'after',        // "before", "after", $-selector string or $-object
        method :        'plain',        // methods: plain, wildcard (* for zero or more and ? for exactly one) and regexp
        showMatches :   false,          // false: don't show, function: call user defined function, $-object: write there, $-selector string: match and write
        caseSensitive : false,          // case sensitive match
        cssClass:       'faytFilter',   // css class for the text field
        delay:          100
    }


})(jQuery);