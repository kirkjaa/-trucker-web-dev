// "use client";
// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";

// import { Icons } from "@/app/icons";
// import { useGloblalStore } from "@/app/store/globalStore";

// const capitalize = (str: string): string => {
//   return str
//     .split(" ")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// };

// const breadcrumbMapping: { [key: string]: { [key: number]: string[] } } = {
//   "/manage-users/manage-requests": {
//     2: ["Registration Proof"],
//     3: ["Registration Proof", "Reason for Reject"],
//   },
//   "/manage-users/manage-vet-accounts": {
//     2: ["Vet Profile"],
//     3: ["Vet Profile", "Reason for Reject"],
//   },
//   "/manage-users/user-information": {
//     2: ["User Proile"],
//     3: ["User Proile", "Pet Profile"],
//   },
//   "/manage-notifications/notification-list": {
//     2: ["Create Notification"],
//     3: ["Edit Notification"],
//     4: ["Create Notification"],
//   },
//   "/manage-shop/manage-orders": {
//     2: ["Order Details"],
//   },
//   "/manage-content/manage-blogs": {
//     2: ["Create Blog"],
//   },
// };

// export default function Breadcrumb() {
//   // Global State
//   const { currentStep, setCurrentStep } = useGloblalStore();

//   // Local State
//   const [breadcrumb, setBreadcrumb] = useState<string[]>([]);

//   // Hooks
//   const pathName = usePathname();

//   // Use Effect
//   useEffect(() => {
//     const pathSegments = pathName.split("/").filter(Boolean);
//     const baseBreadcrumb = [...pathSegments];

//     const additionalBreadcrumb =
//       breadcrumbMapping[pathName]?.[currentStep] || [];
//     setBreadcrumb([...baseBreadcrumb, ...additionalBreadcrumb]);
//   }, [pathName, currentStep]);

//   useEffect(() => {
//     setCurrentStep(1);
//   }, [pathName]);

//   const handleBreadcrumbClick = (segment: string, index: number) => {
//     const pathSegments = pathName.split("/").filter(Boolean);

//     if (index < pathSegments.length) {
//       setCurrentStep(1);
//     } else {
//       const stepMapping = breadcrumbMapping[pathName];
//       if (stepMapping) {
//         const step = Object.keys(stepMapping).find((stepKey) =>
//           stepMapping[parseInt(stepKey)].includes(segment)
//         );
//         if (step) {
//           setCurrentStep(parseInt(step));
//         }
//       }
//     }
//   };

//   return (
//     <div className="flex gap-1 items-center text-text-secondary">
//       {breadcrumb.map((segment, index) => (
//         <div
//           key={index}
//           className="flex items-center cursor-pointer"
//           onClick={() => handleBreadcrumbClick(segment, index)}
//         >
//           <p
//             className={`body2 ${
//               index === breadcrumb.length - 1
//                 ? "text-text-primary"
//                 : "text-text-secondary"
//             }`}
//           >
//             {capitalize(segment.replace(/-/g, " "))}
//           </p>
//           {index < breadcrumb.length - 1 && (
//             <Icons
//               name="ChevronRight"
//               className="w-5 h-5 text-text-secondary"
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
