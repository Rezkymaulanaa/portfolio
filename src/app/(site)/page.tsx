// Temporary page for Phase 2: checks that the site can read from Sanity.
// It will be replaced by the real home page in Phase 4.

import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/client";
import { iconUrl } from "@/sanity/lib/image";

type CheckData = {
  fullName: string;
  tools: { _id: string; name: string; icon: object }[];
  projectCount: number;
  serviceCount: number;
};

const CHECK_QUERY = `{
  "fullName": *[_id == "siteSettings"][0].fullName,
  "tools": *[_id == "siteSettings"][0].usualTools[]->{ _id, name, icon },
  "projectCount": count(*[_type == "project"]),
  "serviceCount": count(*[_type == "service"])
}`;

export default async function Home() {
  const data = await sanityFetch<CheckData>(CHECK_QUERY);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16">
      <h1 className="text-section font-extrabold uppercase">{data.fullName}</h1>
      <p className="mt-4 text-muted">
        Connected to Sanity: {data.projectCount} projects, {data.serviceCount}{" "}
        services, {data.tools.length} tools.
      </p>
      <ul className="mt-8 flex flex-wrap gap-3">
        {data.tools.map((tool) => (
          <li key={tool._id} className="rounded-card bg-surface p-3">
            <Image
              src={iconUrl(tool.icon, 48)}
              alt={tool.name}
              width={48}
              height={48}
              className="size-12 object-contain"
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
