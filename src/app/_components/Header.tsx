'use client'

import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem} from "@nextui-org/react";
import logo from "~/assets/logo.png";
import Image from 'next/image'
import { usePathname } from "next/navigation";
import Link from "next/link";
const Header = ()=> {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const menuItems = [
    {
      menu: "Home",
      url: "/",
      submenu:[]
    },
    {
      menu: "About",
      url:"/about",
      submenu:[]
    },
    {
      menu: "Product",
      url: "/product",
      submenu:[
        {
          menu:"Hotel Products",
          url: "/hotel_products"
        },
        {
          menu: "Home Products",
          url: "/home_products"
        }
      ]
    },
    {
      menu: "Event",
      url: "/event"
    },
    {
      menu: "Carries",
      url: "/carrie"
    },
    {
      menu: "Education",
      url: "/education"
    }
  ]
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Image src={logo} alt="logo png" className="w-[150px]"/>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4 uppercase" justify="center">
        {
          menuItems.map((item,index)=>(
            <NavbarItem key={`${item}-${index}`}>
              <Link className={pathname === item.url ? "text-[#DB2230]": "text-[black]"} href={item.url}>
                {item.menu}
              </Link>
            </NavbarItem>
          ))
        }
        
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="/contact" variant="flat">
            Contact us
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className={`w-full ${pathname === item.url ? "text-[#DB2230]" : "text-black"}`}
              href={item.url}
            >
              {item.menu}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default Header;
