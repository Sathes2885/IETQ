import express from "express";
import { createClient } from "@supabase/supabase-js";
import { Request, Response, NextFunction } from "express";

// Setup Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const router = express.Router();

// Middleware to check authenticated user and attach profile
async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user?.user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.user.id)
    .single();

  if (!profile) return res.status(404).json({ error: "User profile not found" });

  req.user = profile;
  next();
}

// Role-checking middleware
function authorizeRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }
    next();
  };
}

// ========================
// AUTH Routes
// ========================

router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the LMS API");
});

// ========================
// ADMIN Routes
// ========================
router.use("/admin", authenticateUser, authorizeRole("admin"));

router.get("/admin/dashboard", async (req: Request, res: Response) => {
  const { count } = await supabase.from("profiles").select("*", { count: "exact" });
  res.json({ message: "Admin Dashboard", totalUsers: count });
});

// ========================
// TEACHER Routes
// ========================
router.use("/teacher", authenticateUser, authorizeRole("teacher"));

router.get("/teacher/dashboard", async (req: Request, res: Response) => {
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("instructor_id", req.user.id);
  res.json({ message: "Teacher Dashboard", courses });
});

// ========================
// STUDENT Routes
// ========================
router.use("/student", authenticateUser, authorizeRole("student"));

router.get("/student/dashboard", async (req: Request, res: Response) => {
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, courses(*)")
    .eq("student_id", req.user.id);
  res.json({ message: "Student Dashboard", enrollments });
});

// ========================
// PUBLIC Routes (optional)
// ========================
router.get("/courses", async (req: Request, res: Response) => {
  const { data: courses } = await supabase.from("courses").select("*").eq("status", "published");
  res.json({ courses });
});

export default router;
