import { Avatar, MenuItem, Typography } from "@mui/material";
import { MouseEvent, useContext, useMemo, useState } from "react";

import { AppContext } from "~/contexts/app.context";
import { List } from "@phosphor-icons/react";
import { StyledMenuSiderbar } from "~/components/ActionMenu/styled";
import classNames from "classnames";
import fileStorageService from "~/services/fileStorage.service";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSidebarOptions } from "./useSidebarOptions";

function AvatarPopper({ pageTitle }: { pageTitle?: string }) {
  const navigate = useNavigate();
  const { userInfo } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const searchParams = new URLSearchParams(location.search);
  const tenantCode = searchParams.get("tenantCode");
  const userRole = userInfo?.roles?.[0];
  const { sysAdminSidebar, tenantSidebar } = useSidebarOptions();

  const sidebarOptions = useMemo(() => {
    if (userRole === "SYSADMIN" && !tenantCode) {
      return sysAdminSidebar;
    } else {
      return tenantSidebar;
    }
  }, [sysAdminSidebar, tenantCode, tenantSidebar, userRole]);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { data: img } = useQuery({
    queryKey: ["userImg", userInfo?.avatarUrl],
    queryFn: async () => {
      const res: any = await fileStorageService.getFileImage(
        userInfo?.avatarUrl
      );
      if (res !== undefined) {
        const url = URL.createObjectURL(res);
        return url;
      }
      return "";
    },
  });

  const handleClickAvatar = () => {
    navigate("/setting");
  };

  return (
    <>
      <div className="justify-center flex-col hidden mt-6 mb-4 miniLaptop:flex miniLaptop:w-full">
        <span className="text-xs absolute left-0 bottom-14">v.2025.05.08</span>
        <Avatar
          onClick={handleClickAvatar}
          className="!w-[32px] !h-[32px] cursor-pointer  "
          alt={userInfo?.name || userInfo?.username}
          src={img}
        />
      </div>
      <div className="flex py-4 miniLaptop:hidden">
        <button onClick={handleClick} className="cursor-pointer">
          <List size={24} />
        </button>
      </div>

      <StyledMenuSiderbar
        id="action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="block miniLaptop:hidden"
      >
        {/* Add your menu items here */}
        <div className="flex flex-col items-start gap-1">
          <MenuItem
            onClick={() => {
              handleClickAvatar();
              handleClose();
            }}
            className="w-full h-10 !rounded-md"
            disableRipple
          >
            <Avatar
              className="!w-[32px] !h-[32px] cursor-pointer  "
              alt={userInfo?.name || userInfo?.username}
              src={img}
            />
            <div className="flex flex-col">
              <Typography variant="label3">
                {userInfo?.name || userInfo?.username}
              </Typography>
              <Typography variant="caption">
                {userInfo?.roles?.[0] || ""}
              </Typography>
            </div>
          </MenuItem>
          {sidebarOptions.map((option) => (
            <MenuItem
              onClick={() => {
                navigate(
                  tenantCode
                    ? `${option.path}?tenantCode=${tenantCode}`
                    : option.path
                );
                handleClose();
              }}
              key={option.title}
              disableRipple
              className={classNames("w-full h-10 !rounded-md", {
                "!bg-[var(--primary)] !text-[white]":
                  option.path === location.pathname,
              })}
            >
              {option.icon}
              <Typography variant="body3">{option.title}</Typography>
            </MenuItem>
          ))}
        </div>
      </StyledMenuSiderbar>
      <Typography variant="label2" className="flex miniLaptop:hidden">
        {pageTitle}
      </Typography>
    </>
  );
}

export default AvatarPopper;
