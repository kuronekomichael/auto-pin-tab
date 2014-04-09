/* jshint jquery:true */
'use strict';
$(function(){

    function insertLine(value) {

        var $li = $('<li>');
        $li.append($('<input>').attr('type', 'text').addClass('url-list__target-url').val(value));
        if (value) {
            $li.find('.url-list__target-url').attr('readonly', 'readonly');
            $li.data('status', 'STAY');
            $li.append($('<button>').attr('title', 'remove').addClass('icon remove'));
        } else {
            $li.data('status', 'EDIT');
            $li.append($('<button>').attr('title', 'save').addClass('icon save'));
            $li.append($('<button>').attr('title', 'remove').addClass('icon remove'));
        }
        $('.url-list').append($li);

        $('.icon.add').remove();
        $li.append($('<button>').attr('title', 'add').addClass('icon add'));
    }

    function initStorage() {
        if (localStorage.targetUrls === undefined) {
            localStorage.targetUrls = [
                'https://www.facebook.com/',
                'https://mail.google.com/mail',
                'https://web.tweetdeck.com/',
                'https://i.doit.im/home'
            ];
        }
    }

    function updateStorage() {
        var storage = [];
        $('.url-list__target-url').each(function(index, node) {
            if (node.value) {
                storage.push(node.value);
            }
        });
        var oldValue = localStorage.targetUrls;
        localStorage.targetUrls = storage;
        var newValue = localStorage.targetUrls;
        
        if (oldValue !== newValue) {
            $('.debug').show();
            setTimeout(function() {
                $('.debug').hide();
            }, 1000);
        }
    }

    $(document).on('click', '.icon.add', function() {
        insertLine();
    });

    $(document).on('click', '.icon.remove', function() {
        var $parent = $(this).parent('li');
        $parent.remove();

        $('.icon.add').remove();
        $('.url-list li:last-child').append($('<button>').attr('title', 'add').addClass('icon add'));

        updateStorage();
    });

    $(document).on('click', '.icon.save', function() {
        var $parent = $(this).parent('li');
        var $input = $parent.find('.url-list__target-url');

        if ($input.val().length <= 0) {
            return;
        }

        // EDIT -> STAY
        $parent.data('status', 'STAY');
        $input.attr('readonly', 'readonly');
        $(this).remove();

        updateStorage();
    });

    $(document).on('click', '.url-list__target-url', function() {
        if (!$(this).attr('readonly')) {
            return;
        }
        
        // STAY -> EDIT
        $(this).removeAttr('readonly');

        var $parent = $(this).parent('li');
        $parent.data('status', 'EDIT');
        $parent.append($('<button>').attr('title', 'save').addClass('icon save'));
    });

    // loaded
    (function() {
        initStorage();

        localStorage.targetUrls.split(',').forEach(function(url) {
            insertLine(url);
        });
	})();
});