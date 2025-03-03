import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { NavbarMobile } from "./sidebar.mobile";
import { FormPopOver } from "@/components/from/popover";

export function Navbar() {
    return (
        <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
            {/* Mobile Sidebar */}
            <NavbarMobile />

            {/* Desktop Sidebar */}
            <div className="flex items-center gap-x-4">

                <div className="hidden md:flex">
                    <Logo />
                </div>

                {/* Desktop Btn */}
                <FormPopOver align="start" side="bottom" sideOffset={18}>
                    <Button variant="primary" size="sm" className="rounded-sm hidden md:block h-auto py-1.5 px-2" >
                        Create
                    </Button>
                </FormPopOver>

                {/* Mobile Btn */}
                <FormPopOver>
                    <Button variant="primary" size="sm" className="rounded-sm block md:hidden" >
                        <Plus className="h-4 w-4" />
                    </Button>
                </FormPopOver>

            </div>

            <div className="ml-auto flex items-center gap-x-2">
                <OrganizationSwitcher
                    hidePersonal
                    afterCreateOrganizationUrl="/organization/:id"
                    afterLeaveOrganizationUrl="/auth/org"
                    afterSelectOrganizationUrl="/organization/:id"
                    appearance={{
                        elements: {
                            rootBox: {
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }
                        }
                    }}
                />
                
                {/* UserButton Deprecated field: afterSignOutUrl="/"  */}
                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: {
                                height: 30,
                                width: 30
                            }
                        }
                    }}
                />
            </div>
        </nav>
    )
}