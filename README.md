# Movie Search App

This project is a **Movie Search** app built with [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), and [Shadcn UI](https://ui.shadcn.dev/). The app allows users to search for movie details using the [OMDb API](http://www.omdbapi.com/), and it features a dropdown of recent searches and a sleek, responsive UI.

## Features

- **Movie Search**: Users can search for any movie by entering its title, and the app fetches details like the poster, release year, plot, genre, director, and IMDb rating.
- **Recent Searches**: The app stores the user's last 5 searches and shows them in a dropdown for easy access.
- **Loading Spinner**: A loading spinner is displayed while fetching the movie details.
- **Error Handling**: If no movie is found or the user input is invalid, an error message is displayed.
- **Responsive Design**: The UI is mobile-friendly and adapts to different screen sizes using Shadcn's responsive components.

## Technologies Used

- **Next.js**: For server-side rendering, routing, and building the frontend.
- **TypeScript**: To ensure type safety and improve code quality.
- **Shadcn UI**: For better design consistency, UI components, and handling accessibility.
- **OMDb API**: External API to fetch movie details.
- **ClipLoader (react-spinners)**: For the loading spinner.
- **LocalStorage**: To persist recent searches locally.



## Future Enhancements

- **Search Suggestions**: Add auto-suggestions as the user types.
- **Debouncing**: Implement debounce on the search input to prevent too many API requests.
- **Infinite Scrolling**: Allow the user to load more search results instead of just one.
- **Dark Mode**: Add a dark theme using Shadcn's dark mode components.
