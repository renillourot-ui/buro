import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COURSES, getCourse, getLesson } from "@/data/courses";
import { LessonClient } from "@/components/learning/LessonClient";

interface LessonPageProps {
  params: Promise<{ course: string; lesson: string }>;
}

/** Every course × lesson pair is statically renderable — no DB is involved. */
export function generateStaticParams(): Array<{ course: string; lesson: string }> {
  return COURSES.flatMap((course) => course.lessons.map((lesson) => ({ course: course.slug, lesson: lesson.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) return { title: "Lesson not found" };
  const found = getLesson(course, lessonSlug);
  if (!found) return { title: "Lesson not found" };
  return {
    title: `${found.lesson.title} — ${course.title}`,
    description: found.lesson.objectives[0] ?? course.description,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();
  const found = getLesson(course, lessonSlug);
  if (!found) notFound();

  const { lesson, index } = found;
  const prev = index > 0 ? course.lessons[index - 1] ?? null : null;
  const next = course.lessons[index + 1] ?? null;

  return (
    <main>
      <LessonClient
        key={`${course.slug}/${lesson.slug}`}
        course={course}
        lesson={lesson}
        index={index}
        prev={prev}
        next={next}
      />
    </main>
  );
}
