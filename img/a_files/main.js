

$(function () {

	var toggleTypes = ['SPONSOR', 'VOLUNTEER', 'MENTOR', 'ORGANIZER', 'HACKER'];

	var benefit = "Shirt"
	var types = ['mentor', 'participant', 'volunteer'];
	var fontSize = 4.9;

	//set search to email at start
	localStorage.setItem('search', 'email')

	// $( "#toggleButton" ).click(function() {
	// 	if($('#searchInput').attr('placeholder') == 'Scan Swag') {
	// 		$('#searchInput').attr('placeholder', 'Search By Email')
	// 		$('#searchInput').val('')
	// 		$('#toggleButton').html('Toggle For Swag Scan')
	// 		localStorage.setItem('search', 'email')
	// 	} else {
	// 		$('#searchInput').attr('placeholder', 'Scan Swag')
	// 		$('#searchInput').val('')
	// 		$('#toggleButton').html('Toggle For Check-in')
	// 		localStorage.setItem('search', 'swag')
	// 	}
	// });

	// $('#searchInput').on('input', function() {
	// 	if ($('#toggleButton').text().trim() == 'Toggle For Check-in') {
	// 		scan()
	// 	} 
	// });	

	$("#topBar").click(function () {
		var role = localStorage.getItem('role')
		var email = localStorage.getItem('email')
		var newTypes = types
		var index = newTypes.indexOf(role);
		newTypes.splice(index, 1)
		newTypes.push(role)
		updateContent('email', email, newTypes)
	});

	// Checkin and Print
	$('#print').click(function () {
		checkin()
		javascript: print();
	});

	generateBar(1234);

	function generateBar(email) {	
		$("#barcodeC").empty()
		$("#barcodeC").barcode(String(email), "code39", {
		    barWidth: 4,
		    barHeight: 90,
		    output: "bmp"
		});
		$("#barcodeC").width('auto');
     }

	function checkin() {
		var role = localStorage.getItem('role')
		var id = localStorage.getItem('id')
		var formData = {
			"role": role,
			"id": id
		}
		formData[role] = {"status": "attended"}
		var new_url = "https://hackduke-api.herokuapp.com/people/update_role_external";
		$.ajax({
			type: "POST",
			data: formData,
			dataType: 'json',
			url: new_url,
			content: 'application/javascript',
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Basic " + btoa("hackduke" + ":" + "dendenHacker"));
			},
			success: function (data, textStatus, jqXHR) {
				notify('Checked-In Success', true);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				notify('Check-in Failed', false);
			}
		})
	}

	// Cat updating
	$('#crop_cat_container').click(function () {
		$("#crop_cat").css("background-image", "url(http://thecatapi.com/api/images/get?format=src&type=jpg&size=small&" + new Date().getTime());
	});
	$('#crop_cat_container').click();

	/// Search Interface Setup
	$('#search').click(function () {
		$('#search input').focus();
	});

	// Presearch assignments
	var searched = '', query;

	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $("#search input").is(":focus")) {
			search();
			// if(localStorage.getItem('search') == 'email') {
			// 	search();
			// } else {
			// 	scan();
			// }
		}
	});

	function addBenefit(benefits, id, role) {
		var newBenefits = benefits
		newBenefits.push(benefit)
		var formData = {
			"role": role,
			"id": id
		}
		formData[role] = {"benefits": benefits}
		var new_url = "https://hackduke-api.herokuapp.com/people/update_role_external";
		$.ajax({
			type: "POST",
			data: formData,
			dataType: 'json',
			url: new_url,
			content: 'application/javascript',
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Basic " + btoa("hackduke" + ":" + "dendenHacker"));
			},
			success: function (data, textStatus, jqXHR) {
				notify('Person Can Receive Swag', true);
				$('#searchInput').val('')
			},
			error: function (jqXHR, textStatus, errorThrown) {
				notify('Failed to Update Person', false);
				$('#searchInput').val('')
			}
		})
	}

	function scan() {

		var formData = {
			"season": "fall",
			"event_type": "code_for_good",
			"role": "person",
			"key": "id",
			"year": 2016,
			"value": $("#search input").val()
		}
		var new_url = "https://hackduke-api.herokuapp.com/people/query_by_key_value";
		$.ajax({
			type: "POST",
			data: formData,
			dataType: 'json',
			url: new_url,
			content: 'application/javascript',
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Basic " + btoa("hackduke" + ":" + "dendenHacker"));
			},
			success: function (data, textStatus, jqXHR) {
				// always checks the first role match
				if(data.length > 0) {
					for(var i = 0; i < types.length; i++) {
						var role = data[0][types[i]][0]
						if(role != null) {
							var benefits = role['benefits']
							if(benefits.indexOf(benefit) == -1) {
								addBenefit(benefits, role['id'], types[i])
								notify('Person Can Receive Swag', true);

							} else {
								notify('Person Cannot Receive Swag', false);
								$('#searchInput').val('')
							}
							break;
						}
					}
				} else {
					notify('Person Not Found', false);
					$('#searchInput').val('')
				}

			},
			error: function (jqXHR, textStatus, errorThrown) {
				notify('Person Not Found', false);
				$('#searchInput').val('')
			}
		});
	}

	$('#searchIcon').click(function () {
		search()
		// if(localStorage.getItem('search') == 'email') {
		// 	search();
		// } else {
		// 	scan();
		// }
	});


	// Search operations
	function search() {
		query = $("#search input").val();
		updateContent('email', query, types)
	}

	function updateContent(key, query, types) {
		var formData = {
			"season": "fall",
			"event_type": "code_for_good",
			"role": "person",
			"key": key,
			"year": 2016,
			"value": query
		}
		var new_url = "https://hackduke-api.herokuapp.com/people/query_by_key_value";
		$.ajax({
			type: "POST",
			data: formData,
			dataType: 'json',
			url: new_url,
			content: 'application/javascript',
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Basic " + btoa("hackduke" + ":" + "dendenHacker"));
			},
			success: function (data, textStatus, jqXHR) {
				if(data.length > 0) {
					var first = data[0]
					var confirmed = false
					for(var i = 0; i < types.length; i++) {
						if(first[types[i]][0] != null) {
							if(types[i] != 'participant' || first[types[i]][0]['status'] == 'confirmed') {
								notify('&#10004; Person Found and Confirmed', true);
								confirmed = true
								$('#first').val(first["person"]["first_name"] + ' ' + first["person"]["last_name"]);
								shrinkToFill($('#first'), fontSize, "", "Montserrat, sans-serif");
								$('#full').val(first["person"]["email"]);
								localStorage.setItem('email', first["person"]["email"])
								generateBar(first["person"]["id"]);
								var upper = types[i].toUpperCase();
								mod = first[types[i]][0]['person_id'] % 3
								if(types[i] == 'participant') {
									if(mod == 0) {
										upper += ' (GROUP A)'
									} else if(mod == 1) {
										upper += ' (GROUP B)'
									} else if(mod == 2) {
										upper += ' (GROUP C)'
									}
								}
								$('#type').text(upper);
								localStorage.setItem('id', first[types[i]][0]['id'])
								localStorage.setItem('role', types[i])
								break;
							} 
						}
					}
					if(!confirmed) {
						notify('Person Not Confirmed.')
					}
				} else {
					notify('Person Not Found', false);
				}

			},
			error: function (jqXHR, textStatus, errorThrown) {
				notify('Person Not Found', false);
			}
		});
	}

	// Notifications
	function notify(msg, which) {
		if (which == true) which = 'good';
		else which = 'bad';
		var $which = $('#' + which);
		$which.html(msg);
		$which.fadeIn(150).css("display", "inline-block");
		setTimeout(function () {
			$which.fadeOut(150);
		}, 3000);
	}

	function px(input) {
		var emSize = parseFloat($("body").css("font-size"));
		return (input / emSize);
	}

	// Text resizing
	$(".resizer button").click(function () {
		var multiplier = 1;
		var $whichText = $('#first');
		if ($(this).parent().attr('id') == "r2") {
			$whichText = $('#full');
		}
		if ($(this).html() != "+") {
			multiplier = -1;
		}

		var currentSize = px(parseFloat($whichText.css('font-size')));
		$whichText.css('font-size', currentSize + (multiplier * .15) + 'em');
	});

	$('#first').keyup(function () {
		shrinkToFill(this, fontSize, "", "Montserrat, sans-serif");
	})

	function measureText(txt, font) {
		var id = 'text-width-tester',
			$tag = $('#' + id);
		if (!$tag.length) {
			$tag = $('<span id="' + id + '" style="display:none;font:' + font + ';">' + txt + '</span>');
			$('body').append($tag);
		} else {
			$tag.css({
				font: font
			}).html(txt);
		}
		return {
			width: $tag.width(),
			height: $tag.height()
		}
	}

	function shrinkToFill(input, fontSize, fontWeight, fontFamily) {
		var $input = $(input),
			txt = $input.val(),
			maxWidth = $input.width() + 5, // add some padding
			font = fontWeight + " " + fontSize + "em " + fontFamily;
		// see how big the text is at the default size
		var textWidth = measureText(txt, font).width;
		if (textWidth > maxWidth) {
			// if it's too big, calculate a new font size
			// the extra .9 here makes up for some over-measures
			fontSize = fontSize * maxWidth / textWidth * .9;
			font = fontWeight + " " + fontSize + "em " + fontFamily;
			// and set the style on the input
			$input.css({
				font: font
			});
		} else {
			// in case the font size has been set small and 
			// the text was then deleted
			$input.css({
				font: font
			});
		}
	}
});