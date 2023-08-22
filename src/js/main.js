// Custom scripts
document.addEventListener('DOMContentLoaded', function () {
    let isMobile = true;

    // mobile-menu
    if (document.querySelector('.mobile-menu')) {
        const mobileMenu = document.querySelector('.mobile-menu'),
            menuButtonToggle = document.querySelector('.header__supheader-burger'),
            closeButton = document.querySelector('.mobile-menu__close');

        menuButtonToggle.addEventListener('click', (e) => {
            const target = e.target;
            const menuHandler = () => {
                if (!isMobile) {
                    mobileMenu.classList.add('hidden');
                    return;
                }

                mobileMenu.classList.toggle('hidden');
                lockBody(mobileMenu.classList.contains('hidden') ? 'remove' : 'add');
            };

            if (target.closest('.header__supheader-burger')) {
                menuHandler();
            }
        });

        closeButton.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            lockBody('remove');
        });
    }

    const lockBody = (action) => {
        const body = document.querySelector('body');
        body.classList[action]('noscroll');
    };
    // mobile authorized user menu
    const selector = '.header__supheader-item.mobile';
    const userIcon = document.querySelector(selector);

    if (userIcon && isMobile) {
        userIcon.addEventListener('click', () => {
            const mobileMenu = document.querySelector('.mobile-user-menu'),
                closeButton = mobileMenu.querySelector('.mobile-menu__close');

            mobileMenu.classList.toggle('hidden');
            userIcon.classList.toggle('--active');

            lockBody('add');

            closeButton.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                lockBody('remove');
                userIcon.classList.remove('--active');
            });
        });
    }

    window.addEventListener('resize', () => {
        isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (!isMobile) {
            const mobileMenu = document.querySelectorAll('.mobile-menu');

            mobileMenu.forEach((menu) => menu.classList.add('hidden'));

            document.querySelector(selector)?.classList.remove('--active');
        }
    });

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

    if (items.length) {
        items.forEach((item) => {
            item.addEventListener('click', () => {
                const parent = item.parentNode;

                parent.classList.toggle('accordion__item-active');
            });
        });
    }
    //Order creation
    let order = JSON.parse(localStorage.getItem('order')) || [];

    if (order.length) {
        displayOrderList(order);
        changeCheckboxView(order)
    }

    function changeCheckboxView(order) {
        order.forEach(({article}) => {
            const node = document.querySelector(`[data-id=${article}]`);
            const input = node.querySelector('input')

            input.checked = !input.checked
        })
    }

    const tableCheckboxes = document.querySelectorAll('.price__content-info-checkbox');

    if (tableCheckboxes.length) {
        tableCheckboxes.forEach((checkbox) => {
            const input = checkbox.parentNode.querySelector('input');

            input.addEventListener('change', () => {
                const isChecked = input.checked;

                const row = input.closest('.price__content-info-table-row');

                const data = serializeDataRow(row, 'td', 1);

                if (isChecked) {
                    order = [...order, data];
                    localStorage.setItem('order', JSON.stringify(order));

                    displayOrderList(order);
                    return;
                }

                order = order.filter(({ article }) => article !== data.article);

                localStorage.setItem('order', JSON.stringify(order));

                displayOrderList(order);
            });
        });
    }

    const serializeDataRow = (node, selector, slice = 0) =>
        Array.from(node.querySelectorAll(selector))
            .slice(slice)
            .reduce((acc, node, index) => {
                const names = ['article', 'name', 'count', 'price', 'amount', 'size'];

                acc[names[index]] = node.textContent;

                return acc;
            }, {});

    function displayOrderList(orders) {
        const table = document.querySelector('.order-creation__info');
        const existText = document.querySelector('.order-creation__content .empty');

        if (!orders.length) {
            table.style.display = 'none';
            existText.style.display = 'block';
            return;
        }

        const body = document.querySelector('.order-creation__order-table').querySelector('tbody');

        body.innerHTML = orders
            .map(({ article, name, count, price, amount, size }) => {
                return `
                <tr class="order-creation__order-table-row">
                   <td data-label="Артикул" colspan="1" class="order-creation__order-table-cell">${article}</td>
                   <td data-label="Название" colspan="2" class="order-creation__order-table-cell">
                       ${name}
                   </td>
                   <td data-label="Штук в упаковке" colspan="1" class="order-creation__order-table-cell">${parseFloat(
                       amount
                   )}</td>
                   <td data-label="Количество упаковок" colspan="1" class="order-creation__order-table-cell counter">
                       <div>
                           <button class="order-creation__order-table-btn decrement">
                               <img src="../img/order-creation/decrement.svg" alt="decrement" />
                           </button>
                           <span class="order-creation__order-table-counter">${count}</span>
                           <button class="order-creation__order-table-btn increment">
                               <img src="../img/order-creation/increment.svg" alt="decrement" />
                           </button>
                        </div>
                   </td>
                   <td data-label="Объем упаковок" colspan="1" class="order-creation__order-table-cell">${String(
                       parseFloat(size)
                   ).replace('.', ',')} м²</td>
                   <td data-label="Сумма (без НДС)" colspan="1" class="order-creation__order-table-cell">${price}</td>
                   <td colspan="1" class="order-creation__order-table-cell">
                       <button class="order-creation__order-table-remove-btn">
                           <img src="../img/order-creation/remove-icon.svg" alt="remove" />
                       </button>
                   </td>
                </tr>
        `;
            })
            .join('');

        table.style.display = 'flex';
        existText.style.display = 'none';

        changeOrderCount();
        removeOrder();
        updateOrderData();
    }

    //Remove product from order
    function removeOrder() {
        const removeButtons = document.querySelectorAll('.order-creation__order-table-remove-btn');

        removeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const row = button.closest('.order-creation__order-table-row');

                const { article } = serializeDataRow(row, 'td');

                const cell = document.querySelector(`[data-id=${article}]`);
                const input = cell.querySelector('input');

                order = order.filter((order) => article !== order.article);

                localStorage.setItem('order', JSON.stringify(order))

                displayOrderList(order);

                input.checked = !input.checked;
            });

            updateOrderData();
        });
    }

    //Increment And Decrement
    function changeOrderCount() {
        const buttons = document.querySelectorAll('.order-creation__order-table-cell.counter button');

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const row = button.closest('.order-creation__order-table-row');

                const { article } = serializeDataRow(row, 'td');

                order = order.map((order) => {
                    const currentOrderItem = order.article === article;

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

                localStorage.setItem('order', JSON.stringify(order))

                displayOrderList(order);
                updateOrderData();
            });
        });
    }

    //Update Order Data
    function updateOrderData() {
        const amountNodes = document.querySelectorAll('.order-creation__order-table-cell.amount');
        const sizeNodes = document.querySelectorAll('.order-creation__order-table-cell.size');

        const size = order.reduce(
            (acc, order) => acc + parseFloat(order.amount) * parseInt(order.count) * parseFloat(order.size),
            0
        );
        const amount = order.reduce((acc, order) => acc + parseFloat(order.price) * order.count, 0);

        amountNodes.forEach((node) => {
            node.textContent = `${amount} руб.`;
        });

        sizeNodes.forEach((node) => {
            node.textContent = `${size.toFixed(1)} м²`;
        });
    }

    //Modal
    function bindModal(trigger, modal, close) {
        (trigger = document.querySelector(trigger)),
            (modal = document.querySelector(modal)),
            (close = document.querySelector(close));

        const body = document.body;

        if (!modal) return;

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            body.classList.add('locked');

            appendTable();
        });
        close.addEventListener('click', () => {
            modal.style.display = 'none';
            body.classList.remove('locked');

            removeTable();
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                body.classList.remove('locked');

                removeTable();
            }
        });
    }

    // ПЕРВЫЙ аргумент - класс кнопки, при клике на которую будет открываться модальное окно.
    // ВТОРОЙ аргумент - класс самого модального окна.
    // ТРЕТИЙ аргумент - класс кнопки, при клике на которую будет закрываться модальное окно.
    const orderCreationButton = document.querySelector('.order-creation__order-btn');

    if (orderCreationButton) {
        bindModal('.order-creation__order-btn', '.modal__wrapper', '.modal__close');
    }

    //Add table to modal
    function appendTable() {
        const table = document.querySelector('.order-creation__order-table').cloneNode(true);
        const body = document.querySelector('#order-creation').querySelector('.modal__body');

        body.appendChild(table);
    }

    // Remove table from modal after close
    function removeTable() {
        const body = document.querySelector('#order-creation').querySelector('.modal__body');

        body.textContent = '';
    }
});
