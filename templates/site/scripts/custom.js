$('body').on('click', '[data-location-href]', function () {
    window.location.href = $(this).attr('data-location-href');
    return false;
});

$('body').on('click', '.btnAjaxLogin', function (e) {
    e.preventDefault();

	var form = $(this).closest('form');
    var username = form[0]['username'].value;

	$.post(form.attr('action'), form.serialize(), function (res) {
		if ($.trim(res) === '') {
            getLoggedUser();
		}
        else {
			$('.ajaxLoginContainer').html(res);
		}
	});

	return false;
});

$('body').on('click', '.btnAjaxRegister', function () {
    if ($('#giveConsent').is(":checked")) {
        var form = $(this).closest('form');

        $.post(form.attr('action'), form.serialize(), function (res) {
            var response = $.trim(res);

            if (response === '') {
                registerUserAPI(form[0], $('#subscribed').is(":checked") ? 1 : 0);
            }
            else if (response === 'subscribed_error') {
                registerUserAPI(form[0], 2);
            }
            else {
                $('.ajaxRegisterContainer').html(res);
                checkMaterialFieldsForValue();
            }
        });
    }
    else {
        $('.messages-container').empty();
        showErrorMessage(messages['manage_personal_info']);
    }

    return false;
});

$('#subscribeBtn').on('click', function (e) {
    e.preventDefault();

    var form = $(this).closest('form');

    $.post(form.attr('action'), form.serialize(), function (res) {
        var response = $.trim(res);

        if (response === 'success') {
            requestInfoAgreePrivacyRight('GIVE', 1);
        }
        else {
            $('#newsletter-modal').html(res);
            checkMaterialFieldsForValue();
            requestInfoAgreePrivacyRight('GIVE', 2);
        }
    });

    return false;
});

$('#unsubscribeBtn').on('click', function (e) {
    e.preventDefault();

    var form = $(this).closest('form');

    $.post(form.attr('action'), form.serialize(), function (res) {
        var response = $.trim(res);

        if (response === 'success') {
            requestInfoAgreePrivacyRight('TAKE', 0);
        }
        else {
            $('#nonewsletter-modal').html(res);
            checkMaterialFieldsForValue();
            requestInfoAgreePrivacyRight('TAKE', 2);
        }
    });

    return false;
});

$('#saveProfileBtn').on('click', function (e) {
    e.preventDefault();

    var form = $(this).closest('form');

    $.post(form.attr('action'), form.serialize(), function (res) {
        var response = $.trim(res);

        if (response === '') {
            saveUserAPI(form[0]);
            $('.messages-container').empty();
            showSuccessMessage(messages['profile_info_saved']);
        }
        else {
            $('.ajaxProfileContainer').html(res);
            checkMaterialFieldsForValue();
        }
    });

    return false;
});


$(document).ajaxError(function(event, request, settings) {
	try {
		var repsonse = JSON.parse(request.responseText);
		alert(repsonse.error.message);
		if ($.blockUI) {
			$.unblockUI();
		}
	} catch (e) {}
});

function renderTemplate(template, data, handler)
{
	return template.replace(/{\w+}/g, function(all) {
		
		var key = all.replace(/{|}/g, '');
		
		var result;
		
		if (typeof data[key] === 'undefined') {
		    result = all;
		} else {
			result = data[key];
		}
		
		if ($.isFunction(handler)) {
			result = handler(result, all, template)
		}

		return result;
	});
}

function priceSlider(prices, v1, v2, onChange) 
{
	v1 = $.inArray(v1, prices.real);
	v1 = v1 === -1 ? 0 : v1;

	v2 = $.inArray(v2, prices.real);
	v2 = v2 === -1 ? 0 : v2;

    $('#slider-range').slider({
        range: true,
        step: 1,
        min: 0,
        max: (prices.real.length - 1),
        values: [v1, v2],
        slide: function(event, ui) {
        	$('#price-from').val(prices.rate[ui.values[0]]);
            $('#price-to').val(prices.rate[ui.values[1]]);
            $('#price-from-real').val(prices.real[ui.values[0]]);
            $('#price-to-real').val(prices.real[ui.values[1]]);
        },
        change: onChange
    });
    
    $('#price-from').val(prices.rate[$('#slider-range').slider('values', 0)]);
    $('#price-to').val(prices.rate[$('#slider-range').slider('values', 1)]);
    
    $('#price-from-real').val(prices.real[$('#slider-range').slider('values', 0)]);
    $('#price-to-real').val(prices.real[$('#slider-range').slider('values', 1)]);
}

function areaSlider(areas, v1, v2, onChange) 
{
	v1 = $.inArray(v1, areas.real);
	v1 = v1 === -1 ? 0 : v1;

	v2 = $.inArray(v2, areas.real);
	v2 = v2 === -1 ? 0 : v2;

    $('#slider-area-range').slider({
        range: true,
        step: 1,
        min: 0,
        max: (areas.real.length - 1),
        values: [v1, v2],
        slide: function(event, ui) {
        	$('#area-from').val(areas.rate[ui.values[0]]);
            $('#area-to').val(areas.rate[ui.values[1]]);
            $('#area-from-real').val(areas.real[ui.values[0]]);
            $('#area-to-real').val(areas.real[ui.values[1]]);
        },
        change: onChange
    });
    
    $('#area-from').val(areas.rate[$('#slider-area-range').slider('values', 0)]);
    $('#area-to').val(areas.rate[$('#slider-area-range').slider('values', 1)]);
    
    $('#area-from-real').val(areas.real[$('#slider-area-range').slider('values', 0)]);
    $('#area-to-real').val(areas.real[$('#slider-area-range').slider('values', 1)]);
}

