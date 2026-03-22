import React, { useState, useEffect } from 'react';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // YOUR ACTUAL WORDPRESS API URL
  // The "?_embed" part is a WordPress trick that forces the API to include
  // the Featured Image and Author data in the same request!
  // status=publish,future includes both published and scheduled posts
  const API_URL = 'https://blog.reagleeagle.com/wp-json/wp/v2/posts?_embed&status=publish,future';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // For scheduled posts, you need authentication
        // Option 1: Use Application Password (WordPress > Users > Your Profile > Application Passwords)
        // Store these in environment variables, NOT in the code!
        const username = import.meta.env.VITE_WP_USERNAME; // Your WordPress username
        const appPassword = import.meta.env.VITE_WP_APP_PASSWORD; // Generated app password

        const headers = {};

        // Only add auth if credentials are available
        if (username && appPassword) {
          const credentials = btoa(`${username}:${appPassword}`);
          headers['Authorization'] = `Basic ${credentials}`;
        }

        const response = await fetch(API_URL, { headers });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load blog posts.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8 min-h-[400px] flex items-center justify-center">
        <p className="text-xl font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-32">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent drop-shadow-md pb-2">
          Latest Resources & Articles
        </h2>
        <p className="max-w-2xl mx-auto text-xl text-white/90">
          Insights, updates, and helpful tools for therapists.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          // WordPress buries the featured image URL deep inside the _embedded object
          const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
          const authorName = post._embedded?.author?.[0]?.name || 'Admin';

          return (
            <article 
              key={post.id} 
              className="group relative flex flex-col h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Featured Image */}
              <div className="h-48 w-full bg-slate-800/50 overflow-hidden relative">
                {featuredImage ? (
                  <img 
                    src={featuredImage} 
                    alt={post.title.rendered} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/40 space-y-2">
                    <span className="text-sm font-medium">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Post Content */}
              <div className="p-6 flex flex-col flex-1 relative">
                <p className="text-sm font-semibold text-cyan-400 mb-3 tracking-wide uppercase">
                  {/* Format the date nicely */}
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>

                <div className="flex-1">
                  {/* Title */}
                  <h3 
                    className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors leading-tight"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  
                  {/* Excerpt */}
                  <div 
                    className="text-white/70 line-clamp-3 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                </div>

                {/* Author footer */}
                <div className="mt-auto pt-4 border-t border-white/10 flex items-center mt-6">
                  <div className="text-sm font-medium text-white/90">
                    By <span className="text-cyan-300">{authorName}</span>
                  </div>
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center text-sm font-medium text-teal-400 hover:text-cyan-300 transition-colors">
                    Read more →
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
