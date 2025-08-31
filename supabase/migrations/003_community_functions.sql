-- Community features and functions
-- This adds functions for community interactions

-- Function to get community prompts with filters
CREATE OR REPLACE FUNCTION public.get_community_prompts(
  search_query TEXT DEFAULT NULL,
  category_filter TEXT DEFAULT NULL,
  sort_by TEXT DEFAULT 'trending',
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0,
  user_id UUID DEFAULT auth.uid()
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  description TEXT,
  category TEXT,
  tags TEXT[],
  visibility prompt_visibility,
  created_via_voice BOOLEAN,
  likes_count INTEGER,
  comments_count INTEGER,
  views_count INTEGER,
  average_rating REAL,
  ratings_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  author_username TEXT,
  author_plan plan_type,
  user_has_liked BOOLEAN,
  user_rating INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.content,
    p.description,
    p.category,
    p.tags,
    p.visibility,
    p.created_via_voice,
    p.likes_count,
    p.comments_count,
    p.views_count,
    p.average_rating,
    p.ratings_count,
    p.created_at,
    u.username as author_username,
    u.plan as author_plan,
    EXISTS(SELECT 1 FROM prompt_likes pl WHERE pl.prompt_id = p.id AND pl.user_id = get_community_prompts.user_id) as user_has_liked,
    COALESCE((SELECT rating FROM prompt_ratings pr WHERE pr.prompt_id = p.id AND pr.user_id = get_community_prompts.user_id), 0) as user_rating
  FROM prompts p
  JOIN users u ON p.user_id = u.id
  WHERE
    p.visibility = 'public'
    AND p.moderation_status = 'approved'
    AND (search_query IS NULL OR (
      p.title ILIKE '%' || search_query || '%'
      OR p.description ILIKE '%' || search_query || '%'
      OR EXISTS(SELECT 1 FROM unnest(p.tags) tag WHERE tag ILIKE '%' || search_query || '%')
    ))
    AND (category_filter IS NULL OR category_filter = 'all' OR p.category = category_filter)
  ORDER BY
    CASE
      WHEN sort_by = 'newest' THEN p.created_at
      ELSE NULL
    END DESC,
    CASE
      WHEN sort_by = 'popular' THEN p.likes_count
      WHEN sort_by = 'rating' THEN p.average_rating
      WHEN sort_by = 'trending' THEN (p.likes_count + p.comments_count)
      ELSE 0
    END DESC,
    p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get prompt details with user context
CREATE OR REPLACE FUNCTION public.get_prompt_details(
  prompt_id UUID,
  viewer_id UUID DEFAULT auth.uid()
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  can_access BOOLEAN;
BEGIN
  -- Check if user can access this prompt
  SELECT public.can_access_prompt(prompt_id, viewer_id) INTO can_access;
  
  IF NOT can_access THEN
    RETURN json_build_object('error', 'Access denied');
  END IF;
  
  -- Record view if viewer is different from author
  IF viewer_id IS NOT NULL AND viewer_id != (SELECT user_id FROM prompts WHERE id = prompt_id) THEN
    INSERT INTO prompt_views (user_id, prompt_id)
    VALUES (viewer_id, prompt_id)
    ON CONFLICT DO NOTHING;
  END IF;
  
  SELECT json_build_object(
    'prompt', (
      SELECT json_build_object(
        'id', p.id,
        'title', p.title,
        'content', p.content,
        'description', p.description,
        'category', p.category,
        'tags', p.tags,
        'visibility', p.visibility,
        'created_via_voice', p.created_via_voice,
        'likes_count', p.likes_count,
        'comments_count', p.comments_count,
        'views_count', p.views_count,
        'average_rating', p.average_rating,
        'ratings_count', p.ratings_count,
        'created_at', p.created_at,
        'author', json_build_object(
          'username', u.username,
          'plan', u.plan
        )
      )
      FROM prompts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = prompt_id
    ),
    'user_context', json_build_object(
      'has_liked', EXISTS(SELECT 1 FROM prompt_likes WHERE prompt_id = get_prompt_details.prompt_id AND user_id = viewer_id),
      'rating', COALESCE((SELECT rating FROM prompt_ratings WHERE prompt_id = get_prompt_details.prompt_id AND user_id = viewer_id), 0),
      'can_edit', (SELECT user_id FROM prompts WHERE id = prompt_id) = viewer_id OR public.is_admin(viewer_id)
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to like/unlike a prompt
CREATE OR REPLACE FUNCTION public.toggle_prompt_like(
  prompt_id UUID,
  user_id UUID DEFAULT auth.uid()
)
RETURNS JSON AS $$
DECLARE
  liked BOOLEAN;
  new_count INTEGER;
BEGIN
  -- Check if user can access this prompt
  IF NOT public.can_access_prompt(prompt_id, user_id) THEN
    RETURN json_build_object('error', 'Access denied');
  END IF;
  
  -- Toggle like
  IF EXISTS(SELECT 1 FROM prompt_likes WHERE prompt_likes.prompt_id = toggle_prompt_like.prompt_id AND prompt_likes.user_id = toggle_prompt_like.user_id) THEN
    DELETE FROM prompt_likes WHERE prompt_likes.prompt_id = toggle_prompt_like.prompt_id AND prompt_likes.user_id = toggle_prompt_like.user_id;
    liked := FALSE;
  ELSE
    INSERT INTO prompt_likes (prompt_id, user_id) VALUES (toggle_prompt_like.prompt_id, toggle_prompt_like.user_id);
    liked := TRUE;
  END IF;
  
  -- Get new count
  SELECT likes_count INTO new_count FROM prompts WHERE id = prompt_id;
  
  RETURN json_build_object(
    'liked', liked,
    'likes_count', new_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add a comment
CREATE OR REPLACE FUNCTION public.add_comment(
  prompt_id UUID,
  content TEXT,
  parent_id UUID DEFAULT NULL,
  user_id UUID DEFAULT auth.uid()
)
RETURNS JSON AS $$
DECLARE
  comment_id UUID;
  result JSON;
BEGIN
  -- Check if user can access this prompt
  IF NOT public.can_access_prompt(prompt_id, user_id) THEN
    RETURN json_build_object('error', 'Access denied');
  END IF;
  
  -- Validate content
  IF LENGTH(TRIM(content)) < 1 THEN
    RETURN json_build_object('error', 'Comment cannot be empty');
  END IF;
  
  -- Insert comment
  INSERT INTO prompt_comments (prompt_id, user_id, content, parent_id)
  VALUES (add_comment.prompt_id, add_comment.user_id, add_comment.content, add_comment.parent_id)
  RETURNING id INTO comment_id;
  
  -- Return comment details
  SELECT json_build_object(
    'id', pc.id,
    'content', pc.content,
    'created_at', pc.created_at,
    'likes_count', pc.likes_count,
    'author', json_build_object(
      'username', u.username,
      'plan', u.plan
    ),
    'parent_id', pc.parent_id
  ) INTO result
  FROM prompt_comments pc
  JOIN users u ON pc.user_id = u.id
  WHERE pc.id = comment_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add/update a rating
CREATE OR REPLACE FUNCTION public.rate_prompt(
  prompt_id UUID,
  rating INTEGER,
  review TEXT DEFAULT NULL,
  user_id UUID DEFAULT auth.uid()
)
RETURNS JSON AS $$
DECLARE
  new_average REAL;
  new_count INTEGER;
BEGIN
  -- Check if user can access this prompt
  IF NOT public.can_access_prompt(prompt_id, user_id) THEN
    RETURN json_build_object('error', 'Access denied');
  END IF;
  
  -- Validate rating
  IF rating < 1 OR rating > 5 THEN
    RETURN json_build_object('error', 'Rating must be between 1 and 5');
  END IF;
  
  -- Insert or update rating
  INSERT INTO prompt_ratings (prompt_id, user_id, rating, review)
  VALUES (rate_prompt.prompt_id, rate_prompt.user_id, rate_prompt.rating, rate_prompt.review)
  ON CONFLICT (user_id, prompt_id)
  DO UPDATE SET
    rating = EXCLUDED.rating,
    review = EXCLUDED.review,
    updated_at = NOW();
  
  -- Get new average and count
  SELECT average_rating, ratings_count INTO new_average, new_count
  FROM prompts WHERE id = prompt_id;
  
  RETURN json_build_object(
    'average_rating', new_average,
    'ratings_count', new_count,
    'user_rating', rating
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to report a prompt
CREATE OR REPLACE FUNCTION public.report_prompt(
  prompt_id UUID,
  reason report_reason,
  description TEXT DEFAULT NULL,
  user_id UUID DEFAULT auth.uid()
)
RETURNS JSON AS $$
BEGIN
  -- Check if user can access this prompt
  IF NOT public.can_access_prompt(prompt_id, user_id) THEN
    RETURN json_build_object('error', 'Access denied');
  END IF;
  
  -- Check if user already reported this prompt
  IF EXISTS(SELECT 1 FROM prompt_reports WHERE prompt_reports.prompt_id = report_prompt.prompt_id AND prompt_reports.user_id = report_prompt.user_id) THEN
    RETURN json_build_object('error', 'You have already reported this prompt');
  END IF;
  
  -- Insert report
  INSERT INTO prompt_reports (prompt_id, user_id, reason, description)
  VALUES (report_prompt.prompt_id, report_prompt.user_id, report_prompt.reason, report_prompt.description);
  
  RETURN json_build_object('success', true, 'message', 'Report submitted successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get comments for a prompt
CREATE OR REPLACE FUNCTION public.get_prompt_comments(
  prompt_id UUID,
  user_id UUID DEFAULT auth.uid()
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Check if user can access this prompt
  IF NOT public.can_access_prompt(prompt_id, user_id) THEN
    RETURN json_build_object('error', 'Access denied');
  END IF;
  
  SELECT json_agg(
    json_build_object(
      'id', pc.id,
      'content', pc.content,
      'created_at', pc.created_at,
      'updated_at', pc.updated_at,
      'likes_count', pc.likes_count,
      'parent_id', pc.parent_id,
      'author', json_build_object(
        'username', u.username,
        'plan', u.plan
      ),
      'can_edit', pc.user_id = get_prompt_comments.user_id OR public.is_admin(get_prompt_comments.user_id)
    )
    ORDER BY pc.created_at ASC
  ) INTO result
  FROM prompt_comments pc
  JOIN users u ON pc.user_id = u.id
  WHERE pc.prompt_id = get_prompt_comments.prompt_id;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get community stats
CREATE OR REPLACE FUNCTION public.get_community_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_prompts', (SELECT COUNT(*) FROM prompts WHERE visibility = 'public' AND moderation_status = 'approved'),
    'total_contributors', (SELECT COUNT(DISTINCT user_id) FROM prompts WHERE visibility = 'public' AND moderation_status = 'approved'),
    'total_likes', (SELECT COALESCE(SUM(likes_count), 0) FROM prompts WHERE visibility = 'public' AND moderation_status = 'approved'),
    'total_comments', (SELECT COALESCE(SUM(comments_count), 0) FROM prompts WHERE visibility = 'public' AND moderation_status = 'approved'),
    'weekly_growth', (
      SELECT COUNT(*) FROM prompts 
      WHERE visibility = 'public' 
      AND moderation_status = 'approved' 
      AND created_at >= NOW() - INTERVAL '7 days'
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get categories with counts
CREATE OR REPLACE FUNCTION public.get_categories_with_counts()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'name', category,
      'count', count,
      'color', COALESCE(pc.color, '#6B7280'),
      'description', COALESCE(pc.description, category)
    )
    ORDER BY count DESC
  ) INTO result
  FROM (
    SELECT 
      category,
      COUNT(*) as count
    FROM prompts 
    WHERE visibility = 'public' AND moderation_status = 'approved'
    GROUP BY category
    UNION ALL
    SELECT 'all', COUNT(*) FROM prompts WHERE visibility = 'public' AND moderation_status = 'approved'
  ) counts
  LEFT JOIN prompt_categories pc ON pc.name = counts.category;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