function filtersToggle() 
{
    if ($(window).width() < 768) {
        $('body').on('click', '.btn-toggle-filters', function() {
            $(this).toggleClass('active');
            var label = $(this).find('span');
            if ($(this).hasClass('active')) {
            	label.html(label.attr('data-close'));
            	$(this).find('svg use').attr('xlink:href', 'templates/site/images/symbol-defs.svg#icon-clear');
            } else {
            	label.html(label.attr('data-open'));
            	$(this).find('svg use').attr('xlink:href', 'templates/site/images/symbol-defs.svg#icon-filter');
            }
            appendOverlay();
            $('body').toggleClass('overlay-active');
            $('.nav-overlay').fadeToggle(200);
            $('.search-filters-form').toggleClass('active').slideToggle();
        });
    } else {
        $('.search-filters-form').css('display', '');
        $('.btn-toggle-filters, .search-filters-form').removeClass('active');
    }
}


var currentPage = 0, messages = {};

function getLoggedUser() {
    if (app.globals.getLoggedUserRoute !== '') {
        var req = $.ajax({
            async: true,
            crossDomain: true,
            url: app.globals.getLoggedUserRoute,
            method: 'GET',
            dataType: "JSON"
        });

        req.done(function (response) {
            if (response && response.username !== '' && response.email !== '' && response.domainId !== '') {
                getLoggedUserAPI(response.username, response.email, response.domainId);
            }
        });

        req.fail(function() {
            window.location.reload(true);
        });
    }
}

function getLoggedUserAPI(username, email, domainId) {
    if (app.globals.apiUrl !== '' && username !== '' && email !== '' && domainId !== '') {
        var req = $.ajax({
            async: true,
            crossDomain: true,
            url: app.globals.apiUrl + 'getLoggedUser/' + username + '/' + email + '/' + domainId,
            method: 'GET',
            dataType: "JSON"
        });

        req.done(function (response) {
            if (response && response != undefined) {
                window.sessionStorage.setItem('currentUserGuid', response.userGuid);
            }

            window.location.reload(true);
        });

        req.fail(function() {
            window.location.reload(true);
        });
    }
}

function registerUserAPI($form, subscribed) {
    if (app.globals.apiUrl !== '') {
        var data = {
            'domainId': app.globals.currentDomainId,
            'email': $form['email'].value,
            'username': $form['username'].value,
            'password': $form['password'].value,
            'status': 1,
            'subscribed': subscribed
        };

        var req = $.ajax({
            async: true,
            crossDomain: true,
            url: app.globals.apiUrl + 'saveUserFpi',
            method: 'POST',
            dataType: "JSON",
            data: data
        });

        req.done(function (response) {
            if (response.status === 200 || response.status === 201) {
                window.location.replace(app.url.base + '/' + app.language.current.code + '/register/thanks');
            }
            else {
                showErrorMessage(messages['internal_error']);
            }
        });

        req.fail(function(response) {
            buildFailNotification(response);
        });
    }
}

function saveUserAPI($form) {
    if (app.globals.apiUrl !== '') {
        var data = {
            'domainId': app.globals.domainId !== '' ? app.globals.domainId : app.globals.currentDomainId,
            'guid': window.sessionStorage.getItem('currentUserGuid'),
            'email': $form['email'].value
        };

        if ($form['password'].value !== '') data['password'] = $form['password'].value;

        var req = $.ajax({
            async: true,
            crossDomain: true,
            url: app.globals.apiUrl + 'saveUserFpi',
            method: 'POST',
            dataType: "JSON",
            data: data
        });

        req.done(function (response) {
            if (response.status != 200) {
                showErrorMessage(messages['internal_error']);
            }

            if ($form['password'].value !== '') {
                $('#actualPassword').removeClass('focused');
                $('#profileForm').find('#password').removeClass('focused');
                $('#repassword').removeClass('focused');

                $form['actualPassword'].value = '';
                $form['password'].value = '';
                $form['repassword'].value = '';
            }
        });

        req.fail(function(response) {
            buildFailNotification(response);
        });
    }
}

function getPrivacyRights() {
    if (app.globals.apiUrl !== '') {
        var data = {
            'domainId': app.globals.currentDomainId,
            'languageId': app.language.current.id,
            'status': 1
        };

        var req = $.ajax({
            async: true,
            crossDomain: true,
            url: app.globals.apiUrl + 'getAllPrivacyRights',
            method: 'GET',
            dataType: "JSON",
            data: data
        });

        req.done(function (response) {
            if (app.globals.routeCaller.indexOf('dashboard') !== -1) {
                if (response && response.data.length > 0) {
                    var cardFooter = '', containerId = '', hasErase = false, hasInfoAgree = false;
                    var rights = [];

                    $.each(response.data, function(key, val) {
                        if (val.privacyRightCode !== app.globals.giveConsentRightCode) {
                            if (val.privacyRightCode === app.globals.eraseRightCode) {
                                hasErase = true;
                                containerId = 'erasePrivacyRightContainer';

                                cardFooter = '<div class="card-footer">' +
                                                '<button class="btn-blue btn-md btn-erase" type="button">' +
                                                    val.privacyRightActionButton +
                                                '</button>' +
                                              '</div>';
                            }
                            else if (val.privacyRightCode === app.globals.infoAgreeRightCode) {
                                hasInfoAgree = true;
                                containerId = 'infoAgreePrivacyRightContainer';

                                cardFooter = '<div class="card-footer">' +
                                                '<button class="btn-blue btn-md btn-agree-info" type="button" disabled>'+messages['yes']+'</button>' +
                                                '<button class="btn-blue btn-md btn-disagree-info" type="button" disabled>'+messages['no']+'</button>' +
                                             '</div>';
                            }
                            else {
                                rights.push(val.privacyRightCode);
                                containerId = val.privacyRightCode +'Container';
                                cardFooter = '<div class="card-footer">' +
                                                '<button class="btn-blue btn-md btn-request btn-'+ val.privacyRightCode +'" ' +
                                                        'data-code="'+ val.privacyRightCode +'" type="button">' +
                                                    val.privacyRightActionButton +
                                                '</button>' +
                                              '</div>';
                            }

                            var rightHtml = '<div id="'+ containerId +'" class="col-xs-12 col-sm-6 col-md-4 right-container">' +
                                                '<div class="page-form right-page-form">' +
                                                    '<div class="card">' +
                                                        '<div class="card-header">' +
                                                            '<h5 class="card-title" style="color: #1c2d61;">' +
                                                                val.privacyRightName +
                                                            '</h5>' +
                                                        '</div>' +
                                                        '<div class="card-body">' +
                                                            '<p>' + val.privacyRightDescription + '</p>' +
                                                        '</div>' +
                                                        cardFooter +
                                                    '</div>' +
                                                    '</div>' +
                                                '</div>';

                            $('.privacy-rights-container').append(rightHtml);
                        }
                    });

                    if (hasErase) {
                        raiseEraseEvents();
                        getErasePrivacyRightRequests();
                    }

                    if (hasInfoAgree) {
                        raiseInfoAgreeEvents();
                        getInfoAgreePrivacyRightRequests();
                    }

                    $.each(rights, function(key, val){
                        raiseRightEvents();
                        getPrivacyRightRequests(val);
                    });
                }
            }
            else if (app.globals.routeCaller.indexOf('rights-requests') !== -1) {
                if (response && response.data.length > 0) {
                    $.each(response.data, function(key, val) {
                        $('.' + val.privacyRightCode).empty().append(val.privacyRightName);
                    });
                }
            }
        });

        req.fail(function(response) {
            buildFailNotification(response);
        });
    }
}

