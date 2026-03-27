import React, { useState, useEffect } from 'react';

const POSTS_PER_PAGE = 9;
const TAGS_PER_PAGE = 15;
const WP_BASE = 'https://blog.reagleeagle.com/wp-json/wp/v2';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const [tagSearch, setTagSearch] = useState('');
  const [tagPage, setTagPage] = useState(1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchKey, setFetchKey] = useState(0);

  const categoryId = import.meta.env.VITE_WP_CATEGORY_THERAPIST_RESOURCES;

  // Build auth headers
  const getHeaders = () => {
    const username = import.meta.env.VITE_WP_USERNAME;
    const appPassword = import.meta.env.VITE_WP_APP_PASSWORD;
    if (username && appPassword) {
      return { Authorization: `Basic ${btoa(`${username}:${appPassword}`)}` };
    }
    return {};
  };

  // Fetch tags relevant to this category only
  useEffect(() => {
    const fetchCategoryTags = async () => {
      try {
        // Step 1: Get all published posts in this category (lightweight, just IDs + tags)
        const postsRes = await fetch(
          `${WP_BASE}/posts?status=publish&categories=${categoryId}&per_page=100&_fields=id,tags`,
          { headers: getHeaders() }
        );
        if (!postsRes.ok) return;

        const postsData = await postsRes.json();

        // Step 2: Count how often each tag appears across TR posts
        const tagCounts = {};
        for (const post of postsData) {
          for (const tagId of post.tags) {
            tagCounts[tagId] = (tagCounts[tagId] || 0) + 1;
          }
        }

        // Step 3: Get all tag IDs sorted by usage
        const topTagIds = Object.entries(tagCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([id]) => id);

        if (topTagIds.length === 0) return;

        // Step 4: Fetch full tag objects for those IDs
        const tagsRes = await fetch(
          `${WP_BASE}/tags?include=${topTagIds.join(',')}&per_page=100`,
          { headers: getHeaders() }
        );
        if (!tagsRes.ok) return;

        const tagsData = await tagsRes.json();

        // Sort by TR-specific usage count (most used first)
        tagsData.sort((a, b) => (tagCounts[b.id] || 0) - (tagCounts[a.id] || 0));
        setTags(tagsData);
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    fetchCategoryTags();
  }, [categoryId]);

  // Fetch posts when page or activeTag changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let url = `${WP_BASE}/posts?_embed&status=publish&categories=${categoryId}&per_page=${POSTS_PER_PAGE}&page=${page}`;
        if (activeTag) {
          url += `&tags=${activeTag}`;
        }

        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const wpTotalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);

        setPosts(data);
        setTotalPages(wpTotalPages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load blog posts.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, activeTag, categoryId, fetchKey]);

  const handleTagClick = (tagId) => {
    setActiveTag(tagId === activeTag ? null : tagId);
    setPage(1);
  };

  const handleShowAll = () => {
    setActiveTag(null);
    setPage(1);
    setFetchKey((k) => k + 1);
  };

  // Filter tags by search, then paginate
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );
  const isSearching = tagSearch.length > 0;
  const totalTagPages = Math.ceil(filteredTags.length / TAGS_PER_PAGE);
  const paginatedTags = isSearching
    ? filteredTags
    : filteredTags.slice((tagPage - 1) * TAGS_PER_PAGE, tagPage * TAGS_PER_PAGE);

  // Tag list component (reused in sidebar and mobile)
  const TagList = ({ horizontal }) => {
    const displayTags = horizontal ? tags.slice(0, TAGS_PER_PAGE) : paginatedTags;

    return (
      <div>
        <div className={horizontal
          ? 'flex gap-2 overflow-x-auto pb-2 scrollbar-hide'
          : 'flex flex-col gap-1'
        }>
          <button
            onClick={handleShowAll}
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTag === null
                ? 'text-cyan-400 font-semibold bg-white/10'
                : 'text-white/70 hover:text-cyan-300 hover:bg-white/5'
            }`}
          >
            All Posts
          </button>
          {displayTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag.id)}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-left shrink-0 ${
                activeTag === tag.id
                  ? 'text-cyan-400 font-semibold bg-white/10'
                  : 'text-white/70 hover:text-cyan-300 hover:bg-white/5'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>

        {/* Tag pagination (desktop sidebar only, hidden when searching) */}
        {!horizontal && !isSearching && totalTagPages > 1 && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
            <button
              onClick={() => setTagPage((p) => Math.max(1, p - 1))}
              disabled={tagPage === 1}
              className={`text-sm px-2 py-1 rounded-lg transition-colors ${
                tagPage === 1
                  ? 'text-white/20 cursor-not-allowed'
                  : 'text-cyan-400 hover:bg-white/5'
              }`}
            >
              ←
            </button>
            <span className="text-xs text-white/50">
              {tagPage} of {totalTagPages}
            </span>
            <button
              onClick={() => setTagPage((p) => Math.min(totalTagPages, p + 1))}
              disabled={tagPage === totalTagPages}
              className={`text-sm px-2 py-1 rounded-lg transition-colors ${
                tagPage === totalTagPages
                  ? 'text-white/20 cursor-not-allowed'
                  : 'text-cyan-400 hover:bg-white/5'
              }`}
            >
              →
            </button>
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <div className="text-center text-red-600 p-8 min-h-[400px] flex items-center justify-center">
        <p className="text-xl font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-32">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent drop-shadow-md pb-2">
          Latest Resources & Articles
        </h2>
        <p className="max-w-2xl mx-auto text-xl text-white/90">
          Insights, updates, and helpful tools for therapists.
        </p>
      </div>

      {/* Mobile tag pills */}
      {tags.length > 0 && (
        <div className="lg:hidden mb-8">
          <TagList horizontal />
        </div>
      )}

      {/* Main layout: sidebar + content */}
      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
        {/* Desktop sidebar */}
        {tags.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-28 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">Topics</h3>
              <input
                type="text"
                placeholder="Search topics..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="w-full px-3 py-2 mb-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 transition-colors"
              />
              <TagList />
            </div>
          </aside>
        )}

        {/* Posts + pagination */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center text-white/60 py-20">
              <p className="text-lg">No posts found.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => {
                  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                  const authorName = post._embedded?.author?.[0]?.name || 'Admin';

                  return (
                    <article
                      key={post.id}
                      className="group relative flex flex-col h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Featured Image */}
                      <a href={post.link} target="_blank" rel="noopener noreferrer" className="block h-48 w-full bg-slate-800/50 overflow-hidden relative cursor-pointer">
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
                      </a>

                      {/* Post Content */}
                      <div className="p-6 flex flex-col flex-1 relative">
                        <p className="text-sm font-semibold text-cyan-400 mb-3 tracking-wide uppercase">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>

                        <div className="flex-1">
                          <h3
                            className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors leading-tight"
                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                          />
                          <div
                            className="text-white/70 line-clamp-3 text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                          />
                        </div>

                        {/* Author footer */}
                        <div className="mt-auto pt-4 border-t border-white/10 flex items-center">
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-xl border transition-colors ${
                      page === 1
                        ? 'border-white/5 text-white/30 cursor-not-allowed'
                        : 'border-white/10 bg-white/5 text-cyan-400 hover:bg-white/10'
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-10 h-10 rounded-xl border transition-colors ${
                        num === page
                          ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-400 font-semibold'
                          : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-cyan-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-xl border transition-colors ${
                      page === totalPages
                        ? 'border-white/5 text-white/30 cursor-not-allowed'
                        : 'border-white/10 bg-white/5 text-cyan-400 hover:bg-white/10'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
