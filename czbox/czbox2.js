/**
 * CzBox2 - simple Zepto.js / jQuery lightbox
 * @author		Jan Pecha, <janpecha@email.cz>
 * @version		2013-01-12-1
 */

var CzBox = CzBox || {};

/** Object */
CzBox.lang = {
	textImage: "Image",
	textOf: "of",
	textPrev: "Previous",
	textNext: "Next",
	textClose: "Close",
	textLoading: "Loading"
};

/** Object */
CzBox.nodes = {};

/** bool */
CzBox._created = false;

/** Array */
CzBox.enableRels = ['czbox', 'lightbox'];

/** String */
CzBox.currentRel = '';

/** Integer		0...(length-1) */
CzBox.currentIndex = 0;


CzBox.create = function() {
	if(CzBox._created === false)
	{
		CzBox._created = true;
		
		// DOM modify
		CzBox.modifyDom();
	
		// Default events binding
		CzBox.init();
	
		// Scan document - fill $nodes
		// rel attr regexp: /(czbox|lightbox)(\[(.+)\])?/
		var rels = CzBox.enableRels.join('|');
		rels = '(' + rels + ')(\\[(.+)\\])?';
		
		// generate selector
		var selector = [];
		
		for(var i = 0; i < CzBox.enableRels.length; i++)
		{
			selector.push('a[rel*=' + CzBox.enableRels[i] + ']');
		}
		
		CzBox.scanDocument(selector.join(', '), new RegExp(rels));
	}
};


CzBox.modifyDom = function() {
	if(!($('#czbox-box').length))
	{
		$('body').first().append('<div id="czbox-box">'
				+ '<div id="czbox-background"></div>'
				+ '<div id="czbox-image-box">'
					+ '<div id="czbox-description"></div>'
					+ '<div id="czbox-info-bar">'
						+ '<span class="czbox-text">' + this.lang.textImage + '</span>'
						+ ' <span id="czbox-image-number"></span> '
						+ '<span class="czbox-text">' + this.lang.textOf + '</span>'
						+ ' <span id="czbox-images-count"></span> '
					+ '</div>'
					+ '<div id="czbox-loading"><span class="czbox-text">' + this.lang.textLoading + '</span></div>'
					+ '<div id="czbox-image-wrapper"><img id="czbox-image" src="#" alt=""></div>'
					+ '<a id="czbox-btn-prev" href="#"><span class="czbox-text">' + this.lang.textPrev + '</span></a>'
					+ '<a id="czbox-btn-next" href="#"><span class="czbox-text">' + this.lang.textNext + '</span></a>'
					+ '<a id="czbox-btn-close" href="#"><span class="czbox-text">' + this.lang.textClose + '</span></a>'
				+ '</div>'
			+ '</div>'
		);
	}
};

/** Events binding */
CzBox.init = function() {
	// Close event
	$('#czbox-btn-close, #czbox-background').on('click', function() {
		CzBox.close();
		
		return false;
	});
	
	// Next event
	$('#czbox-btn-next').on('click', function() {
		CzBox.next();
		
		return false;
	});
	// TODO: touch event - swipeRight, swipeDown
	
	// Prev event
	$('#czbox-btn-prev').on('click', function() {
		CzBox.prev();
		
		return false;
	});
	// TODO: touch event - swipeLeft, swipeUp
	
	// Keyboard events
	$('body').on('keydown', function(e) {
		if($('#czbox-box').hasClass('czbox-open'))
		{
			var code;
		
			if(!e)
			{
				e = window.event;
			}
		
			if(e.keyCode)
			{
				code = e.keyCode;
			}
			else if(e.which)
			{
				code = e.which;
			}

			switch(code)
			{
				case 27/*ESC*/:
					CzBox.close();
					return false;
					//break;
			
				case 13/*Enter*/:
				case 39/*Right key*/:
				case 40/*Down key*/:
					CzBox.next();
					return false;
					//break;
			
				case 37/*Left key*/:
				case 38/*Up key*/:
					CzBox.prev();
					return false;
					//break;
			}
		}
	});
	
	// Mouse wheel event
	/** Initialization code. 
	 * @url		http://www.adomas.org/javascript-mouse-wheel/
	 */
	if (window.addEventListener)
	{
		/** DOMMouseScroll is for mozilla */
		window.addEventListener('DOMMouseScroll', CzBox.handlerWheel, false);
	}
	
	/** IE/Opera */
	window.onmousewheel = document.onmousewheel = CzBox.handlerWheel;
	
	// Onload event
	$('#czbox-image').on('load', function() {
		$('#czbox-loading').css('display', 'none');
		
		$(this).parent()
			.css('visibility', 'visible')
			.animate({
				opacity: 1
			}, 600);
	});
};


/**
 * @param	String	selector
 * @param	RegExp	regexp for parsing data from <a rel=''>
 * @return
 */
