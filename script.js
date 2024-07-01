document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartCountElement = document.getElementById('cart-count');
    const flashMessage = document.getElementById('flash-message');
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');
    const cartItemsModal = document.getElementById('cart-items');
    const themeToggleButton = document.getElementById('theme-toggle');

    function updateCartCount() {
        cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    function showFlashMessage(message) {
        flashMessage.textContent = message;
        flashMessage.classList.add('show');
        setTimeout(() => {
            flashMessage.classList.remove('show');
        }, 2000);
    }

    function addToCart(product) {
        const existingProduct = cart.find(item => item.name === product.name);
        if (existingProduct) {
            existingProduct.quantity += product.quantity;
        } else {
            cart.push(product);
        }
        updateCartCount();
        showFlashMessage('تم إضافة المنتج إلى السلة بنجاح');
        updateCartModal();
    }

    function removeFromCart(name) {
        const index = cart.findIndex(item => item.name === name);
        if (index !== -1) {
            cart.splice(index, 1);
            updateCartCount();
            updateCartModal();
        }
    }

    function updateCartModal() {
        cartItemsModal.innerHTML = '';
        cart.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `${product.name} - ${product.quantity} × ${product.price}ج = ${product.quantity * product.price}ج`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'حذف';
            deleteButton.addEventListener('click', () => {
                removeFromCart(product.name);
            });
            li.appendChild(deleteButton);
            cartItemsModal.appendChild(li);
        });
        const total = cart.reduce((sum, product) => sum + product.quantity * product.price, 0);
        const totalElement = document.createElement('li');
        totalElement.textContent = `المجموع: ${total} ج`;
        cartItemsModal.appendChild(totalElement);
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', event => {
            const card = event.target.closest('.card');
            const product = {
                name: card.getAttribute('data-name'),
                price: parseFloat(card.getAttribute('data-price')),
                quantity: parseInt(card.querySelector('.quantity').value, 10)
            };
            addToCart(product);
        });
    });

    document.querySelectorAll('.category').forEach(categoryLink => {
        categoryLink.addEventListener('click', event => {
            event.preventDefault();
            document.querySelectorAll('.category').forEach(link => link.classList.remove('active'));
            categoryLink.classList.add('active');
            const category = categoryLink.getAttribute('data-category');
            document.querySelectorAll('.card').forEach(card => {
                card.style.display = (category === 'all' || card.getAttribute('data-category') === category) ? 'block' : 'none';
            });
        });
    });

    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', () => {
            const quantityInput = button.closest('.quantity-control').querySelector('.quantity');
            quantityInput.value = parseInt(quantityInput.value, 10) + 1;
        });
    });

    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', () => {
            const quantityInput = button.closest('.quantity-control').querySelector('.quantity');
            if (parseInt(quantityInput.value, 10) > 1) {
                quantityInput.value = parseInt(quantityInput.value, 10) - 1;
            }
        });
    });

    document.querySelector('.cart-icon-container').addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });

    closeButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', event => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Sorting functionality
    const sortBySelect = document.getElementById('sort-by');

    sortBySelect.addEventListener('change', () => {
        const sortBy = sortBySelect.value;

        const cardsContainer = document.querySelector('.product-cards');
        const cards = Array.from(cardsContainer.querySelectorAll('.card'));

        switch (sortBy) {
            case 'price-asc':
                cards.sort((a, b) => parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price')));
                break;
            case 'price-desc':
                cards.sort((a, b) => parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price')));
                break;
            case 'name-asc':
                cards.sort((a, b) => a.getAttribute('data-name').localeCompare(b.getAttribute('data-name')));
                break;
            case 'name-desc':
                cards.sort((a, b) => b.getAttribute('data-name').localeCompare(a.getAttribute('data-name')));
                break;
            default:
                return;
        }

        // Clear existing cards from container
        cardsContainer.innerHTML = '';

        // Append sorted cards back to the container
        cards.forEach(card => {
            cardsContainer.appendChild(card);
        });
    });

});
