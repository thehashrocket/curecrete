// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

/**
 * jQuery Validation Plugin 1.11.0pre
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright 2013 JÃ¶rn Zaefferer
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function($) {

    $.extend($.fn, {
        // http://docs.jquery.com/Plugins/Validation/validate
        validate: function( options ) {

            // if nothing is selected, return nothing; can't chain anyway
            if ( !this.length ) {
                if ( options && options.debug && window.console ) {
                    console.warn( "Nothing selected, can't validate, returning nothing." );
                }
                return;
            }

            // check if a validator for this form was already created
            var validator = $.data( this[0], "validator" );
            if ( validator ) {
                return validator;
            }

            // Add novalidate tag if HTML5.
            this.attr( "novalidate", "novalidate" );

            validator = new $.validator( options, this[0] );
            $.data( this[0], "validator", validator );

            if ( validator.settings.onsubmit ) {

                this.validateDelegate( ":submit", "click", function( event ) {
                    if ( validator.settings.submitHandler ) {
                        validator.submitButton = event.target;
                    }
                    // allow suppressing validation by adding a cancel class to the submit button
                    if ( $(event.target).hasClass("cancel") ) {
                        validator.cancelSubmit = true;
                    }
                });

                // validate the form on submit
                this.submit( function( event ) {
                    if ( validator.settings.debug ) {
                        // prevent form submit to be able to see console output
                        event.preventDefault();
                    }
                    function handle() {
                        var hidden;
                        if ( validator.settings.submitHandler ) {
                            if ( validator.submitButton ) {
                                // insert a hidden input as a replacement for the missing submit button
                                hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
                            }
                            validator.settings.submitHandler.call( validator, validator.currentForm, event );
                            if ( validator.submitButton ) {
                                // and clean up afterwards; thanks to no-block-scope, hidden can be referenced
                                hidden.remove();
                            }
                            return false;
                        }
                        return true;
                    }

                    // prevent submit for invalid forms or custom submit handlers
                    if ( validator.cancelSubmit ) {
                        validator.cancelSubmit = false;
                        return handle();
                    }
                    if ( validator.form() ) {
                        if ( validator.pendingRequest ) {
                            validator.formSubmitted = true;
                            return false;
                        }
                        return handle();
                    } else {
                        validator.focusInvalid();
                        return false;
                    }
                });
            }

            return validator;
        },
        // http://docs.jquery.com/Plugins/Validation/valid
        valid: function() {
            if ( $(this[0]).is("form")) {
                return this.validate().form();
            } else {
                var valid = true;
                var validator = $(this[0].form).validate();
                this.each(function() {
                    valid &= validator.element(this);
                });
                return valid;
            }
        },
        // attributes: space seperated list of attributes to retrieve and remove
        removeAttrs: function( attributes ) {
            var result = {},
                $element = this;
            $.each(attributes.split(/\s/), function( index, value ) {
                result[value] = $element.attr(value);
                $element.removeAttr(value);
            });
            return result;
        },
        // http://docs.jquery.com/Plugins/Validation/rules
        rules: function( command, argument ) {
            var element = this[0];

            if ( command ) {
                var settings = $.data(element.form, "validator").settings;
                var staticRules = settings.rules;
                var existingRules = $.validator.staticRules(element);
                switch(command) {
                    case "add":
                        $.extend(existingRules, $.validator.normalizeRule(argument));
                        staticRules[element.name] = existingRules;
                        if ( argument.messages ) {
                            settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
                        }
                        break;
                    case "remove":
                        if ( !argument ) {
                            delete staticRules[element.name];
                            return existingRules;
                        }
                        var filtered = {};
                        $.each(argument.split(/\s/), function( index, method ) {
                            filtered[method] = existingRules[method];
                            delete existingRules[method];
                        });
                        return filtered;
                }
            }

            var data = $.validator.normalizeRules(
                $.extend(
                    {},
                    $.validator.classRules(element),
                    $.validator.attributeRules(element),
                    $.validator.dataRules(element),
                    $.validator.staticRules(element)
                ), element);

            // make sure required is at front
            if ( data.required ) {
                var param = data.required;
                delete data.required;
                data = $.extend({required: param}, data);
            }

            return data;
        }
    });

// Custom selectors
    $.extend($.expr[":"], {
        // http://docs.jquery.com/Plugins/Validation/blank
        blank: function( a ) { return !$.trim("" + a.value); },
        // http://docs.jquery.com/Plugins/Validation/filled
        filled: function( a ) { return !!$.trim("" + a.value); },
        // http://docs.jquery.com/Plugins/Validation/unchecked
        unchecked: function( a ) { return !a.checked; }
    });

// constructor for validator
    $.validator = function( options, form ) {
        this.settings = $.extend( true, {}, $.validator.defaults, options );
        this.currentForm = form;
        this.init();
    };

    $.validator.format = function( source, params ) {
        if ( arguments.length === 1 ) {
            return function() {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.validator.format.apply( this, args );
            };
        }
        if ( arguments.length > 2 && params.constructor !== Array  ) {
            params = $.makeArray(arguments).slice(1);
        }
        if ( params.constructor !== Array ) {
            params = [ params ];
        }
        $.each(params, function( i, n ) {
            source = source.replace( new RegExp("\\{" + i + "\\}", "g"), function() {
                return n;
            });
        });
        return source;
    };

    $.extend($.validator, {

        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            validClass: "valid",
            errorElement: "label",
            focusInvalid: true,
            errorContainer: $([]),
            errorLabelContainer: $([]),
            onsubmit: true,
            ignore: ":hidden",
            ignoreTitle: false,
            onfocusin: function( element, event ) {
                this.lastActive = element;

                // hide error label and remove error class on focus if enabled
                if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
                    if ( this.settings.unhighlight ) {
                        this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
                    }
                    this.addWrapper(this.errorsFor(element)).hide();
                }
            },
            onfocusout: function( element, event ) {
                if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
                    this.element(element);
                }
            },
            onkeyup: function( element, event ) {
                if ( event.which === 9 && this.elementValue(element) === "" ) {
                    return;
                } else if ( element.name in this.submitted || element === this.lastElement ) {
                    this.element(element);
                }
            },
            onclick: function( element, event ) {
                // click on selects, radiobuttons and checkboxes
                if ( element.name in this.submitted ) {
                    this.element(element);
                }
                // or option elements, check parent select in that case
                else if ( element.parentNode.name in this.submitted ) {
                    this.element(element.parentNode);
                }
            },
            highlight: function( element, errorClass, validClass ) {
                if ( element.type === "radio" ) {
                    this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                } else {
                    $(element).addClass(errorClass).removeClass(validClass);
                }
            },
            unhighlight: function( element, errorClass, validClass ) {
                if ( element.type === "radio" ) {
                    this.findByName(element.name).removeClass(errorClass).addClass(validClass);
                } else {
                    $(element).removeClass(errorClass).addClass(validClass);
                }
            }
        },

        // http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
        setDefaults: function( settings ) {
            $.extend( $.validator.defaults, settings );
        },

        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            creditcard: "Please enter a valid credit card number.",
            equalTo: "Please enter the same value again.",
            maxlength: $.validator.format("Please enter no more than {0} characters."),
            minlength: $.validator.format("Please enter at least {0} characters."),
            rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
            range: $.validator.format("Please enter a value between {0} and {1}."),
            max: $.validator.format("Please enter a value less than or equal to {0}."),
            min: $.validator.format("Please enter a value greater than or equal to {0}.")
        },

        autoCreateRanges: false,

        prototype: {

            init: function() {
                this.labelContainer = $(this.settings.errorLabelContainer);
                this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
                this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
                this.submitted = {};
                this.valueCache = {};
                this.pendingRequest = 0;
                this.pending = {};
                this.invalid = {};
                this.reset();

                var groups = (this.groups = {});
                $.each(this.settings.groups, function( key, value ) {
                    if ( typeof value === "string" ) {
                        value = value.split(/\s/);
                    }
                    $.each(value, function( index, name ) {
                        groups[name] = key;
                    });
                });
                var rules = this.settings.rules;
                $.each(rules, function( key, value ) {
                    rules[key] = $.validator.normalizeRule(value);
                });

                function delegate(event) {
                    var validator = $.data(this[0].form, "validator"),
                        eventType = "on" + event.type.replace(/^validate/, "");
                    if ( validator.settings[eventType] ) {
                        validator.settings[eventType].call(validator, this[0], event);
                    }
                }
                $(this.currentForm)
                    .validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
                        "[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
                        "[type='email'], [type='datetime'], [type='date'], [type='month'], " +
                        "[type='week'], [type='time'], [type='datetime-local'], " +
                        "[type='range'], [type='color'] ",
                        "focusin focusout keyup", delegate)
                    .validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

                if ( this.settings.invalidHandler ) {
                    $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
                }
            },

            // http://docs.jquery.com/Plugins/Validation/Validator/form
            form: function() {
                this.checkForm();
                $.extend(this.submitted, this.errorMap);
                this.invalid = $.extend({}, this.errorMap);
                if ( !this.valid() ) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                }
                this.showErrors();
                return this.valid();
            },

            checkForm: function() {
                this.prepareForm();
                for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
                    this.check( elements[i] );
                }
                return this.valid();
            },

            // http://docs.jquery.com/Plugins/Validation/Validator/element
            element: function( element ) {
                element = this.validationTargetFor( this.clean( element ) );
                this.lastElement = element;
                this.prepareElement( element );
                this.currentElements = $(element);
                var result = this.check( element ) !== false;
                if ( result ) {
                    delete this.invalid[element.name];
                } else {
                    this.invalid[element.name] = true;
                }
                if ( !this.numberOfInvalids() ) {
                    // Hide error containers on last error
                    this.toHide = this.toHide.add( this.containers );
                }
                this.showErrors();
                return result;
            },

            // http://docs.jquery.com/Plugins/Validation/Validator/showErrors
            showErrors: function( errors ) {
                if ( errors ) {
                    // add items to error list and map
                    $.extend( this.errorMap, errors );
                    this.errorList = [];
                    for ( var name in errors ) {
                        this.errorList.push({
                            message: errors[name],
                            element: this.findByName(name)[0]
                        });
                    }
                    // remove items from success list
                    this.successList = $.grep( this.successList, function( element ) {
                        return !(element.name in errors);
                    });
                }
                if ( this.settings.showErrors ) {
                    this.settings.showErrors.call( this, this.errorMap, this.errorList );
                } else {
                    this.defaultShowErrors();
                }
            },

            // http://docs.jquery.com/Plugins/Validation/Validator/resetForm
            resetForm: function() {
                if ( $.fn.resetForm ) {
                    $(this.currentForm).resetForm();
                }
                this.submitted = {};
                this.lastElement = null;
                this.prepareForm();
                this.hideErrors();
                this.elements().removeClass( this.settings.errorClass ).removeData( "previousValue" );
            },

            numberOfInvalids: function() {
                return this.objectLength(this.invalid);
            },

            objectLength: function( obj ) {
                var count = 0;
                for ( var i in obj ) {
                    count++;
                }
                return count;
            },

            hideErrors: function() {
                this.addWrapper( this.toHide ).hide();
            },

            valid: function() {
                return this.size() === 0;
            },

            size: function() {
                return this.errorList.length;
            },

            focusInvalid: function() {
                if ( this.settings.focusInvalid ) {
                    try {
                        $(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
                            .filter(":visible")
                            .focus()
                            // manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
                            .trigger("focusin");
                    } catch(e) {
                        // ignore IE throwing errors when focusing hidden elements
                    }
                }
            },

            findLastActive: function() {
                var lastActive = this.lastActive;
                return lastActive && $.grep(this.errorList, function( n ) {
                    return n.element.name === lastActive.name;
                }).length === 1 && lastActive;
            },

            elements: function() {
                var validator = this,
                    rulesCache = {};

                // select all valid inputs inside the form (no submit or reset buttons)
                return $(this.currentForm)
                    .find("input, select, textarea")
                    .not(":submit, :reset, :image, [disabled]")
                    .not( this.settings.ignore )
                    .filter(function() {
                        if ( !this.name ) {
                            if ( window.console ) {
                                console.error( "%o has no name assigned", this );
                            }
                            throw new Error( "Failed to validate, found an element with no name assigned. See console for element reference." );
                        }

                        // select only the first element for each name, and only those with rules specified
                        if ( this.name in rulesCache || !validator.objectLength($(this).rules()) ) {
                            return false;
                        }

                        rulesCache[this.name] = true;
                        return true;
                    });
            },

            clean: function( selector ) {
                return $(selector)[0];
            },

            errors: function() {
                var errorClass = this.settings.errorClass.replace(" ", ".");
                return $(this.settings.errorElement + "." + errorClass, this.errorContext);
            },

            reset: function() {
                this.successList = [];
                this.errorList = [];
                this.errorMap = {};
                this.toShow = $([]);
                this.toHide = $([]);
                this.currentElements = $([]);
            },

            prepareForm: function() {
                this.reset();
                this.toHide = this.errors().add( this.containers );
            },

            prepareElement: function( element ) {
                this.reset();
                this.toHide = this.errorsFor(element);
            },

            elementValue: function( element ) {
                var type = $(element).attr("type"),
                    val = $(element).val();

                if ( type === "radio" || type === "checkbox" ) {
                    return $("input[name='" + $(element).attr("name") + "']:checked").val();
                }

                if ( typeof val === "string" ) {
                    return val.replace(/\r/g, "");
                }
                return val;
            },

            check: function( element ) {
                element = this.validationTargetFor( this.clean( element ) );

                var rules = $(element).rules();
                var dependencyMismatch = false;
                var val = this.elementValue(element);
                var result;

                for (var method in rules ) {
                    var rule = { method: method, parameters: rules[method] };
                    try {

                        result = $.validator.methods[method].call( this, val, element, rule.parameters );

                        // if a method indicates that the field is optional and therefore valid,
                        // don't mark it as valid when there are no other rules
                        if ( result === "dependency-mismatch" ) {
                            dependencyMismatch = true;
                            continue;
                        }
                        dependencyMismatch = false;

                        if ( result === "pending" ) {
                            this.toHide = this.toHide.not( this.errorsFor(element) );
                            return;
                        }

                        if ( !result ) {
                            this.formatAndAdd( element, rule );
                            return false;
                        }
                    } catch(e) {
                        if ( this.settings.debug && window.console ) {
                            console.log( "Exception occured when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
                        }
                        throw e;
                    }
                }
                if ( dependencyMismatch ) {
                    return;
                }
                if ( this.objectLength(rules) ) {
                    this.successList.push(element);
                }
                return true;
            },

            // return the custom message for the given element and validation method
            // specified in the element's HTML5 data attribute
            customDataMessage: function( element, method ) {
                return $(element).data("msg-" + method.toLowerCase()) || (element.attributes && $(element).attr("data-msg-" + method.toLowerCase()));
            },

            // return the custom message for the given element name and validation method
            customMessage: function( name, method ) {
                var m = this.settings.messages[name];
                return m && (m.constructor === String ? m : m[method]);
            },

            // return the first defined argument, allowing empty strings
            findDefined: function() {
                for(var i = 0; i < arguments.length; i++) {
                    if ( arguments[i] !== undefined ) {
                        return arguments[i];
                    }
                }
                return undefined;
            },

            defaultMessage: function( element, method ) {
                return this.findDefined(
                    this.customMessage( element.name, method ),
                    this.customDataMessage( element, method ),
                    // title is never undefined, so handle empty string as undefined
                    !this.settings.ignoreTitle && element.title || undefined,
                    $.validator.messages[method],
                    "<strong>Warning: No message defined for " + element.name + "</strong>"
                );
            },

            formatAndAdd: function( element, rule ) {
                var message = this.defaultMessage( element, rule.method ),
                    theregex = /\$?\{(\d+)\}/g;
                if ( typeof message === "function" ) {
                    message = message.call(this, rule.parameters, element);
                } else if (theregex.test(message)) {
                    message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
                }
                this.errorList.push({
                    message: message,
                    element: element
                });

                this.errorMap[element.name] = message;
                this.submitted[element.name] = message;
            },

            addWrapper: function( toToggle ) {
                if ( this.settings.wrapper ) {
                    toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
                }
                return toToggle;
            },

            defaultShowErrors: function() {
                var i, elements;
                for ( i = 0; this.errorList[i]; i++ ) {
                    var error = this.errorList[i];
                    if ( this.settings.highlight ) {
                        this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
                    }
                    this.showLabel( error.element, error.message );
                }
                if ( this.errorList.length ) {
                    this.toShow = this.toShow.add( this.containers );
                }
                if ( this.settings.success ) {
                    for ( i = 0; this.successList[i]; i++ ) {
                        this.showLabel( this.successList[i] );
                    }
                }
                if ( this.settings.unhighlight ) {
                    for ( i = 0, elements = this.validElements(); elements[i]; i++ ) {
                        this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
                    }
                }
                this.toHide = this.toHide.not( this.toShow );
                this.hideErrors();
                this.addWrapper( this.toShow ).show();
            },

            validElements: function() {
                return this.currentElements.not(this.invalidElements());
            },

            invalidElements: function() {
                return $(this.errorList).map(function() {
                    return this.element;
                });
            },

            showLabel: function( element, message ) {
                var label = this.errorsFor( element );
                if ( label.length ) {
                    // refresh error/success class
                    label.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );

                    // check if we have a generated label, replace the message then
                    if ( label.attr("generated") ) {
                        label.html(message);
                    }
                } else {
                    // create label
                    label = $("<" + this.settings.errorElement + "/>")
                        .attr({"for":  this.idOrName(element), generated: true})
                        .addClass(this.settings.errorClass)
                        .html(message || "");
                    if ( this.settings.wrapper ) {
                        // make sure the element is visible, even in IE
                        // actually showing the wrapped element is handled elsewhere
                        label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
                    }
                    if ( !this.labelContainer.append(label).length ) {
                        if ( this.settings.errorPlacement ) {
                            this.settings.errorPlacement(label, $(element) );
                        } else {
                            label.insertAfter(element);
                        }
                    }
                }
                if ( !message && this.settings.success ) {
                    label.text("");
                    if ( typeof this.settings.success === "string" ) {
                        label.addClass( this.settings.success );
                    } else {
                        this.settings.success( label, element );
                    }
                }
                this.toShow = this.toShow.add(label);
            },

            errorsFor: function( element ) {
                var name = this.idOrName(element);
                return this.errors().filter(function() {
                    return $(this).attr("for") === name;
                });
            },

            idOrName: function( element ) {
                return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
            },

            validationTargetFor: function( element ) {
                // if radio/checkbox, validate first element in group instead
                if ( this.checkable(element) ) {
                    element = this.findByName( element.name ).not(this.settings.ignore)[0];
                }
                return element;
            },

            checkable: function( element ) {
                return (/radio|checkbox/i).test(element.type);
            },

            findByName: function( name ) {
                return $(this.currentForm).find("[name='" + name + "']");
            },

            getLength: function( value, element ) {
                switch( element.nodeName.toLowerCase() ) {
                    case "select":
                        return $("option:selected", element).length;
                    case "input":
                        if ( this.checkable( element) ) {
                            return this.findByName(element.name).filter(":checked").length;
                        }
                }
                return value.length;
            },

            depend: function( param, element ) {
                return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
            },

            dependTypes: {
                "boolean": function( param, element ) {
                    return param;
                },
                "string": function( param, element ) {
                    return !!$(param, element.form).length;
                },
                "function": function( param, element ) {
                    return param(element);
                }
            },

            optional: function( element ) {
                var val = this.elementValue(element);
                return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
            },

            startRequest: function( element ) {
                if ( !this.pending[element.name] ) {
                    this.pendingRequest++;
                    this.pending[element.name] = true;
                }
            },

            stopRequest: function( element, valid ) {
                this.pendingRequest--;
                // sometimes synchronization fails, make sure pendingRequest is never < 0
                if ( this.pendingRequest < 0 ) {
                    this.pendingRequest = 0;
                }
                delete this.pending[element.name];
                if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
                    $(this.currentForm).submit();
                    this.formSubmitted = false;
                } else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                    this.formSubmitted = false;
                }
            },

            previousValue: function( element ) {
                return $.data(element, "previousValue") || $.data(element, "previousValue", {
                    old: null,
                    valid: true,
                    message: this.defaultMessage( element, "remote" )
                });
            }

        },

        classRuleSettings: {
            required: {required: true},
            email: {email: true},
            url: {url: true},
            date: {date: true},
            dateISO: {dateISO: true},
            number: {number: true},
            digits: {digits: true},
            creditcard: {creditcard: true}
        },

        addClassRules: function( className, rules ) {
            if ( className.constructor === String ) {
                this.classRuleSettings[className] = rules;
            } else {
                $.extend(this.classRuleSettings, className);
            }
        },

        classRules: function( element ) {
            var rules = {};
            var classes = $(element).attr("class");
            if ( classes ) {
                $.each(classes.split(" "), function() {
                    if ( this in $.validator.classRuleSettings ) {
                        $.extend(rules, $.validator.classRuleSettings[this]);
                    }
                });
            }
            return rules;
        },

        attributeRules: function( element ) {
            var rules = {};
            var $element = $(element);

            for (var method in $.validator.methods) {
                var value;

                // support for <input required> in both html5 and older browsers
                if ( method === "required" ) {
                    value = $element.get(0).getAttribute(method);
                    // Some browsers return an empty string for the required attribute
                    // and non-HTML5 browsers might have required="" markup
                    if ( value === "" ) {
                        value = true;
                    }
                    // force non-HTML5 browsers to return bool
                    value = !!value;
                } else {
                    value = $element.attr(method);
                }

                if ( value ) {
                    rules[method] = value;
                } else if ( $element[0].getAttribute("type") === method ) {
                    rules[method] = true;
                }
            }

            // maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
            if ( rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength) ) {
                delete rules.maxlength;
            }

            return rules;
        },

        dataRules: function( element ) {
            var method, value,
                rules = {}, $element = $(element);
            for (method in $.validator.methods) {
                value = $element.data("rule-" + method.toLowerCase());
                if ( value !== undefined ) {
                    rules[method] = value;
                }
            }
            return rules;
        },

        staticRules: function( element ) {
            var rules = {};
            var validator = $.data(element.form, "validator");
            if ( validator.settings.rules ) {
                rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
            }
            return rules;
        },

        normalizeRules: function( rules, element ) {
            // handle dependency check
            $.each(rules, function( prop, val ) {
                // ignore rule when param is explicitly false, eg. required:false
                if ( val === false ) {
                    delete rules[prop];
                    return;
                }
                if ( val.param || val.depends ) {
                    var keepRule = true;
                    switch (typeof val.depends) {
                        case "string":
                            keepRule = !!$(val.depends, element.form).length;
                            break;
                        case "function":
                            keepRule = val.depends.call(element, element);
                            break;
                    }
                    if ( keepRule ) {
                        rules[prop] = val.param !== undefined ? val.param : true;
                    } else {
                        delete rules[prop];
                    }
                }
            });

            // evaluate parameters
            $.each(rules, function( rule, parameter ) {
                rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
            });

            // clean number parameters
            $.each(["minlength", "maxlength", "min", "max"], function() {
                if ( rules[this] ) {
                    rules[this] = Number(rules[this]);
                }
            });
            $.each(["rangelength", "range"], function() {
                var parts;
                if ( rules[this] ) {
                    if ( $.isArray(rules[this]) ) {
                        rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
                    } else if ( typeof rules[this] === "string" ) {
                        parts = rules[this].split(/[\s,]+/);
                        rules[this] = [Number(parts[0]), Number(parts[1])];
                    }
                }
            });

            if ( $.validator.autoCreateRanges ) {
                // auto-create ranges
                if ( rules.min && rules.max ) {
                    rules.range = [rules.min, rules.max];
                    delete rules.min;
                    delete rules.max;
                }
                if ( rules.minlength && rules.maxlength ) {
                    rules.rangelength = [rules.minlength, rules.maxlength];
                    delete rules.minlength;
                    delete rules.maxlength;
                }
            }

            return rules;
        },

        // Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
        normalizeRule: function( data ) {
            if ( typeof data === "string" ) {
                var transformed = {};
                $.each(data.split(/\s/), function() {
                    transformed[this] = true;
                });
                data = transformed;
            }
            return data;
        },

        // http://docs.jquery.com/Plugins/Validation/Validator/addMethod
        addMethod: function( name, method, message ) {
            $.validator.methods[name] = method;
            $.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
            if ( method.length < 3 ) {
                $.validator.addClassRules(name, $.validator.normalizeRule(name));
            }
        },

        methods: {

            // http://docs.jquery.com/Plugins/Validation/Methods/required
            required: function( value, element, param ) {
                // check if dependency is met
                if ( !this.depend(param, element) ) {
                    return "dependency-mismatch";
                }
                if ( element.nodeName.toLowerCase() === "select" ) {
                    // could be an array for select-multiple or a string, both are fine this way
                    var val = $(element).val();
                    return val && val.length > 0;
                }
                if ( this.checkable(element) ) {
                    return this.getLength(value, element) > 0;
                }
                return $.trim(value).length > 0;
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/remote
            remote: function( value, element, param ) {
                if ( this.optional(element) ) {
                    return "dependency-mismatch";
                }

                var previous = this.previousValue(element);
                if (!this.settings.messages[element.name] ) {
                    this.settings.messages[element.name] = {};
                }
                previous.originalMessage = this.settings.messages[element.name].remote;
                this.settings.messages[element.name].remote = previous.message;

                param = typeof param === "string" && {url:param} || param;

                if ( previous.old === value ) {
                    return previous.valid;
                }

                previous.old = value;
                var validator = this;
                this.startRequest(element);
                var data = {};
                data[element.name] = value;
                $.ajax($.extend(true, {
                    url: param,
                    mode: "abort",
                    port: "validate" + element.name,
                    dataType: "json",
                    data: data,
                    success: function( response ) {
                        validator.settings.messages[element.name].remote = previous.originalMessage;
                        var valid = response === true || response === "true";
                        if ( valid ) {
                            var submitted = validator.formSubmitted;
                            validator.prepareElement(element);
                            validator.formSubmitted = submitted;
                            validator.successList.push(element);
                            delete validator.invalid[element.name];
                            validator.showErrors();
                        } else {
                            var errors = {};
                            var message = response || validator.defaultMessage( element, "remote" );
                            errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
                            validator.invalid[element.name] = true;
                            validator.showErrors(errors);
                        }
                        previous.valid = valid;
                        validator.stopRequest(element, valid);
                    }
                }, param));
                return "pending";
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/minlength
            minlength: function( value, element, param ) {
                var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
                return this.optional(element) || length >= param;
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/maxlength
            maxlength: function( value, element, param ) {
                var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
                return this.optional(element) || length <= param;
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/rangelength
            rangelength: function( value, element, param ) {
                var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
                return this.optional(element) || ( length >= param[0] && length <= param[1] );
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/min
            min: function( value, element, param ) {
                return this.optional(element) || value >= param;
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/max
            max: function( value, element, param ) {
                return this.optional(element) || value <= param;
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/range
            range: function( value, element, param ) {
                return this.optional(element) || ( value >= param[0] && value <= param[1] );
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/email
            email: function( value, element ) {
                // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
                return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/url
            url: function( value, element ) {
                // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
                return this.optional(element) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/date
            date: function( value, element ) {
                return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/dateISO
            dateISO: function( value, element ) {
                return this.optional(element) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/number
            number: function( value, element ) {
                return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/digits
            digits: function( value, element ) {
                return this.optional(element) || /^\d+$/.test(value);
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/creditcard
            // based on http://en.wikipedia.org/wiki/Luhn
            creditcard: function( value, element ) {
                if ( this.optional(element) ) {
                    return "dependency-mismatch";
                }
                // accept only spaces, digits and dashes
                if ( /[^0-9 \-]+/.test(value) ) {
                    return false;
                }
                var nCheck = 0,
                    nDigit = 0,
                    bEven = false;

                value = value.replace(/\D/g, "");

                for (var n = value.length - 1; n >= 0; n--) {
                    var cDigit = value.charAt(n);
                    nDigit = parseInt(cDigit, 10);
                    if ( bEven ) {
                        if ( (nDigit *= 2) > 9 ) {
                            nDigit -= 9;
                        }
                    }
                    nCheck += nDigit;
                    bEven = !bEven;
                }

                return (nCheck % 10) === 0;
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/equalTo
            equalTo: function( value, element, param ) {
                // bind to the blur event of the target in order to revalidate whenever the target field is updated
                // TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
                var target = $(param);
                if ( this.settings.onfocusout ) {
                    target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                        $(element).valid();
                    });
                }
                return value === target.val();
            }

        }

    });

// deprecated, use $.validator.format instead
    $.format = $.validator.format;

}(jQuery));

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
(function($) {
    var pendingRequests = {};
    // Use a prefilter if available (1.5+)
    if ( $.ajaxPrefilter ) {
        $.ajaxPrefilter(function( settings, _, xhr ) {
            var port = settings.port;
            if ( settings.mode === "abort" ) {
                if ( pendingRequests[port] ) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = xhr;
            }
        });
    } else {
        // Proxy ajax
        var ajax = $.ajax;
        $.ajax = function( settings ) {
            var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
                port = ( "port" in settings ? settings : $.ajaxSettings ).port;
            if ( mode === "abort" ) {
                if ( pendingRequests[port] ) {
                    pendingRequests[port].abort();
                }
                return (pendingRequests[port] = ajax.apply(this, arguments));
            }
            return ajax.apply(this, arguments);
        };
    }
}(jQuery));

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
(function($) {
    $.extend($.fn, {
        validateDelegate: function( delegate, type, handler ) {
            return this.bind(type, function( event ) {
                var target = $(event.target);
                if ( target.is(delegate) ) {
                    return handler.apply(target, arguments);
                }
            });
        }
    });
}(jQuery));

// Dropzone.js ver 3.0
;(function(){

    /**
     * Require the given path.
     *
     * @param {String} path
     * @return {Object} exports
     * @api public
     */

    function require(path, parent, orig) {
        var resolved = require.resolve(path);

        // lookup failed
        if (null == resolved) {
            orig = orig || path;
            parent = parent || 'root';
            var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
            err.path = orig;
            err.parent = parent;
            err.require = true;
            throw err;
        }

        var module = require.modules[resolved];

        // perform real require()
        // by invoking the module's
        // registered function
        if (!module.exports) {
            module.exports = {};
            module.client = module.component = true;
            module.call(this, module.exports, require.relative(resolved), module);
        }

        return module.exports;
    }

    /**
     * Registered modules.
     */

    require.modules = {};

    /**
     * Registered aliases.
     */

    require.aliases = {};

    /**
     * Resolve `path`.
     *
     * Lookup:
     *
     *   - PATH/index.js
     *   - PATH.js
     *   - PATH
     *
     * @param {String} path
     * @return {String} path or null
     * @api private
     */

    require.resolve = function(path) {
        if (path.charAt(0) === '/') path = path.slice(1);

        var paths = [
            path,
            path + '.js',
            path + '.json',
            path + '/index.js',
            path + '/index.json'
        ];

        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            if (require.modules.hasOwnProperty(path)) return path;
            if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
        }
    };

    /**
     * Normalize `path` relative to the current path.
     *
     * @param {String} curr
     * @param {String} path
     * @return {String}
     * @api private
     */

    require.normalize = function(curr, path) {
        var segs = [];

        if ('.' != path.charAt(0)) return path;

        curr = curr.split('/');
        path = path.split('/');

        for (var i = 0; i < path.length; ++i) {
            if ('..' == path[i]) {
                curr.pop();
            } else if ('.' != path[i] && '' != path[i]) {
                segs.push(path[i]);
            }
        }

        return curr.concat(segs).join('/');
    };

    /**
     * Register module at `path` with callback `definition`.
     *
     * @param {String} path
     * @param {Function} definition
     * @api private
     */

    require.register = function(path, definition) {
        require.modules[path] = definition;
    };

    /**
     * Alias a module definition.
     *
     * @param {String} from
     * @param {String} to
     * @api private
     */

    require.alias = function(from, to) {
        if (!require.modules.hasOwnProperty(from)) {
            throw new Error('Failed to alias "' + from + '", it does not exist');
        }
        require.aliases[to] = from;
    };

    /**
     * Return a require function relative to the `parent` path.
     *
     * @param {String} parent
     * @return {Function}
     * @api private
     */

    require.relative = function(parent) {
        var p = require.normalize(parent, '..');

        /**
         * lastIndexOf helper.
         */

        function lastIndexOf(arr, obj) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) return i;
            }
            return -1;
        }

        /**
         * The relative require() itself.
         */

        function localRequire(path) {
            var resolved = localRequire.resolve(path);
            return require(resolved, parent, path);
        }

        /**
         * Resolve relative to the parent.
         */

        localRequire.resolve = function(path) {
            var c = path.charAt(0);
            if ('/' == c) return path.slice(1);
            if ('.' == c) return require.normalize(p, path);

            // resolve deps by returning
            // the dep in the nearest "deps"
            // directory
            var segs = parent.split('/');
            var i = lastIndexOf(segs, 'deps') + 1;
            if (!i) i = 0;
            path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
            return path;
        };

        /**
         * Check if module is defined at `path`.
         */

        localRequire.exists = function(path) {
            return require.modules.hasOwnProperty(localRequire.resolve(path));
        };

        return localRequire;
    };
    require.register("component-emitter/index.js", function(exports, require, module){

        /**
         * Expose `Emitter`.
         */

        module.exports = Emitter;

        /**
         * Initialize a new `Emitter`.
         *
         * @api public
         */

        function Emitter(obj) {
            if (obj) return mixin(obj);
        };

        /**
         * Mixin the emitter properties.
         *
         * @param {Object} obj
         * @return {Object}
         * @api private
         */

        function mixin(obj) {
            for (var key in Emitter.prototype) {
                obj[key] = Emitter.prototype[key];
            }
            return obj;
        }

        /**
         * Listen on the given `event` with `fn`.
         *
         * @param {String} event
         * @param {Function} fn
         * @return {Emitter}
         * @api public
         */

        Emitter.prototype.on = function(event, fn){
            this._callbacks = this._callbacks || {};
            (this._callbacks[event] = this._callbacks[event] || [])
                .push(fn);
            return this;
        };

        /**
         * Adds an `event` listener that will be invoked a single
         * time then automatically removed.
         *
         * @param {String} event
         * @param {Function} fn
         * @return {Emitter}
         * @api public
         */

        Emitter.prototype.once = function(event, fn){
            var self = this;
            this._callbacks = this._callbacks || {};

            function on() {
                self.off(event, on);
                fn.apply(this, arguments);
            }

            fn._off = on;
            this.on(event, on);
            return this;
        };

        /**
         * Remove the given callback for `event` or all
         * registered callbacks.
         *
         * @param {String} event
         * @param {Function} fn
         * @return {Emitter}
         * @api public
         */

        Emitter.prototype.off =
            Emitter.prototype.removeListener =
                Emitter.prototype.removeAllListeners = function(event, fn){
                    this._callbacks = this._callbacks || {};
                    var callbacks = this._callbacks[event];
                    if (!callbacks) return this;

                    // remove all handlers
                    if (1 == arguments.length) {
                        delete this._callbacks[event];
                        return this;
                    }

                    // remove specific handler
                    var i = callbacks.indexOf(fn._off || fn);
                    if (~i) callbacks.splice(i, 1);
                    return this;
                };

        /**
         * Emit `event` with the given args.
         *
         * @param {String} event
         * @param {Mixed} ...
         * @return {Emitter}
         */

        Emitter.prototype.emit = function(event){
            this._callbacks = this._callbacks || {};
            var args = [].slice.call(arguments, 1)
                , callbacks = this._callbacks[event];

            if (callbacks) {
                callbacks = callbacks.slice(0);
                for (var i = 0, len = callbacks.length; i < len; ++i) {
                    callbacks[i].apply(this, args);
                }
            }

            return this;
        };

        /**
         * Return array of callbacks for `event`.
         *
         * @param {String} event
         * @return {Array}
         * @api public
         */

        Emitter.prototype.listeners = function(event){
            this._callbacks = this._callbacks || {};
            return this._callbacks[event] || [];
        };

        /**
         * Check if this emitter has `event` handlers.
         *
         * @param {String} event
         * @return {Boolean}
         * @api public
         */

        Emitter.prototype.hasListeners = function(event){
            return !! this.listeners(event).length;
        };

    });
    require.register("dropzone/index.js", function(exports, require, module){


        /**
         * Exposing dropzone
         */
        module.exports = require("./lib/dropzone.js");

    });
    require.register("dropzone/lib/dropzone.js", function(exports, require, module){
        /*
         #
         # More info at [www.dropzonejs.com](http://www.dropzonejs.com)
         #
         # Copyright (c) 2012, Matias Meno
         #
         # Permission is hereby granted, free of charge, to any person obtaining a copy
         # of this software and associated documentation files (the "Software"), to deal
         # in the Software without restriction, including without limitation the rights
         # to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
         # copies of the Software, and to permit persons to whom the Software is
         # furnished to do so, subject to the following conditions:
         #
         # The above copyright notice and this permission notice shall be included in
         # all copies or substantial portions of the Software.
         #
         # THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
         # IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
         # FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
         # AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
         # LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
         # OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
         # THE SOFTWARE.
         #
         */


        (function() {
            var Dropzone, Em, camelize, contentLoaded, noop, without,
                __hasProp = {}.hasOwnProperty,
                __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
                __slice = [].slice;

            Em = typeof Emitter !== "undefined" && Emitter !== null ? Emitter : require("emitter");

            noop = function() {};

            Dropzone = (function(_super) {
                var extend;

                __extends(Dropzone, _super);

                /*
                 This is a list of all available events you can register on a dropzone object.

                 You can register an event handler like this:

                 dropzone.on("dragEnter", function() { });
                 */


                Dropzone.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "selectedfiles", "addedfile", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded"];

                Dropzone.prototype.defaultOptions = {
                    url: null,
                    method: "post",
                    withCredentials: false,
                    parallelUploads: 2,
                    uploadMultiple: false,
                    maxFilesize: 256,
                    paramName: "file",
                    createImageThumbnails: true,
                    maxThumbnailFilesize: 10,
                    thumbnailWidth: 100,
                    thumbnailHeight: 100,
                    maxFiles: null,
                    params: {},
                    clickable: true,
                    ignoreHiddenFiles: true,
                    acceptedFiles: null,
                    acceptedMimeTypes: null,
                    autoProcessQueue: true,
                    addRemoveLinks: false,
                    previewsContainer: null,
                    dictDefaultMessage: "Drop files here to upload",
                    dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
                    dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
                    dictFileTooBig: "File is too big ({{filesize}}MB). Max filesize: {{maxFilesize}}MB.",
                    dictInvalidFileType: "You can't upload files of this type.",
                    dictResponseError: "Server responded with {{statusCode}} code.",
                    dictCancelUpload: "Cancel upload",
                    dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
                    dictRemoveFile: "Remove file",
                    dictRemoveFileConfirmation: null,
                    dictMaxFilesExceeded: "You can only upload {{maxFiles}} files.",
                    accept: function(file, done) {
                        return done();
                    },
                    init: function() {
                        return noop;
                    },
                    forceFallback: false,
                    fallback: function() {
                        var child, messageElement, span, _i, _len, _ref;
                        this.element.className = "" + this.element.className + " dz-browser-not-supported";
                        _ref = this.element.getElementsByTagName("div");
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            child = _ref[_i];
                            if (/(^| )dz-message($| )/.test(child.className)) {
                                messageElement = child;
                                child.className = "dz-message";
                                continue;
                            }
                        }
                        if (!messageElement) {
                            messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
                            this.element.appendChild(messageElement);
                        }
                        span = messageElement.getElementsByTagName("span")[0];
                        if (span) {
                            span.textContent = this.options.dictFallbackMessage;
                        }
                        return this.element.appendChild(this.getFallbackForm());
                    },
                    resize: function(file) {
                        var info, srcRatio, trgRatio;
                        info = {
                            srcX: 0,
                            srcY: 0,
                            srcWidth: file.width,
                            srcHeight: file.height
                        };
                        srcRatio = file.width / file.height;
                        trgRatio = this.options.thumbnailWidth / this.options.thumbnailHeight;
                        if (file.height < this.options.thumbnailHeight || file.width < this.options.thumbnailWidth) {
                            info.trgHeight = info.srcHeight;
                            info.trgWidth = info.srcWidth;
                        } else {
                            if (srcRatio > trgRatio) {
                                info.srcHeight = file.height;
                                info.srcWidth = info.srcHeight * trgRatio;
                            } else {
                                info.srcWidth = file.width;
                                info.srcHeight = info.srcWidth / trgRatio;
                            }
                        }
                        info.srcX = (file.width - info.srcWidth) / 2;
                        info.srcY = (file.height - info.srcHeight) / 2;
                        return info;
                    },
                    /*
                     Those functions register themselves to the events on init and handle all
                     the user interface specific stuff. Overwriting them won't break the upload
                     but can break the way it's displayed.
                     You can overwrite them if you don't like the default behavior. If you just
                     want to add an additional event handler, register it on the dropzone object
                     and don't overwrite those options.
                     */

                    drop: function(e) {
                        return this.element.classList.remove("dz-drag-hover");
                    },
                    dragstart: noop,
                    dragend: function(e) {
                        return this.element.classList.remove("dz-drag-hover");
                    },
                    dragenter: function(e) {
                        return this.element.classList.add("dz-drag-hover");
                    },
                    dragover: function(e) {
                        return this.element.classList.add("dz-drag-hover");
                    },
                    dragleave: function(e) {
                        return this.element.classList.remove("dz-drag-hover");
                    },
                    selectedfiles: function(files) {
                        if (this.element === this.previewsContainer) {
                            return this.element.classList.add("dz-started");
                        }
                    },
                    reset: function() {
                        return this.element.classList.remove("dz-started");
                    },
                    addedfile: function(file) {
                        var _this = this;
                        file.previewElement = Dropzone.createElement(this.options.previewTemplate);
                        file.previewTemplate = file.previewElement;
                        this.previewsContainer.appendChild(file.previewElement);
                        file.previewElement.querySelector("[data-dz-name]").textContent = file.name;
                        file.previewElement.querySelector("[data-dz-size]").innerHTML = this.filesize(file.size);
                        if (this.options.addRemoveLinks) {
                            file._removeLink = Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\">" + this.options.dictRemoveFile + "</a>");
                            file._removeLink.addEventListener("click", function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                if (file.status === Dropzone.UPLOADING) {
                                    return Dropzone.confirm(_this.options.dictCancelUploadConfirmation, function() {
                                        return _this.removeFile(file);
                                    });
                                } else {
                                    if (_this.options.dictRemoveFileConfirmation) {
                                        return Dropzone.confirm(_this.options.dictRemoveFileConfirmation, function() {
                                            return _this.removeFile(file);
                                        });
                                    } else {
                                        return _this.removeFile(file);
                                    }
                                }
                            });
                            file.previewElement.appendChild(file._removeLink);
                        }
                        return this._updateMaxFilesReachedClass();
                    },
                    removedfile: function(file) {
                        var _ref;
                        if ((_ref = file.previewElement) != null) {
                            _ref.parentNode.removeChild(file.previewElement);
                        }
                        return this._updateMaxFilesReachedClass();
                    },
                    thumbnail: function(file, dataUrl) {
                        var thumbnailElement;
                        file.previewElement.classList.remove("dz-file-preview");
                        file.previewElement.classList.add("dz-image-preview");
                        thumbnailElement = file.previewElement.querySelector("[data-dz-thumbnail]");
                        thumbnailElement.alt = file.name;
                        return thumbnailElement.src = dataUrl;
                    },
                    error: function(file, message) {
                        file.previewElement.classList.add("dz-error");
                        return file.previewElement.querySelector("[data-dz-errormessage]").textContent = message;
                    },
                    errormultiple: noop,
                    processing: function(file) {
                        file.previewElement.classList.add("dz-processing");
                        if (file._removeLink) {
                            return file._removeLink.textContent = this.options.dictCancelUpload;
                        }
                    },
                    processingmultiple: noop,
                    uploadprogress: function(file, progress, bytesSent) {
                        return file.previewElement.querySelector("[data-dz-uploadprogress]").style.width = "" + progress + "%";
                    },
                    totaluploadprogress: noop,
                    sending: noop,
                    sendingmultiple: noop,
                    success: function(file) {
                        return file.previewElement.classList.add("dz-success");
                    },
                    successmultiple: noop,
                    canceled: function(file) {
                        return this.emit("error", file, "Upload canceled.");
                    },
                    canceledmultiple: noop,
                    complete: function(file) {
                        if (file._removeLink) {
                            return file._removeLink.textContent = this.options.dictRemoveFile;
                        }
                    },
                    completemultiple: noop,
                    maxfilesexceeded: noop,
                    previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-details\">\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></div>\n    <img data-dz-thumbnail />\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-success-mark\"><span>✔</span></div>\n  <div class=\"dz-error-mark\"><span>✘</span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>"
                };

                extend = function() {
                    var key, object, objects, target, val, _i, _len;
                    target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
                    for (_i = 0, _len = objects.length; _i < _len; _i++) {
                        object = objects[_i];
                        for (key in object) {
                            val = object[key];
                            target[key] = val;
                        }
                    }
                    return target;
                };

                function Dropzone(element, options) {
                    var elementOptions, fallback, _ref;
                    this.element = element;
                    this.version = Dropzone.version;
                    this.defaultOptions.previewTemplate = this.defaultOptions.previewTemplate.replace(/\n*/g, "");
                    this.clickableElements = [];
                    this.listeners = [];
                    this.files = [];
                    if (typeof this.element === "string") {
                        this.element = document.querySelector(this.element);
                    }
                    if (!(this.element && (this.element.nodeType != null))) {
                        throw new Error("Invalid dropzone element.");
                    }
                    if (this.element.dropzone) {
                        throw new Error("Dropzone already attached.");
                    }
                    Dropzone.instances.push(this);
                    element.dropzone = this;
                    elementOptions = (_ref = Dropzone.optionsForElement(this.element)) != null ? _ref : {};
                    this.options = extend({}, this.defaultOptions, elementOptions, options != null ? options : {});
                    if (this.options.forceFallback || !Dropzone.isBrowserSupported()) {
                        return this.options.fallback.call(this);
                    }
                    if (this.options.url == null) {
                        this.options.url = this.element.getAttribute("action");
                    }
                    if (!this.options.url) {
                        throw new Error("No URL provided.");
                    }
                    if (this.options.acceptedFiles && this.options.acceptedMimeTypes) {
                        throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
                    }
                    if (this.options.acceptedMimeTypes) {
                        this.options.acceptedFiles = this.options.acceptedMimeTypes;
                        delete this.options.acceptedMimeTypes;
                    }
                    this.options.method = this.options.method.toUpperCase();
                    if ((fallback = this.getExistingFallback()) && fallback.parentNode) {
                        fallback.parentNode.removeChild(fallback);
                    }
                    if (this.options.previewsContainer) {
                        this.previewsContainer = Dropzone.getElement(this.options.previewsContainer, "previewsContainer");
                    } else {
                        this.previewsContainer = this.element;
                    }
                    if (this.options.clickable) {
                        if (this.options.clickable === true) {
                            this.clickableElements = [this.element];
                        } else {
                            this.clickableElements = Dropzone.getElements(this.options.clickable, "clickable");
                        }
                    }
                    this.init();
                }

                Dropzone.prototype.getAcceptedFiles = function() {
                    var file, _i, _len, _ref, _results;
                    _ref = this.files;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        if (file.accepted) {
                            _results.push(file);
                        }
                    }
                    return _results;
                };

                Dropzone.prototype.getRejectedFiles = function() {
                    var file, _i, _len, _ref, _results;
                    _ref = this.files;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        if (!file.accepted) {
                            _results.push(file);
                        }
                    }
                    return _results;
                };

                Dropzone.prototype.getQueuedFiles = function() {
                    var file, _i, _len, _ref, _results;
                    _ref = this.files;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        if (file.status === Dropzone.QUEUED) {
                            _results.push(file);
                        }
                    }
                    return _results;
                };

                Dropzone.prototype.getUploadingFiles = function() {
                    var file, _i, _len, _ref, _results;
                    _ref = this.files;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        if (file.status === Dropzone.UPLOADING) {
                            _results.push(file);
                        }
                    }
                    return _results;
                };

                Dropzone.prototype.init = function() {
                    var eventName, noPropagation, setupHiddenFileInput, _i, _len, _ref, _ref1,
                        _this = this;
                    if (this.element.tagName === "form") {
                        this.element.setAttribute("enctype", "multipart/form-data");
                    }
                    if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
                        this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><span>" + this.options.dictDefaultMessage + "</span></div>"));
                    }
                    if (this.clickableElements.length) {
                        setupHiddenFileInput = function() {
                            if (_this.hiddenFileInput) {
                                document.body.removeChild(_this.hiddenFileInput);
                            }
                            _this.hiddenFileInput = document.createElement("input");
                            _this.hiddenFileInput.setAttribute("type", "file");
                            _this.hiddenFileInput.setAttribute("multiple", "multiple");
                            if (_this.options.acceptedFiles != null) {
                                _this.hiddenFileInput.setAttribute("accept", _this.options.acceptedFiles);
                            }
                            _this.hiddenFileInput.style.visibility = "hidden";
                            _this.hiddenFileInput.style.position = "absolute";
                            _this.hiddenFileInput.style.top = "0";
                            _this.hiddenFileInput.style.left = "0";
                            _this.hiddenFileInput.style.height = "0";
                            _this.hiddenFileInput.style.width = "0";
                            document.body.appendChild(_this.hiddenFileInput);
                            return _this.hiddenFileInput.addEventListener("change", function() {
                                var files;
                                files = _this.hiddenFileInput.files;
                                if (files.length) {
                                    _this.emit("selectedfiles", files);
                                    _this.handleFiles(files);
                                }
                                return setupHiddenFileInput();
                            });
                        };
                        setupHiddenFileInput();
                    }
                    this.URL = (_ref = window.URL) != null ? _ref : window.webkitURL;
                    _ref1 = this.events;
                    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                        eventName = _ref1[_i];
                        this.on(eventName, this.options[eventName]);
                    }
                    this.on("uploadprogress", function() {
                        return _this.updateTotalUploadProgress();
                    });
                    this.on("removedfile", function() {
                        return _this.updateTotalUploadProgress();
                    });
                    this.on("canceled", function(file) {
                        return _this.emit("complete", file);
                    });
                    noPropagation = function(e) {
                        e.stopPropagation();
                        if (e.preventDefault) {
                            return e.preventDefault();
                        } else {
                            return e.returnValue = false;
                        }
                    };
                    this.listeners = [
                        {
                            element: this.element,
                            events: {
                                "dragstart": function(e) {
                                    return _this.emit("dragstart", e);
                                },
                                "dragenter": function(e) {
                                    noPropagation(e);
                                    return _this.emit("dragenter", e);
                                },
                                "dragover": function(e) {
                                    noPropagation(e);
                                    return _this.emit("dragover", e);
                                },
                                "dragleave": function(e) {
                                    return _this.emit("dragleave", e);
                                },
                                "drop": function(e) {
                                    noPropagation(e);
                                    return _this.drop(e);
                                },
                                "dragend": function(e) {
                                    return _this.emit("dragend", e);
                                }
                            }
                        }
                    ];
                    this.clickableElements.forEach(function(clickableElement) {
                        return _this.listeners.push({
                            element: clickableElement,
                            events: {
                                "click": function(evt) {
                                    if ((clickableElement !== _this.element) || (evt.target === _this.element || Dropzone.elementInside(evt.target, _this.element.querySelector(".dz-message")))) {
                                        return _this.hiddenFileInput.click();
                                    }
                                }
                            }
                        });
                    });
                    this.enable();
                    return this.options.init.call(this);
                };

                Dropzone.prototype.destroy = function() {
                    var _ref;
                    this.disable();
                    this.removeAllFiles(true);
                    if ((_ref = this.hiddenFileInput) != null ? _ref.parentNode : void 0) {
                        this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
                        this.hiddenFileInput = null;
                    }
                    return delete this.element.dropzone;
                };

                Dropzone.prototype.updateTotalUploadProgress = function() {
                    var acceptedFiles, file, totalBytes, totalBytesSent, totalUploadProgress, _i, _len, _ref;
                    totalBytesSent = 0;
                    totalBytes = 0;
                    acceptedFiles = this.getAcceptedFiles();
                    if (acceptedFiles.length) {
                        _ref = this.getAcceptedFiles();
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            file = _ref[_i];
                            totalBytesSent += file.upload.bytesSent;
                            totalBytes += file.upload.total;
                        }
                        totalUploadProgress = 100 * totalBytesSent / totalBytes;
                    } else {
                        totalUploadProgress = 100;
                    }
                    return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
                };

                Dropzone.prototype.getFallbackForm = function() {
                    var existingFallback, fields, fieldsString, form;
                    if (existingFallback = this.getExistingFallback()) {
                        return existingFallback;
                    }
                    fieldsString = "<div class=\"dz-fallback\">";
                    if (this.options.dictFallbackText) {
                        fieldsString += "<p>" + this.options.dictFallbackText + "</p>";
                    }
                    fieldsString += "<input type=\"file\" name=\"" + this.options.paramName + (this.options.uploadMultiple ? "[]" : "") + "\" " + (this.options.uploadMultiple ? 'multiple="multiple"' : void 0) + " /><button type=\"submit\">Upload!</button></div>";
                    fields = Dropzone.createElement(fieldsString);
                    if (this.element.tagName !== "FORM") {
                        form = Dropzone.createElement("<form action=\"" + this.options.url + "\" enctype=\"multipart/form-data\" method=\"" + this.options.method + "\"></form>");
                        form.appendChild(fields);
                    } else {
                        this.element.setAttribute("enctype", "multipart/form-data");
                        this.element.setAttribute("method", this.options.method);
                    }
                    return form != null ? form : fields;
                };

                Dropzone.prototype.getExistingFallback = function() {
                    var fallback, getFallback, tagName, _i, _len, _ref;
                    getFallback = function(elements) {
                        var el, _i, _len;
                        for (_i = 0, _len = elements.length; _i < _len; _i++) {
                            el = elements[_i];
                            if (/(^| )fallback($| )/.test(el.className)) {
                                return el;
                            }
                        }
                    };
                    _ref = ["div", "form"];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        tagName = _ref[_i];
                        if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
                            return fallback;
                        }
                    }
                };

                Dropzone.prototype.setupEventListeners = function() {
                    var elementListeners, event, listener, _i, _len, _ref, _results;
                    _ref = this.listeners;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        elementListeners = _ref[_i];
                        _results.push((function() {
                            var _ref1, _results1;
                            _ref1 = elementListeners.events;
                            _results1 = [];
                            for (event in _ref1) {
                                listener = _ref1[event];
                                _results1.push(elementListeners.element.addEventListener(event, listener, false));
                            }
                            return _results1;
                        })());
                    }
                    return _results;
                };

                Dropzone.prototype.removeEventListeners = function() {
                    var elementListeners, event, listener, _i, _len, _ref, _results;
                    _ref = this.listeners;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        elementListeners = _ref[_i];
                        _results.push((function() {
                            var _ref1, _results1;
                            _ref1 = elementListeners.events;
                            _results1 = [];
                            for (event in _ref1) {
                                listener = _ref1[event];
                                _results1.push(elementListeners.element.removeEventListener(event, listener, false));
                            }
                            return _results1;
                        })());
                    }
                    return _results;
                };

                Dropzone.prototype.disable = function() {
                    var file, _i, _len, _ref, _results;
                    this.clickableElements.forEach(function(element) {
                        return element.classList.remove("dz-clickable");
                    });
                    this.removeEventListeners();
                    _ref = this.files;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        _results.push(this.cancelUpload(file));
                    }
                    return _results;
                };

                Dropzone.prototype.enable = function() {
                    this.clickableElements.forEach(function(element) {
                        return element.classList.add("dz-clickable");
                    });
                    return this.setupEventListeners();
                };

                Dropzone.prototype.filesize = function(size) {
                    var string;
                    if (size >= 100000000000) {
                        size = size / 100000000000;
                        string = "TB";
                    } else if (size >= 100000000) {
                        size = size / 100000000;
                        string = "GB";
                    } else if (size >= 100000) {
                        size = size / 100000;
                        string = "MB";
                    } else if (size >= 100) {
                        size = size / 100;
                        string = "KB";
                    } else {
                        size = size * 10;
                        string = "b";
                    }
                    return "<strong>" + (Math.round(size) / 10) + "</strong> " + string;
                };

                Dropzone.prototype._updateMaxFilesReachedClass = function() {
                    if (this.options.maxFiles && this.getAcceptedFiles().length >= this.options.maxFiles) {
                        return this.element.classList.add("dz-max-files-reached");
                    } else {
                        return this.element.classList.remove("dz-max-files-reached");
                    }
                };

                Dropzone.prototype.drop = function(e) {
                    var files, items;
                    if (!e.dataTransfer) {
                        return;
                    }
                    this.emit("drop", e);
                    files = e.dataTransfer.files;
                    this.emit("selectedfiles", files);
                    if (files.length) {
                        items = e.dataTransfer.items;
                        if (items && items.length && ((items[0].webkitGetAsEntry != null) || (items[0].getAsEntry != null))) {
                            this.handleItems(items);
                        } else {
                            this.handleFiles(files);
                        }
                    }
                };

                Dropzone.prototype.handleFiles = function(files) {
                    var file, _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        _results.push(this.addFile(file));
                    }
                    return _results;
                };

                Dropzone.prototype.handleItems = function(items) {
                    var entry, item, _i, _len;
                    for (_i = 0, _len = items.length; _i < _len; _i++) {
                        item = items[_i];
                        if (item.webkitGetAsEntry != null) {
                            entry = item.webkitGetAsEntry();
                            if (entry.isFile) {
                                this.addFile(item.getAsFile());
                            } else if (entry.isDirectory) {
                                this.addDirectory(entry, entry.name);
                            }
                        } else {
                            this.addFile(item.getAsFile());
                        }
                    }
                };

                Dropzone.prototype.accept = function(file, done) {
                    if (file.size > this.options.maxFilesize * 1024 * 1024) {
                        return done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
                    } else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) {
                        return done(this.options.dictInvalidFileType);
                    } else if (this.options.maxFiles && this.getAcceptedFiles().length >= this.options.maxFiles) {
                        done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
                        return this.emit("maxfilesexceeded", file);
                    } else {
                        return this.options.accept.call(this, file, done);
                    }
                };

                Dropzone.prototype.addFile = function(file) {
                    var _this = this;
                    file.upload = {
                        progress: 0,
                        total: file.size,
                        bytesSent: 0
                    };
                    this.files.push(file);
                    file.status = Dropzone.ADDED;
                    this.emit("addedfile", file);
                    if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
                        this.createThumbnail(file);
                    }
                    return this.accept(file, function(error) {
                        if (error) {
                            file.accepted = false;
                            return _this._errorProcessing([file], error);
                        } else {
                            return _this.enqueueFile(file);
                        }
                    });
                };

                Dropzone.prototype.enqueueFiles = function(files) {
                    var file, _i, _len;
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        this.enqueueFile(file);
                    }
                    return null;
                };

                Dropzone.prototype.enqueueFile = function(file) {
                    var _this = this;
                    file.accepted = true;
                    if (file.status === Dropzone.ADDED) {
                        file.status = Dropzone.QUEUED;
                        if (this.options.autoProcessQueue) {
                            return setTimeout((function() {
                                return _this.processQueue();
                            }), 1);
                        }
                    } else {
                        throw new Error("This file can't be queued because it has already been processed or was rejected.");
                    }
                };

                Dropzone.prototype.addDirectory = function(entry, path) {
                    var dirReader, entriesReader,
                        _this = this;
                    dirReader = entry.createReader();
                    entriesReader = function(entries) {
                        var _i, _len;
                        for (_i = 0, _len = entries.length; _i < _len; _i++) {
                            entry = entries[_i];
                            if (entry.isFile) {
                                entry.file(function(file) {
                                    if (_this.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
                                        return;
                                    }
                                    file.fullPath = "" + path + "/" + file.name;
                                    return _this.addFile(file);
                                });
                            } else if (entry.isDirectory) {
                                _this.addDirectory(entry, "" + path + "/" + entry.name);
                            }
                        }
                    };
                    return dirReader.readEntries(entriesReader, function(error) {
                        return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log(error) : void 0 : void 0;
                    });
                };

                Dropzone.prototype.removeFile = function(file) {
                    if (file.status === Dropzone.UPLOADING) {
                        this.cancelUpload(file);
                    }
                    this.files = without(this.files, file);
                    this.emit("removedfile", file);
                    if (this.files.length === 0) {
                        return this.emit("reset");
                    }
                };

                Dropzone.prototype.removeAllFiles = function(cancelIfNecessary) {
                    var file, _i, _len, _ref;
                    if (cancelIfNecessary == null) {
                        cancelIfNecessary = false;
                    }
                    _ref = this.files.slice();
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) {
                            this.removeFile(file);
                        }
                    }
                    return null;
                };

                Dropzone.prototype.createThumbnail = function(file) {
                    var fileReader,
                        _this = this;
                    fileReader = new FileReader;
                    fileReader.onload = function() {
                        var img;
                        img = new Image;
                        img.onload = function() {
                            var canvas, ctx, resizeInfo, thumbnail, _ref, _ref1, _ref2, _ref3;
                            file.width = img.width;
                            file.height = img.height;
                            resizeInfo = _this.options.resize.call(_this, file);
                            if (resizeInfo.trgWidth == null) {
                                resizeInfo.trgWidth = _this.options.thumbnailWidth;
                            }
                            if (resizeInfo.trgHeight == null) {
                                resizeInfo.trgHeight = _this.options.thumbnailHeight;
                            }
                            canvas = document.createElement("canvas");
                            ctx = canvas.getContext("2d");
                            canvas.width = resizeInfo.trgWidth;
                            canvas.height = resizeInfo.trgHeight;
                            ctx.drawImage(img, (_ref = resizeInfo.srcX) != null ? _ref : 0, (_ref1 = resizeInfo.srcY) != null ? _ref1 : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, (_ref2 = resizeInfo.trgX) != null ? _ref2 : 0, (_ref3 = resizeInfo.trgY) != null ? _ref3 : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
                            thumbnail = canvas.toDataURL("image/png");
                            return _this.emit("thumbnail", file, thumbnail);
                        };
                        return img.src = fileReader.result;
                    };
                    return fileReader.readAsDataURL(file);
                };

                Dropzone.prototype.processQueue = function() {
                    var i, parallelUploads, processingLength, queuedFiles;
                    parallelUploads = this.options.parallelUploads;
                    processingLength = this.getUploadingFiles().length;
                    i = processingLength;
                    if (processingLength >= parallelUploads) {
                        return;
                    }
                    queuedFiles = this.getQueuedFiles();
                    if (!(queuedFiles.length > 0)) {
                        return;
                    }
                    if (this.options.uploadMultiple) {
                        return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
                    } else {
                        while (i < parallelUploads) {
                            if (!queuedFiles.length) {
                                return;
                            }
                            this.processFile(queuedFiles.shift());
                            i++;
                        }
                    }
                };

                Dropzone.prototype.processFile = function(file) {
                    return this.processFiles([file]);
                };

                Dropzone.prototype.processFiles = function(files) {
                    var file, _i, _len;
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        file.processing = true;
                        file.status = Dropzone.UPLOADING;
                        this.emit("processing", file);
                    }
                    if (this.options.uploadMultiple) {
                        this.emit("processingmultiple", files);
                    }
                    return this.uploadFiles(files);
                };

                Dropzone.prototype._getFilesWithXhr = function(xhr) {
                    var file, files;
                    return files = (function() {
                        var _i, _len, _ref, _results;
                        _ref = this.files;
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            file = _ref[_i];
                            if (file.xhr === xhr) {
                                _results.push(file);
                            }
                        }
                        return _results;
                    }).call(this);
                };

                Dropzone.prototype.cancelUpload = function(file) {
                    var groupedFile, groupedFiles, _i, _j, _len, _len1, _ref;
                    if (file.status === Dropzone.UPLOADING) {
                        groupedFiles = this._getFilesWithXhr(file.xhr);
                        for (_i = 0, _len = groupedFiles.length; _i < _len; _i++) {
                            groupedFile = groupedFiles[_i];
                            groupedFile.status = Dropzone.CANCELED;
                        }
                        file.xhr.abort();
                        for (_j = 0, _len1 = groupedFiles.length; _j < _len1; _j++) {
                            groupedFile = groupedFiles[_j];
                            this.emit("canceled", groupedFile);
                        }
                        if (this.options.uploadMultiple) {
                            this.emit("canceledmultiple", groupedFiles);
                        }
                    } else if ((_ref = file.status) === Dropzone.ADDED || _ref === Dropzone.QUEUED) {
                        file.status = Dropzone.CANCELED;
                        this.emit("canceled", file);
                        if (this.options.uploadMultiple) {
                            this.emit("canceledmultiple", [file]);
                        }
                    }
                    if (this.options.autoProcessQueue) {
                        return this.processQueue();
                    }
                };

                Dropzone.prototype.uploadFile = function(file) {
                    return this.uploadFiles([file]);
                };

                Dropzone.prototype.uploadFiles = function(files) {
                    var file, formData, handleError, headerName, headerValue, headers, input, inputName, inputType, key, progressObj, response, updateProgress, value, xhr, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3,
                        _this = this;
                    xhr = new XMLHttpRequest();
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        file.xhr = xhr;
                    }
                    xhr.open(this.options.method, this.options.url, true);
                    xhr.withCredentials = !!this.options.withCredentials;
                    response = null;
                    handleError = function() {
                        var _j, _len1, _results;
                        _results = [];
                        for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
                            file = files[_j];
                            _results.push(_this._errorProcessing(files, response || _this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr));
                        }
                        return _results;
                    };
                    updateProgress = function(e) {
                        var allFilesFinished, progress, _j, _k, _l, _len1, _len2, _len3, _results;
                        if (e != null) {
                            progress = 100 * e.loaded / e.total;
                            for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
                                file = files[_j];
                                file.upload = {
                                    progress: progress,
                                    total: e.total,
                                    bytesSent: e.loaded
                                };
                            }
                        } else {
                            allFilesFinished = true;
                            progress = 100;
                            for (_k = 0, _len2 = files.length; _k < _len2; _k++) {
                                file = files[_k];
                                if (!(file.upload.progress === 100 && file.upload.bytesSent === file.upload.total)) {
                                    allFilesFinished = false;
                                }
                                file.upload.progress = progress;
                                file.upload.bytesSent = file.upload.total;
                            }
                            if (allFilesFinished) {
                                return;
                            }
                        }
                        _results = [];
                        for (_l = 0, _len3 = files.length; _l < _len3; _l++) {
                            file = files[_l];
                            _results.push(_this.emit("uploadprogress", file, progress, file.upload.bytesSent));
                        }
                        return _results;
                    };
                    xhr.onload = function(e) {
                        var _ref;
                        if (files[0].status === Dropzone.CANCELED) {
                            return;
                        }
                        if (xhr.readyState !== 4) {
                            return;
                        }
                        response = xhr.responseText;
                        if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
                            try {
                                response = JSON.parse(response);
                            } catch (_error) {
                                e = _error;
                                response = "Invalid JSON response from server.";
                            }
                        }
                        updateProgress();
                        if (!((200 <= (_ref = xhr.status) && _ref < 300))) {
                            return handleError();
                        } else {
                            return _this._finished(files, response, e);
                        }
                    };
                    xhr.onerror = function() {
                        if (files[0].status === Dropzone.CANCELED) {
                            return;
                        }
                        return handleError();
                    };
                    progressObj = (_ref = xhr.upload) != null ? _ref : xhr;
                    progressObj.onprogress = updateProgress;
                    headers = {
                        "Accept": "application/json",
                        "Cache-Control": "no-cache",
                        "X-Requested-With": "XMLHttpRequest"
                    };
                    if (this.options.headers) {
                        extend(headers, this.options.headers);
                    }
                    for (headerName in headers) {
                        headerValue = headers[headerName];
                        xhr.setRequestHeader(headerName, headerValue);
                    }
                    formData = new FormData();
                    if (this.options.params) {
                        _ref1 = this.options.params;
                        for (key in _ref1) {
                            value = _ref1[key];
                            formData.append(key, value);
                        }
                    }
                    for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
                        file = files[_j];
                        this.emit("sending", file, xhr, formData);
                    }
                    if (this.options.uploadMultiple) {
                        this.emit("sendingmultiple", files, xhr, formData);
                    }
                    if (this.element.tagName === "FORM") {
                        _ref2 = this.element.querySelectorAll("input, textarea, select, button");
                        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                            input = _ref2[_k];
                            inputName = input.getAttribute("name");
                            inputType = input.getAttribute("type");
                            if (!inputType || ((_ref3 = inputType.toLowerCase()) !== "checkbox" && _ref3 !== "radio") || input.checked) {
                                formData.append(inputName, input.value);
                            }
                        }
                    }
                    for (_l = 0, _len3 = files.length; _l < _len3; _l++) {
                        file = files[_l];
                        formData.append("" + this.options.paramName + (this.options.uploadMultiple ? "[]" : ""), file, file.name);
                    }
                    return xhr.send(formData);
                };

                Dropzone.prototype._finished = function(files, responseText, e) {
                    var file, _i, _len;
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        file.status = Dropzone.SUCCESS;
                        this.emit("success", file, responseText, e);
                        this.emit("complete", file);
                    }
                    if (this.options.uploadMultiple) {
                        this.emit("successmultiple", files, responseText, e);
                        this.emit("completemultiple", files);
                    }
                    if (this.options.autoProcessQueue) {
                        return this.processQueue();
                    }
                };

                Dropzone.prototype._errorProcessing = function(files, message, xhr) {
                    var file, _i, _len;
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        file.status = Dropzone.ERROR;
                        this.emit("error", file, message, xhr);
                        this.emit("complete", file);
                    }
                    if (this.options.uploadMultiple) {
                        this.emit("errormultiple", files, message, xhr);
                        this.emit("completemultiple", files);
                    }
                    if (this.options.autoProcessQueue) {
                        return this.processQueue();
                    }
                };

                return Dropzone;

            })(Em);

            Dropzone.version = "3.7.1";

            Dropzone.options = {};

            Dropzone.optionsForElement = function(element) {
                if (element.id) {
                    return Dropzone.options[camelize(element.id)];
                } else {
                    return void 0;
                }
            };

            Dropzone.instances = [];

            Dropzone.forElement = function(element) {
                if (typeof element === "string") {
                    element = document.querySelector(element);
                }
                if ((element != null ? element.dropzone : void 0) == null) {
                    throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
                }
                return element.dropzone;
            };

            Dropzone.autoDiscover = true;

            Dropzone.discover = function() {
                var checkElements, dropzone, dropzones, _i, _len, _results;
                if (document.querySelectorAll) {
                    dropzones = document.querySelectorAll(".dropzone");
                } else {
                    dropzones = [];
                    checkElements = function(elements) {
                        var el, _i, _len, _results;
                        _results = [];
                        for (_i = 0, _len = elements.length; _i < _len; _i++) {
                            el = elements[_i];
                            if (/(^| )dropzone($| )/.test(el.className)) {
                                _results.push(dropzones.push(el));
                            } else {
                                _results.push(void 0);
                            }
                        }
                        return _results;
                    };
                    checkElements(document.getElementsByTagName("div"));
                    checkElements(document.getElementsByTagName("form"));
                }
                _results = [];
                for (_i = 0, _len = dropzones.length; _i < _len; _i++) {
                    dropzone = dropzones[_i];
                    if (Dropzone.optionsForElement(dropzone) !== false) {
                        _results.push(new Dropzone(dropzone));
                    } else {
                        _results.push(void 0);
                    }
                }
                return _results;
            };

            Dropzone.blacklistedBrowsers = [/opera.*Macintosh.*version\/12/i];

            Dropzone.isBrowserSupported = function() {
                var capableBrowser, regex, _i, _len, _ref;
                capableBrowser = true;
                if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
                    if (!("classList" in document.createElement("a"))) {
                        capableBrowser = false;
                    } else {
                        _ref = Dropzone.blacklistedBrowsers;
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            regex = _ref[_i];
                            if (regex.test(navigator.userAgent)) {
                                capableBrowser = false;
                                continue;
                            }
                        }
                    }
                } else {
                    capableBrowser = false;
                }
                return capableBrowser;
            };

            without = function(list, rejectedItem) {
                var item, _i, _len, _results;
                _results = [];
                for (_i = 0, _len = list.length; _i < _len; _i++) {
                    item = list[_i];
                    if (item !== rejectedItem) {
                        _results.push(item);
                    }
                }
                return _results;
            };

            camelize = function(str) {
                return str.replace(/[\-_](\w)/g, function(match) {
                    return match[1].toUpperCase();
                });
            };

            Dropzone.createElement = function(string) {
                var div;
                div = document.createElement("div");
                div.innerHTML = string;
                return div.childNodes[0];
            };

            Dropzone.elementInside = function(element, container) {
                if (element === container) {
                    return true;
                }
                while (element = element.parentNode) {
                    if (element === container) {
                        return true;
                    }
                }
                return false;
            };

            Dropzone.getElement = function(el, name) {
                var element;
                if (typeof el === "string") {
                    element = document.querySelector(el);
                } else if (el.nodeType != null) {
                    element = el;
                }
                if (element == null) {
                    throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
                }
                return element;
            };

            Dropzone.getElements = function(els, name) {
                var e, el, elements, _i, _j, _len, _len1, _ref;
                if (els instanceof Array) {
                    elements = [];
                    try {
                        for (_i = 0, _len = els.length; _i < _len; _i++) {
                            el = els[_i];
                            elements.push(this.getElement(el, name));
                        }
                    } catch (_error) {
                        e = _error;
                        elements = null;
                    }
                } else if (typeof els === "string") {
                    elements = [];
                    _ref = document.querySelectorAll(els);
                    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                        el = _ref[_j];
                        elements.push(el);
                    }
                } else if (els.nodeType != null) {
                    elements = [els];
                }
                if (!((elements != null) && elements.length)) {
                    throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
                }
                return elements;
            };

            Dropzone.confirm = function(question, accepted, rejected) {
                if (window.confirm(question)) {
                    return accepted();
                } else if (rejected != null) {
                    return rejected();
                }
            };

            Dropzone.isValidFile = function(file, acceptedFiles) {
                var baseMimeType, mimeType, validType, _i, _len;
                if (!acceptedFiles) {
                    return true;
                }
                acceptedFiles = acceptedFiles.split(",");
                mimeType = file.type;
                baseMimeType = mimeType.replace(/\/.*$/, "");
                for (_i = 0, _len = acceptedFiles.length; _i < _len; _i++) {
                    validType = acceptedFiles[_i];
                    validType = validType.trim();
                    if (validType.charAt(0) === ".") {
                        if (file.name.indexOf(validType, file.name.length - validType.length) !== -1) {
                            return true;
                        }
                    } else if (/\/\*$/.test(validType)) {
                        if (baseMimeType === validType.replace(/\/.*$/, "")) {
                            return true;
                        }
                    } else {
                        if (mimeType === validType) {
                            return true;
                        }
                    }
                }
                return false;
            };

            if (typeof jQuery !== "undefined" && jQuery !== null) {
                jQuery.fn.dropzone = function(options) {
                    return this.each(function() {
                        return new Dropzone(this, options);
                    });
                };
            }

            if (typeof module !== "undefined" && module !== null) {
                module.exports = Dropzone;
            } else {
                window.Dropzone = Dropzone;
            }

            Dropzone.ADDED = "added";

            Dropzone.QUEUED = "queued";

            Dropzone.ACCEPTED = Dropzone.QUEUED;

            Dropzone.UPLOADING = "uploading";

            Dropzone.PROCESSING = Dropzone.UPLOADING;

            Dropzone.CANCELED = "canceled";

            Dropzone.ERROR = "error";

            Dropzone.SUCCESS = "success";

            /*
             # contentloaded.js
             #
             # Author: Diego Perini (diego.perini at gmail.com)
             # Summary: cross-browser wrapper for DOMContentLoaded
             # Updated: 20101020
             # License: MIT
             # Version: 1.2
             #
             # URL:
             # http://javascript.nwbox.com/ContentLoaded/
             # http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
             */


            contentLoaded = function(win, fn) {
                var add, doc, done, init, poll, pre, rem, root, top;
                done = false;
                top = true;
                doc = win.document;
                root = doc.documentElement;
                add = (doc.addEventListener ? "addEventListener" : "attachEvent");
                rem = (doc.addEventListener ? "removeEventListener" : "detachEvent");
                pre = (doc.addEventListener ? "" : "on");
                init = function(e) {
                    if (e.type === "readystatechange" && doc.readyState !== "complete") {
                        return;
                    }
                    (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
                    if (!done && (done = true)) {
                        return fn.call(win, e.type || e);
                    }
                };
                poll = function() {
                    var e;
                    try {
                        root.doScroll("left");
                    } catch (_error) {
                        e = _error;
                        setTimeout(poll, 50);
                        return;
                    }
                    return init("poll");
                };
                if (doc.readyState !== "complete") {
                    if (doc.createEventObject && root.doScroll) {
                        try {
                            top = !win.frameElement;
                        } catch (_error) {}
                        if (top) {
                            poll();
                        }
                    }
                    doc[add](pre + "DOMContentLoaded", init, false);
                    doc[add](pre + "readystatechange", init, false);
                    return win[add](pre + "load", init, false);
                }
            };

            Dropzone._autoDiscoverFunction = function() {
                if (Dropzone.autoDiscover) {
                    return Dropzone.discover();
                }
            };

            contentLoaded(window, Dropzone._autoDiscoverFunction);

        }).call(this);

    });
    require.alias("component-emitter/index.js", "dropzone/deps/emitter/index.js");
    require.alias("component-emitter/index.js", "emitter/index.js");
    if (typeof exports == "object") {
        module.exports = require("dropzone");
    } else if (typeof define == "function" && define.amd) {
        define(function(){ return require("dropzone"); });
    } else {
        this["Dropzone"] = require("dropzone");
    }})();