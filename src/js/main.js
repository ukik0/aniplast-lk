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

    //toggle password
    $('.toggle-password').click(function () {
        const eye = $(this);
        const input = eye.parent().find('#password');

        if ($(input).attr('type') === 'password') {
            $(input).attr('type', 'text');
            $(eye).addClass('open');
        } else {
            $(input).attr('type', 'password');
            $(eye).removeClass('open');
        }
    });
    // Accordion
    const items = document.querySelectorAll('.accordion__item-trigger');

    items.forEach((item) => {
        item.addEventListener('click', () => {
            const parent = item.parentNode;

            if (parent.classList.contains('accordion__item-active')) {
                parent.classList.remove('accordion__item-active');
            } else {
                document
                    .querySelectorAll('.accordion__item')
                    .forEach((child) => child.classList.remove('accordion__item-active'));
                parent.classList.add('accordion__item-active');
            }
        });
    });
    //Order creation
    let order = [];

    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobile = mobileRegex.test(navigator.userAgent);

    const tableCheckboxes = document.querySelectorAll('.price__content-info-checkbox');

    tableCheckboxes.forEach((checkbox) => {
        const input = checkbox.parentNode.querySelector('input');

        input.addEventListener('change', () => {
            const isChecked = input.checked;

            const row = input.closest('.price__content-info-table-row');

            const data = serializeDataRow(row, 'td', 1);

            if (isChecked) {
                order = [...order, data];

                displayOrderList(order);
                return;
            }

            order = order.filter(({ article }) => article !== data.article);
            displayOrderList(order);
        });
    });

    const serializeDataRow = (node, selector, slice = 0) =>
        Array.from(node.querySelectorAll(selector))
            .slice(slice)
            .reduce((acc, node, index) => {
                const names = ['article', 'name', 'count', 'price'];

                acc[names[index]] = node.textContent;

                return acc;
            }, {});

    const displayOrderList = (orders) => {
        const table = document.querySelector('.order-creation__info');
        const existText = document.querySelector('.order-creation__content .empty');

        if (!orders.length) {
            table.style.display = 'none';
            existText.style.display = 'block';
            return;
        }

        const body = isMobile
            ? document.querySelector('.order-creation__order-table.hidden__desctop').querySelector('tbody')
            : document.querySelector('.order-creation__order-table.hidden__mobile').querySelector('tbody');

        if (isMobile) {
            body.innerHTML = orders
                .map(({ article, name, count, price }) => {
                    return `
                <tr class="order-creation__order-table-row">
                    <td colspan="1" class="order-creation__order-table-cell"></td>
                    <td colspan="1" class="order-creation__order-table-cell remove" data-search="${article}">
                           <button class="order-creation__order-table-remove-btn">
                               <img src="../img/order-creation/remove-icon.svg" alt="remove" />
                           </button>
                     </td>
                </tr>
                <tr class="order-creation__order-table-row">
                    <td colspan="1" class="order-creation__order-table-cell">Артикул</td>
                    <td colspan="2" class="order-creation__order-table-cell article">${article}</td>
                </tr>
                <tr class="order-creation__order-table-row">
                    <td colspan="1" class="order-creation__order-table-cell">Название</td>
                    <td colspan="2" class="order-creation__order-table-cell">
                        ${name}
                    </td>
                </tr>
                <tr class="order-creation__order-table-row">
                    <td colspan="1" class="order-creation__order-table-cell">Штук в упаковке</td>
                    <td colspan="2" class="order-creation__order-table-cell">1</td>
                </tr>
                <tr class="order-creation__order-table-row">
                    <td colspan="1" class="order-creation__order-table-cell">
                        Количество упаковок
                    </td>
                    <td colspan="2" class="order-creation__order-table-cell counter" data-search="${article}">
                        <button class="order-creation__order-table-btn decrement">
                            <img src="../img/order-creation/decrement.svg" alt="decrement" />
                        </button>
                        <span class="order-creation__order-table-counter">${count}</span>
                        <button class="order-creation__order-table-btn increment">
                            <img src="../img/order-creation/increment.svg" alt="decrement" />
                        </button>
                    </td>
                </tr>
                <tr class="order-creation__order-table-row">
                    <td colspan="1" class="order-creation__order-table-cell">Объем упаковок</td>
                    <td colspan="2" class="order-creation__order-table-cell">0,1 м²</td>
                </tr>
                <tr class="order-creation__order-table-row">
                    <td colspan="1" class="order-creation__order-table-cell">Сумма (без НДС)</td>
                    <td colspan="2" class="order-creation__order-table-cell">${price}</td>
                </tr>
        `;
                })
                .join('');
        } else {
            body.innerHTML = orders
                .map(({ article, name, count, price }) => {
                    return `
                <tr class="order-creation__order-table-row">
                   <td colspan="1" class="order-creation__order-table-cell">${article}</td>
                   <td colspan="2" class="order-creation__order-table-cell">
                       ${name}
                   </td>
                   <td colspan="1" class="order-creation__order-table-cell">1</td>
                   <td colspan="1" class="order-creation__order-table-cell counter">
                       <button class="order-creation__order-table-btn decrement">
                           <img src="../img/order-creation/decrement.svg" alt="decrement" />
                       </button>
                       <span class="order-creation__order-table-counter">${count}</span>
                       <button class="order-creation__order-table-btn increment">
                           <img src="../img/order-creation/increment.svg" alt="decrement" />
                       </button>
                   </td>
                   <td colspan="1" class="order-creation__order-table-cell">0,1 м²</td>
                   <td colspan="1" class="order-creation__order-table-cell">${price}</td>
                   <td colspan="1" class="order-creation__order-table-cell">
                       <button class="order-creation__order-table-remove-btn">
                           <img src="../img/order-creation/remove-icon.svg" alt="remove" />
                       </button>
                   </td>
                </tr>
        `;
                })
                .join('');
        }

        table.style.display = 'flex';
        existText.style.display = 'none';

        changeOrderCount();
        removeOrder();
        updateOrderData();
    };

    //Remove product from order
    const removeOrder = () => {
        const removeButtons = document.querySelectorAll('.order-creation__order-table-remove-btn');

        removeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const row = button.closest('.order-creation__order-table-row');
                const id = button.closest('td').dataset.search;

                const { article } = serializeDataRow(row, 'td');

                const cell = document.querySelector(`[data-id=${isMobile ? id : article}]`);
                const input = cell.querySelector('input');

                order = order.filter((order) => (isMobile ? id : article) !== order.article);
                displayOrderList(order);

                input.checked = !input.checked;
            });

            updateOrderData();
        });
    };

    //Increment And Decrement
    const changeOrderCount = () => {
        const buttons = document.querySelectorAll('.order-creation__order-table-cell.counter button');

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const row = button.closest('.order-creation__order-table-row');
                const id = button.closest('td').dataset.search;

                const { article } = serializeDataRow(row, 'td');

                order = order.map((order) => {
                    const currentOrderItem = order.article === (isMobile ? id : article);

                    if (currentOrderItem) {
                        if (button.classList.contains('increment') && order.count <= 9) {
                            order.count++;
                        } else {
                            if (button.classList.contains('decrement') && order.count > 1) {
                                order.count--;
                            }
                        }
                    }

                    return order;
                });
                displayOrderList(order);
                updateOrderData();
            });
        });
    };

    //Update Order Data
    const updateOrderData = () => {
        const amountNode = isMobile
            ? document.querySelector('.order-creation__order-table-cell.mobile.amount')
            : document.querySelector('.order-creation__order-table-cell.amount');
        const sizeNode = isMobile
            ? document.querySelector('.order-creation__order-table-cell.mobile.amount')
            : document.querySelector('.order-creation__order-table-cell.size');

        const size = order.reduce((acc, order) => acc + +order.count, 0);
        const amount = order.reduce((acc, order) => acc + parseFloat(order.price) * order.count, 0);
        amountNode.textContent = `${amount} руб.`;
    };

    //Modal
    function bindModal(trigger, modal, close) {
        (trigger = document.querySelector(trigger)),
            (modal = document.querySelector(modal)),
            (close = document.querySelector(close));

        const body = document.body;

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            body.classList.add('locked');
        });
        close.addEventListener('click', () => {
            modal.style.display = 'none';
            body.classList.remove('locked');
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                body.classList.remove('locked');
            }
        });
    }

    // ПЕРВЫЙ аргумент - класс кнопки, при клике на которую будет открываться модальное окно.
    // ВТОРОЙ аргумент - класс самого модального окна.
    // ТРЕТИЙ аргумент - класс кнопки, при клике на которую будет закрываться модальное окно.
    bindModal('.order-creation__order-btn', '.modal__wrapper', '.modal__close');

    const orderCreationButton = document.querySelector('.order-creation__order-btn');

    orderCreationButton.addEventListener('click', () => {
        const table = document
            .querySelector(
                isMobile ? '.order-creation__order-table.hidden__desctop' : '.order-creation__order-table'
            )
            .cloneNode(true);
        const body = document.querySelector('#order-creation').querySelector('.modal__body');

        body.appendChild(table);
    });
});