function getErasePrivacyRight() {
    if (app.globals.apiUrl !== '') {
        if (app.globals.eraseRightCode !== '') {
            var data = {
                'domainId': app.globals.currentDomainId,
                'languageId': app.language.current.id,
                'privacyRightCode': app.globals.eraseRightCode
            };

            var req = $.ajax({
                async: true,
                crossDomain: true,
                url: app.globals.apiUrl + 'getAllPrivacyRights',
                method: 'GET',
                dataType: "JSON",
                data: data
            });

            req.done(function (response) {
                if (response && response.data.length > 0) {
                    var eraseRight = response.data[0];

                    if (app.globals.routeCaller.indexOf('dashboard') !== -1) {
                        var erasePrivacyRightHtml = '<div id="erasePrivacyRightContainer" class="col-xs-5 col-md-5">' +
                                                        '<div class="page-form right-page-form">' +
                                                            '<div class="card">' +
                                                                '<div class="card-header">' +
                                                                    '<h5 class="card-title" style="color: #1c2d61;">' +
                                                                        eraseRight.privacyRightName +
                                                                    '</h5>' +
                                                                '</div>' +
                                                                '<div class="card-body">' +
                                                                    '<p>' + eraseRight.privacyRightDescription + '</p>' +
                                                                '</div>' +
                                                                '<div class="card-footer">' +
                                                                    '<button class="btn-blue btn-md btn-erase" type="button">' +
                                                                        eraseRight.privacyRightActionButton +
                                                                    '</button>' +
                                                                '</div>' +
                                                            '</div>' +
                                                        '</div>' +
                                                    '</div>';

                        $('.privacy-rights-container').append(erasePrivacyRightHtml);

                        raiseEraseEvents();
                        getErasePrivacyRightRequests();
                    }
                    else if (app.globals.routeCaller.indexOf('rights-requests') !== -1) {
                        $('.' + app.globals.eraseRightCode).empty().append(eraseRight.privacyRightName);
                    }
                }
            });

            req.fail(function(response) {
                buildFailNotification(response);
            });
        }
        else {
            showErrorMessage(messages['missed_erase_code']);
        }
    }
    else {
        showErrorMessage(messages['api_url_undefined']);
    }
}

function getInfoAgreePrivacyRight() {
    if (app.globals.apiUrl !== '') {
        if (app.globals.infoAgreeRightCode !== '') {
            var data = {
                'domainId': app.globals.domainId !== '' ? app.globals.domainId : app.globals.currentDomainId,
                'languageId': app.language.current.id,
                'privacyRightCode': app.globals.infoAgreeRightCode
            };

            var req = $.ajax({
                async: true,
                crossDomain: true,
                url: app.globals.apiUrl + 'getAllPrivacyRights',
                method: 'GET',
                dataType: "JSON",
                data: data
            });

            req.done(function (response) {
                if (response && response.data.length > 0) {
                    var infoAgreeRight = response.data[0];

                    if (app.globals.routeCaller.indexOf('dashboard') !== -1) {
                        var infoAgreePrivacyRightHtml = '<div id="infoAgreePrivacyRightContainer" class="col-xs-5 col-md-5">' +
                                                            '<div class="page-form right-page-form">' +
                                                                '<div class="card">' +
                                                                    '<div class="card-header">' +
                                                                        '<h5 class="card-title" style="color: #1c2d61;">' +
                                                                            infoAgreeRight.privacyRightName +
                                                                        '</h5>' +
                                                                    '</div>' +
                                                                    '<div class="card-body">' +
                                                                        '<p>' + infoAgreeRight.privacyRightDescription + '</p>' +
                                                                    '</div>' +
                                                                    '<div class="card-footer">' +
                                                                        '<button class="btn-blue btn-md btn-agree-info" type="button" disabled>'+messages['yes']+'</button>' +
                                                                        '<button class="btn-blue btn-md btn-disagree-info" type="button" disabled>'+messages['no']+'</button>' +
                                                                    '</div>' +
                                                                '</div>' +
                                                            '</div>' +
                                                        '</div>';

                        $('.privacy-rights-container').append(infoAgreePrivacyRightHtml);

                        raiseInfoAgreeEvents();
                        getInfoAgreePrivacyRightRequests();
                    }
                    else if (app.globals.routeCaller.indexOf('rights-requests') !== -1) {
                        $('.' + app.globals.infoAgreeRightCode).empty().append(infoAgreeRight.privacyRightName);
                    }
                }
            });

            req.fail(function(response) {
                buildFailNotification(response);
            });
        }
        else {
            showErrorMessage('The agree to be informed privacy right code is not configured');
        }
    }
    else {
        showErrorMessage(messages['api_url_undefined']);
    }
}

