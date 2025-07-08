// lib/i18n.ts
export type Language = 'en' | 'ru'

export interface Translations {
  // Common
  common: {
    save: string
    cancel: string
    delete: string
    edit: string
    add: string
    search: string
    loading: string
    error: string
    success: string
    confirm: string
    active: string
    inactive: string
    yes: string
    no: string
  }
  
  // Navigation
  nav: {
    dashboard: string
    bookings: string
    rooms: string
    store: string
    rental: string
    orders: string
    history: string
    statistics: string
    logout: string
    toWebsite: string
  }
  
  // Admin Layout
  layout: {
    adminPanel: string
    loggedOut: string
    loggedOutDesc: string
    logoutError: string
    logoutErrorDesc: string
  }
  
  // Login Page
  login: {
    title: string
    description: string
    loginLabel: string
    passwordLabel: string
    loginPlaceholder: string
    passwordPlaceholder: string
    loginButton: string
    loggingIn: string
    loginSuccess: string
    loginSuccessDesc: string
    loginError: string
    invalidCredentials: string
    loginErrorDesc: string
  }
  
  // Dashboard
  dashboard: {
    title: string
    description: string
    totalRequests: string
    allTime: string
    pendingReview: string
    requireAction: string
    confirmed: string
    activeBookings: string
    rejected: string
    rejectedRequests: string
    popularBookingTypes: string
    distributionByType: string
    noDataYet: string
    recentRequests: string
    lastRequests: string
    noRequestsYet: string
    viewAllRequests: string
    quickActions: string
    mainFunctions: string
    requests: string
    rooms: string
    history: string
    at: string
  }
  
  // Store Management
  store: {
    title: string
    description: string
    addProduct: string
    searchAndFilters: string
    searchLabel: string
    searchPlaceholder: string
    categoryLabel: string
    allCategories: string
    productsFound: string
    noProductsFound: string
    price: string
    inStock: string
    status: string
    active: string
    hidden: string
    editProduct: string
    addNewProduct: string
    editProductDesc: string
    addProductDesc: string
    productName: string
    priceLabel: string
    quantityInStock: string
    imageUrlOptional: string
    productActive: string
    productActiveDesc: string
    saveChanges: string
    deleteConfirm: string
    loadError: string
    loadErrorDesc: string
    updateSuccess: string
    addSuccess: string
    saveError: string
    saveErrorDesc: string
    deleteSuccess: string
    deleteError: string
    deleteErrorDesc: string
    statusChangeSuccess: string
    statusChangeError: string
    activated: string
    deactivated: string
  }
  
  // Orders Management
  orders: {
    title: string
    description: string
    searchAndFilters: string
    searchLabel: string
    searchPlaceholder: string
    statusLabel: string
    allStatuses: string
    processing: string
    readyForPickup: string
    completed: string
    cancelled: string
    ordersFound: string
    noOrdersFound: string
    orderNumber: string
    details: string
    ready: string
    cancel: string
    complete: string
    customerInformation: string
    orderDetails: string
    orderCode: string
    status: string
    createdDate: string
    total: string
    orderedItems: string
    quantity: string
    rental: string
    purchase: string
    each: string
    loadError: string
    loadErrorDesc: string
    statusChangeSuccess: string
    statusChangeError: string
    statusChangeErrorDesc: string
    items: string
  }
  
  // Rental Management
  rental: {
    title: string
    description: string
    addRentalItem: string
    searchAndFilters: string
    searchLabel: string
    searchPlaceholder: string
    categoryLabel: string
    allCategories: string
    itemsFound: string
    noItemsFound: string
    pricePerDay: string
    inStock: string
    status: string
    active: string
    hidden: string
    editItem: string
    addNewItem: string
    editItemDesc: string
    addItemDesc: string
    itemName: string
    priceLabel: string
    quantityInStock: string
    imageUrlOptional: string
    itemActive: string
    itemActiveDesc: string
    saveChanges: string
    deleteConfirm: string
    loadError: string
    loadErrorDesc: string
    updateSuccess: string
    addSuccess: string
    saveError: string
    saveErrorDesc: string
    deleteSuccess: string
    deleteError: string
    deleteErrorDesc: string
    statusChangeSuccess: string
    statusChangeError: string
    activated: string
    deactivated: string
  }
  
