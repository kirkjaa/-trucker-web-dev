"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../collapsible";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./sidebar";

import { iconNames, Icons } from "@/app/icons";
import { cn } from "@/lib/utils";

export default function SideBarGroup({
  iconMain,
  label,
  items,
  isOpen,
  onClick,
  pathName,
  handleControlClick,
}: {
  iconMain: keyof typeof iconNames;
  label: string;
  items: {
    title?: string;
    url: string;
    iconLight?: keyof typeof iconNames;
    iconBulk?: keyof typeof iconNames;
  }[];
  isOpen: boolean;
  onClick: () => void;
  pathName: string;
  handleControlClick: () => void;
}) {
  const { state, setOpen } = useSidebar();

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onClick}
      className="group/collapsible"
    >
      <SidebarGroup>
        <SidebarGroupLabel asChild isOpen={isOpen}>
          <CollapsibleTrigger onClick={handleControlClick}>
            <div className="flex gap-3 items-center text-white">
              <Icons
                name={iconMain}
                className={cn("w-6 h-6", state === "collapsed" && "w-12 h-7")}
                onClick={() => setOpen(true)}
              />
              {state === "expanded" && <p className="body2">{label}</p>}
            </div>
            {items.length > 0 && (
              <ChevronDown className="ml-auto text-white transition-transform group-data-[collapsible=icon]:[&>svg]:size-5 group-data-[state=open]/collapsible:rotate-180" />
            )}
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        {items.map(
          (item) =>
            state === "expanded" && (
              <CollapsibleContent key={item.title}>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className="rounded-md">
                        <Link
                          href={item.url}
                          className={cn("body2 text-white h-12 pl-10", {
                            "bg-white/20 rounded-lg": pathName.startsWith(
                              item.url
                            ),
                          })}
                        >
                          {item.iconLight && item.iconBulk && (
                            <Icons
                              name={
                                pathName.startsWith(item.url)
                                  ? item.iconBulk
                                  : item.iconLight
                              }
                              className="w-6 h-6"
                            />
                          )}
                          <p>{item.title}</p>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            )
        )}
      </SidebarGroup>
    </Collapsible>
  );
}
