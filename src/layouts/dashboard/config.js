import { SvgIcon } from "@mui/material";
import IdeaSearchIcon from "public/Images/IdeaSearchIcon";
import NewsIcon from "public/Images/NewsIcon";
import EventIcon from "public/Images/EventIcon";

import ShortListIcon from "public/Images/ShortListIcon";

import AllMandate from "public/Images/AllMandate";

import SearchStartupIcon from "public/Images/SearchStartupIcon";
import MandateIcon from "public/Images/MandateIcon";
import PitchesIcon from "public/Images/PitchesIcon";
import UpdateIcon from "public/Images/UpdateIcon";
import { FormattedMessage } from "react-intl";
import permission from "src/utils/permission";
import Notification from "public/Images/HomePage/Notification";
import SubscriptionIcon from "public/Images/HomePage/SubscriptionIcon";
import UserActivity from "public/Images/HomePage/UserActivity";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";

const startupItems = [
  {
    title: <FormattedMessage id="side.nav.title.Mandates" defaultMessage="Mandates" />,
    path: "/SeeMandates",
    icon: (
      <SvgIcon fontSize="small">
        <MandateIcon />
      </SvgIcon>
    ),
    permission: permission.STARTUP_MANDATE_SIDE_NAV,
  },
  {
    title: <FormattedMessage id="side.nav.title.Pitches" defaultMessage="Pitches" />,
    path: "/MyPitches",
    icon: (
      <SvgIcon fontSize="small">
        <PitchesIcon />
      </SvgIcon>
    ),
    permission: permission.STARTUP_PITCH_SIDE_NAV,
  },
  // {
  //   title: <FormattedMessage id="side.nav.title.Updates" defaultMessage="Updates" />,
  //   path: "/MyUpdates",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <UpdateIcon />
  //     </SvgIcon>
  //   ),
  // },
  {
    title: <FormattedMessage id="side.nav.title.ideaSearch" defaultMessage="Idea Search" />,
    path: "/IdeaSearch",
    icon: (
      <SvgIcon fontSize="small">
        <IdeaSearchIcon />
      </SvgIcon>
    ),

    permission: permission.STARTUP_IDEASEARCH_SIDE_NAV,
  },
  {
    title: <FormattedMessage id="side.nav.title.news" defaultMessage="News" />,
    path: "/News",
    icon: (
      <SvgIcon fontSize="small">
        {/* <PitchesIcon /> */}
        <NewsIcon />
      </SvgIcon>
    ),
    permission: permission.NEWS_SIDE_NAV,
  },
  {
    title: <FormattedMessage id="side.nav.title.events" defaultMessage="Events" />,
    path: "/Events",
    icon: (
      <SvgIcon fontSize="small">
        <PitchesIcon />
      </SvgIcon>
    ),
    permission: permission.EVENTS_SIDE_NAV,
  },
];

const investorItems = [
  // {
  //   title: (
  //     <FormattedMessage
  //       id="side.nav.title.createNewMandates"
  //       defaultMessage="Create New Mandates"
  //     />
  //   ),
  //   path: "/CreateMandates",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <MandateIcon />
  //     </SvgIcon>
  //   ),
  //   permission: permission.INVESTOR_CREATE_NEW_MANDATE_SIDE_NAV
  // },
  {
    title: (
      <FormattedMessage
        id="side.nav.title.createNewMandates"
        defaultMessage="Create New Mandates"
      />
    ),
    path: "/MandateCreation",
    icon: (
      <SvgIcon fontSize="small">
        <MandateIcon />
      </SvgIcon>
    ),
    permission: permission.INVESTOR_CREATE_NEW_MANDATE_SIDE_NAV,
  },
  {
    title: <FormattedMessage id="side.nav.title.allMandates" defaultMessage="My Mandates" />,
    path: "/InvestorMandate",
    icon: (
      <SvgIcon fontSize="small">
        {/* <PitchesIcon /> */}
        <AllMandate />
      </SvgIcon>
    ),
    permission: permission.INVESTOR_ALL_MANDATE_SIDE_NAV,
  },
  {
    title: <FormattedMessage id="side.nav.title.news" defaultMessage="News" />,
    path: "/News",
    icon: (
      <SvgIcon fontSize="small">
        {/* <PitchesIcon /> */}
        <NewsIcon />
      </SvgIcon>
    ),
    permission: permission.NEWS_SIDE_NAV,
  },
  {
    title: <FormattedMessage id="side.nav.title.events" defaultMessage="Events" />,
    path: "/Events",
    icon: (
      <SvgIcon fontSize="small">
        {/* <PitchesIcon /> */}
        <EventIcon />
      </SvgIcon>
    ),
    permission: permission.EVENTS_SIDE_NAV,
  },
  {
    title: <FormattedMessage id="side.nav.title.searchStartups" defaultMessage="Search Startups" />,
    path: "/SearchStartups",
    icon: (
      <SvgIcon fontSize="small">
        {/* <UpdateIcon /> */}
        <SearchStartupIcon />
      </SvgIcon>
    ),
    permission: permission.SEARCH_STARTUP_SIDENAV,

    extra: "extra",
  },
  {
    title: (
      <FormattedMessage
        id="side.nav.title.shortListStartups"
        defaultMessage="Shortlisted Startups"
      />
    ),
    path: "/ShortlistStartups",
    icon: (
      <SvgIcon fontSize="small">
        <ShortListIcon />
      </SvgIcon>
    ),
    permission: permission.INVESTOR_SHORTLIST_STARTUP_SIDE_NAV,
  },
];

