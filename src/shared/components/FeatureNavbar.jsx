import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const FeatureNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const navigation = [
    {
      name: "Product",
      href: "#",
      subItems: [
        { name: "Resume Builder", href: "#" },
        { name: "Learning Hub", href: "#" },
        { name: "Career Analytics", href: "#" },
      ],
    },
    {
      name: "Solutions",
      href: "#",
      subItems: [
        { name: "For Individuals", href: "#" },
        { name: "For Teams", href: "#" },
        { name: "For Educators", href: "#" },
      ],
    },
    {
      name: "Resources",
      href: "#",
      subItems: [
        { name: "Documentation", href: "#" },
        { name: "Case Studies", href: "#" },
        { name: "API Reference", href: "#" },
      ],
    },
    { name: "Pricing", href: "#" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <nav className="container mx-auto px-6 py-4" aria-label="Global">
        <div className="flex items-center justify-between">
          {/* Logo - routes to home '/' */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3 group font-medium">
              <div className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-500 rounded-lg">
                <span className="text-gray-700 text-xl font-bold">#</span>
              </div>
              <div className="flex items-baseline">
                <span
                  className="text-2xl font-bold text-gray-700"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  Hashtag AI
                </span>
              </div>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.subItems && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <a
                  href={item.href}
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </a>

                {item.subItems && openDropdown === item.name && (
                  <div className="absolute -left-4 top-full z-10 mt-3 w-56 rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5">
                    <div className="p-2">
                      {item.subItems.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block rounded-lg px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-0 z-50 overflow-y-auto bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6 text-center">
                {navigation.map((item) => (
                  <div key={item.name} className="group relative">
                    <a
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                    {item.subItems && (
                      <div className="mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default FeatureNavbar;
