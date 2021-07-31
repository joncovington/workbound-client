import React from "react";
import { Accordion, List } from "semantic-ui-react";

const PermissionList = (props) => {
  const permissions = props.user.permissions;

  const panels = [];
  Object.keys(permissions).forEach((perm, index) => {
    if (Object.keys(permissions[perm]).length > 0) {
      var items = [];
      Object.keys(permissions[perm]).forEach((key) => {
        if (permissions[perm][key].status === true && perm !== "status") {
          items.push(permissions[perm][key].verbose);
        }
      });

      panels.push({
        key: `panel-${index}`,
        title: {
          content: perm.toUpperCase(),
        },
        content: {
          content: <List bulleted items={items} />,
        },
      });
    }
  });
  return <Accordion panels={panels} styled fluid />;
};

export default PermissionList;