  // Bookings Management
  bookings: {
    title: string
    description: string
    searchAndFilters: string
    searchLabel: string
    searchPlaceholder: string
    statusLabel: string
    typeLabel: string
    allStatuses: string
    allTypes: string
    pending: string
    confirmed: string
    rejected: string
    bookingsFound: string
    noBookingsFound: string
    bookingNumber: string
    details: string
    approve: string
    reject: string
    customerInfo: string
    bookingDetails: string
    date: string
    time: string
    duration: string
    lessonType: string
    status: string
    createdDate: string
    notes: string
    adminMessage: string
    room: string
    capacity: string
    selectRoom: string
    noRoomSelected: string
    noAvailableRooms: string
    noAvailableRoomsDesc: string
    approveSuccess: string
    rejectSuccess: string
    statusChangeError: string
    loadError: string
    loadErrorDesc: string
  }
  
  // Rooms Management
  rooms: {
    title: string
    description: string
    roomsOverview: string
    roomsList: string
    roomName: string
    roomType: string
    capacity: string
    roomDescription: string
    drums: string
    guitar: string
    universal: string
    people: string
    availabilityChecker: string
    selectDate: string
    checkAvailability: string
    availableSlots: string
    noSlotsAvailable: string
    bookingSchedule: string
    viewSchedule: string
    continues: string
    loadError: string
    loadErrorDesc: string
    // Room descriptions
    bigDrumRoom: string
    upperMediumRoom: string
    upperSmallDrumGuitarRoom: string
  }
  
  // Statistics
  statistics: {
    title: string
    description: string
    overview: string
    bookingStats: string
    monthlyStats: string
    typeDistribution: string
    revenueStats: string
    popularTimes: string
    roomUtilization: string
    month: string
    bookings: string
    revenue: string
    avgBookingValue: string
    totalBookings: string
    totalRevenue: string
    thisMonth: string
    lastMonth: string
    growth: string
    decline: string
    noDataAvailable: string
    loadError: string
    loadErrorDesc: string
  }
  
