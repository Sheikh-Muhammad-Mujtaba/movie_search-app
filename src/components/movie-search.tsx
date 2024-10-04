"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";


// define the movie details type
type MovieDetails = {
    Title: string;
    Year: string;
    Plot: string;
    Poster: string;
    imdbRating: string;
    Genre: string;
    Director: string;
    Actors: string;
    Runtime: string;
    Released: string;
};

export default function MovieSearch() {


    //state to manage the  search term input by the user
    const [searchTerm, setSearchTerm] = useState<string>("");
    //state to manage the movie details  retrived from the API
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    // state to manage  the loading state during API fetch
    const [loading, setLoading] = useState<boolean>(false);
    //state to manage any  error  message from the API
    const [error, setError] = useState<string | null>(null);
    // state  to manage the search results
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    // state to manage the search history dropdown
    const [showDropdown, setShowDropdown] = useState<boolean>(false);


    // Fetch recent searches from localStorage on component mount
    useEffect(() => {
        const storedSearches = localStorage.getItem("recentSearches");
        if (storedSearches) {
            setRecentSearches(JSON.parse(storedSearches));
        }
    }, []);


    useEffect(() => {
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
      }, [recentSearches]);


    // function  to hanndle the search button click
    const handleSearch = async (): Promise<void> => {
        if (!searchTerm.trim()) {
            setError("Please enter a valid movie title.");
            return;
        }


        setRecentSearches((prev) => {
            // Filter out duplicate searches and add the current search term to the front of the list
            const updatedSearches = [searchTerm, ...prev.filter(search => search !== searchTerm)].slice(0, 5);
            localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
            return updatedSearches;
        });

        setLoading(true); // set the loading state to true while fetching data
        setError(null); // reset error state
        setMovieDetails(null); // Clear previous movie details
        try {
            const response = await fetch(
                `https://www.omdbapi.com/?t=${searchTerm}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
            );
            if (!response.ok) {
                throw new Error("Network error. Please try again.");

            }
            const data = await response.json();
            if (data.Response === "False") {
                throw new Error(data.Error);
            }
            setMovieDetails(data); // set movie details state with the  fetched data
            updateRecentSearches(searchTerm); // Add to recent searches
        } catch (error: any) {
            setError(error.message); // set  error state with the error message

        } finally {
            setLoading(false); // set  the loading state to false after fetching data

        }
    };


    // Function to update recent searches in localStorage
    const updateRecentSearches = (newSearch: string) => {
        const updatedSearches = [newSearch, ...recentSearches.filter(search => search !== newSearch)].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    };

    // function to handle changes  to the search term input
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value); // update the  search term state with  the input value
        setError("");  // Clear the error message when user types
    };

    // function to handle key press 
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") {
            handleSearch();
            setShowDropdown(false);
        }
    };


    const handleFocus = () => {
        if (recentSearches.length > 0) {
            setShowDropdown(true);
        }
    };

    const handleBlur = () => {
        // Hide dropdown after a small delay to allow clicks on recent searches
        setTimeout(() => {
            setShowDropdown(false);
        }, 200);
    };

    


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
                {/* Title of the Movie Search component */}
                <h1 className="text-3xl font-bold mb-1 text-center">Movie Search</h1>
                <p className="mb-6 text-center">
                    Search for any movies and display details.
                </p>
                <div className="flex items-center justify-between mb-6">
                <div className="relative w-full mr-4">
                    {/* Search input field */}
                    <Input
                        type="text"
                        placeholder="Enter a movie title"
                        value={searchTerm}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress} 
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                    {/* Dropdown for recent searches */}
                    {showDropdown && recentSearches.length > 0 && (
                        <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-10 max-h-40 overflow-y-auto transition-opacity duration-300">
                            {recentSearches.map((search, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-700 transition-colors duration-200"
                                    onClick={() => setSearchTerm(search)}
                                >
                                    {search}
                                </li>
                            ))}
                        </ul>
                    )}
                    </div>
                    {/* Search button */}
                    <Button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-5 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                    >
                       {loading ? <ClipLoader size={20} color={"#fff"} /> : "Search"}
                    </Button>
                </div>

                {/* Loading spinner */}
                {loading && (
                    <div className="flex justify-center items-center">
                        <ClipLoader className="w-6 h-6 text-blue-500" />
                    </div>
                )}
                {/* Error message */}
                {error && (
                    <div className="text-red-500 text-center mb-4">
                        {error}. Please try searching for another movie.
                    </div>
                )}
                {/* Movie details */}
                {movieDetails && (
                    <div className="flex flex-col items-center">
                        <div className="w-full mb-4">
                            {/* Movie poster image */}
                            <Image
                                src={
                                    movieDetails.Poster !== "N/A"
                                        ? movieDetails.Poster
                                        : "/placeholder.svg"
                                }
                                alt={movieDetails.Title}
                                width={200}
                                height={300}
                                className="rounded-md shadow-md mx-auto"
                            />
                        </div>
                        <div className="w-full text-center">
                            <h2 className="text-2xl font-bold mb-2">{movieDetails.Title}</h2>
                            <p className="text-gray-600 mb-4 italic">{movieDetails.Plot}</p>
                            {/* Movie details section */}
                            <div className="flex justify-center items-center text-gray-500 mb-2">
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                <span className="mr-4">{movieDetails.Year}</span>
                                <StarIcon className="w-4 h-4 mr-1 fill-yellow-500" />
                                <span>{movieDetails.imdbRating}</span>
                            </div>
                            <div className="flex justify-center items-center text-gray-500 mb-2">
                                <span className="mr-4">
                                    <strong>Genre:</strong> {movieDetails.Genre}
                                </span>
                            </div>
                            <div className="flex justify-center items-center text-gray-500 mb-2">
                                <span className="mr-4">
                                    <strong>Director:</strong> {movieDetails.Director}
                                </span>
                            </div>
                            <div className="flex justify-center items-center text-gray-500 mb-2">
                                <span className="mr-4">
                                    <strong>Actors:</strong> {movieDetails.Actors}
                                </span>
                            </div>
                            <div className="flex justify-center items-center text-gray-500 mb-2">
                                <span className="mr-4">
                                    <strong>Runtime:</strong> {movieDetails.Runtime}
                                </span>
                            </div>
                            <div className="flex justify-center items-center text-gray-500 mb-2">
                                <span className="mr-4">
                                    <strong>Released:</strong> {movieDetails.Released}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );




















































}


