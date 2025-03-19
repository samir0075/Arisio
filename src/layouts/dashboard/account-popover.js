import { useCallback } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { signInActions } from "src/store/signInSlice";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { paymentActions } from "src/store/paymentSlice";
import { initialData } from "../../utils/initialState-for-searchStartup";
import { searchStartupFilterDataClean } from "src/action/searchStartups";
import { searchStartUpsActions } from "src/store/searchStartupsSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useAuth();

  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const userRole = userDetails?.role;
  const userStatusCode = userDetails?.status;

  const userTransactionHistory = useSelector((state) => {
    return state?.payment?.skipCashTransaction;
  });

  const handleSignOut = useCallback(() => {
    onClose?.();
    auth.signOut();
    router.push("/");
    dispatch(paymentActions.emptySkipCashTransaction());

    dispatch(searchStartupFilterDataClean(initialData));
    dispatch(
      searchStartUpsActions.setKeyowordFilterKeys({
        keywordFilterKeys: {},
      })
    );
    dispatch(
      searchStartUpsActions.setCompanyNameFilterName({
        filterName: {},
      })
    );
    dispatch(
      searchStartUpsActions.setfilterDatabyCompanyFilterFeild({
        filterFeilds: {},
      })
    );
    dispatch(signInActions.handleSignOut());
  }, [onClose, auth, router, dispatch]);

  const handleProfile = () => {
    onClose?.();
    router.push("/Profile");
  };

  const handleMyUpdates = () => {
    onClose?.();
    router.push("/MyUpdates");
  };

  const handleMyProfile = () => {
    onClose?.();
    router.push("/MyProfile");
  };

  const handleMyTransaction = () => {
    // if (userTransactionHistory?.status === false) {
    //   onClose?.();
    //   toast.warning("There is no transactions", {
    //     position: "top-right",
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });
    // } else {
    onClose?.();
    router.push("/PricingSubscription");
    // }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: "8px",
          "& > *": {
            borderRadius: 1,
          },
        }}
      >
        {userRole !== "ADMINISTRATOR" ? (
          <>
            {userRole !== "INDIVIDUAL" && (
              <MenuItem onClick={handleProfile} disabled={userDetails?.status === 4}>
                {" "}
                <FormattedMessage id="side.nav.title.Profile" defaultMessage="Profile" />
              </MenuItem>
            )}
            {userRole === "INDIVIDUAL" && (
              <MenuItem onClick={handleMyProfile}>
                {" "}
                <FormattedMessage id="side.nav.title.myProfile" defaultMessage="My Profile" />
              </MenuItem>
            )}

            {userRole === "ENTREPRENEUR" && userStatusCode === 1 && (
              <MenuItem onClick={handleMyUpdates}>
                <FormattedMessage id="side.nav.title.myUpdates" defaultMessage="My Updates" />
              </MenuItem>
            )}
            {isPermitted(permissions.ACCOUNTPOPOVER_PLANTRANSACTION) && (
              <MenuItem onClick={handleMyTransaction}>
                {" "}
                <FormattedMessage
                  id="side.nav.title.myTransaction"
                  defaultMessage="Plan Transactions"
                />
              </MenuItem>
            )}

            <MenuItem onClick={handleSignOut}>
              {" "}
              <FormattedMessage id="side.nav.title.SignOut" defaultMessage="Sign out" />
            </MenuItem>
          </>
        ) : (
          <MenuItem onClick={handleSignOut}>
            {" "}
            <FormattedMessage id="side.nav.title.SignOut" defaultMessage="Sign out" />
          </MenuItem>
        )}
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
