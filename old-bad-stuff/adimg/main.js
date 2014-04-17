// Live RESET ALL
// main.js on article pages
// click through to articles / article title contenteditable

// Poll
// Dbl click to clear on ad, sponsor, nav, video



function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {

      var reader = new FileReader();
      // Closure to capture the file information.

      reader.onload = (function(theFile) {


        return function(e) {
          // Render thumbnail.
          var filename = theFile.name;
          var img;

          if (filename.indexOf("logo") >= 0) {
            var img = new Image();
            img.src = e.target.result;
          	$('#sponsor a').css('background','url(\'' + e.target.result + '\') top left no-repeat').css('width',img.width + 'px').css('height',img.height + 'px');
          	localStorage.logo = e.target.result;
          	localStorage.logoW = img.width;
          	localStorage.logoH = img.height;
          }

          else if (filename.indexOf("video") >= 0) {
          	$('#drop_video').css('background','url(\'' + e.target.result + '\') top left no-repeat');
          	localStorage.videoStill = e.target.result;
          }
          else if (filename.indexOf("adspot") >= 0) {
          	$('#drop_ad').css('background','url(\'' + e.target.result + '\') top left no-repeat');
          	localStorage.brandedAd = e.target.result;
          }
          else if (filename.indexOf("thumb") >= 0) {
          	var newThumb = e.target.result;
			localStorage.thumb = newThumb;
          }
          else if (filename.indexOf("article") >= 0) {
          	$('#articlephoto').css('background','url(\'' + e.target.result + '\') top right no-repeat');
          	var articlePhoto = e.target.result;
			localStorage.articlephoto = articlePhoto;
          }
          else {
          	$('.first').css('background','url(\'' + e.target.result + '\') bottom right no-repeat');
          	localStorage.photo = e.target.result;
          }
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }





  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }



//   Setup the dnd listeners.
//   var dropSponsor = document.getElementById('drop_sponsor');
//   dropSponsor.addEventListener('dragover', handleDragOver, false);
//   dropSponsor.addEventListener('drop', handleFileSelect, false);
//
//   var dropPhoto = document.getElementById('drop_photo');
//   dropPhoto.addEventListener('dragover', handleDragOver, false);
//   dropPhoto.addEventListener('drop', handleFileSelect, false);
//
//   var dropVideo = document.getElementById('drop_video');
//   dropVideo.addEventListener('dragover', handleDragOver, false);
//   dropVideo.addEventListener('drop', handleFileSelect, false);
//
//   var dropAd = document.getElementById('drop_ad');
//   dropAd.addEventListener('dragover', handleDragOver, false);
//   dropAd.addEventListener('drop', handleFileSelect, false);

  var dropImages = document.getElementById('w');
  dropImages.addEventListener('dragover', handleDragOver, false);
  dropImages.addEventListener('drop', handleFileSelect, false);


function dragBackground() {
	var $bg = $('.first'),
        elbounds = {
            w: parseInt($bg.width()),
            h: parseInt($bg.height())
        },
        bounds = {w: 1800 - elbounds.w, h: 1200 - elbounds.h},
        origin = {x: 0, y: 0},
        start = {x: 0, y: 0},
        movecontinue = false;

    function move (e){
        var inbounds = {x: false, y: false},
            offset = {
                x: start.x - (origin.x - e.clientX),
                y: start.y - (origin.y - e.clientY)
            };

        inbounds.x = offset.x < 0 && (offset.x * -1) < bounds.w;
        inbounds.y = offset.y < 0 && (offset.y * -1) < bounds.h;

        if (movecontinue && inbounds.x && inbounds.y) {
            start.x = offset.x;
            start.y = offset.y;

            $(this).css('background-position', start.x + 'px ' + start.y + 'px');
        }

        origin.x = e.clientX;
        origin.y = e.clientY;

        e.stopPropagation();
        return false;
    }

    function handle (e){
        movecontinue = false;
        $bg.unbind('mousemove', move);

        if (e.type == 'mousedown') {
            origin.x = e.clientX;
            origin.y = e.clientY;
            movecontinue = true;
            $bg.bind('mousemove', move);
        } else {
            $(document.body).focus();
        }

        e.stopPropagation();
        return false;
    }

    function reset (){
        start = {x: 0, y: 0};
        $(this).css('background', 'url(\'../adimg/sas2011-tmp_photo.png\') top left no-repeat');
    }

    $bg.bind('mousedown mouseup mouseleave', handle);
    $bg.bind('dblclick', reset);
}




















/*** COLOR CHANGE HELPER FUNCTIONS ***/
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

/* hex to rgb */
function hex2rgb(h) { var r = parseInt((cutHex(h)).substring(0,2),16), g = parseInt((cutHex(h)).substring(2,4),16), b = parseInt((cutHex(h)).substring(4,6),16)
	return r+', '+g+', '+b;
}



/*** BIND SHOW/HIDE EVENT FOR FEATURES ***/
var features = new Array('sm','video','poll','twitter','fb','gplus','articlephoto')
var featureDefaults = new Array(
	["heading","Title TBD"],
	["articles",4],
	["fmi",1],
	["adspot","x250"],
	["sm","hide"],
	["video","hide"],
	["poll","hide"],
	["twitter","show"],
	["fb","show"],
	["gplus","show"],
	["articlephoto","show"]
);


$.each(features, function(key, val) {
	$('input[name="' + val + '"]').click(
		function(){
			if ($(this).is(':checked')) {
				$('#' + val).show();
				localStorage[val] = "show";
			}
			else {
				$('#' + val).hide();
				localStorage[val] = "hide";
			}
			if ($('input.socialcheck:checked').length == 0) { $('#social').hide(); } else { $('#social').show(); }
	});
});




function checkLoad() {
	$.each(features, function(key, val) {
	if(localStorage[val] == undefined) { localStorage[val] = "show" };
		if (localStorage[val] == "show") {
			$('#' + val).show();
			$('input[name="' + val + '"]').attr('checked',true);
		}
		else {
			$('#' + val).hide();
			$('input[name="' + val + '"]').attr('checked',false);
		}
	});
}


/*** GET LOCALSTORAGE ***/
function getLocalStorage() {
	if (localStorage.heading) { var title = localStorage.heading; }
	else { var title = 'Title TBD';	}

	if (localStorage.thumb) { var thumb = localStorage.thumb; }
	else { var thumb = '../adimg/sas2011-tmp_photo.png'; }

	if (localStorage.logo) { var logo = localStorage.logo; }
	else { var logo = '../adimg/sas2011-tmp_logo.png'; }

	if (localStorage.photo) { var photo = localStorage.photo; }
	else { var photo = '../adimg/sas2011-tmp_photo.png'; }

	if (localStorage.videoStill) { var videoStill = localStorage.videoStill; }
	else { var videoStill = ''; }

	if (localStorage.brandedAd) { var brandedAd = localStorage.brandedAd; }
	else { var brandedAd = ''; }

	if (localStorage.logoW) { var logoW = localStorage.logoW; }
	else { var logoW = '142'; }

	if (localStorage.logoH) { var logoH = localStorage.logoH; }
	else { var logoH = '76'; }

	if (localStorage.fmi) { clickCount = localStorage.fmi; }
	else { clickCount = 1; }

	if (localStorage.articles) { var numArticles = localStorage.articles; }
	else { var numArticles = 4; }

	var $fmiLinks = $('.fmilink');
	$fmiLinks.hide(1, function() {
		$fmiLinks
			.slice(0, clickCount)
			.show();
	});

	$('input[name="currentarticles"]').attr('value',numArticles);

	var $articles = $('.article');
	$articles.hide(1, function() {
		$articles
			.slice(1, numArticles)
			.show();
	});

	if (numArticles == 1) {
		// logic for displaying the 1 article template
		$('#article.homepage-article').show();
		$('#l').hide();
		$('#ap').show();
		$('#aa').hide();
	 }



	$('#heading').text(title);
	$('.first').css('background','url(\'' + photo + '\') bottom right no-repeat');
	$('#nh a:link, #nh a:visited, #nh a:hover, #nh a:active').css('background','url(\'' + thumb + '\') bottom right no-repeat');
	$('#sponsor a').css('background','url(\'' + logo + '\') top left no-repeat').css('width', logoW + 'px').css('height', logoH + 'px');
	$('#drop_ad').css('background','url(\'' + brandedAd + '\') top left no-repeat');
	$('#drop_video').css('background','url(\'' + videoStill + '\') top left no-repeat');

	if(localStorage.adspot) {
		var adsize = localStorage.adspot;
		$('#ad').addClass(adsize);
		if (adsize == 'x280') { $('input[value="x280"]').attr('checked',true); $('#ad p').html('336x280'); }
		else if (adsize == 'x600') { $('input[value="x600"]').attr('checked',true); $('#ad p').html('300x600'); }
		else if (adsize == 'x250') { $('input[value="x250"]').attr('checked',true); $('#ad p').html('300x250'); }
	}
	else {
		$('#ad').addClass('x250');
	}
}



/*** EDIT HEADING ***/
$("#heading").keydown(function(e) {
	if(e.keyCode == 13) { // close editable region & save title to localstorage
		var newheading = $('#heading').text();
		localStorage.heading = newheading;
		$('#heading').blur();
	};

	var fontsize = $(this).css('font-size'); // get current font-size to adjust
	fontsize = fontsize.replace('px','');
	fontsize = parseInt(fontsize);

	if(e.keyCode == 40) { // reduce font-size with down arrow
		fontsize = (fontsize - 1); $(this).css('font-size', fontsize + 'px');
	}

	if(e.keyCode == 38) { // increase font-size with up arrow
		fontsize = (fontsize + 1); $(this).css('font-size', fontsize + 'px');
	}
});



/*** ADD FMI LINKS ***/


	$('#addfmi').click(function(e) {
		e.preventDefault();
		if (clickCount < 5) {
			clickCount++;
			var $fmiLinks = $('.fmilink');
			$fmiLinks.hide(1, function() {
				$fmiLinks
					.slice(0, clickCount)
					.show();
			});
			localStorage.fmi = clickCount;
		}
	});
	$('#decfmi').click(function(e) {
		e.preventDefault();
		if (clickCount > 1) {
			clickCount--;
			var $fmiLinks = $('.fmilink');
			$fmiLinks.hide(1, function() {
				$fmiLinks
					.slice(0, clickCount)
					.show();
			});
			localStorage.fmi = clickCount;
		}
	});





/*** EDIT # OF CURRENT ARTICLES ***/
$('input[name="currentarticles"]').keydown(function(e) {
	var numArticles = parseInt($(this).val());

	if (numArticles > 1) {
		if(e.keyCode == 40) { // reduce # of articles with down arrow
			numArticles = (numArticles - 1); $(this).val(numArticles);
			localStorage.articles = numArticles;
		}
	}


	if (numArticles < 6) {
		if(e.keyCode == 38) { // increase # of articles with up arrow
			numArticles = (numArticles + 1); $(this).val(numArticles);
			localStorage.articles = numArticles;
		}
	}

	 if (numArticles == 1) {
		// logic for displaying the 1 article template
		$('#article.homepage-article').show();
		$('#l').hide();
		$('#ap').show();
		$('#aa').hide();
		localStorage.articles = numArticles;
	 }

	 if (numArticles != 1) {
	 	$('#article.homepage-article').hide();
		$('#l').show();
		$('#ap').hide();
		$('#aa').show();
	}


	var $articles = $('.article');
	$articles.hide(1, function() {
		$articles
			.slice(1, numArticles)
			.show();
	});



});






/*** CHANGE COLOR ***/
function changeColor() {
	var masterhex = $('input[name="masterhex"]').val();
	localStorage.masterhex = masterhex;
	$('h1 a').css('color', masterhex);
	var copybg = hex2rgb(masterhex);
	localStorage.copybg = copybg;
	$('.first .copy').css('background','rgba(' + copybg + ', 0.75)');
	$('a:link').css('color',masterhex);
}

$('input[name="masterhex"]').blur(function() { changeColor(); });



/*** CHANGE ADSIZE ***/
function changeAdsize() {
	$('input[name="adsize"]').live('change',function(){
		var adsize = $(this).val();
		localStorage.adspot = adsize;
		if (adsize == "x250") { $('#ad').removeClass(); $('#ad p').html('300x250'); }
		else if (adsize == "x280") { $('#ad').removeClass().addClass('x280'); $('#ad p').html('336x280'); }
		else { $('#ad').removeClass().addClass('x600'); $('#ad p').html('300x600'); }
	});
}




/*** HIDE/SHOW PANEL ***/
$('#hidepanel').click(function(e) {
	e.preventDefault();
	$('#controlpanel').hide();
});

$('#showpanel').click(function() {
	$('#controlpanel').show();
});




/*** RESET ALL ***/
$('#reset').click(function(e) {
	localStorage.clear();
	$.each(featureDefaults, function(key, val) {
		localStorage[val[0]] = val[1];
	});
});


function getPanelField(label) {
  for (var i = 0; i < jemplate.fields.length; i++) {
    if (jemplate.fields[i].label === label) {
      return jemplate.fields[i]
    }
  }
}

function getElements(panelField) {

}

  var inputs = $('#panel').find('input');
  inputs.each(function() {
    $(this).blur(function() {
      var $input = $(this),
        title = $(this).attr('title'),
        value = $(this).val(),
        panelField = getPanelField(title);
        elements = getElements(panelField);

      if ('helper' in panelField) {
        [panelField.helper](value);
      }

      panelField.elements.each(function() {
        if ('helper' in this) {
          // get the params of the helper function
          // to apply the transformation to appropriate selectors
        }
        if ('css_property' in this) {
          $(this.selectors).css(this.css_property, value);
        }
        else if ('helper' in this) {
          var helperFn = this.helper
          [helperFn](this.selectors);
        }
      })

    })
  })


  $('#panel').jemplate({
    fields: [{
      label: 'Master Hex',
      type: 'color',
      elements: [
        { selectors: 'h1 .selected #sidebar', css_property: 'background-color', helper: getActiveValue('.selected') },
        { selectors: '#right-rail', css_property: 'border-color', helper: getDesaturatedValue() },
        { selectors: '#right-rail p', css_property: 'color' }
      ],
      helper: getDesaturatedValue()
    },
    {
      label: 'Font Palette',
      type: 'string',
      elements: [
        { selectors: 'h1 p', css_property: 'font-family' }
      ]
    },
    {
      label: 'Number of Articles',
      type: 'int',
      elements: [
        { selectors: '#fmi-links', helper: displayArticles }
      ]
    }]
  })
