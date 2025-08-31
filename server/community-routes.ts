import type { Express } from "express";
import { supabaseAdmin } from "./supabase";

// Auth middleware - require authenticated user
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

export function setupCommunityRoutes(app: Express) {
  // Get all community posts
  app.get("/api/community/posts", async (req, res) => {
    try {
      const { category, sort = 'recent', limit = 50 } = req.query;
      
      let query = supabaseAdmin
        .from('community_posts')
        .select(`
          *,
          users!community_posts_user_id_fkey (
            id, email, full_name, avatar_url, plan
          )
        `)
        .eq('status', 'active');

      // Filter by category if specified
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      // Apply sorting
      switch (sort) {
        case 'popular':
          query = query.order('likes_count', { ascending: false });
          break;
        case 'trending':
          query = query.order('views_count', { ascending: false });
          break;
        case 'discussed':
          query = query.order('comments_count', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(Number(limit));
      
      if (error) {
        console.error('Error fetching community posts:', error);
        return res.status(500).json({ message: 'Failed to fetch posts' });
      }

      const formattedPosts = (data || []).map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags || [],
        is_anonymous: post.is_anonymous,
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        views_count: post.views_count,
        created_at: post.created_at,
        user: post.users
      }));

      res.json(formattedPosts);
    } catch (error: any) {
      console.error('Error in community posts endpoint:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get individual post
  app.get("/api/community/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const { data: post, error } = await supabaseAdmin
        .from('community_posts')
        .select(`
          *,
          users!community_posts_user_id_fkey (
            id, email, full_name, avatar_url, plan
          )
        `)
        .eq('id', id)
        .eq('status', 'active')
        .single();

      if (error || !post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Check if user has liked this post
      let userHasLiked = false;
      if (userId) {
        const { data: likeData } = await supabaseAdmin
          .from('community_likes')
          .select('id')
          .eq('post_id', id)
          .eq('user_id', userId)
          .single();
        
        userHasLiked = !!likeData;
      }

      const formattedPost = {
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags || [],
        is_anonymous: post.is_anonymous,
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        views_count: post.views_count,
        created_at: post.created_at,
        user: post.users,
        user_has_liked: userHasLiked
      };

      res.json(formattedPost);
    } catch (error: any) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Create new post
  app.post("/api/community/posts", requireAuth, async (req, res) => {
    try {
      const { title, content, category, tags, is_anonymous } = req.body;
      const user = req.user!;

      if (!title?.trim() || !content?.trim() || !category) {
        return res.status(400).json({ message: 'Title, content, and category are required' });
      }

      const { data, error } = await supabaseAdmin
        .from('community_posts')
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          category,
          tags: tags || [],
          is_anonymous: is_anonymous || false
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Failed to create post' });
      }

      res.status(201).json(data);
    } catch (error: any) {
      console.error('Error in create post endpoint:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Like/unlike post
  app.post("/api/community/posts/:id/like", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user!;

      // Check if user already liked this post
      const { data: existingLike } = await supabaseAdmin
        .from('community_likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike: Remove like and decrement count
        await supabaseAdmin
          .from('community_likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id);

        // Get current likes count and decrement
        const { data: currentPost } = await supabaseAdmin
          .from('community_posts')
          .select('likes_count')
          .eq('id', id)
          .single();

        await supabaseAdmin
          .from('community_posts')
          .update({ likes_count: Math.max(0, (currentPost?.likes_count || 1) - 1) })
          .eq('id', id);

        res.json({ liked: false });
      } else {
        // Like: Add like and increment count
        await supabaseAdmin
          .from('community_likes')
          .insert({ post_id: id, user_id: user.id });

        // Get current likes count and increment
        const { data: currentPost } = await supabaseAdmin
          .from('community_posts')
          .select('likes_count')
          .eq('id', id)
          .single();

        await supabaseAdmin
          .from('community_posts')
          .update({ likes_count: (currentPost?.likes_count || 0) + 1 })
          .eq('id', id);

        res.json({ liked: true });
      }
    } catch (error: any) {
      console.error('Error toggling post like:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Track post view
  app.post("/api/community/posts/:id/view", async (req, res) => {
    try {
      const { id } = req.params;

      // Get current views count and increment
      const { data: currentPost } = await supabaseAdmin
        .from('community_posts')
        .select('views_count')
        .eq('id', id)
        .single();

      if (currentPost) {
        await supabaseAdmin
          .from('community_posts')
          .update({ views_count: (currentPost.views_count || 0) + 1 })
          .eq('id', id);
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error('Error tracking post view:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get post comments
  app.get("/api/community/posts/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;

      const { data: comments, error } = await supabaseAdmin
        .from('community_comments')
        .select(`
          *,
          users!community_comments_user_id_fkey (
            id, email, full_name, avatar_url, plan
          )
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ message: 'Failed to fetch comments' });
      }

      const formattedComments = (comments || []).map(comment => ({
        id: comment.id,
        content: comment.content,
        likes_count: comment.likes_count || 0,
        created_at: comment.created_at,
        user: comment.users
      }));

      res.json(formattedComments);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Add comment to post
  app.post("/api/community/posts/:id/comments", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const user = req.user!;

      if (!content?.trim()) {
        return res.status(400).json({ message: 'Comment content is required' });
      }

      // Insert comment
      const { data: comment, error: commentError } = await supabaseAdmin
        .from('community_comments')
        .insert({
          post_id: id,
          user_id: user.id,
          content: content.trim()
        })
        .select(`
          *,
          users!community_comments_user_id_fkey (
            id, email, full_name, avatar_url, plan
          )
        `)
        .single();

      if (commentError) {
        console.error('Error creating comment:', commentError);
        return res.status(500).json({ message: 'Failed to create comment' });
      }

      // Update post comments count
      const { data: currentPost } = await supabaseAdmin
        .from('community_posts')
        .select('comments_count')
        .eq('id', id)
        .single();

      await supabaseAdmin
        .from('community_posts')
        .update({ comments_count: (currentPost?.comments_count || 0) + 1 })
        .eq('id', id);

      const formattedComment = {
        id: comment.id,
        content: comment.content,
        likes_count: comment.likes_count || 0,
        created_at: comment.created_at,
        user: comment.users
      };

      res.status(201).json(formattedComment);
    } catch (error: any) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get user's posts
  app.get("/api/community/users/:userId/posts", async (req, res) => {
    try {
      const { userId } = req.params;

      const { data: posts, error } = await supabaseAdmin
        .from('community_posts')
        .select(`
          *,
          users!community_posts_user_id_fkey (
            id, email, full_name, avatar_url, plan
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user posts:', error);
        return res.status(500).json({ message: 'Failed to fetch user posts' });
      }

      const formattedPosts = (posts || []).map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags || [],
        is_anonymous: post.is_anonymous,
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        views_count: post.views_count,
        created_at: post.created_at,
        user: post.users
      }));

      res.json(formattedPosts);
    } catch (error: any) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ message: error.message });
    }
  });
}
