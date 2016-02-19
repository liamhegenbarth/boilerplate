// Set the height of the footer

import $$ from 'selectors'


var resizeFooter = function resizeFooter() 
{

	var footerHeight = $$.footerWrapper.outerHeight(true);

	$$.wrapper.css({ paddingBottom : footerHeight });

};

resizeFooter();


$$.window.on('resize', resizeFooter);


export default resizeFooter
