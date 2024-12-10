'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import ComicGrid from '@/components/comic-grid';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const [totalPages, setTotalPages] = useState(1); // State for the total pages

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery, currentPage);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, currentPage]);

  const performSearch = async (query: string, page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/komikindo/search/${encodeURIComponent(query)}/${page}`,
      );
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setSearchResults(data.comics || []);
      setTotalPages(data.totalPages || 1); // Set total pages from API response
    } catch (error) {
      console.error('Error searching comics:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when a new search is performed
    performSearch(searchQuery, 1);
  };

  const handlePagination = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='container bg-black py-6'
    >
      <h1 className='text-custom-pink mb-6 text-3xl font-bold'>
        Search Comics
      </h1>
      <form onSubmit={handleSearch} className='mb-6'>
        <div className='flex gap-2'>
          <Input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search for comics...'
            className='text-custom-pink flex-grow border-2 border-[#FBDEFF]'
          />
          <Button
            type='submit'
            className='text-custom-pink text-custom-pink bg-gray-700'
            variant='ghost'
          >
            Search
          </Button>
        </div>
      </form>
      <ComicGrid searchResults={searchResults} loading={loading} />

      {/* Pagination Controls */}
      <div className='mt-6 flex justify-between'>
        <Button
          onClick={() => handlePagination('prev')}
          disabled={currentPage <= 1}
          variant='ghost'
          className='text-custom-pink bg-gray-700'
        >
          Previous
        </Button>
        <span className='text-custom-pink'>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePagination('next')}
          disabled={currentPage >= totalPages}
          variant='ghost'
          className='text-custom-pink bg-gray-700'
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
}