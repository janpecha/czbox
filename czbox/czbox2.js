/**
 * CzBox2 - simple Zepto.js lightbox
 * @author		Jan Pecha, <janpecha@email.cz>
 * @version		2012-06-27-1
 * @todo		[ok 2012-06-27]	2012-06-27 - hidden next,prev button if show last,first image
 */

var CzBox = CzBox || {};

/** Object */
CzBox.lang = {
	// [Config]
	textImage: "Image",
	textOf: "of",
	textPrev: "Previous",
	textNext: "Next",
	textClose: "Close",
	textLoading: "Loading",
	
	//autoHorizontalPos: true,
	//autoVerticalPos: true
};

/** Object */
CzBox.nodes = {};

/** Array */
CzBox.enableRels = ['czbox', 'lightbox'];

/** String */
CzBox.currentRel = '';

/** Integer		0...(length-1) */
CzBox.currentIndex = 0;


CzBox.create = function() {
	// DOM modify
	CzBox.modifyDom();
	
	// Default events binding
	CzBox.init();
	
	// Scan document - fill $nodes
	// rel attr regexp: /(czbox|lightbox)(\[(.+)\])?/
	var rels = CzBox.enableRels.join('|');
	rels = '(' + rels + ')(\\[(.+)\\])?';
//	var relParseRegExp = new RegExp(rels);
	CzBox.scanDocument('a[rel*=lightbox] > img, a[rel*=czbox] > img', new RegExp(rels));
}


CzBox.modifyDom = function() {
	if(!($('#czbox-box').length))
	{
		$('body').first().append('<div id="czbox-box">'
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
			+ '</div>'
		);
	}
}


CzBox.init = function() {
	// Close event
	// TODO: add Esc handler
	$('#czbox-btn-close, #czbox-background').on('click', function() {
		CzBox.close();
		
		return false;
	});
	
	// Next event
	$('#czbox-btn-next').on('click', function() {
		CzBox.next();
		
		return false;
	});
	// TODO: touch event
	// TODO: right key
	
	// Prev event
	$('#czbox-btn-prev').on('click', function() {
		CzBox.prev();
		
		return false;
	});
	// TODO: touch event
	// TODO: left key
	
	// Keyboard events
	$('body').on('keydown', function(e) {
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
				break;
			
			case 13/*Enter*/:
			case 39/*Right key*/:
			case 40/*Down key*/:
				CzBox.next();
				break;
			
			case 37/*Left key*/:
			case 38/*Up key*/:
				CzBox.prev();
				break;
		}
		
		return false;
	});
	
	// Onload event
	$('#czbox-image').on('load', function() {
		//$(this).addClass('czbox-open');
		//$(this).css('display', 'block');
		$('#czbox-loading').css('display', 'none');
		
		$(this).parent().animate({
			opacity: 1
		}, 600);
//		alert($(this).width());
			//.animate({
			//	width: alert($(this.css('width'))), height:  $(this.css('width'))
			//}, 2, 'ease-out');
	});
}


/**
 * @param	String	selector
 * @param	RegExp	regexp for parsing data from <a rel=''>
 * @return
 */
CzBox.scanDocument = function(selector, parseRelAttrRegExp) {
	$(selector).each(function(index) {
		// 'this' is item (<img>)
		// vygenerovat seznam nodes - pouzit data-czbox-num, cat
		var anchor = $(this).parent();
		var rel = anchor.attr('rel');
//		alert(rel);
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
//			CzBox.nodes[rel] = 1;
			CzBox.nodes[rel] = new Array;
		}
//		else
//		{
//			CzBox.nodes[rel] += 1;
//		}
		
		CzBox.nodes[rel].push(anchor);
		
		anchor.data('czbox-rel', rel);
		anchor.data('czbox-index', CzBox.nodes[rel].length - 1);
		
		anchor.on('click', function() {
			CzBox.open(this);
			//alert(this.href);
			return false;
		});
	});
}


/**
 * @param	HTMLAnchorElement
 */
CzBox.open = function(anchor) {
	if(anchor.href !== $('#czbox-image').attr('src'))
	{
		$('#czbox-box').addClass('czbox-open');
	
		$('#czbox-loading').css('display', 'block');
	
		//$('#czbox-image').css('opacity', 0)
		$('#czbox-image-wrapper').css('opacity', 0);
		$('#czbox-image').attr('src', anchor.href);
	
		CzBox.update(anchor);
	}
}


CzBox.close = function() {
	$('#czbox-box').removeClass('czbox-open');
	$('#czbox-image').attr('src', '');
	$('#czbox-description').hide();
}


CzBox.next = function() {
	if(CzBox.currentRel !== '')
	{
		if(CzBox.currentIndex < (CzBox.nodes[CzBox.currentRel].length - 1))
		{
			CzBox.open(CzBox.nodes[CzBox.currentRel][CzBox.currentIndex + 1].get(0));
		}
	}
}


CzBox.prev = function() {
	if(CzBox.currentRel !== '')
	{
		if(CzBox.currentIndex > 0)
		{
			CzBox.open(CzBox.nodes[CzBox.currentRel][CzBox.currentIndex - 1].get(0));
		}
	}
}


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
		// TODO: hidden next & prev buttons
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
}


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
}


/**
 * @param	Object	Zepto Anchor Object - $(anchor)
 * @return	String	description or empty string
 */
CzBox.getDescription = function(zeptoAnchor) {
	var description = '';
	
	// Load description from
	var img = zeptoAnchor.children('img').first();
	
	// image title
	if(description = img.attr('title'))
	{
		return description;
	}
	
	// anchor title
	if(description = zeptoAnchor.attr('title'))
	{
		return description;
	}
	
	// image alt
	if(description = img.attr('alt'))
	{
		return description;
	}
	
	return '';
}

