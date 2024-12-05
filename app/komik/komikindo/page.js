'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Pagination from '@/components/ui/Pagination';
import { useRouter } from 'next/navigation';

const KomikList = () => {
  const [komikList, setKomikList] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const fetchKomik = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/komik/komikindo?page=${page}`);
      const data = await response.json();
      setKomikList(data.komikList || []);
      setPagination(data.pagination || []);
    } catch (error) {
      console.error('Error fetching komik data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSearchResults = async (query) => {
    if (query) {
      try {
        const response = await fetch(`/api/komik/komikindo/search/${query}/1`);
        const data = await response.json();
        setSearchResults(data.comics || []);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchKomik(currentPage);
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter') {
      window.location.href = `/search/${searchQuery}`;
    }
  };
useEffect(() => {
    const cookies = document.cookie;
    const userCookie = cookies && cookies.split(';').find(cookie => cookie.trim().startsWith('user='));

    if (userCookie) {
      setIsLoggedIn(true);
    } else {
      router.push('/login');
    }
  }, [router]);
  const handleKomikClick = async (komikLink) => {
    setIsLoading(true);
    try {
      await router.push(`/komik/komikindo/${komikLink.replace(/https:\/\/[^]+\/komik\/([^]+)\//, '$1')}/chapters`);
    } catch (error) {
      console.error('Error navigating to komik page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ListItems = ({ komik, onClick }) => {
    return (
      <div
        key={komik.judul}
        className="bg-gray-700 p-2 rounded-lg flex flex-col items-center justify-center"
        onClick={onClick}
      >
        <Image
          src={komik.thumbnail}
          alt={komik.judul}
          width={200}
          height={250}
          loading="lazy"
          className="w-full aspect-[3/4] bg-gray-600 rounded-lg mb-3"
        />
        <h3 className="text-sm font-semibold text-center line-clamp-2">
          {komik.judul}
        </h3>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-800 text-white p-5">
      <div className="w-full max-w-lg mb-5">
        <input
          type="text"
          placeholder="Cari Komik"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearchSubmit}
          className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none placeholder-gray-400"
        />
        {searchQuery && (
          <div className="absolute z-50 max-h-52 overflow-y-auto bg-gray-700 w-full mt-2 p-3 rounded-lg shadow-lg">
            <ul className="space-y-2">
              {searchResults.slice(0, 5).map((komik) => (
                <li
                  key={komik.link}
                  onClick={() => handleKomikClick(komik.link)}
                  className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-600"
                >
                  <Image
                    src={komik.image}
                    alt={komik.title}
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                  <span className="text-sm">{komik.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-5 gap-1 w-full mt-5">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, index) => (
            <SkeletonLoader key={index} />
          ))
        ) : (
          komikList.map((komik) => (
            <ListItems key={komik.judul} komik={komik} onClick={() => handleKomikClick(komik.link)} />
          ))
        )}
      </div>

      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          pagination={pagination}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center">
    <div className="w-full aspect-[3/4] bg-gray-600 rounded-lg mb-3 animate-pulse"></div>
    <div className="w-full h-6 bg-gray-600 rounded mb-2 animate-pulse"></div>
    <div className="w-3/4 h-6 bg-gray-600 rounded animate-pulse"></div>
  </div>
);

export default KomikList;