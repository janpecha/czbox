CzBox2 - only pure JS
#####################

Photo lightbox based on pure JS & CSS

Usage
=====

1) Load CzBox
	<script type="text/javascript" src="./czbox/czbox2.js"></script>
	
2) Set skin
	<link rel="stylesheet" type="text/css" href="./czbox/czbox.css">

3) Add image to HTML document
	<a href="photos/foto1_thumb.jpg" rel="czbox"><img src="photos/foto1_big.jpg"></a>
	or
	<a href="photos/foto1_thumb.jpg" rel="lightbox"><img src="photos/foto1_big.jpg"></a>

4) Run init CzBox
	for script on end of document:
	
	<script type="text/javascript">
		// config
		// CzBox.langCs();
				
		CzBox.create();
	</script>


Create roadmap
--------------
<a href="photos/foto1_thumb.jpg" rel="czbox[roadmap]"><img src="photos/foto1_big.jpg"></a>
<a href="photos/foto2_thumb.jpg" rel="czbox[roadmap]"><img src="photos/foto2_big.jpg"></a>
<a href="photos/foto3_thumb.jpg" rel="czbox[roadmap]"><img src="photos/foto3_big.jpg"></a>


Set image description
---------------------

<a href="photos/foto1_thumb.jpg" rel="czbox[roadmap]"><img src="photos/foto1_big.jpg" title="this is description"></a>
or
<a href="photos/foto1_thumb.jpg" rel="czbox[roadmap]" title="this is description"><img src="photos/foto1_big.jpg"></a>
or
<a href="photos/foto1_thumb.jpg" rel="czbox[roadmap]"><img src="photos/foto1_big.jpg" alt="this is description"></a>



Example
=======

Live example on site http://janpecha.iunas.cz/czbox/example-only-js/ or see /example directory.


License
=======

See file license.txt


Author
======

- Jan Pecha (http://janpecha.iunas.cz)

