import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { registerOperatorRoute } from "/imports/client/ui";
import PaymentSettings from "./PaymentSettings.js";

registerOperatorRoute({
  group: "settings",
  MainComponent: PaymentSettings,
  priority: 20,
  path: "/payment",
  // eslint-disable-next-line react/display-name
  SidebarIconComponent: (props) => <FontAwesomeIcon icon={faCreditCard} {...props} />,
  sidebarI18nLabel: "admin.settings.paymentSettingsLabel"
});
