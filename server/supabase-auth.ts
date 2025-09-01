import type { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "./supabase";

// Middleware that authenticates requests using a Supabase JWT (Authorization: Bearer <token>)
// If a valid token is provided, it loads the user's profile from public.users and sets req.user
// It also provides a req.isAuthenticated() function compatible with existing code
export async function supabaseAuth(req: any, res: Response, next: NextFunction) {
  try {
    // Skip admin routes - they use their own authentication
    if (req.path.startsWith('/api/admin/')) {
      return next();
    }

    const authHeader = req.headers["authorization"] as string | undefined;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(); // no token, fall back to any other auth (e.g., passport session)
    }

    const token = authHeader.slice("Bearer ".length).trim();
    if (!token) return res.sendStatus(401);

    const { data: userInfo, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !userInfo?.user) {
      return res.sendStatus(401);
    }

    // Load profile from public.users
    let { data: profile, error: profileError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", userInfo.user.id)
      .single();

    // If profile doesn't exist, auto-provision it from auth user
    if (profileError || !profile) {
      const authUser = userInfo.user;
      const username = (authUser.user_metadata?.username as string) || (authUser.email?.split("@")[0] ?? "user");
      const fullName = (authUser.user_metadata?.full_name as string) || (authUser.user_metadata?.name as string) || null;
      const avatarUrl = (authUser.user_metadata?.avatar_url as string) || null;

      // Create profile
      const { data: created, error: createError } = await supabaseAdmin
        .from("users")
        .insert({
          id: authUser.id,
          username,
          email: authUser.email,
          full_name: fullName,
          avatar_url: avatarUrl,
          plan: "free",
          prompts_used: 0,
          enhancements_used: 0,
        })
        .select("*")
        .single();

      if (createError) {
        // If another request created it concurrently, try to fetch again
        const { data: fetched } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();
        profile = fetched as any;
      } else {
        profile = created as any;
      }
    }

    if (!profile) {
      return res.sendStatus(401);
    }

    // Map Supabase profile to the shape the server expects for req.user
    req.user = {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      plan: profile.plan,
      promptsUsed: profile.prompts_used ?? 0,
      enhancementsUsed: profile.enhancements_used ?? 0,
    };

    req.isAuthenticated = () => true;

    return next();
  } catch (e) {
    return res.sendStatus(401);
  }
}