  // History
  history: {
    title: string
    description: string
    searchAndFilters: string
    searchLabel: string
    searchPlaceholder: string
    dateRange: string
    statusLabel: string
    typeLabel: string
    allStatuses: string
    allTypes: string
    from: string
    to: string
    applyFilters: string
    clearFilters: string
    recordsFound: string
    noRecordsFound: string
    viewDetails: string
    exportData: string
    date: string
    customer: string
    type: string
    status: string
    amount: string
    loadError: string
    loadErrorDesc: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      active: 'Active',
      inactive: 'Inactive',
      yes: 'Yes',
      no: 'No'
    },
    nav: {
      dashboard: 'Dashboard',
      bookings: 'Bookings',
      rooms: 'Rooms',
      store: 'Store',
      rental: 'Rental',
      orders: 'Orders',
      history: 'History',
      statistics: 'Statistics',
      logout: 'Log out',
      toWebsite: 'To website'
    },
    layout: {
      adminPanel: 'Admin Panel',
      loggedOut: 'Logged out',
      loggedOutDesc: 'You have successfully logged out',
      logoutError: 'Error',
      logoutErrorDesc: 'Failed to log out'
    },
    login: {
      title: 'Admin Panel',
      description: 'Enter your credentials to access the control panel',
      loginLabel: 'Login',
      passwordLabel: 'Password',
      loginPlaceholder: 'Enter login',
      passwordPlaceholder: 'Enter password',
      loginButton: 'Login',
      loggingIn: 'Logging in...',
      loginSuccess: 'Login successful',
      loginSuccessDesc: 'Welcome to admin panel',
      loginError: 'Login error',
      invalidCredentials: 'Invalid credentials',
      loginErrorDesc: 'An error occurred during login'
    },
    dashboard: {
      title: 'Control Panel',
      description: 'Activity overview and request management',
      totalRequests: 'Total requests',
      allTime: 'All time',
      pendingReview: 'Pending review',
      requireAction: 'Require action',
      confirmed: 'Confirmed',
      activeBookings: 'Active bookings',
      rejected: 'Rejected',
      rejectedRequests: 'Rejected requests',
      popularBookingTypes: 'Popular booking types',
      distributionByType: 'Distribution of requests by type',
      noDataYet: 'No data yet',
      recentRequests: 'Recent requests',
      lastRequests: 'Last 5 requests',
      noRequestsYet: 'No requests yet',
      viewAllRequests: 'View all requests',
      quickActions: 'Quick actions',
      mainFunctions: 'Main management functions',
      requests: 'Requests',
      rooms: 'Rooms',
      history: 'History',
      at: 'at'
    },
    store: {
      title: 'Store Management',
      description: 'Add, edit and manage products',
      addProduct: 'Add Product',
      searchAndFilters: 'Search and Filters',
      searchLabel: 'Search',
      searchPlaceholder: 'Name, description, category...',
      categoryLabel: 'Category',
      allCategories: 'All Categories',
      productsFound: 'Products found',
      noProductsFound: 'No products found',
      price: 'Price:',
      inStock: 'In Stock:',
      status: 'Status:',
      active: 'Active',
      hidden: 'Hidden',
      editProduct: 'Edit Product',
      addNewProduct: 'Add Product',
      editProductDesc: 'Make changes to the product information',
      addProductDesc: 'Fill in information about the new product',
      productName: 'Product Name',
      priceLabel: 'Price ($)',
      quantityInStock: 'Quantity in Stock',
      imageUrlOptional: 'Image URL (optional)',
      productActive: 'Product is active',
      productActiveDesc: 'Product is active (displayed in store)',
      saveChanges: 'Save Changes',
      deleteConfirm: 'Are you sure you want to delete this product?',
      loadError: 'Error loading products:',
      loadErrorDesc: 'Failed to load products',
      updateSuccess: 'Product successfully updated',
      addSuccess: 'Product successfully added',
      saveError: 'An error occurred',
      saveErrorDesc: 'Failed to save product',
      deleteSuccess: 'Product successfully deleted',
      deleteError: 'Failed to delete product',
      deleteErrorDesc: 'Failed to delete product',
      statusChangeSuccess: 'Product {status}',
      statusChangeError: 'Failed to change product status',
      activated: 'activated',
      deactivated: 'deactivated'
    },
    orders: {
      title: 'Order Management',
      description: 'View and manage customer orders',
      searchAndFilters: 'Search and filters',
      searchLabel: 'Search',
      searchPlaceholder: 'Order code, customer name, email...',
      statusLabel: 'Status',
      allStatuses: 'All statuses',
      processing: 'Processing',
      readyForPickup: 'Ready for pickup',
      completed: 'Completed',
      cancelled: 'Cancelled',
      ordersFound: 'Orders found',
      noOrdersFound: 'No orders found',
      orderNumber: 'Order #',
      details: 'Details',
      ready: 'Ready',
      cancel: 'Cancel',
      complete: 'Complete',
      customerInformation: 'Customer Information',
      orderDetails: 'Order Details',
      orderCode: 'Order code:',
      status: 'Status:',
      createdDate: 'Created date:',
      total: 'Total:',
      orderedItems: 'Ordered Items',
      quantity: 'Quantity:',
      rental: 'Rental',
      purchase: 'Purchase',
      each: 'each',
      loadError: 'Error loading orders:',
      loadErrorDesc: 'Failed to load orders',
      statusChangeSuccess: 'Order status changed to {status}',
      statusChangeError: 'Failed to change order status',
      statusChangeErrorDesc: 'Failed to change order status',
      items: 'Items'
    },
    rental: {
      title: 'Rental Management',
      description: 'Add, edit and manage rental items',
      addRentalItem: 'Add Rental Item',
      searchAndFilters: 'Search and Filters',
      searchLabel: 'Search',
      searchPlaceholder: 'Name, description, category...',
      categoryLabel: 'Category',
      allCategories: 'All Categories',
      itemsFound: 'Items found',
      noItemsFound: 'No items found',
      pricePerDay: 'Price per day:',
      inStock: 'In Stock:',
      status: 'Status:',
      active: 'Active',
      hidden: 'Hidden',
      editItem: 'Edit Item',
      addNewItem: 'Add Item',
      editItemDesc: 'Make changes to the item information',
      addItemDesc: 'Fill in information about the new item',
      itemName: 'Item Name',
      priceLabel: 'Price per day ($)',
      quantityInStock: 'Quantity in Stock',
      imageUrlOptional: 'Image URL (optional)',
      itemActive: 'Item is active',
      itemActiveDesc: 'Item is active (displayed in rental)',
      saveChanges: 'Save Changes',
      deleteConfirm: 'Are you sure you want to delete this item?',
      loadError: 'Error loading rental items:',
      loadErrorDesc: 'Failed to load rental items',
      updateSuccess: 'Item successfully updated',
      addSuccess: 'Item successfully added',
      saveError: 'An error occurred',
      saveErrorDesc: 'Failed to save item',
      deleteSuccess: 'Item successfully deleted',
      deleteError: 'Failed to delete item',
      deleteErrorDesc: 'Failed to delete item',
      statusChangeSuccess: 'Item {status}',
      statusChangeError: 'Failed to change item status',
      activated: 'activated',
      deactivated: 'deactivated'
    },
    bookings: {
      title: 'Booking Management',
      description: 'View and manage customer bookings',
      searchAndFilters: 'Search and Filters',
      searchLabel: 'Search',
      searchPlaceholder: 'Customer name, email, booking code...',
      statusLabel: 'Status',
      typeLabel: 'Type',
      allStatuses: 'All Statuses',
      allTypes: 'All Types',
      pending: 'Pending',
      confirmed: 'Confirmed',
      rejected: 'Rejected',
      bookingsFound: 'Bookings found',
      noBookingsFound: 'No bookings found',
      bookingNumber: 'Booking #',
      details: 'Details',
      approve: 'Approve',
      reject: 'Reject',
      customerInfo: 'Customer Information',
      bookingDetails: 'Booking Details',
      date: 'Date:',
      time: 'Time:',
      duration: 'Duration:',
      lessonType: 'Lesson Type:',
      status: 'Status:',
      createdDate: 'Created:',
      notes: 'Notes:',
      adminMessage: 'Admin Message:',
      room: 'Room:',
      capacity: 'Capacity:',
      selectRoom: 'Select Room',
      noRoomSelected: 'No room selected',
      noAvailableRooms: 'No available rooms',
      noAvailableRoomsDesc: 'All suitable rooms are occupied for this time. Consider rejecting the booking or suggesting another time.',
      approveSuccess: 'Booking approved successfully',
      rejectSuccess: 'Booking rejected successfully',
      statusChangeError: 'Failed to change booking status',
      loadError: 'Error loading bookings:',
      loadErrorDesc: 'Failed to load bookings'
    },
    rooms: {
      title: 'Room Management',
      description: 'View room availability and manage bookings',
      roomsOverview: 'Rooms Overview',
      roomsList: 'Available Rooms',
      roomName: 'Room Name',
      roomType: 'Type',
      capacity: 'Capacity',
      roomDescription: 'Description',
      drums: 'Drums',
      guitar: 'Guitar',
      universal: 'Universal',
      people: 'people',
      availabilityChecker: 'Availability Checker',
      selectDate: 'Select Date',
      checkAvailability: 'Check Availability',
      availableSlots: 'Available Time Slots',
      noSlotsAvailable: 'No slots available for selected date',
      bookingSchedule: 'Booking Schedule',
      viewSchedule: 'View Schedule',
      continues: 'continues',
      loadError: 'Error loading rooms:',
      loadErrorDesc: 'Failed to load room information',
      // Room descriptions
      bigDrumRoom: 'Big drum room',
      upperMediumRoom: 'Upper medium drum room',
      upperSmallDrumGuitarRoom: 'Upper small drum-guitar room'
    },
    statistics: {
      title: 'Statistics',
      description: 'Analytics and performance metrics',
      overview: 'Overview',
      bookingStats: 'Booking Statistics',
      monthlyStats: 'Monthly Statistics',
      typeDistribution: 'Booking Type Distribution',
      revenueStats: 'Revenue Statistics',
      popularTimes: 'Popular Time Slots',
      roomUtilization: 'Room Utilization',
      month: 'Month',
      bookings: 'Bookings',
      revenue: 'Revenue',
      avgBookingValue: 'Avg. Booking Value',
      totalBookings: 'Total Bookings',
      totalRevenue: 'Total Revenue',
      thisMonth: 'This Month',
      lastMonth: 'Last Month',
      growth: 'Growth',
      decline: 'Decline',
      noDataAvailable: 'No data available',
      loadError: 'Error loading statistics:',
      loadErrorDesc: 'Failed to load statistics'
    },
    history: {
      title: 'History',
      description: 'View all booking history and records',
      searchAndFilters: 'Search and Filters',
      searchLabel: 'Search',
      searchPlaceholder: 'Customer name, booking code...',
      dateRange: 'Date Range',
      statusLabel: 'Status',
      typeLabel: 'Type',
      allStatuses: 'All Statuses',
      allTypes: 'All Types',
      from: 'From',
      to: 'To',
      applyFilters: 'Apply Filters',
      clearFilters: 'Clear Filters',
      recordsFound: 'Records found',
      noRecordsFound: 'No records found',
      viewDetails: 'View Details',
      exportData: 'Export Data',
      date: 'Date',
      customer: 'Customer',
      type: 'Type',
      status: 'Status',
      amount: 'Amount',
      loadError: 'Error loading history:',
      loadErrorDesc: 'Failed to load history data'
    }
  },
  ru: {
    common: {
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      add: 'Добавить',
      search: 'Поиск',
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успех',
      confirm: 'Подтвердить',
      active: 'Активен',
      inactive: 'Неактивен',
      yes: 'Да',
      no: 'Нет'
    },
    nav: {
      dashboard: 'Главная',
      bookings: 'Бронирование',
      rooms: 'Комнаты',
      store: 'Магазин',
      rental: 'Аренда',
      orders: 'Заказы',
      history: 'История',
      statistics: 'Статистика',
      logout: 'Выйти',
      toWebsite: 'На сайт'
    },
    layout: {
      adminPanel: 'Админ-панель',
      loggedOut: 'Выход выполнен',
      loggedOutDesc: 'Вы успешно вышли из системы',
      logoutError: 'Ошибка',
      logoutErrorDesc: 'Не удалось выйти из системы'
    },
    login: {
      title: 'Админ-панель',
      description: 'Введите учетные данные для доступа к панели управления',
      loginLabel: 'Логин',
      passwordLabel: 'Пароль',
      loginPlaceholder: 'Введите логин',
      passwordPlaceholder: 'Введите пароль',
      loginButton: 'Войти',
      loggingIn: 'Вход...',
      loginSuccess: 'Успешный вход',
      loginSuccessDesc: 'Добро пожаловать в админ-панель',
      loginError: 'Ошибка входа',
      invalidCredentials: 'Неверные учетные данные',
      loginErrorDesc: 'Произошла ошибка при входе'
    },
    dashboard: {
      title: 'Панель управления',
      description: 'Обзор активности и управление заявками',
      totalRequests: 'Всего заявок',
      allTime: 'За все время',
      pendingReview: 'Ожидают рассмотрения',
      requireAction: 'Требуют действий',
      confirmed: 'Подтверждены',
      activeBookings: 'Активные бронирования',
      rejected: 'Отклонены',
      rejectedRequests: 'Отклоненные заявки',
      popularBookingTypes: 'Популярные типы бронирований',
      distributionByType: 'Распределение заявок по типам',
      noDataYet: 'Пока нет данных',
      recentRequests: 'Недавние заявки',
      lastRequests: 'Последние 5 заявок',
      noRequestsYet: 'Пока нет заявок',
      viewAllRequests: 'Посмотреть все заявки',
      quickActions: 'Быстрые действия',
      mainFunctions: 'Основные функции управления',
      requests: 'Заявки',
      rooms: 'Комнаты',
      history: 'История',
      at: 'в'
    },
    store: {
      title: 'Управление магазином',
      description: 'Добавление, редактирование и управление товарами',
      addProduct: 'Добавить товар',
      searchAndFilters: 'Поиск и фильтры',
      searchLabel: 'Поиск',
      searchPlaceholder: 'Название, описание, категория...',
      categoryLabel: 'Категория',
      allCategories: 'Все категории',
      productsFound: 'Найдено товаров',
      noProductsFound: 'Товары не найдены',
      price: 'Цена:',
      inStock: 'В наличии:',
      status: 'Статус:',
      active: 'Активен',
      hidden: 'Скрыт',
      editProduct: 'Редактировать товар',
      addNewProduct: 'Добавить товар',
      editProductDesc: 'Внесите изменения в информацию о товаре',
      addProductDesc: 'Заполните информацию о новом товаре',
      productName: 'Название товара',
      priceLabel: 'Цена ($)',
      quantityInStock: 'Количество в наличии',
      imageUrlOptional: 'URL изображения (опционально)',
      productActive: 'Товар активен',
      productActiveDesc: 'Товар активен (отображается в магазине)',
      saveChanges: 'Сохранить изменения',
      deleteConfirm: 'Вы уверены, что хотите удалить этот товар?',
      loadError: 'Ошибка загрузки товаров:',
      loadErrorDesc: 'Не удалось загрузить товары',
      updateSuccess: 'Товар успешно обновлен',
      addSuccess: 'Товар успешно добавлен',
      saveError: 'Произошла ошибка',
      saveErrorDesc: 'Не удалось сохранить товар',
      deleteSuccess: 'Товар успешно удален',
      deleteError: 'Не удалось удалить товар',
      deleteErrorDesc: 'Не удалось удалить товар',
      statusChangeSuccess: 'Товар {status}',
      statusChangeError: 'Не удалось изменить статус товара',
      activated: 'активирован',
      deactivated: 'деактивирован'
    },
    orders: {
      title: 'Управление заказами',
      description: 'Просмотр и управление заказами клиентов',
      searchAndFilters: 'Поиск и фильтры',
      searchLabel: 'Поиск',
      searchPlaceholder: 'Код заказа, имя клиента, email...',
      statusLabel: 'Статус',
      allStatuses: 'Все статусы',
      processing: 'Обработка',
      readyForPickup: 'Готов к выдаче',
      completed: 'Выполнен',
      cancelled: 'Отменен',
      ordersFound: 'Найдено заказов',
      noOrdersFound: 'Заказы не найдены',
      orderNumber: 'Заказ №',
      details: 'Детали',
      ready: 'Готов',
      cancel: 'Отменить',
      complete: 'Выполнен',
      customerInformation: 'Информация о клиенте',
      orderDetails: 'Детали заказа',
      orderCode: 'Код заказа:',
      status: 'Статус:',
      createdDate: 'Дата создания:',
      total: 'Итого:',
      orderedItems: 'Заказанные товары',
      quantity: 'Количество:',
      rental: 'Аренда',
      purchase: 'Покупка',
      each: 'шт',
      loadError: 'Ошибка загрузки заказов:',
      loadErrorDesc: 'Не удалось загрузить заказы',
      statusChangeSuccess: 'Статус заказа изменен на {status}',
      statusChangeError: 'Не удалось изменить статус заказа',
      statusChangeErrorDesc: 'Не удалось изменить статус заказа',
      items: 'Товары'
    },
    rental: {
      title: 'Управление арендой',
      description: 'Добавление, редактирование и управление товарами для аренды',
      addRentalItem: 'Добавить товар для аренды',
      searchAndFilters: 'Поиск и фильтры',
      searchLabel: 'Поиск',
      searchPlaceholder: 'Название, описание, категория...',
      categoryLabel: 'Категория',
      allCategories: 'Все категории',
      itemsFound: 'Найдено товаров',
      noItemsFound: 'Товары не найдены',
      pricePerDay: 'Цена за день:',
      inStock: 'В наличии:',
      status: 'Статус:',
      active: 'Активен',
      hidden: 'Скрыт',
      editItem: 'Редактировать товар',
      addNewItem: 'Добавить товар',
      editItemDesc: 'Внесите изменения в информацию о товаре',
      addItemDesc: 'Заполните информацию о новом товаре',
      itemName: 'Название товара',
      priceLabel: 'Цена за день ($)',
      quantityInStock: 'Количество в наличии',
      imageUrlOptional: 'URL изображения (опционально)',
      itemActive: 'Товар активен',
      itemActiveDesc: 'Товар активен (отображается в аренде)',
      saveChanges: 'Сохранить изменения',
      deleteConfirm: 'Вы уверены, что хотите удалить этот товар?',
      loadError: 'Ошибка загрузки товаров для аренды:',
      loadErrorDesc: 'Не удалось загрузить товары для аренды',
      updateSuccess: 'Товар успешно обновлен',
      addSuccess: 'Товар успешно добавлен',
      saveError: 'Произошла ошибка',
      saveErrorDesc: 'Не удалось сохранить товар',
      deleteSuccess: 'Товар успешно удален',
      deleteError: 'Не удалось удалить товар',
      deleteErrorDesc: 'Не удалось удалить товар',
      statusChangeSuccess: 'Товар {status}',
      statusChangeError: 'Не удалось изменить статус товара',
      activated: 'активирован',
      deactivated: 'деактивирован'
    },
    bookings: {
      title: 'Управление бронированием',
      description: 'Просмотр и управление заявками клиентов',
      searchAndFilters: 'Поиск и фильтры',
      searchLabel: 'Поиск',
      searchPlaceholder: 'Имя клиента, email, код бронирования...',
      statusLabel: 'Статус',
      typeLabel: 'Тип',
      allStatuses: 'Все статусы',
      allTypes: 'Все типы',
      pending: 'Ожидает',
      confirmed: 'Подтвержден',
      rejected: 'Отклонен',
      bookingsFound: 'Найдено бронирований',
      noBookingsFound: 'Бронирования не найдены',
      bookingNumber: 'Бронирование №',
      details: 'Детали',
      approve: 'Одобрить',
      reject: 'Отклонить',
      customerInfo: 'Информация о клиенте',
      bookingDetails: 'Детали бронирования',
      date: 'Дата:',
      time: 'Время:',
      duration: 'Длительность:',
      lessonType: 'Тип урока:',
      status: 'Статус:',
      createdDate: 'Создано:',
      notes: 'Заметки:',
      adminMessage: 'Сообщение админа:',
      room: 'Комната:',
      capacity: 'Вместимость:',
      selectRoom: 'Выбрать комнату',
      noRoomSelected: 'Комната не выбрана',
      noAvailableRooms: 'Нет доступных комнат',
      noAvailableRoomsDesc: 'Все подходящие комнаты заняты на это время. Рассмотрите возможность отклонения заявки или предложите другое время.',
      approveSuccess: 'Бронирование успешно одобрено',
      rejectSuccess: 'Бронирование успешно отклонено',
      statusChangeError: 'Не удалось изменить статус бронирования',
      loadError: 'Ошибка загрузки бронирований:',
      loadErrorDesc: 'Не удалось загрузить бронирования'
    },
    rooms: {
      title: 'Управление комнатами',
      description: 'Просмотр доступности комнат и управление бронированиями',
      roomsOverview: 'Обзор комнат',
      roomsList: 'Доступные комнаты',
      roomName: 'Название комнаты',
      roomType: 'Тип',
      capacity: 'Вместимость',
      roomDescription: 'Описание',
      drums: 'Барабаны',
      guitar: 'Гитара',
      universal: 'Универсальная',
      people: 'человек',
      availabilityChecker: 'Проверка доступности',
      selectDate: 'Выберите дату',
      checkAvailability: 'Проверить доступность',
      availableSlots: 'Доступные временные слоты',
      noSlotsAvailable: 'Нет доступных слотов на выбранную дату',
      bookingSchedule: 'Расписание бронирований',
      viewSchedule: 'Посмотреть расписание',
      continues: 'продолжается',
      loadError: 'Ошибка загрузки комнат:',
      loadErrorDesc: 'Не удалось загрузить информацию о комнатах',
      // Room descriptions
      bigDrumRoom: 'Большая барабанная комната',
      upperMediumRoom: 'Верхняя средняя барабанная комната',
      upperSmallDrumGuitarRoom: 'Верхняя малая барабанно-гитарная комната'
    },
    statistics: {
      title: 'Статистика',
      description: 'Аналитика и показатели производительности',
      overview: 'Обзор',
      bookingStats: 'Статистика бронирований',
      monthlyStats: 'Месячная статистика',
      typeDistribution: 'Распределение по типам бронирований',
      revenueStats: 'Статистика доходов',
      popularTimes: 'Популярные временные слоты',
      roomUtilization: 'Использование комнат',
      month: 'Месяц',
      bookings: 'Бронирования',
      revenue: 'Доход',
      avgBookingValue: 'Сред. стоимость',
      totalBookings: 'Всего бронирований',
      totalRevenue: 'Общий доход',
      thisMonth: 'Этот месяц',
      lastMonth: 'Прошлый месяц',
      growth: 'Рост',
      decline: 'Снижение',
      noDataAvailable: 'Нет доступных данных',
      loadError: 'Ошибка загрузки статистики:',
      loadErrorDesc: 'Не удалось загрузить статистику'
    },
    history: {
      title: 'История',
      description: 'Просмотр всей истории бронирований и записей',
      searchAndFilters: 'Поиск и фильтры',
      searchLabel: 'Поиск',
      searchPlaceholder: 'Имя клиента, код бронирования...',
      dateRange: 'Диапазон дат',
      statusLabel: 'Статус',
      typeLabel: 'Тип',
      allStatuses: 'Все статусы',
      allTypes: 'Все типы',
      from: 'С',
      to: 'По',
      applyFilters: 'Применить фильтры',
      clearFilters: 'Очистить фильтры',
      recordsFound: 'Найдено записей',
      noRecordsFound: 'Записи не найдены',
      viewDetails: 'Посмотреть детали',
      exportData: 'Экспорт данных',
      date: 'Дата',
      customer: 'Клиент',
      type: 'Тип',
      status: 'Статус',
      amount: 'Сумма',
      loadError: 'Ошибка загрузки истории:',
      loadErrorDesc: 'Не удалось загрузить данные истории'
    }
  }
}

export function getTranslations(language: Language): Translations {
  return translations[language]
}