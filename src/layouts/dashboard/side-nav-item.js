/* eslint-disable react/no-children-prop */
import NextLink from "next/link";
import PropTypes from "prop-types";
import { Box, ButtonBase, Collapse, ListItem, ListItemText, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getStartUpsCount } from "src/action/searchStartups";
import { useEffect, useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export const SideNavItem = props => {
  const { active = false, disabled, external, icon, path, title, extra, children = [] } = props;
  const [open, setOpen] = useState(true);
  const userData = localStorage.getItem("userDetails");
  const lang = localStorage.getItem("lang");
  const isRTL = lang === "ar";
  const userDetails = userData ? JSON.parse(userData) : null;
  const investorId = userDetails?.investorId;

  const router = useRouter();
  const currentPath = router.pathname;

  const dispatch = useDispatch();

  const startUpsCount = useSelector(state => state?.searchStartUps?.startUpsCount);

  useEffect(() => {
    if (userDetails?.role === "INVESTOR" && Object.keys(startUpsCount).length === 0) {
      dispatch(getStartUpsCount(investorId));
    }
  }, [dispatch, investorId, startUpsCount, userDetails?.role]);

  const handleClick = () => {
    if (children.length) {
      setOpen(!open);
    }
  };

  const linkProps = path
    ? external
      ? {
          component: "a",
          href: path,
          target: "_blank"
        }
      : {
          component: NextLink,
          href: path
        }
    : {};
  const isChildActive = childPath => currentPath?.includes(childPath);

  const filterNestedRoutes =
    isChildActive(path) || children.some(child => isChildActive(child.path));

  return (
    <li>
      <ButtonBase
        sx={{
          alignItems: "center",
          borderRadius: "5px",
          display: "flex",
          justifyContent: "flex-start",
          pl: "16px",
          pr: isRTL ? "0px" : "16px",
          py: "0px",
          textAlign: "left",
          width: "100%",
          marginTop: "5px",
          backgroundColor: disabled
            ? ""
            : filterNestedRoutes
            ? "#ffffff2b"
            : active
            ? "#ffffff2b"
            : "transparent",
          "&:hover": !disabled && {
            backgroundColor: "#ffffff2b"
          }
        }}
        onClick={handleClick}
        disabled={disabled}
        {...linkProps}
      >
        {icon && (
          <Tooltip title={title} placement={"right"}>
            <Box
              component="span"
              sx={{
                alignItems: "center",
                color: "#fff",
                display: "inline-flex",
                justifyContent: "center",
                mr: isRTL ? 1.5 : 2,
                ml: isRTL ? 2 : 0,
                ...(active && {
                  color: "#fff"
                }),
                ...(disabled && {
                  color: "neutral.500"
                })
              }}
            >
              {icon}
            </Box>
          </Tooltip>
        )}
        <Box
          component="span"
          sx={{
            color: "#fff",
            flexGrow: 1,
            fontFamily: theme => theme.typography.fontFamily,
            fontSize: 14,
            // fontWeight: 600,
            lineHeight: "24px",
            whiteSpace: "nowrap",
            padding: "10px",
            ...(active && {
              color: "#fff"
            }),
            ...(disabled && {
              color: "neutral.500"
            })
          }}
        >
          {title}
        </Box>
        {children.length > 0 && (
          <Box
            component="span"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {open ? <ExpandLess sx={{ color: " #fff" }} /> : <ExpandMore sx={{ color: " #fff" }} />}
          </Box>
        )}
        {extra && (
          <Box
            component="div"
            sx={{
              color: "neutral.400",
              flexGrow: 3,
              fontFamily: theme => theme.typography.fontFamily,
              fontSize: 12,
              fontWeight: 400,
              padding: "5px",
              borderRadius: "50%",
              marginRight: isRTL ? "-5px" : "21px",
              backgroundColor: "#726c6c",
              color: "#ffffff",
              ...(active && {
                color: "#fff"
              })
            }}
          >
            {typeof startUpsCount === "object" && startUpsCount?.count}
          </Box>
        )}
      </ButtonBase>
      {children.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ paddingLeft: "5px" }}>
            {children.map(child => (
              <SideNavItem
                key={child.title}
                active={active}
                disabled={disabled}
                external={child.external}
                icon={child.icon}
                path={child.path}
                title={child.title}
                children={child.children}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
  extra: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.object)
};
