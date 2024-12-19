import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Avatar,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@nextui-org/react";
import { DatePicker } from "@nextui-org/react";
import { getLocalTimeZone, today, CalendarDate } from "@internationalized/date";
import React from "react";
import { useAuth } from "../hooks/AuthContext";


function convertTimestampToCalendarDate(unixTimestamp) {
  // If the timestamp is in seconds, convert it to milliseconds
  const date = new Date(unixTimestamp * 1000);
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();
  
  return new CalendarDate(year, month, day);
}
export function NavbarComponent() {
  const auth = useAuth();
  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-2xl">Task Tracker</p>
      </NavbarBrand>

      <NavbarContent justify="end">
        {auth && auth.user && auth?.user?.created_at && (
          <NavbarItem>
            <DatePicker
              defaultValue={today(getLocalTimeZone())}
              label=""
              minValue={convertTimestampToCalendarDate(auth?.user?.created_at)}
            />
          </NavbarItem>
        )}
        <NavbarItem>
          {auth && auth.user ? (
            <>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="primary"
                    name={auth?.user?.username}
                    size="sm"
                    src={auth?.user?.avatar}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{auth?.user?.username}</p>
                    <p className="">{auth?.user?.email}</p>
                  </DropdownItem>
                  <DropdownItem key="logout">
                    <Button
                      variant="ghost"
                      color="danger"
                      onPress={auth?.logout}
                    >
                      Log Out
                    </Button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <Button as={Link} color="primary" href="/login" variant="flat">
              Log In
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