function getErasePrivacyRightRequests() {
    if (app.globals.apiUrl !== '') {
        var data = {
            'domainId': app.globals.domainId !== '' ? app.globals.domainId : app.globals.currentDomainId,
            'guid': window.sessionStorage.getItem('currentUserGuid'),
            'privacyRightCode': app.globals.eraseRightCode
        };

        var req = $.ajax({
            async: true,
            crossDomain: true,
            url: app.globals.apiUrl + 'getRequests',
            method: 'GET',
            dataType: "JSON",
            data: data
        });

        req.done(function (response) {
            if (response && response.data.length > 0) {
                var lastRequest = response.data[0];
                if (lastRequest.status === 'NEW' || lastRequest.status === 'PROCESSED') $('.btn-erase').attr('disabled', '');
            }
        });

        req.fail(function(response) {
            buildFailNotification(response);
        });
    }
    else {
        showErrorMessage(messages['api_url_undefined']);
    }
}

function getInfoAgreePrivacyRightRequests() {
    if (app.globals.apiUrl !== '') {
        var data = {
            'domainId': app.globals.domainId !== '' ? app.globals.domainId : app.globals.currentDomainId,
            'guid': window.sessionStorage.getItem('currentUserGuid'),
            'privacyRightCode': app.globals.infoAgreeRightCode
        };

        var req = $.ajax({
            async: true,
            crossDomain: true,
            url: app.globals.apiUrl + 'getRequests',
            method: 'GET',
            dataType: "JSON",
            data: data
        });

        req.done(function (response) {
            if (response && response.data.length > 0) {
                var lastRequest = response.data[0];

                if (lastRequest.action === 'GIVE') {
                    if (lastRequest.status === 'FINISHED') {
                        $('.btn-disagree-info').removeAttr('disabled');

                        if (app.globals.routeCaller.indexOf('profile') !== -1) {
                            $('.nonewsletter-container').removeAttr('style');
                            $('#subscribed').prop('checked', true);
                        }
                    }
                    else if (lastRequest.status === 'CANCELLED' || lastRequest.status === 'DENIED') {
                        $('.btn-disagree-info').removeAttr('disabled');

                        if (app.globals.routeCaller.indexOf('profile') !== -1) {
                            $('.newsletter-container').removeAttr('style');
                            $('#subscribed').prop('checked', false);
                        }
                    }
                }
                else if (lastRequest.action === 'TAKE') {
                    if (lastRequest.status === 'FINISHED') {
                        $('.btn-agree-info').removeAttr('disabled');

                        if (app.globals.routeCaller.indexOf('profile') !== -1) {
                            $('.newsletter-container').removeAttr('style');
                            $('#subscribed').prop('checked', false);
                        }
                    }
                    else if (lastRequest.status === 'CANCELLED' || lastRequest.status === 'DENIED') {
                        $('.btn-agree-info').removeAttr('disabled');

                        if (app.globals.routeCaller.indexOf('profile') !== -1) {
                            $('.nonewsletter-container').removeAttr('style');
                            $('#subscribed').prop('checked', true);
                        }
                    }
                }
            } else {
            	$('.btn-disagree-info').removeAttr('disabled');
            	$('.btn-agree-info').removeAttr('disabled');
            }
        });

        req.fail(function(response) {
            buildFailNotification(response);
        });
    }
    else {
        showErrorMessage(messages['api_url_undefined']);
    }
}

function getPrivacyRightRequests(privacyRightCode) {
    if (app.globals.apiUrl !== '') {
        var data = {
            'domainId': app.globals.domainId !== '' ? app.globals.domainId : app.globals.currentDomainId,
            'guid': window.sessionStorage.getItem('currentUserGuid'),
            'privacyRightCode': privacyRightCode
        };

        var req = $.ajax({
            async: true,
            crossDomain: true,
            url: app.globals.apiUrl + 'getRequests',
            method: 'GET',
            dataType: "JSON",
            data: data
        });

        req.done(function (response) {
            if (response && response.data.length > 0) {
                var lastRequest = response.data[0];

                if (lastRequest.status === 'NEW' || lastRequest.status === 'PROCESSED') {
                    $('.btn-' + privacyRightCode).attr('data-action', lastRequest.action);
                }
                else {
                    $('.btn-' + privacyRightCode).attr('data-action', lastRequest.action === 'TAKE' ? 'GIVE' : 'TAKE');
                }
            }
            else {
                $('.btn-' + privacyRightCode).attr('data-action', 'GIVE');
            }
        });

        req.fail(function(response) {
            buildFailNotification(response);
        });
    }
    else {
        showErrorMessage(messages['api_url_undefined']);
    }
}

