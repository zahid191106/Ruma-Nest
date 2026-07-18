import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface BlogCardProps {
  title: string;
  slug: { current: string };
  excerpt: string;
  mainImage?: { asset: { _ref: string } };
  publishedAt: string;
}

async function getAllPosts(): Promise<BlogCardProps[]> {
  const query = `*[_type == "post"] | order(publishedAt desc){
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt
  }`;
  return await client.fetch(query);
}

export const metadata = {
  title: "Ruma Nest Blog | UAE Property, Roommate & Commuter Insights",
  description: "Read the ultimate guides on finding bedspaces, shared accommodation, and daily car lifts in Dubai, Abu Dhabi, and Sharjah.",
};

export default async function BlogListPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between overflow-x-hidden">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <span className="text-pink-600 font-bold tracking-widest text-xs uppercase bg-pink-50 px-4 py-1.5 rounded-full">
            Insights & Guides
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 mt-4 mb-4 tracking-tight">
            Mastering UAE Life
          </h1>
          <p className="text-gray-600 text-lg">
            Expert advice on navigating rentals, co-living setups, and community commutes across the Emirates.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No blog posts found. Check back soon!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const imageUrl = post.mainImage?.asset 
                ? urlFor(post.mainImage).auto('format').fit('max').url() 
                : '/fallback-placeholder.png';
              
              const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });

              return (
                <article 
                  key={post.slug.current} 
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-100 transition-all duration-300 flex flex-col group"
                >
                  <Link href={`/blog/${post.slug.current}`} className="relative h-56 w-full overflow-hidden block">
                    <img
                      src={imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </Link>

                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-xs font-semibold text-gray-400 mb-2">{formattedDate}</span>
                    <h2 className="text-xl font-bold text-slate-950 mb-3 line-clamp-2 group-hover:text-pink-600 transition-colors">
                      <Link href={`/blog/${post.slug.current}`}>{post.title}</Link>
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">{post.excerpt}</p>
                    <Link 
                      href={`/blog/${post.slug.current}`}
                      className="text-pink-600 font-bold text-sm inline-flex items-center group/btn tracking-wide"
                    >
                      Read Guide 
                      <span className="transform translate-x-1 group-hover/btn:translate-x-2 transition-transform ml-1">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}