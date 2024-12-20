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
import { useAuthStore } from "../store/authStore";
import React, { useEffect } from "react";
import { getProjects } from "../src/api/project";
import { Project } from "../types/types";

function convertTimestampToCalendarDate(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return new CalendarDate(year, month, day);
}

export function NavbarComponent() {
  const auth = useAuthStore((state)=> state);
  const [projects, setProjects] = React.useState<Project[]>([]);

  const getUserProjects = async () => {
    const projects1: Project[] = await getProjects()
    setProjects(projects1)
  }

  useEffect(()=>{
    getUserProjects()
  },[])

  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-2xl">Task Tracker</p>
      </NavbarBrand>

      {projects.map((p)=>{
        return (
          <NavbarItem>
            <Link href={`/projects/${p.id}`}>
              {p.name}
            </Link>
          </NavbarItem>
        )
      })}

      <NavbarContent justify="end">
        {auth && auth.user && auth?.user?.created_at && (
          <NavbarItem>
            <DatePicker
              defaultValue={today(getLocalTimeZone())}
              label=""
              minValue={convertTimestampToCalendarDate(auth?.user?.created_at)}
              maxValue={today(getLocalTimeZone())}
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