function requestInfoAgreePrivacyRight(action, subscribed) {
    if (app.globals.apiUrl !== '') {
        var data = {
            'domainId': app.globals.domainId !== '' ? app.globals.domainId : app.globals.currentDomainId,
            'guid': window.sessionStorage.getItem('currentUserGuid'),
            'privacyRightCode': app.globals.infoAgreeRightCode,
            'action': action,
            'subscribed': subscribed,
            'saveStatus': 1
        };

        var req = $.ajax({
            async: true,
            crossDomain: true,
            url: app.globals.apiUrl + 'saveRequestFpi',
            method: 'POST',
            dataType: "JSON",
            data: data
        });

        req.done(function (response) {
            if (response.status == 201)
            {
                if (subscribed === 0) {
                    $('#subscribed').prop('checked', false);

                    $('.nonewsletter-container').css('display', 'none');
                    $('.newsletter-container').removeAttr('style');

                    $('.messages-container').empty();
                    showSuccessMessage(messages['removed_from_newsletter']);
                }
                else if (subscribed === 1) {
                    $('#subscribed').prop('checked', true);

                    $('.newsletter-container').css('display', 'none');
                    $('.nonewsletter-container').removeAttr('style');

                    $('.messages-container').empty();
                    showSuccessMessage(messages['subscribed_to_newsletter']);
                }
            }

            if ((subscribed === 0 || subscribed === 1) && app.globals.routeCaller.indexOf('profile') !== -1) {
                $('#nonewsletter-modal').modal('hide');
                $('#newsletter-modal').modal('hide');
            }
        });

        req.fail(function(response) {
            buildFailNotification(response);
            if (app.globals.routeCaller.indexOf('profile') !== -1) {
                $('#nonewsletter-modal').modal('hide');
            }
        });
    }
    else {
        showErrorMessage(messages['api_url_undefined']);
    }
}

function requestErasePrivacyRight(action, subscribed) {
    if (app.globals.apiUrl !== '') {
        var data = {
            'domainId': app.globals.domainId !== '' ? app.globals.domainId : app.globals.currentDomainId,
            'guid': window.sessionStorage.getItem('currentUserGuid'),
            'privacyRightCode': app.globals.eraseRightCode,
            'action': action,
            'subscribed': subscribed,
            'saveStatus': 0
        };

        var req = $.ajax({
            async: true,
            crossDomain: true,
            url: app.globals.apiUrl + 'saveRequestFpi',
            method: 'POST',
            dataType: "JSON",
            data: data
        });

        req.done(function (response) {
            if (response.status == 201 && (subscribed === 0 || subscribed === 1))
            {
                $('.btn-erase').attr('disabled', '');
                $('.messages-container').empty();
                showSuccessMessage(messages['request_made_successfully']);
                
                $.ajax({
                    async: true,
                    crossDomain: true,
                    url: app.globals.forgotUser,
                    method: 'POST',
                    dataType: "JSON"
                });
            }
        });

        req.fail(function(response) {
            buildFailNotification(response);
        });
    }
    else {
        showErrorMessage(messages['api_url_undefined']);
    }
}

function requestPrivacyRight(privacyRightCode, action) {
    if (app.globals.apiUrl !== '') {
        var data = {
            'domainId': app.globals.domainId !== '' ? app.globals.domainId : app.globals.currentDomainId,
            'guid': window.sessionStorage.getItem('currentUserGuid'),
            'privacyRightCode': privacyRightCode,
            'action': action,
            'subscribed': 1,
            'saveStatus': 0
        };

        var req = $.ajax({
            async: true,
            crossDomain: true,
            url: app.globals.apiUrl + 'saveRequestFpi',
            method: 'POST',
            dataType: "JSON",
            data: data
        });

        req.done(function (response) {
            if (response.status == 201)
            {
                $('.btn-request').attr('data-action', action === 'TAKE' ? 'GIVE' : 'TAKE');
                $('.messages-container').empty();
                showSuccessMessage(messages['request_made_successfully']);
            }
        });

        req.fail(function(response) {
            buildFailNotification(response);
        });
    }
    else {
        showErrorMessage(messages['api_url_undefined']);
    }
}

function getRequests() {
    if (app.globals.apiUrl !== '') {
        var data = {
            'domainId': app.globals.domainId !== '' ? app.globals.domainId : app.globals.currentDomainId,
            'guid': window.sessionStorage.getItem('currentUserGuid')
        };

        if (currentPage !== 0) {
            data['page'] = currentPage;
        }

        var req = $.ajax({
            async: true,
            crossDomain: true,
            url: app.globals.apiUrl + 'getRequests',
            method: 'GET',
            dataType: "JSON",
            data: data
        });

        req.done(function (response) {
            $('.messages-container').empty();
            $('.pagination').empty();
            $('.requests-container').find('tbody').empty();

            buildRequestsTable(response.data);
            buildPagination(response.meta.pagination, buildRequestsUrl());
        });

        req.fail(function(response) {
            buildFailNotification(response);
        });
    }
    else {
        showErrorMessage(messages['api_url_undefined']);
    }
}

function getStatusHistory(requestId) {
    if (app.globals.apiUrl !== '') {
        if (requestId && requestId !== undefined) {
            var req = $.ajax({
                async: true,
                crossDomain: true,
                url: app.globals.apiUrl + 'getStatusesRequest/' + requestId,
                method: 'GET',
                dataType: "JSON"
            });

            req.done(function (response) {
                buildStatusHistoryTable(response.data);
            });

            req.fail(function(response) {
                buildFailNotification(response);
            });
        }
        else {
            showErrorMessage(messages['no_request_selected']);
        }
    }
    else {
        showErrorMessage(messages['api_url_undefined']);
    }
}

