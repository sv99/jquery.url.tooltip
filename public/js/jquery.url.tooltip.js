/*
 * jQuery Url Tooltip plugin 1.4
 *
 * Based on http://bassistance.de/jquery-plugins/jquery-plugin-tooltip/
 * http://docs.jquery.com/Plugins/Tooltip
 *
 * Copyright (c) 2006 - 2008 Jörn Zaefferer
 * Copyright (c) 2020 Slava Volkov
 *
 * $Id: jquery.url.tooltip.js 2020.07.12 slava.volkov $
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

;(function($) {

	// the global tooltip element
	let helper = {},
		// the current tooltipped element
		current,
		// timeout id for delayed tooltips
		tID,
		// flag for mouse tracking
		track = false;

	$.fn.tooltip = function (options) {
		const defaults = {
			delay: 200,
			fade: false,
			extraClass: "",
			top: 15,
			left: 15,
			id: "tooltip",
			pre: false,
			bodyHandler: function(el, cb) { cb('OK') },
			loadedBody: "",
		};

		const settings = $.extend( {}, defaults, options );
		createHelper(settings.id);

		return this.each(function() {
			  // local setting for store loadedBody
			  const local = $.extend( {}, defaults, options );
				$.data(this, "tooltip", local);
				this.tOpacity = helper.parent.css("opacity");
			})
				.mouseover(save)
				.mouseout(hide)
				.click(hide);
	}

	function createHelper(id) {
		// there can be only one tooltip helper
		if( helper.parent )
			return;
		// create the helper body
		helper.parent = $('<div id="' + id + '"><div class="body"></div></div>')
			// add to document
			.appendTo(document.body)
			// hide it at first
			.hide();

		// save body references
		helper.body = $('div.body', helper.parent);
	}

	function settings(element) {
		return $.data(element, "tooltip");
	}

	// main event handler to start showing tooltips
	function handle(event) {
		// show helper, either with timeout or on instant
		if( settings(this).delay )
			tID = setTimeout(show, settings(this).delay);
		else
			show();

		// if selected, update the helper position when the mouse moves
		track = !!settings(this).track;
		$(document.body).bind('mousemove', update);

		// update at least once
		update(event);
	}

	// save elements title before the tooltip is displayed
	function save() {
		// if this is the current source, or it has no title (occurs with click event), stop
		if ( this === current )
			return;

		// save current
		current = this;

		if (settings(this).loadedBody) {
			helper.body.html(settings(this).loadedBody);
		} else {
			const that = this;
			settings(this).bodyHandler(this, function (body) {
				if (settings(that).pre) {
					body = '<pre>' + body + '</pre>';
				}
				settings(that).loadedBody = body;
				helper.body.html(body);
			})
		}
		helper.body.show();

		// add an optional class for this tip
		helper.parent.addClass(settings(this).extraClass);

		handle.apply(this, arguments);
	}

	// delete timeout and show helper
	function show() {
		tID = null;
		if (settings(current).fade) {
			if (helper.parent.is(":animated"))
				helper.parent.stop().show().fadeTo(settings(current).fade, current.tOpacity);
			else
				helper.parent.is(':visible') ? helper.parent.fadeTo(settings(current).fade, current.tOpacity) : helper.parent.fadeIn(settings(current).fade);
		} else {
			helper.parent.show();
		}
		update();
	}

	/**
	 * callback for mousemove
	 * updates the helper position
	 * removes itself when no current element
	 */
	function update(event)	{
		if (event && event.target.tagName === "OPTION") {
			return;
		}

		// stop updating when tracking is disabled and the tooltip is visible
		if ( !track && helper.parent.is(":visible")) {
			$(document.body).unbind('mousemove', update)
		}

		// if no current element is available, remove this listener
		if( current == null ) {
			$(document.body).unbind('mousemove', update);
			return;
		}

		// remove position helper classes
		helper.parent.removeClass("viewport-right").removeClass("viewport-bottom");

		let left = helper.parent[0].offsetLeft;
		let top = helper.parent[0].offsetTop;
		if (event) {
			// position the helper 15 pixel to bottom right, starting from mouse position
			left = event.pageX + settings(current).left;
			top = event.pageY + settings(current).top;
			let right='auto';
			if (settings(current).positionLeft) {
				right = $(window).width() - left;
				left = 'auto';
			}
			helper.parent.css({
				left: left,
				right: right,
				top: top
			});
		}

		const v = viewport(),
			h = helper.parent[0];
		// check horizontal position
		if (v.x + v.cx < h.offsetLeft + h.offsetWidth) {
			left -= h.offsetWidth + 20 + settings(current).left;
			helper.parent.css({left: left + 'px'}).addClass("viewport-right");
		}
		// check vertical position
		if (v.y + v.cy < h.offsetTop + h.offsetHeight) {
			top -= h.offsetHeight + 20 + settings(current).top;
			helper.parent.css({top: top + 'px'}).addClass("viewport-bottom");
		}
	}

	function viewport() {
		return {
			x: $(window).scrollLeft(),
			y: $(window).scrollTop(),
			cx: $(window).width(),
			cy: $(window).height()
		};
	}

	// hide helper and restore added classes and the title
	function hide(event) {
		// clear timeout if possible
		if(tID)
			clearTimeout(tID);
		// no more current element
		current = null;

		const tsettings = settings(this);
		function complete() {
			helper.parent.removeClass( tsettings.extraClass ).hide().css("opacity", "");
		}
		if (tsettings.fade) {
			if (helper.parent.is(':animated'))
				helper.parent.stop().fadeTo(tsettings.fade, 0, complete);
			else
				helper.parent.stop().fadeOut(tsettings.fade, complete);
		} else
			complete();
	}

})(jQuery);
