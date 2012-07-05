
CzBox2 - Great Photo Lightbox
#############################

- for jQuery & Zepto.JS or only pure JavaScript
- default skin not used any images
- Lightbox2 compatible - don't have to change your sites.
- Open-Source - CzBox is available under New BSD License


How to Use
==========

Step 1 - Load scripts & skin
----------------------------

Load Zepto.JS or jQuery (not necessary for pure-JS version):

	<script type="text/javascript" src="zepto.js"></script>

	<script type="text/javascript" src="jquery.min.js"></script>


Load czbox.js:

	<script type="text/javascript" src="./czbox/czbox2.js"></script>


Load CzBox skin:

	<link rel="stylesheet" type="text/css" href="./czbox/czbox.css">


Create CzBox:

	<script type="text/javascript">CzBox.create();</script>
	

Step 2 - Activate
-----------------

Add rel="czbox" attribute to any link to activate CzBox (or alternatively rel="lightbox"):
	
	<a href="photos/photo1.jpg" rel="czbox">Photo #1</a>

Note: you can use data-czbox-href="" attribute for address of image:

	<a href="http://example.com/" rel="czbox" data-czbox-href="photos/photo1.jpg">Photo #1</a>


Optionally you can add <a title> attribute for show a caption (or can use <a><img title> or <a><img alt>)

	<a href="photos/photo1.jpg" rel="czbox" title="This is a caption">Photo #1</a>
	<a href="photos/photo1.jpg" rel="czbox"><img src="thumb.jpg" title="This is a caption"></a>
	<a href="photos/photo1.jpg" rel="czbox"><img src="thumb.jpg" alt="This is a caption"></a>


You can use rel="czbox[groupId]" for creating group of images.

	<a href="photos/photo1.jpg" rel="czbox[group]">Photo #1</a>
	<a href="photos/photo2.jpg" rel="czbox[group]">Photo #2</a>
	<a href="photos/photo3.jpg" rel="czbox[group]">Photo #3</a>


Demo
=======

Live demo is on site http://janpecha.iunas.cz/czbox/example/ or in /example directory.


License
=======

See file license.txt


Author
======

- Jan Pecha (http://janpecha.iunas.cz)

