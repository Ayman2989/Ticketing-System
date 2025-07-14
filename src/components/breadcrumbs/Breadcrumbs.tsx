"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const Breadcrumbs = () => {
  const pathname = usePathname();
  const [dynamicLabels, setDynamicLabels] = useState<{ [id: string]: string }>(
    {}
  );

  if (!pathname) return null;

  // Split path into segments
  const pathSegments = pathname.split("/").filter((segment) => segment);

  useEffect(() => {
    setDynamicLabels({}); // Reset labels on pathname change

    // Find segments that look like MongoDB ObjectIDs (24 hex characters)
    const idSegments = pathSegments.filter((segment) =>
      /^[0-9a-fA-F]{24}$/.test(segment)
    );

    if (idSegments.length > 0) {
      let updatedLabels: { [id: string]: string } = {};
      idSegments.forEach((id) => {
        updatedLabels[id] = "Loading..."; // Set loading state for each ID
      });
      setDynamicLabels(updatedLabels);

      if (idSegments.length === 1) {
        const idSegment = idSegments[0];
        const idIndex = pathSegments.indexOf(idSegment);
        const parentSegment = idIndex > 0 ? pathSegments[idIndex - 1] : "";
        fetch(`/api/${parentSegment}/${idSegment}`)
          .then((res) => res.json())
          .then((data) =>
            setDynamicLabels((prev) => ({ ...prev, [idSegment]: data.name }))
          )
          .catch((error) => console.error(error));
      } else if (idSegments.length === 2) {
        const [firstId, secondId] = idSegments;
        const firstIndex = pathSegments.indexOf(firstId);
        const firstParent = firstIndex > 0 ? pathSegments[firstIndex - 1] : "";

        Promise.all([
          fetch(`/api/${firstParent}/${firstId}`).then((res) => res.json()),
          fetch(`/api/tickets/${firstId}/test-cases/${secondId}`).then((res) =>
            res.json()
          ),
        ])
          .then(([firstData, secondData]) => {
            setDynamicLabels((prev) => ({
              ...prev,
              [firstId]: firstData.name,
              [secondId]: secondData.name,
            }));
          })
          .catch((error) => console.error(error));
      }
    }
  }, [pathname]);

  // Build breadcrumb data
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;
    let label = dynamicLabels[segment] || "Loading..."; // Ensure "Loading..." is shown

    if (!dynamicLabels[segment] && !/^[0-9a-fA-F]{24}$/.test(segment)) {
      label = decodeURIComponent(
        segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      );
    }

    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumbs" className="md:mb-4 md:m-3 mb-4">
      <ol className="flex space-x-2 text-sm text-gray-600">
        <li>
          <Link href="/" className="text-etuwaCustom-db text-base">
            Home
          </Link>
          <span> / </span>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href}>
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-500 text-base">{crumb.label}</span>
            ) : (
              <>
                <Link
                  href={crumb.href}
                  className="text-etuwaCustom-db text-base"
                >
                  {crumb.label}
                </Link>
                <span> / </span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
