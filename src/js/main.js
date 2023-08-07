// Custom scripts
document.addEventListener('DOMContentLoaded', function () {
    // mobile-menu
    if (document.querySelector('.mobile-menu')) {
        const mobileMenu = document.querySelector('.mobile-menu'),
            menuButtonToggle = document.querySelector('.header__supheader-burger'),
            body = document.querySelector('body'),
            closeModal = document.querySelector('.mobile-menu__close');

        menuButtonToggle.addEventListener('click', (e) => {
            const target = e.target;

            const menuHandler = () => {
                mobileMenu.classList.toggle('hidden');
                body.classList.toggle('noscroll');
            };

            if (target.closest('.header__supheader-burger')) {
                menuHandler();
            }
        });

        closeModal.addEventListener('click', (e) => {
            mobileMenu.classList.add('hidden');
            body.classList.remove('noscroll');
        });
    }

    //select
    $('.categories__select').click(function () {
        $(this).attr('tabindex', 1).focus();
        $(this).toggleClass('categories__active');
        $(this).find('.categories__select-body').slideToggle(300);
        $(this).find('.categories__select-header img').toggleClass('rotate-arrow');
    });
    $('.categories__select-header').focusout(function () {
        $(this).removeClass('categories__active');
        $(this).find('.categories__select-body').slideUp(300);
    });
    $('.categories__select .categories__select-body li').click(function () {
        $(this).parents('.categories__select').addClass('active').find('span').text($(this).text());
        $(this).parents('.categories__select').find('input').attr('value', $(this).attr('data-id'));
    });

    // mask
    if ($('#telephone').length) {
        $('#telephone').mask('+7(999) 999-99-99');
    }
});
