import CaseStudyLayout from "@/components/case-study/case-study-layout";
import {
  FEATURED_PROJECT_IDS,
  PROJECT_RECORDS,
} from "@/data/project-records";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const FEATURED_PROJECTS = FEATURED_PROJECT_IDS.map((id) => PROJECT_RECORDS[id]);

export const dynamicParams = false;

export function generateStaticParams() {
  return FEATURED_PROJECTS.map((project) => ({ slug: project.id }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = FEATURED_PROJECTS.find(({ id }) => id === params.slug);

  if (!project) {
    return {};
  }

  return {
    title: `${project.title} — Case Study`,
    description: project.valueProposition,
  };
}

const CaseStudyPage = ({ params }: { params: { slug: string } }) => {
  const project = FEATURED_PROJECTS.find(({ id }) => id === params.slug);

  if (!project) {
    notFound();
  }

  return <CaseStudyLayout project={project} />;
};

export default CaseStudyPage;