function buildRequestsTable(requests) {
    if (requests && requests.length > 0) {
        var action = '', status = '', rowHtml = '';

        $.each(requests, function(key, val) {
            action = val.action === 'GIVE' ? 'allow' : 'disallow';

            switch (val.status) {
                case 'NEW':
                    status = 'New';
                    break;
                case 'PROCESSED':
                    status = 'Processed';
                    break;
                case 'FINISHED':
                    status = 'Finished';
                    break;
                case 'CANCELLED':
                    status = 'Cancelled';
                    break;
                default:
                    status = 'Denied';
                    break;
            }

            rowHtml = '<tr>' +
                        '<td class="text-center">'+ val.id +'</td>' +
                        '<td>'+ val.requestDate +'</td>' +
                        '<td>'+ val.statusDate +'</td>' +
                        '<td class="'+ val.privacyRightCode +'"></td>' +
                        '<td>'+ action +'</td>' +
                        '<td class="td-status">' +
                            '<button class="btn btn-md btn-show-status" data-id="'+ val.id +'">' +
                                '<svg class="icon" role="img">' +
                                    '<use xmlns:xlink="http://www.w3.org/1999/xlink"' +
                                        'xlink:href="templates/site/images/symbol-defs.svg#icon-info"/>' +
                                '</svg>' +
                            '</button>' +
                            status + '&nbsp; ' +
                        '</td>' +
                      '</tr>';

            $('.requests-container').find('tbody').append(rowHtml);
        });

        getPrivacyRights();
        raiseRequestsTableEvents();
    }
    else {
        showErrorMessage(messages['no_requests']);
    }
}

function buildPagination(paginationData, url) {
    if (paginationData.total_pages > 1) {
        currentPage = paginationData.current_page;

        var paginationHtml = '', prevPageHtml = '', itemPageHtml = '', nextPageHtml = '';

        if (currentPage === 1) {
            prevPageHtml = '<li><a disabled rel="prev"><span class="pagination-arrow">&laquo;</span></a></li>';
        }
        else {
            prevPageHtml = '<li>' +
                            '<a id="btnPrevPage" class="custom-page" rel="prev" ' +
                                'href="'+ url + '&page=' + parseInt(currentPage - 1) +'"' +
                                'data-page="'+ parseInt(currentPage - 1) +'">' +
                                '<span class="pagination-arrow">&laquo;</span>' +
                            '</a>' +
                           '</li>';
        }

        paginationHtml += prevPageHtml;

        for (var i = 0; i < paginationData.total_pages; i++) {
            if (parseInt(i + 1) === currentPage) {
                itemPageHtml = '<li class="active"><a rel="canonical" href="#" disabled>'+ parseInt(i + 1) +'</a></li>';
            }
            else {
                itemPageHtml = '<li class="not-active">' +
                                '<a id="btnItemPage'+ parseInt(i + 1) +'" rel="canonical" class="custom-page" ' +
                                    'href="'+ url +'&page='+ parseInt(i + 1) +'"' +
                                    'data-page="'+ parseInt(i + 1) +'">' +
                                    parseInt(i + 1)+
                                '</a>' +
                                '</li>';
            }

            paginationHtml += itemPageHtml;
        }

        if (currentPage === paginationData.total_pages) {
            nextPageHtml = '<li><a disabled class="next"><span class="pagination-arrow">&raquo;</span></a></li>';
        }
        else {
            nextPageHtml = '<li>' +
                            '<a id="btnNextPage" class="previous custom-page" rel="next" ' +
                                'href="'+ url + '&page=' + parseInt(currentPage + 1) +'"' +
                                'data-page="'+ parseInt(currentPage + 1) +'">' +
                                '<span class="pagination-arrow">&raquo;</span>' +
                            '</a>' +
                           '</li>';
        }

        paginationHtml += nextPageHtml;
        paginationHtml += '</ul></div>';

        $('.pagination').append(paginationHtml);

        raisePaginationEvents();
    }
}

function buildRequestsUrl() {
    var url = '';
    var domainId = app.globals.domainId !== '' ? app.globals.domainId : app.globals.currentDomainId;

    return url + 'getRequests?domainId='+ domainId;
}

function buildStatusHistoryTable(statuses) {
    if (statuses && statuses.length > 0) {
        $('#statusHistoryTable').find('tbody').empty();

        var rowHtml = '', comment = '';

        $.each(statuses, function(key, val) {
            comment = val.statusComment !== null ? val.statusComment : '-';

            rowHtml = '<tr>' +
                        '<td>'+ val.status +'</td>' +
                        '<td>'+ val.statusDate +'</td>' +
                        '<td>'+ comment +'</td>' +
                     '</tr>';

            $('#statusHistoryTable').find('tbody').append(rowHtml);
        });

        $('#statusHistoryModal').modal('show');
    }
    else {
        showErrorMessage(messages['no_statuses_history']);
    }
}

function buildFailNotification(response) {
    var message = '';

    switch (response.status) {
        case 400:
            if (response.responseJSON.unknown_fields !== undefined) {
                $.each(response.responseJSON.unknown_fields, function(key, val) {
                    message += val;
                });
            }

            if (response.responseJSON.invalid_filters !== undefined) {
                $.each(response.responseJSON.invalid_filters, function(key, val) {
                    message += val;
                });
            }

            if (response.responseJSON.invalid_fields !== undefined) {
                $.each(response.responseJSON.invalid_fields, function(key, val) {
                    message += val;
                });
            }

            if (response.responseJSON.message !== '' && response.responseJSON.message !== undefined) {
                message += response.responseJSON.message;
            }

            break;
        case 403:
            message = messages['no_permission'];
            break;
        case 404:
        case 405:
        case 500:
        default:
            if (response.responseJSON && response.responseJSON !== undefined)
                message = response.responseJSON.message;
            else
                message = messages['unknown_error'];
            break;
    }

    if (message !== '') {
        $('.messages-container').empty();
        showErrorMessage(message);
    }
}

function showSuccessMessage(message) {
    var html = '<div class="alert success" style="margin-bottom: 30px;">' +
                '<svg class="icon" role="img">' +
                    '<use xmlns:xlink="http://www.w3.org/1999/xlink"' +
                        'xlink:href="templates/site/images/symbol-defs.svg#icon-check"/>' +
                '</svg>' +
                '<strong>Success!</strong> '+ message +
               '</div>';

    $('.messages-container').append(html);
}

