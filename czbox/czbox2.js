/**
 * CzBox2 - simple Zepto.js lightbox
 * @author		Jan Pecha, <janpecha@email.cz>
 * @version		2012-07-01-1
 */

var CzBox = CzBox || {};

/** Object */
CzBox.lang = {
	textImage: "Image",
	textOf: "of",
	textPrev: "Previous",
	textNext: "Next",
	textClose: "Close",
	textLoading: "Loading",
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


/*??ok*/CzBox.create = function() {
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
		CzBox.scanDocument(/*'a[rel*=lightbox] > img, a[rel*=czbox] > img', */new RegExp(rels));
	}
}


/*ok*/CzBox.modifyDom = function() {
	
	if(!(document.getElementById('czbox-box') !== null))
	{
		document.getElementsByTagName('body')[0].innerHTML += '<div id="czbox-box">'
				+ '<div id="czbox-background"></div>'
				+ '<div id="czbox-image-box">'
					+ '<div id="czbox-description"></div>'
					+ '<div id="czbox-info-bar">'
						+ this.lang.textImage
						+ ' <span id="czbox-image-number"></span> '
						+ this.lang.textOf
						+ ' <span id="czbox-images-count"></span> '
					+ '</div>'
					+ '<div id="czbox-loading"><span>' + this.lang.textLoading + '</span></div>'
					+ '<div id="czbox-image-wrapper"><img id="czbox-image" src="#" alt=""></div>'
					+ '<a id="czbox-btn-prev" href="#"><span>' + this.lang.textPrev + '</span></a>'
					+ '<a id="czbox-btn-next" href="#"><span>' + this.lang.textNext + '</span></a>'
					+ '<a id="czbox-btn-close" href="#"><span>' + this.lang.textClose + '</span></a>'
				+ '</div>'
			+ '</div>';
	}
}

