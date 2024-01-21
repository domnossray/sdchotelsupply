"use client";

import React from "react";
import {trpc} from "@/app/_trpc/client"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  DropdownItem, DropdownTrigger, Dropdown, DropdownMenu
} from "@nextui-org/react";
import logo from "~/assets/logo_t.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { GoChevronDown } from "react-icons/go";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  // eslint-disable-next-line
  const { data:menuData }  = trpc.menu.gets.useQuery<any>();
  // eslint-disable-next-line
  const {data:subMenuData} = trpc.subMenu.gets.useQuery<any>();
  const menuWithSubmenu = menuData && menuData.map( m =>({...m, subMenus:subMenuData.filter(sub => sub.parentId === m.id)}))
  console.log(menuWithSubmenu)
  return (
    // <div className="container max-w-[1268px] mx-auto">
    <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth='full' isBordered>
      <div className="container max-w-[1268px] mx-auto flex items-center">
          <NavbarContent>
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="sm:hidden"
            />
            <NavbarBrand>
              <Link href="/"><Image src={logo} alt="logo png" className="w-[150px]" /></Link>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent
            className="hidden gap-4 uppercase sm:flex"
            justify="center"
          >
           
            { menuWithSubmenu && menuWithSubmenu.map((item, index) => 
              item.status == "active" && (
                item.subMenus.length > 0 ? 
                <Dropdown key={`${item}-${index}`}>
                  <NavbarItem>
                    <DropdownTrigger>
                      <Button
                       disableRipple
                       endContent={<GoChevronDown />}
                      
                       className={` ${pathname === item.description ? "text-[#DB2230]" : "text-[black]"} p-0 bg-transparent data-[hover=true]:bg-transparent text-md uppercase rounded-none focus-visible:outline-none`}
                      >
                        {item.name}
                      </Button>
                      
                    </DropdownTrigger>
                  </NavbarItem>
                  <DropdownMenu
                    aria-label="ACME features"
                    className="min-w-fit rounded-none"
                    itemClasses={{
                      base: "gap-4",
                    }}
                  > 
                    {item.subMenus.map(subMenu =>
                      
                        item.status === 'active' && (
                          <DropdownItem
                            key={subMenu.name}
                            
                          >
                               <Link
                                className={
                                  pathname === subMenu.description ? "text-[#DB2230]" : "text-[black]"
                                }
                                href={item.description +"?cat="+subMenu.id}
                              >
                                {subMenu.name}
                              </Link>
                          </DropdownItem>
                        )
                      )}
                    
                    
                  </DropdownMenu>
                </Dropdown> 
                
                :
                <NavbarItem key={`${item}-${index}`}>
                  <Button
                   disableRipple
                   className={` ${pathname === item.description ? "text-[#DB2230]" : "text-[black]"} p-0 bg-transparent data-[hover=true]:bg-transparent text-md uppercase rounded-none`}
                  >
                     <Link
                      
                      href={item.description}
                    >
                      {item.name}
                    </Link>
                  </Button>
                 
                </NavbarItem>
              )
            )}
            
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <Button
                as={Link}
                className="bg-[#DB2230] text-white"
                href="/contact"
                variant="flat"
              >
                Contact us
              </Button>
            </NavbarItem>
          </NavbarContent>
          <NavbarMenu>
            { menuData && menuData.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className={`w-full ${
                    pathname === item.description ? "text-[#DB2230]" : "text-black"
                  }`}
                  href={item.description}
                >
                  {item.name}
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>
      </div>
    </Navbar>
    // </div>
    
  );
};

export default Header;