CzBox.scanDocument = function(selector, parseRelAttrRegExp) {
	$(selector).each(function(index) {
		// 'this' is anchor
		// vygenerovat seznam nodes - pouzit data-czbox-num, cat
		var anchor = $(this);
		var rel = anchor.attr('rel');
		rel = CzBox.parseRelAttr(rel, parseRelAttrRegExp);
		
		if(rel === '')
		{
			rel = 'i_' + index;
		}
		else
		{
			rel = 'c_' + rel;
		}
		
		if(typeof CzBox.nodes[rel] === 'undefined')
		{
			CzBox.nodes[rel] = [];
		}
		
		CzBox.nodes[rel].push(anchor);
		
		anchor.data('czbox-rel', rel);
		anchor.data('czbox-index', CzBox.nodes[rel].length - 1);
		
		anchor.on('click', function() {
			CzBox.open(this);
			return false;
		});
	});
};


/**
 * @param	HTMLAnchorElement
 */
CzBox.open = function(anchor) {
	if(anchor.href !== $('#czbox-image').attr('src'))
	{
		$('#czbox-box').addClass('czbox-open');
	
		$('#czbox-loading').css('display', 'block');
	
		$('#czbox-image-wrapper').css('opacity', 0)
			.css('visibility', 'hidden');
		
		var url = anchor.href;
		
		if(typeof (dataUrl = $(anchor).data('czbox-href')) === 'string')
		{
			url = dataUrl;
		}
		
		$('#czbox-image').attr('src', url);
	
		CzBox.update(anchor);
	}
};


CzBox.close = function() {
	$('#czbox-box').removeClass('czbox-open');
	$('#czbox-image').attr('src', '');
	$('#czbox-description').hide();
};


CzBox.next = function() {
	if(CzBox.currentRel !== '')
	{
		if(CzBox.currentIndex < (CzBox.nodes[CzBox.currentRel].length - 1))
		{
			CzBox.open(CzBox.nodes[CzBox.currentRel][CzBox.currentIndex + 1].get(0));
		}
	}
};


CzBox.prev = function() {
	if(CzBox.currentRel !== '')
	{
		if(CzBox.currentIndex > 0)
		{
			CzBox.open(CzBox.nodes[CzBox.currentRel][CzBox.currentIndex - 1].get(0));
		}
	}
};


/**
 * @param	HTMLAnchorElement
 */
CzBox.update = function(anchor) {
	// Update photo infos (num of, description)
	anchor = $(anchor);
	var rel = anchor.data('czbox-rel');	
	var index = parseInt(anchor.data('czbox-index'), 10);
	
	if(CzBox.nodes[rel].length < 2)	// single image
	{
		// hidden image number && image 'of'
		$('#czbox-info-bar').hide();
		// hidden next & prev buttons
		$('#czbox-btn-next').hide();
		$('#czbox-btn-prev').hide();
	}
	else
	{
		// show image number && image 'of'
		$('#czbox-info-bar').show();
		$('#czbox-image-number').html(index + 1);
		$('#czbox-images-count').html(CzBox.nodes[rel].length);
		// show next & prev buttons
		// prev button
		if(index === 0)
		{
			$('#czbox-btn-prev').hide();
		}
		else
		{
			$('#czbox-btn-prev').show();
		}
		
		// next button
		if(index === (CzBox.nodes[rel].length-1))
		{
			$('#czbox-btn-next').hide();
		}
		else
		{
			$('#czbox-btn-next').show();
		}
	}
	
	// Update description
	var description = CzBox.getDescription(anchor);
	
	if(description !== '')
	{
		$('#czbox-description').html(description)
			.show();
	}
	else
	{
		$('#czbox-description').hide();
	}
	
	// Update private data
	CzBox.currentRel = rel;
	CzBox.currentIndex = index;
};


/**
 * @param	String
 * @param	RegExp
 * @return	String	rel or empty string
 */
CzBox.parseRelAttr = function(rel, regexp) {
	var result = rel.match(regexp);
	
	if(result === null)
	{
		return '';
	}
	
	result = result[3];
	
	if(typeof result === 'undefined')
	{
		return '';
	}
	
	return result;
};


/**
 * @param	Object	Zepto Anchor Object - $(anchor)
 * @return	String	description or empty string
 */
CzBox.getDescription = function(zeptoAnchor) {
	var description = '';
	
	// Load description from
	var img = zeptoAnchor.children('img').first();
	
	// image title
	description = img.attr('title');
	
	if(description)
	{
		return description;
	}
	
	// anchor title
	description = zeptoAnchor.attr('title');
	
	if(description)
	{
		return description;
	}
	
	// image alt
	description = img.attr('alt');
	
	if(description)
	{
		return description;
	}
	
	return '';
};


CzBox.handlerWheel = function(e) {
	if($('#czbox-box').hasClass('czbox-open'))
	{
		e = e ? e : window.event;
	
		if(e.stopPropagation)
		{
			e.stopPropagation();
		}	
	
		if(e.preventDefault)
		{
			e.preventDefault();
		}
	
		e.cancelBubble = true;
		e.cancel = true;
		e.returnValue = false;
		
		return false;
	}
};



/** Translations */
CzBox.langCs = function() {
	CzBox.lang.textImage = "Obrázek";
	CzBox.lang.textOf = "ze";
	CzBox.lang.textPrev = "Předchozí";
	CzBox.lang.textNext = "Další";
	CzBox.lang.textClose = "Zavřít";
	CzBox.lang.textLoading = "Načítám";
};