/** Events binding */
/*ok*/CzBox.init = function() {
	// Close event
	CzBox.framework.addEvent(document.getElementById('czbox-btn-close'), 'click', function(e) {
		CzBox.close();
		
		CzBox.framework.cancelEvent(e);
		return false;
	});
	
	CzBox.framework.addEvent(document.getElementById('czbox-background'), 'click', function(e) {
		CzBox.close();
		
		CzBox.framework.cancelEvent(e);
		return false;
	});
	
	// Next event
	CzBox.framework.addEvent(document.getElementById('czbox-btn-next'), 'click', function(e) {
		CzBox.next();
		
		CzBox.framework.cancelEvent(e);
		return false;
	});
	// TODO: touch event - swipeRight, swipeDown
	
	// Prev event
	CzBox.framework.addEvent(document.getElementById('czbox-btn-prev'), 'click', function(e) {
		CzBox.prev();
		
		CzBox.framework.cancelEvent(e);
		return false;
	});
	// TODO: touch event - swipeLeft, swipeUp
	
	// Keyboard events
	CzBox.framework.addEvent(document.getElementsByTagName('body')[0], 'keydown', function(e) {
		var code;
		
		if(!e)
		{
			var e = window.event;
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
				CzBox.framework.cancelEvent(e);
				return false;
				//break;
			
			case 13/*Enter*/:
			case 39/*Right key*/:
			case 40/*Down key*/:
				CzBox.next();
				CzBox.framework.cancelEvent(e);
				return false;
				//break;
			
			case 37/*Left key*/:
			case 38/*Up key*/:
				CzBox.prev();
				CzBox.framework.cancelEvent(e);
				return false;
				//break;
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
	CzBox.framework.addEvent(document.getElementById('czbox-image'), 'load', function() {
		document.getElementById('czbox-loading').style.display = 'none';
		this.parentNode.style.opacity = 1;
// TODO: animate
//		$(this).parent().animate({
//			opacity: 1
//		}, 600);
	});
}


/**
 * xx	@param	String	selector
 * @param	RegExp	regexp for parsing data from <a rel=''>
 * @return
 */
/*ok*/CzBox.scanDocument = function(/*selector, */parseRelAttrRegExp) {
	var anchors = document.getElementsByTagName('a');
	
	for(var index = 0; index < anchors.length; index++)
	{
		// vygenerovat seznam nodes - pouzit data-czbox-num, cat
		var anchor = anchors[index];

		if(anchor.getElementsByTagName('img').length)
		{
			var rel = anchor.getAttribute('rel');
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
				CzBox.nodes[rel] = new Array;
			}
		
			CzBox.nodes[rel].push(anchor);
		
			anchor.setAttribute('data-czbox-rel', rel);
			anchor.setAttribute('data-czbox-index', CzBox.nodes[rel].length - 1);
		
			CzBox.framework.addEvent(anchor, 'click', function(e) {
				CzBox.open(this);
				
				CzBox.framework.cancelEvent(e);
				return false;
			});
		}
	}
}


/**
 * @param	HTMLAnchorElement
 */
/*ok*/CzBox.open = function(anchor) {
	if(anchor.href !== document.getElementById('czbox-image').getAttribute('src'))
	{
		CzBox.framework.addClass(document.getElementById('czbox-box'), 'czbox-open');
	
		document.getElementById('czbox-loading').style.display = 'block';
		
		document.getElementById('czbox-image-wrapper').style.opacity = 0;
		document.getElementById('czbox-image').setAttribute('src', anchor.href);
	
		CzBox.update(anchor);
	}
}


/*ok*/CzBox.close = function() {
	CzBox.framework.removeClass(document.getElementById('czbox-box'), 'czbox-open');
	document.getElementById('czbox-image').setAttribute('src', '');
	document.getElementById('czbox-description').style.display = 'none';
}


/*??ok*/CzBox.next = function() {
	if(CzBox.currentRel !== '')
	{
		if(CzBox.currentIndex < (CzBox.nodes[CzBox.currentRel].length - 1))
		{
			CzBox.open(CzBox.nodes[CzBox.currentRel][CzBox.currentIndex + 1]);
		}
	}
}


/*??ok*/CzBox.prev = function() {
	if(CzBox.currentRel !== '')
	{
		if(CzBox.currentIndex > 0)
		{
			CzBox.open(CzBox.nodes[CzBox.currentRel][CzBox.currentIndex - 1]);
		}
	}
}


/**
 * @param	HTMLAnchorElement
 */
/*ok*/CzBox.update = function(anchor) {
	// Update photo infos (num of, description)
//	anchor = $(anchor);
	var rel = anchor.getAttribute('data-czbox-rel');	
	var index = parseInt(anchor.getAttribute('data-czbox-index'), 10);
	
	if(CzBox.nodes[rel].length < 2)	// single image
	{
		// hidden image number && image 'of'
		document.getElementById('czbox-info-bar').style.display = 'none';
		// hidden next & prev buttons
		document.getElementById('czbox-btn-next').style.display = 'none';
		document.getElementById('czbox-btn-prev').style.display = 'none';
	}
	else
	{
		// show image number && image 'of'
		document.getElementById('czbox-info-bar').style.display = 'block';
		document.getElementById('czbox-image-number').innerHTML = (index + 1);
		document.getElementById('czbox-images-count').innerHTML = (CzBox.nodes[rel].length);
		// show next & prev buttons
		// prev button
		if(index === 0)
		{
			document.getElementById('czbox-btn-prev').style.display = 'none';
		}
		else
		{
			document.getElementById('czbox-btn-prev').style.display = 'block';
		}
		
		// next button
		if(index === (CzBox.nodes[rel].length-1))
		{
			document.getElementById('czbox-btn-next').style.display = 'none';
		}
		else
		{
			document.getElementById('czbox-btn-next').style.display = 'block';
		}
	}
	
	// Update description
	var description = CzBox.getDescription(anchor);
	var elDescription = document.getElementById('czbox-description');
	
	if(description !== '')
	{
		elDescription.innerHTML = description;
		elDescription.style.display = 'block';
	}
	else
	{
		elDescription.style.display = 'none';
	}
	
	// Update private data
	CzBox.currentRel = rel;
	CzBox.currentIndex = index;
}


/**
 * @param	String
 * @param	RegExp
 * @return	String	rel or empty string
 */
/*??ok*/CzBox.parseRelAttr = function(rel, regexp) {
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
}


/**
 * @param	HTMLAnchorElement
 * @return	String	description or empty string
 */
/*ok*/CzBox.getDescription = function(anchor) {
	var description = '';
	
	// Load description from
	var img = anchor.getElementsByTagName('img')[0];
	
	// image title
	if(description = img.getAttribute('title'))
	{
		return description;
	}
	
	// anchor title
	if(description = anchor.getAttribute('title'))
	{
		return description;
	}
	
	// image alt
	if(description = img.getAttribute('alt'))
	{
		return description;
	}
	
	return '';
}


/*ok*/CzBox.handlerWheel = function(e) {
	
	if(CzBox.framework.hasClass(document.getElementById('czbox-box'), 'czbox-open'))
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
}


/**** CzBox JS Framework ****/
CzBox.framework = CzBox.framework || {};

CzBox.framework.addClass = function(el, classNm) {
	if(!el.className)
	{
		el.className = classNm;
	}
	else
	{
		el.className = el.className + ' ' + classNm;
	}
}

CzBox.framework.removeClass = function(el, classNm) {
	if(el.className)
	{
		while((pos = el.className.indexOf(classNm)) >= 0)
		{
			el.className = el.className.slice(0, pos) + el.className.slice(pos + classNm.length);
		}
	}
}

CzBox.framework.hasClass = function(el, classNm) {
	return (' ' + el.className + ' ').indexOf(' ' + classNm + ' ') > -1;
}

/****** events ******/
CzBox.framework.cancelEvent = function(e) {
	if(window.event)
	{
		event.returnValue = false;
	}
	else
	{
		e.preventDefault();
	}
}

CzBox.framework.addEvent = function(el, type, handler) {
	if(el.addEventListener)
	{
		el.addEventListener(type, handler, false);
		return true;
	}
	else
	{
		if(el.attachEvent)
		{
			return el.attachEvent('on' + type, handler);
		}
	}
	return false;
}

/****** CSS ******/
CzBox.framework.getCss = function(el, propertyName) {
	if (obj.currentStyle)
	{
		return obj.currentStyle[styleProperty];
	}
	else if (window.getComputedStyle)
	{
		return document.defaultView.getComputedStyle(obj, null).getPropertyValue(styleProperty);
	}
}


/** Translations */
CzBox.langCs = function() {
	CzBox.lang.textImage = "Obrázek";
	CzBox.lang.textOf = "ze";
	CzBox.lang.textPrev = "Předchozí";
	CzBox.lang.textNext = "Další";
	CzBox.lang.textClose = "Zavřít";
	CzBox.lang.textLoading = "Načítám";
}


