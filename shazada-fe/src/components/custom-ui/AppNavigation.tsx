"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export interface AppNavigationPropTypes {
  navgiationMenuItemList: {
    titleNavigation: string;
    hrefNav?: string;
    list?: {
      title: string;
      href: string;
      description: string;
    }[];
  }[];
}

export function AppNavigation({
  navgiationMenuItemList,
}: AppNavigationPropTypes) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navgiationMenuItemList.map((item, index) => (
          <NavigationMenuItem key={index}>
            <NavigationMenuTrigger className="text-muted-foreground">
              {item?.titleNavigation}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-96">
                {item?.list?.map((item, index) => (
                  <ListItem key={index} href={item?.href} title={item?.title}>
                    {item?.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
