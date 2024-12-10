"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from 'framer-motion'

type Comic = {
  title: string
  image: string
  link: string
  rating: string
}

type ComicGridProps = {
  searchResults: Comic[]
  loading: boolean
}

export default function ComicGrid({ searchResults, loading }: ComicGridProps) {
  return (
    <div className="grid w-full h-full grid-cols-4 gap-3 lg:grid-cols-5">
      {loading ? (
        <div>Loading...</div>
      ) : (
        searchResults.length === 0 ? (
          <p>No comics found.</p>
        ) : (
          searchResults.map((comic, index) => (
            <motion.div
              key={comic.link}  // Use comic.link for unique key
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="cursor-pointer hover:shadow-lg"  //ukuran grid
            >
              <Card>
                <Link href={comic.link}>
                  <Image
                    src={comic.image}
                    alt={comic.title}
                    width={300}
                    height={400}
                    className="aspect-[3/4] w-full h-full rounded-lg"
                  />
                </Link>
                <CardContent className="p-2">
                  <h3 className="text-custom-pink line-clamp-2 text-center text-base font-semibold leading-tight">{comic.title}</h3>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-custom-pink">{comic.rating}</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="w-4 h-4 text-custom-pink" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        )
      )}
    </div>
  )
}