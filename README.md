# Funda Coding Challenge 2017
The first official challenge of the Web Development minor, offered by the Amsterdam University of Applied Sciences in cooperation with Funda Real Estate.  
In the timespan of a single week every contestant needed to develop a working prototype offering new ideas for the user experience of Funda. This week included the briefing at and final presentations. I chose to expand on the idea of adding favourites, by making the system learn from the use people have with the platform.

## Prototype
First of all, the presentation of the app is Dutch, because, after all, Funda Real Estate is located in the Netherlands.

So I decided to give the favourites-feature some more use. I did this by implementing a system which looks at the properties of the added favourites, like: Amount of rooms, buying- and rental price or property- and living area. These options are variable, so every property of the house could be used.

Every time a user searches for houses, the system checks if there are any saved favourites (there is no account-system built in, so it uses the local storage of the user's browser). If the system found any, it does an additional request to the Funda API, based on the input the user searched on. Before any data gets shown, a filter is a applied to the second data-request, removing everything that doesn't meet the properties of the favourites. The filter is calculated with averages, minimum, and maximum values of the favourite houses properties.
If the filter succeeded, the user will be presented with another list, on top of the ordinary result list, with some 'possibly interesting' results. So the user won't have to scroll a lot in order te find something they like.

The more favourites the user has, the more refined the interests search will be. The app will learn from the users needs, the more ofen it's used to search for houses.

## Demo
Every contestant received an API-key to implement in their prototype. Since these should be private, I'm unable to provide you with a live demo to experience. That's why I recorded a demo for you to see on YouTube.

[Funda: Coding Challenge 2017 - Prototype](https://www.youtube.com/watch?v=Fe-T8ygZZMw)

## Still to add
There were still some things left undone by the end of the week we were given. I'd add them when I need to continue with this project.
The list is as follows:

- Pagination for the result list (API we used only offered 25 results, but some extra feedback, presentation-wise would be nice)
- Filtering and sorting on the results page
- Adding a loading spinner, for users with a slow internet connection
- Expanding the detail page of the houses with more information
- Some bugfixes I didn't have enough time for that week