function showErrorMessage(message) {
    var html = '<div class="alert error" style="margin-bottom: 30px;">' +
                '<svg class="icon" role="img">' +
                    '<use xmlns:xlink="http://www.w3.org/1999/xlink"' +
                        'xlink:href="templates/site/images/symbol-defs.svg#icon-cancel"/>' +
                '</svg>' +
                '<strong>Error!</strong> '+ message +
               '</div>';

    $('.messages-container').append(html);
}

function raiseEraseEvents() {
    $('.btn-erase').click(function(e) {
        e.preventDefault();

        requestErasePrivacyRight('GIVE', 1);
    });
}

function raiseInfoAgreeEvents() {
    $('.btn-agree-info').click(function(e) {
        e.preventDefault();

        var data = {
            'email': app.globals.email,
            'firstName': app.globals.firstName,
            'lastName': app.globals.lastName,
            'subscribed': 1
        };

        var req = $.ajax({
            async: true,
            crossDomain: true,
            url: app.url.base + '/user-management/index/ajax-subscribe',
            method: 'POST',
            dataType: "JSON",
            data: data
        });

        req.done(function (response) {
            if (response.message === 'OK') {
                requestInfoAgreePrivacyRight('GIVE', 1);
            }
            else {
                requestInfoAgreePrivacyRight('GIVE', 2);

                $('.messages-container').empty();

                if (response.errors.email != undefined && response.errors.email != '') {
                    showErrorMessage(response.errors.email);
                }

                if (response.errors.subscribed != undefined && response.errors.subscribed != '') {
                    showErrorMessage(response.errors.subscribed);
                }

                if (response.errors.unknown != undefined && response.errors.unknown != '') {
                    showErrorMessage(response.errors.unknown);
                }
            }
        });

        req.fail(function(response) {
            buildFailNotification(response);
        });
    });

    $('.btn-disagree-info').click(function(e) {
        e.preventDefault();

        var data = {
            'email': app.globals.email,
            'subscribed': -1
        };

        var req = $.ajax({
            async: true,
            crossDomain: true,
            url: app.url.base + '/user-management/index/ajax-subscribe',
            method: 'POST',
            dataType: "JSON",
            data: data
        });

        req.done(function (response) {
            if (response.message === 'OK') {
                requestInfoAgreePrivacyRight('TAKE', 0);
            }
            else {
                requestInfoAgreePrivacyRight('TAKE', 2);

                $('.messages-container').empty();

                if (response.errors.email != undefined && response.errors.email != '') {
                    showErrorMessage(response.errors.email);
                }

                if (response.errors.subscribed != undefined && response.errors.subscribed != '') {
                    showErrorMessage(response.errors.subscribed);
                }

                if (response.errors.unknown != undefined && response.errors.unknown != '') {
                    showErrorMessage(response.errors.unknown);
                }
            }
        });

        req.fail(function(response) {
            buildFailNotification(response);
        });
    });
}

function raiseRightEvents() {
    $('.btn-request').click(function(e) {
        e.preventDefault();

        var $this = $(this);
        var action = $this.data('action');
        var code = $this.data('code');

        requestPrivacyRight(code, action);
    });
}

function raiseRequestsTableEvents() {
    $('.btn-show-status').click(function(e) {
        e.preventDefault();

        var $item = $(this);
        var id = $item.data('id');

        getStatusHistory(id);
    });
}

function raisePaginationEvents() {
    $('.custom-page').click(function(e) {
        e.preventDefault();

        var $item = $(this);
        currentPage = $item.data('page');

        getRequests();
    });
}

function getAllUsers() {
    if (app.globals.getUsersRoute !== '') {
        var req = $.ajax({
            async: true,
            crossDomain: true,
            url: app.globals.getUsersRoute,
            method: 'GET',
            dataType: "JSON"
        });

        req.done(function (response) {
            console.log('SUCCESS', response);
            importUsers(response.emails, response.userNames, response.domainIds);
        });

        req.fail(function(response) {
            console.log('FAIL', response);
        });
    }
    else {
        console.log(messages['get_users_route_undefined']);
    }
}

function importUsers(emails, userNames, domainIds) {
    if (emails && userNames && domainIds && emails.length == userNames.length && emails.length == domainIds.length) {
        if (app.globals.apiUrl !== '') {
            var data = {
                'emails': emails,
                'userNames': userNames,
                'domainIds': domainIds
            };

            var req = $.ajax({
                async: true,
                crossDomain: true,
                url: app.globals.apiUrl + 'importUsersFpi',
                method: 'POST',
                dataType: "JSON",
                data: data
            });

            req.done(function (response) {
                console.log('SUCCESS', response);
            });

            req.fail(function(response) {
                console.log('FAIL', response);
            });
        }
        else {
            console.log(messages['api_url_undefined']);
        }
    }
    else {
        console.log(messages['quantity_no_match']);
    }
}

function testApi() {
    var req = $.ajax({
        async: true,
        crossDomain: true,
        url: "/fpi/public/user-management/index/test-api",
        method: 'GET',
        dataType: "JSON"
    });

    req.done(function (response) {
        console.log('SUCCESS', response);
    });

    req.fail(function(response) {
        console.log('FAIL', response);
    });
}

function testThings() {
    var req = $.ajax({
        async: true,
        crossDomain: true,
        url: "/fpi/public/user-management/index/test-things",
        method: 'GET',
        dataType: "JSON"
    });

    req.done(function (response) {
        console.log('SUCCESS', response);
    });

    req.fail(function(response) {
        console.log('FAIL', response.responseText);
    });
}


$('body').on('click', function(e) {
	var target = $(e.target);
	if (!target.closest('.search-filters-toggle-group').length) {
		if ($('.search-filters-form.active').length && !target.hasClass('select2-selection__choice__remove')) {
			var toggleFilters = $('.btn-toggle-filters');
			if (toggleFilters.length) {
			    var label = toggleFilters.find('span');
			    if (label.length) {
			        label.html(label.attr('data-open'));
			        var svg = toggleFilters.find('svg use');
			        if (svg.length) {
			        	svg.attr('xlink:href', 'templates/site/images/symbol-defs.svg#icon-filter');
			        }
			    }
			}
		}
	}
});

