import { client } from '@/sanity/lib/client';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { Metadata } from 'next';
import { urlFor } from '@/sanity/lib/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Home, SearchCheck, Truck } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    excerpt,
    mainImage,
    body,
    publishedAt
  }`;
  return await client.fetch(query, { slug });
}

async function getRecentPosts(currentSlug: string) {
  const query = `*[_type == "post" && slug.current != $currentSlug] | order(publishedAt desc)[0...5]{
    title,
    slug,
    publishedAt
  }`;
  return await client.fetch(query, { currentSlug });
}

export async function generateStaticParams() {
  try {
    const slugs: string[] = await client.fetch(`*[_type == "post" && defined(slug.current)].slug.current`);
    return slugs.map((slug) => ({ slug }));
  } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post Not Found | Ruma Nest' };
  const imageUrl = post.mainImage?.asset ? urlFor(post.mainImage).url() : '';

  return {
    title: `${post.title} | Ruma Nest UAE Guides`,
    description: post.excerpt,
    alternates: { canonical: `https://www.rumanest.com/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.rumanest.com/blog/${slug}`,
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: 'article',
      locale: 'en_AE',
    },
  };
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      const imgUrl = urlFor(value).auto('format').fit('max').url();
      return (
        <figure className="my-8 group relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
          <img src={imgUrl} alt={value.alt || 'Visual insights'} className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]" loading="lazy" />
          {value.alt && <figcaption className="bg-gray-50 text-center text-xs text-gray-500 py-2 border-t border-gray-100 font-medium">{value.alt}</figcaption>}
        </figure>
      );
    },
  },
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const recentPosts = await getRecentPosts(slug);
  const imageUrl = post.mainImage?.asset ? urlFor(post.mainImage).auto('format').fit('max').url() : null;
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-900 flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-20 pb-24 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,122,0.12),transparent_45%)]" />
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <Link href="/blog" className="inline-flex items-center text-pink-500 font-bold text-sm tracking-wide bg-pink-500/10 px-4 py-1.5 rounded-full hover:bg-pink-500/20 transition-all mb-6">
            ← Back to Knowledge Center
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-5xl mx-auto mb-6 text-pink-600 drop-shadow-sm">
            {post.title}
          </h1>
          <p className="text-slate-600 text-sm md:text-base font-medium mb-10">
            Published {formattedDate} • Verified Insights by Ruma Nest Operations Team
          </p>

          {/* Action Grid */}
          <div className="bg-white backdrop-blur-md p-6 rounded-3xl max-w-4xl mx-auto shadow-xl">
            <p className="text-sm font-extrabold text-pink-500 uppercase tracking-widest mb-4">What are you looking to do today?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/properties" className="flex flex-col items-center justify-center p-4 rounded-2xl shadow-2xl transition-all group">
                <Home className="text-2xl mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm text-slate-600 group-hover:text-pink-600">Find Properties</span>
                <span className="text-xs text-slate-500 mt-1">Rent rooms & bedspaces</span>
              </Link>
              <Link href="/roommate" className="flex flex-col items-center justify-center p-4 rounded-2xl shadow-2xl transition-all group">
                <SearchCheck className="text-2xl mb-1 group-hover:scale-110 transition-transform"/>
                <span className="font-bold text-sm text-slate-600 group-hover:text-pink-600">Find Roommates</span>
                <span className="text-xs text-slate-500 mt-1">Match with verified peers</span>
              </Link>
              <Link href="/car-lifts" className="flex flex-col items-center justify-center p-4 rounded-2xl shadow-2xl transition-all group">
                <Truck className="text-2xl mb-1 group-hover:scale-110 transition-transform"/>
                <span className="font-bold text-sm text-slate-600 group-hover:text-pink-600">Explore Car Lifts</span>
                <span className="text-xs text-slate-500 mt-1">Share your daily commute</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Reading Column */}
          <main className="lg:col-span-8 bg-white rounded-[32px] p-6 md:p-12 shadow-xl border border-slate-100/80">
            {imageUrl && (
              <div className="w-full h-64 sm:h-96 md:h-[440px] mb-10 overflow-hidden rounded-2xl shadow-md border border-slate-100">
                <img src={imageUrl} alt={post.mainImage?.alt || post.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Injected Context Elements */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-2xl mb-8 flex items-start gap-4 shadow-sm">
              <span className="text-2xl mt-0.5">⚠️</span>
              <div>
                <h4 className="font-bold text-amber-950 text-base mb-1">Ruma Nest Security Notice</h4>
                <p className="text-sm text-amber-900 leading-relaxed">
                  Always ensure communication happens directly via verified channels. Do not process deposit transactions to unverified accounts before inspecting tenancy contracts or executing an Emirates ID check.
                </p>
              </div>
            </div>

            {/* Main Rich Content */}
            <article className="prose prose-pink max-w-none text-slate-800 leading-relaxed md:prose-lg prose-headings:font-black prose-headings:text-slate-950 prose-a:text-pink-600 hover:prose-a:text-pink-700">
              <PortableText value={post.body} components={portableTextComponents} />
            </article>

            {/* Dynamic Localized Marketplace Visualization */}
            <div className="mt-12 bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <h3 className="text-xl font-black text-slate-950 mb-4">Estimated Average Rent Metrics (AED / Month)</h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#0B1528] text-white font-bold">
                      <th className="p-3">Category Option</th>
                      <th className="p-3">Dubai Average</th>
                      <th className="p-3">Abu Dhabi Average</th>
                      <th className="p-3">Sharjah Average</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-950">Shared Bedspace</td>
                      <td className="p-3">AED 600 - 1,200</td>
                      <td className="p-3">AED 550 - 1,000</td>
                      <td className="p-3">AED 400 - 700</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-950">Partition Room</td>
                      <td className="p-3">AED 1,100 - 1,800</td>
                      <td className="p-3">AED 1,000 - 1,600</td>
                      <td className="p-3">AED 700 - 1,100</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-950">Private Master Room</td>
                      <td className="p-3">AED 2,500 - 4,500</td>
                      <td className="p-3">AED 2,200 - 3,800</td>
                      <td className="p-3">AED 1,400 - 2,200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Immersive FAQ Accordion Grid Block */}
            <div className="mt-12 border-t border-slate-100 pt-10">
              <h3 className="text-2xl font-black text-slate-950 tracking-tight mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <details className="group bg-slate-50 border border-slate-100 p-5 rounded-2xl transition-all [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between font-bold text-base text-slate-950 cursor-pointer select-none">
                    <span>How do I verify a roommate profile on Ruma Nest?</span>
                    <span className="text-pink-600 font-bold text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    Profiles marked with our check verification shield have completed verification steps with live communication or valid local documentation checkpoints. Look for the badge for added peace of mind.
                  </p>
                </details>
                <details className="group bg-slate-50 border border-slate-100 p-5 rounded-2xl transition-all [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between font-bold text-base text-slate-950 cursor-pointer select-none">
                    <span>Are car lift services legally compliant for daily commuting?</span>
                    <span className="text-pink-600 font-bold text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    Carpooling and splitting commuting fuel expenses with friends or colleagues is supported when arranged directly and transparently without commercial transit registration overlaps. Always review local RTA regulations.
                  </p>
                </details>
              </div>
            </div>
          </main>

          {/* Sticky Conversion Sidebar Container */}
          <aside className="lg:col-span-4 space-y-8 sticky top-6">
            
            {/* Instant Actions Dashboard Placement Card */}
            <div className="bg-[#0B1528] text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 via-transparent to-transparent pointer-events-none" />
              <h3 className="text-lg font-black tracking-wide uppercase text-pink-500 mb-2">Have a Listing to Add?</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">Reach thousands of active search queries looking for spaces and daily routes instantly across the UAE.</p>
              
              <div className="space-y-3">
                <Link href="/properties" className="flex items-center justify-between p-3.5 bg-pink-600 hover:bg-pink-700 rounded-xl transition-all text-sm font-bold shadow-md shadow-pink-600/10 text-center w-full justify-center text-white">
                  ➕ List Your Property
                </Link>
                <Link href="/car-lifts" className="flex items-center justify-between p-3.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-all text-sm font-bold text-center w-full justify-center text-white border border-slate-700">
                  🚗 Offer a Car Lift Route
                </Link>
                <Link href="/roommate" className="flex items-center justify-between p-3.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-all text-sm font-bold text-center w-full justify-center text-white border border-slate-700">
                  🤝 Post Roommate Criteria
                </Link>
              </div>
            </div>

            {/* Recent Insight Links Column Module */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
              <h3 className="text-base font-black text-slate-950 tracking-wide border-b border-slate-100 pb-3 mb-4">
                Recent Insights & Reads
              </h3>
              {recentPosts.length === 0 ? (
                <p className="text-xs text-gray-400">No other articles available.</p>
              ) : (
                <ul className="space-y-4">
                  {recentPosts.map((rPost: any) => (
                    <li key={rPost.slug.current} className="group">
                      <Link href={`/blog/${rPost.slug.current}`} className="block">
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-pink-600 transition-colors line-clamp-2 leading-snug mb-1">
                          {rPost.title}
                        </h4>
                        <span className="text-[11px] font-semibold text-gray-400">
                          {new Date(rPost.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </aside>

        </div>
      </div>

      <Footer />
    </div>
  );
}