const adminItems = [
  {
    title: (
      <FormattedMessage id="side.nav.title.pendingApprovals" defaultMessage="Pending Approvals" />
    ),
    // path: "/PendingApprovals",
    icon: (
      <SvgIcon fontSize="small">
        <MandateIcon />
      </SvgIcon>
    ),
    permission: permission.ADMIN_PENDING_APPROVALS,

    children: [
      {
        title: <FormattedMessage id="side.nav.title.subModule1" defaultMessage="Startups" />,
        path: "/PendingApprovals/Startups",
        icon: (
          <SvgIcon fontSize="small">
            <MandateIcon />
          </SvgIcon>
        ),
        permission: permission.ADMIN_PENDING_APPROVAL_STARTUPS_SIDE_NAV,
      },
      {
        title: <FormattedMessage id="side.nav.title.subModule2" defaultMessage="Investors" />,
        path: "/PendingApprovals/Investor",
        icon: (
          <SvgIcon fontSize="small">
            <MandateIcon />
          </SvgIcon>
        ),
        permission: permission.ADMIN_PENDING_APPROVAL_INVESTORS_SIDE_NAV,
      },

      {
        title: <FormattedMessage id="side.nav.title.subModule2" defaultMessage="Mandates" />,
        path: "/PendingApprovals/Mandates",
        icon: (
          <SvgIcon fontSize="small">
            <MandateIcon />
          </SvgIcon>
        ),
        permission: permission.ADMIN_PENDING_APPROVAL_MANDATES_SIDE_NAV,
      },
      {
        title: <FormattedMessage id="side.nav.title.subModule2" defaultMessage="Events" />,
        path: "/PendingApprovals/PendingEvents",
        icon: (
          <SvgIcon fontSize="small">
            <MandateIcon />
          </SvgIcon>
        ),
        permission: permission.ADMIN_PENDING_APPROVAL_EVENTS_SIDE_NAV,
      },
      {
        title: <FormattedMessage id="side.nav.title.News" defaultMessage="News" />,
        path: "/PendingApprovals/PendingNews",
        icon: (
          <SvgIcon fontSize="small">
            <MandateIcon />
          </SvgIcon>
        ),
        permission: permission.ADMIN_PENDING_APPROVAL_NEWS_SIDE_NAV,
      },
    ],
  },
  {
    title: <FormattedMessage id="side.nav.title.notifications" defaultMessage="Notification" />,
    // path: "/PendingApprovals",
    icon: (
      <SvgIcon fontSize="small">
        <Notification />
      </SvgIcon>
    ),
    permission: permission.ADMIN_PENDING_APPROVALS,

    children: [
      {
        title: (
          <FormattedMessage
            id="side.nav.title.notifications.subscripiton"
            defaultMessage="Subscription"
          />
        ),
        path: "/AdminNotification/Subscription",
        icon: (
          <SvgIcon fontSize="small">
            <SubscriptionIcon />
          </SvgIcon>
        ),
        permission: permission.ADMIN_PENDING_APPROVAL_STARTUPS_SIDE_NAV,
      },
      {
        title: (
          <FormattedMessage
            id="side.nav.title.notifications.activities"
            defaultMessage="User Activities"
          />
        ),
        path: "/AdminNotification/UserActivities",
        icon: (
          <SvgIcon fontSize="small">
            <UserActivity />
          </SvgIcon>
        ),
        permission: permission.ADMIN_PENDING_APPROVAL_INVESTORS_SIDE_NAV,
      },

      // {
      //   title: <FormattedMessage id="side.nav.title.news" defaultMessage="News" />,
      //   path: "/PendingApprovals/Mandates",
      //   icon: (
      //     <SvgIcon fontSize="small">
      //       <MandateIcon />
      //     </SvgIcon>
      //   ),
      //   permission: permission.ADMIN_PENDING_APPROVAL_MANDATES_SIDE_NAV
      // },
      // {
      //   title: <FormattedMessage id="side.nav.title.events" defaultMessage="Events" />,
      //   path: "/PendingApprovals/PendingEvents",
      //   icon: (
      //     <SvgIcon fontSize="small">
      //       <MandateIcon />
      //     </SvgIcon>
      //   ),
      //   permission: permission.ADMIN_PENDING_APPROVAL_EVENTS_SIDE_NAV
      // }
    ],
  },
  // {
  //   title: <FormattedMessage id="side.nav.title.newsLetter" defaultMessage="News Letter" />,
  //   // path: "/PendingApprovals",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <MandateIcon />
  //     </SvgIcon>
  //   ),
  //   permission: permission.ADMIN_PENDING_APPROVALS,

  //   children: [
  //     {
  //       title: (
  //         <FormattedMessage id="side.nav.title.newsLetter.add" defaultMessage="Add news letter" />
  //       ),
  //       path: "/PendingApprovals/Startups",
  //       icon: (
  //         <SvgIcon fontSize="small">
  //           <MandateIcon />
  //         </SvgIcon>
  //       ),
  //       permission: permission.ADMIN_PENDING_APPROVAL_STARTUPS_SIDE_NAV
  //     },
  //     {
  //       title: <FormattedMessage id="side.nav.title.newsLetter.publish" defaultMessage="Publish" />,
  //       path: "/PendingApprovals/Investor",
  //       icon: (
  //         <SvgIcon fontSize="small">
  //           <MandateIcon />
  //         </SvgIcon>
  //       ),
  //       permission: permission.ADMIN_PENDING_APPROVAL_INVESTORS_SIDE_NAV
  //     },

  //     {
  //       title: (
  //         <FormattedMessage id="side.nav.title.newsLetter.schedule" defaultMessage="Schedule" />
  //       ),
  //       path: "/PendingApprovals/Mandates",
  //       icon: (
  //         <SvgIcon fontSize="small">
  //           <MandateIcon />
  //         </SvgIcon>
  //       ),
  //       permission: permission.ADMIN_PENDING_APPROVAL_MANDATES_SIDE_NAV
  //     },
  //     {
  //       title: <FormattedMessage id="side.nav.title.newsLetter.archive" defaultMessage="Archive" />,
  //       path: "/PendingApprovals/PendingEvents",
  //       icon: (
  //         <SvgIcon fontSize="small">
  //           <MandateIcon />
  //         </SvgIcon>
  //       ),
  //       permission: permission.ADMIN_PENDING_APPROVAL_EVENTS_SIDE_NAV
  //     }
  //   ]
  // },
  {
    title: <FormattedMessage id="side.nav.title.events" defaultMessage="Add Events" />,
    path: "/Events",
    icon: (
      <SvgIcon fontSize="small">
        <PitchesIcon />
      </SvgIcon>
    ),
    permission: permission.EVENTS_SIDE_NAV,
  },
  {
    title: <FormattedMessage id="side.nav.title.adddNews" defaultMessage="Add News" />,
    path: "/News",
    icon: (
      <SvgIcon fontSize="small">
        <PitchesIcon />
      </SvgIcon>
    ),
    permission: permission.NEWS_SIDE_NAV,
  },

  // {
  //   title: <FormattedMessage id="side.nav.title.notifications" defaultMessage="Notifications" />,
  //   path: "/Notifications",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <PitchesIcon />
  //     </SvgIcon>
  //   ),
  //   permission: permission.ADMIN_NOTIFICATION_SIDE_NAV
  // },

  {
    title: <FormattedMessage id="side.nav.title.admin.allMandates" defaultMessage="All Mandates" />,
    path: "/AllMandates",
    icon: (
      <SvgIcon fontSize="small">
        <UpdateIcon />
      </SvgIcon>
    ),
    permission: permission.ADMIN_ALLMANDATES_SIDE_NAV,
  },

  {
    title: <FormattedMessage id="side.nav.title.searchStartups" defaultMessage="Search Startups" />,
    path: "/SearchStartups",
    icon: (
      <SvgIcon fontSize="small">
        <IdeaSearchIcon />
      </SvgIcon>
    ),
    permission: permission.SEARCH_STARTUP_SIDENAV,
  },

  {
    title: <FormattedMessage id="side.nav.title.addStartups" defaultMessage="Add Startups" />,

    path: "/AddStartups",
    icon: (
      <SvgIcon fontSize="small">
        <MandateIcon />
      </SvgIcon>
    ),
    permission: permission.ADMIN_ADD_STARTUPS_SIDE_NAV,
  },
];

const mentorItems = [
  {
    title: <FormattedMessage id="side.nav.title.dashboard" defaultMessage="Dashboard" />,
    path: "/dashboard",
    icon: (
      <SvgIcon fontSize="small">
        <DashboardIcon />
      </SvgIcon>
    ),
    // permission: permission.INVESTOR_CREATE_NEW_MANDATE_SIDE_NAV,
  },
  {
    title: (
      <FormattedMessage
        id="side.nav.title.manage-availability"
        defaultMessage="Manage Availability"
      />
    ),
    path: "/mentor_availability",
    icon: (
      <SvgIcon fontSize="small">
        <MoreTimeIcon />
      </SvgIcon>
    ),
    // permission: permission.INVESTOR_CREATE_NEW_MANDATE_SIDE_NAV,
  },
  {
    title: (
      <FormattedMessage
        id="side.nav.title.manage-appointments"
        defaultMessage="Manage Appointments"
      />
    ),
    path: "/mentor_appointments",
    icon: (
      <SvgIcon fontSize="small">
        <EditCalendarIcon />
      </SvgIcon>
    ),
    // permission: permission.INVESTOR_CREATE_NEW_MANDATE_SIDE_NAV,
  },
];

export { investorItems, adminItems, startupItems, mentorItems };