$('.input-multiselect .form-control').select2();

$('.input-multiselect .form-control').on('select2:open', function() {
    $(this).addClass('focused');
    $(this).parent().find('.select2-search__field').attr('readonly', 'readonly');
}).on('select2:close', function() {
    if ($(this).val().length) {
        $(this).addClass('focused');
    } else {
        $(this).removeClass('focused');
    }
}).on('select2:unselecting', function() {
	$(this).data('unselecting', true)
}).on('select2:opening', function(e) {
    if ($(this).data('unselecting')) {
    	$(this).removeData('unselecting');
    	e.preventDefault();
    }
});

$('body').on('focus', '.material-input input, .material-input textarea, .material-input select', function() {
	$(this).addClass('focused');
});

$('body').on('blur', '.material-input input, .material-input textarea, .material-input select', function() {
    if (!$(this).val() || !$(this).val().length) {
		$(this).removeClass('focused');
    }	
});

function checkMaterialFieldsForValue() {
    $('.material-input input, .material-input textarea, .material-input select').each(function() {
        if ($(this).val() && $(this).val().length) {
            $(this).addClass('focused');
        }
    });
}

$(document).ready(function() {
    buildMessages();

    //getAllUsers();
    //testThings();
    //testApi();

    if (app.globals.routeCaller.indexOf('profile') !== -1) {
        getInfoAgreePrivacyRightRequests();
    }
    else if (app.globals.routeCaller.indexOf('dashboard') !== -1) {
        getPrivacyRights();
    }
    else if (app.globals.routeCaller.indexOf('rights-requests') !== -1) {
        getRequests();
    }


    $('.logout-link').click(function(e) {
        e.preventDefault();

        window.sessionStorage.removeItem('currentUserGuid');
        $('#formLogout').submit();

        return false;
    });

    // fix browser user/pass autocomplete bug
    $('.btn-login-toggle').on('click', function() {
        checkMaterialFieldsForValue();
    });
    
    // if ($(window).scrollTop() === 0) {
    //     $('html, body').animate({
    //         scrollTop: $("#breadcrumb").offset().top
    //     }, 100);
    // }
    
    $('form.autofocus .form-control').each(function(){
    	
    	if($(this).val()) {
    		$(this).addClass('focused');
    	}
    	
    });
    
    $('.btn-clear').on('click',function(){
    
    	var form = $(this).closest('form');
    	form.get(0).reset();
   
    });
    
    $("#newsletter-modal").on('click','#subscribeBtn',function(){
    	 var form = $("#subscribeForm");
    	 var serializedData = form.serialize();

    	 $.post(form.attr('action'),form.serialize(),function(data){
    		
    		 		if(data == 'success') { console.log(data);
    		 			$("#newsletter-modal").modal('toggle');;
    		 		} else {
    		 			$("#newsletter-modal").html(data)
    		 		}
         });
    	 return false;
    })
});

$('a.gallery-trigger').on('click', function(e) {
    e.preventDefault();
    var galleryId = $(this).attr('data-gallery-id');
    var galleryType = $(this).attr('data-gallery-type');
    var url = $(this).attr('href');
    var hotelId = $(this).attr('data-hotel-id');
    var roomId = $(this).attr('data-room-id');
    var leadImage = $(this).attr('data-lead-image');
    
    $.post( url, { galleryId: galleryId, hotelId: hotelId, galleryType: galleryType, roomId:roomId,leadImage:leadImage }, function( data ) {

		if(data) {
        	$('.gallery-container').html(data);

        	$('.gallery-thumbs').flexslider({
                controlNav: false,
                directionNav: false,
                animationLoop: false,
                slideshow: false,
                itemWidth: 100,
                itemMargin: 0,
                asNavFor: '.gallery-slider',
                start: function(slider) {
                    slider.find('li').css({
                        'margin-right': '',
                        'width': '',
                        'opacity': '',
                        'z-index': ''
                    })
                }
            });
            $('.gallery-slider').flexslider({
                animation: 'fade',
                controlNav: false,
                directionNav: false,
                animationLoop: false,
                animationSpeed: 500,
                slideshow: false,
                sync: '.gallery-thumbs'
            });
            $('.btn-gallery-prev, .btn-gallery-next').on('click', function(e) {
                e.preventDefault();
                var direction = $(this).data('direction');
                $('.gallery-slider').flexslider(direction);
                return false;
            });

            $('.btn-close-gallery').on('click', function(e) {
                $('.gallery-container').fadeOut(200);
            });
            $('.gallery-container').fadeIn(200).css('top', $(window).scrollTop());
		}
		return false;
		
  	}, "html");
   return false; 
});

function eventsCalendar() {

	if (typeof eventActiveDates === 'undefined') {
		return;
	}
	
	$('.events-calendar').datepicker({
    	//dateFormat: 'dd/mm/yy',
        showOtherMonths: true,
        onSelect: function(data){
        	window.location =$(this).attr('data-url')+'?date='+data;
        },
        beforeShowDay: function(date) {
            if(eventActiveDates) {
		       	 if($.inArray($.datepicker.formatDate('yy-mm-dd', date ), eventActiveDates) > -1)
		    	    {
		    	        return [true,''];
		    	    }
		    	    else
		    	    {    
		    	    	return [false,"highlight"];       
		    	   }
        	}
        },
        onChangeMonthYear: function (year,month) {
            var yearmonth = year+'-'+month;
            var url = $(".events-calendar-container").attr('data-url');
            
            $.post(url,{date:yearmonth}, function(result){
            	
            	 eventActiveDates = result;
            	 $('.events-calendar').datepicker('refresh');
            	 
            	 
            },'json')
           
        }
    
    });
}