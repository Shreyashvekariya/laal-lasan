// Inventory Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Sample inventory data (in a real app, this would come from a database)
    const inventoryItems = [
        {
            id: 'CLT001',
            name: 'Elegant Evening Gown',
            description: 'A stunning floor-length gown perfect for formal events and galas.',
            category: 'Formal',
            size: 'M',
            color: 'Red',
            condition: 'Excellent',
            available: true,
            price: 89.99,
            rentalPrice: 14.99,
            image: 'https://via.placeholder.com/300x400?text=Evening+Gown'
        },
        {
            id: 'CLT002',
            name: 'Classic Tuxedo',
            description: 'A timeless black tuxedo suitable for weddings and formal occasions.',
            category: 'Formal',
            size: 'L',
            color: 'Black',
            condition: 'Excellent',
            available: true,
            price: 199.99,
            rentalPrice: 24.99,
            image: 'https://via.placeholder.com/300x400?text=Tuxedo'
        },
        {
            id: 'CLT003',
            name: 'Summer Floral Dress',
            description: 'A light and breezy floral dress perfect for summer events.',
            category: 'Casual',
            size: 'S',
            color: 'Blue',
            condition: 'Good',
            available: true,
            price: 59.99,
            rentalPrice: 9.99,
            image: 'https://via.placeholder.com/300x400?text=Floral+Dress'
        },
        {
            id: 'CLT004',
            name: 'Business Suit',
            description: 'A professional navy blue suit for business meetings and interviews.',
            category: 'Business',
            size: 'M',
            color: 'Navy',
            condition: 'Excellent',
            available: false,
            price: 149.99,
            rentalPrice: 19.99,
            image: 'https://via.placeholder.com/300x400?text=Business+Suit'
        },
        {
            id: 'CLT005',
            name: 'Cocktail Dress',
            description: 'A chic cocktail dress for semi-formal events and parties.',
            category: 'Semi-Formal',
            size: 'S',
            color: 'Black',
            condition: 'Good',
            available: true,
            price: 79.99,
            rentalPrice: 12.99,
            image: 'https://via.placeholder.com/300x400?text=Cocktail+Dress'
        },
        {
            id: 'CLT006',
            name: 'Casual Jeans',
            description: 'Comfortable designer jeans for everyday wear.',
            category: 'Casual',
            size: 'M',
            color: 'Blue',
            condition: 'Good',
            available: true,
            price: 49.99,
            rentalPrice: 7.99,
            image: 'https://via.placeholder.com/300x400?text=Casual+Jeans'
        },
        {
            id: 'CLT007',
            name: 'Winter Coat',
            description: 'A warm and stylish winter coat for cold weather.',
            category: 'Outerwear',
            size: 'L',
            color: 'Gray',
            condition: 'Excellent',
            available: true,
            price: 129.99,
            rentalPrice: 16.99,
            image: 'https://via.placeholder.com/300x400?text=Winter+Coat'
        },
        {
            id: 'CLT008',
            name: 'Designer Handbag',
            description: 'A luxury designer handbag to complement any outfit.',
            category: 'Accessories',
            size: 'One Size',
            color: 'Brown',
            condition: 'Excellent',
            available: true,
            price: 299.99,
            rentalPrice: 29.99,
            image: 'https://via.placeholder.com/300x400?text=Designer+Handbag'
        }
    ];

    // DOM Elements
    const inventoryGrid = document.getElementById('inventory-grid');
    const searchInput = document.getElementById('search-inventory');
    const categoryFilter = document.getElementById('category-filter');
    const sizeFilter = document.getElementById('size-filter');
    const availabilityFilter = document.getElementById('availability-filter');
    const sortFilter = document.getElementById('sort-filter');
    const rentalModal = document.getElementById('rental-modal');
    const rentalForm = document.getElementById('rental-form');
    const startDateInput = document.getElementById('rental-start-date');
    const endDateInput = document.getElementById('rental-end-date');
    const rentalItemName = document.getElementById('rental-item-name');
    const rentalItemPrice = document.getElementById('rental-price');
    const rentalTotalPrice = document.getElementById('rental-total-price');
    const rentalDuration = document.getElementById('rental-duration');

    // Initialize inventory display
    displayInventory(inventoryItems);

    // Set up event listeners for filters
    if (searchInput) {
        searchInput.addEventListener('input', filterInventory);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterInventory);
    }

    if (sizeFilter) {
        sizeFilter.addEventListener('change', filterInventory);
    }

    if (availabilityFilter) {
        availabilityFilter.addEventListener('change', filterInventory);
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', filterInventory);
    }

    // Set up rental form event listeners
    if (rentalForm) {
        rentalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processRental();
        });
    }

    if (startDateInput && endDateInput) {
        startDateInput.addEventListener('change', updateRentalDetails);
        endDateInput.addEventListener('change', updateRentalDetails);
    }

    // Function to display inventory items
    function displayInventory(items) {
        if (!inventoryGrid) return;

        inventoryGrid.innerHTML = '';

        if (items.length === 0) {
            inventoryGrid.innerHTML = '<p class="no-results">No items found matching your criteria.</p>';
            return;
        }

        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = `inventory-item ${!item.available ? 'unavailable' : ''}`;
            itemElement.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                    ${!item.available ? '<div class="unavailable-overlay">Currently Rented</div>' : ''}
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-description">${item.description}</p>
                    <div class="item-meta">
                        <span class="item-category"><i class="fas fa-tag"></i> ${item.category}</span>
                        <span class="item-size"><i class="fas fa-tshirt"></i> ${item.size}</span>
                        <span class="item-color"><i class="fas fa-palette"></i> ${item.color}</span>
                        <span class="item-condition"><i class="fas fa-star"></i> ${item.condition}</span>
                    </div>
                    <div class="item-price">
                        <span class="rental-price">${formatCurrency(item.rentalPrice)}/day</span>
                        <span class="retail-price">Retail: ${formatCurrency(item.price)}</span>
                    </div>
                    <button class="btn rent-btn" ${!item.available ? 'disabled' : ''} data-item-id="${item.id}">
                        ${item.available ? 'Rent Now' : 'Currently Unavailable'}
                    </button>
                </div>
            `;

            inventoryGrid.appendChild(itemElement);

            // Add event listener to rent button
            const rentBtn = itemElement.querySelector('.rent-btn');
            if (rentBtn && item.available) {
                rentBtn.addEventListener('click', function() {
                    openRentalModal(item);
                });
            }
        });
    }

    // Function to filter inventory based on search and filters
    function filterInventory() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const category = categoryFilter ? categoryFilter.value : 'all';
        const size = sizeFilter ? sizeFilter.value : 'all';
        const availability = availabilityFilter ? availabilityFilter.value : 'all';
        const sortBy = sortFilter ? sortFilter.value : 'name-asc';

        let filteredItems = [...inventoryItems];

        // Apply search filter
        if (searchTerm) {
            filteredItems = filteredItems.filter(item => 
                item.name.toLowerCase().includes(searchTerm) || 
                item.description.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm)
            );
        }

        // Apply category filter
        if (category !== 'all') {
            filteredItems = filteredItems.filter(item => item.category === category);
        }

        // Apply size filter
        if (size !== 'all') {
            filteredItems = filteredItems.filter(item => item.size === size);
        }

        // Apply availability filter
        if (availability !== 'all') {
            const isAvailable = availability === 'available';
            filteredItems = filteredItems.filter(item => item.available === isAvailable);
        }

        // Apply sorting
        switch (sortBy) {
            case 'name-asc':
                filteredItems.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredItems.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                filteredItems.sort((a, b) => a.rentalPrice - b.rentalPrice);
                break;
            case 'price-desc':
                filteredItems.sort((a, b) => b.rentalPrice - a.rentalPrice);
                break;
        }

        // Update display
        displayInventory(filteredItems);
    }

    // Function to open rental modal
    function openRentalModal(item) {
        if (!rentalModal) return;

        // Set current item data
        rentalModal.dataset.itemId = item.id;
        
        // Update modal content
        if (rentalItemName) rentalItemName.textContent = item.name;
        if (rentalItemPrice) rentalItemPrice.textContent = formatCurrency(item.rentalPrice) + '/day';

        // Reset form
        if (rentalForm) rentalForm.reset();

        // Set minimum dates
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (startDateInput) {
            startDateInput.min = formatDateForInput(today);
            startDateInput.value = formatDateForInput(today);
        }

        if (endDateInput) {
            endDateInput.min = formatDateForInput(tomorrow);
            endDateInput.value = formatDateForInput(tomorrow);
        }

        // Update rental details
        updateRentalDetails();

        // Open modal
        openModal('rental-modal');
    }

    // Function to update rental details based on selected dates
    function updateRentalDetails() {
        if (!startDateInput || !endDateInput || !rentalModal) return;

        const itemId = rentalModal.dataset.itemId;
        const item = inventoryItems.find(item => item.id === itemId);

        if (!item) return;

        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        // Validate dates
        if (endDate <= startDate) {
            // Set end date to day after start date
            const newEndDate = new Date(startDate);
            newEndDate.setDate(newEndDate.getDate() + 1);
            endDateInput.value = formatDateForInput(newEndDate);
            endDate.setTime(newEndDate.getTime());
        }

        // Calculate duration and total price
        const days = calculateDuration(startDate, endDate);
        const totalPrice = item.rentalPrice * days;

        // Update display
        if (rentalDuration) rentalDuration.textContent = days + (days === 1 ? ' day' : ' days');
        if (rentalTotalPrice) rentalTotalPrice.textContent = formatCurrency(totalPrice);
    }

    // Function to process rental
    function processRental() {
        if (!rentalModal || !startDateInput || !endDateInput) return;

        const itemId = rentalModal.dataset.itemId;
        const item = inventoryItems.find(item => item.id === itemId);

        if (!item) return;

        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const days = calculateDuration(startDate, endDate);
        const totalPrice = item.rentalPrice * days;

        // Create rental object
        const rental = {
            rentalId: generateRentalId(),
            itemId: item.id,
            itemName: item.name,
            itemImage: item.image,
            startDate: startDate,
            endDate: endDate,
            duration: days,
            pricePerDay: item.rentalPrice,
            totalPrice: totalPrice,
            status: 'pending'
        };

        // In a real app, this would be sent to a server
        // For this demo, we'll store it in localStorage
        saveRental(rental);

        // Close modal
        closeModal('rental-modal');

        // Redirect to payment page
        window.location.href = `payment.html?rentalId=${rental.rentalId}`;
    }

    // Function to save rental to localStorage
    function saveRental(rental) {
        // Get existing rentals
        let rentals = JSON.parse(localStorage.getItem('rentals')) || [];
        
        // Add new rental
        rentals.push(rental);
        
        // Save back to localStorage
        localStorage.setItem('rentals', JSON.stringify(rentals));

        // Update item availability
        const itemIndex = inventoryItems.findIndex(item => item.id === rental.itemId);
        if (itemIndex !== -1) {
            inventoryItems[itemIndex].available = false;
        }
    }

    // Populate category filter with unique categories
    function populateCategoryFilter() {
        if (!categoryFilter) return;

        // Get unique categories
        const categories = [...new Set(inventoryItems.map(item => item.category))];

        // Add options
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // Populate size filter with unique sizes
    function populateSizeFilter() {
        if (!sizeFilter) return;

        // Get unique sizes
        const sizes = [...new Set(inventoryItems.map(item => item.size))];

        // Add options
        sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeFilter.appendChild(option);
        });
    }

    // Initialize filters
    populateCategoryFilter();
    populateSizeFilter();
});