# Product Admin Dashboard

Next.js + React + Tailwind CSS + Axios frontend assignment using DummyJSON.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Login:
- Username: `emilys`
- Password: `emilyspass`

## Features

- Login and protected product routes
- Logout
- Shared Axios instance with token interceptor and centralized 401 handling
- Product table on desktop and cards on mobile
- Pagination with page numbers, Previous/Next and 10/20/50 page size
- Search with 400ms debounce and page reset
- Stale search responses are ignored
- Category filter
- Price/rating/title sorting
- Product details, images and reviews
- Add, edit and delete
- Form validation
- Delete confirmation
- Loading, empty and retryable error states
- URL state for page, page size, search, category and sort
- Invalid page/size values are handled safely
- Login and Save cannot be submitted repeatedly while a request is active

## DummyJSON mutation handling

DummyJSON simulates POST/PUT/DELETE but does not permanently save mutations. The app still sends the API request and stores the result locally in `localStorage` so the UI keeps showing the change after navigation and refresh in the same browser.

- Added products: `addedProducts`
- Edited products: `productOverrides`
- Deleted IDs: `deletedProductIds`

## Search + category decision

DummyJSON does not support search and category filtering together in one API request. The app gives search priority and ignores the category filter while a search term is active. This behavior is explained below the product list.

## Git commits

Make regular commits rather than one large commit:

1. `setup next tailwind axios`
2. `add login and protected routes`
3. `add product listing and pagination`
4. `add search filter and sorting`
5. `add product details`
6. `add product crud`
7. `persist local mutations`
8. `add loading error empty states`
9. `update readme`

## Build

```bash
npm run build
npm start
```

## Deployment

Push the project to a public GitHub repository and import it into Vercel. No environment variable is required for DummyJSON.
