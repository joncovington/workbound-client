import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFetchRolesQuery } from "api/apiSlice";
import { Dropdown, Message, Label, Transition } from "semantic-ui-react";

import { setWorkItems } from "features/builder/builderSlice";

const RoleInput = (props) => {
  const dispatch = useDispatch();
  const { section, index, item } = props;
  const workItems = useSelector((state) => state.builder.workItems);
  const thisWorkItem = workItems[index];
  const {
    data: roleUsers,
    isSuccess,
    isFetching,
    isError,
    isLoading,
    error,
  } = useFetchRolesQuery(
    { category: section ? section.id : null },
    { skip: section === null }
  );

  const assignUser = (userId) => {
    let newWorkItems = JSON.parse(JSON.stringify(workItems));
    newWorkItems[index]["assignedTo"] = userId;
    dispatch(setWorkItems({ workItems: newWorkItems }));
  };

  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (roleUsers?.results.length > 0) {
      let config = [];
      roleUsers.results.forEach((role) => {
        config.push({
          key: role.id,
          value: role.user.id,
          text: role.user.email,
        });
      });
      setOptions(config);
    }
  }, [roleUsers, setOptions]);

  const [warning, setWarning] = useState(true);

  useEffect(() => {
    if (thisWorkItem?.assignedTo === null) {
      setWarning(true);
    } else {
      setWarning(false);
    }
  }, [thisWorkItem]);

  const handleChange = (e) => {
    let userId = e.target.value;
    if (isNaN(parseInt(userId))) {
      assignUser(null);
    } else {
      assignUser(parseInt(userId));
    }
  };

  if (isError) {
    console.log(error);
    return (
      <Message negative>
        <Message.Content>There was an error.</Message.Content>
      </Message>
    );
  }

  if (isFetching || isLoading) {
    return <Dropdown loading fluid selection options={[]} />;
  }

  if (isSuccess) {
    return (
      <div>
        <select
          className="ui fluid dropdown"
          name="assignedTo"
          onChange={(e) => {
            handleChange(e);
          }}
        >
          <option key="none" value="">
            Select User
          </option>
          {options.map((option) => {
            return (
              <option key={option.key} value={option.value}>
                {option.text}
              </option>
            );
          })}
        </select>
        <div>
          <Transition visible={warning}>
            <Label basic color="red" size="tiny" pointing="above">
              WorkItem "{item.title}" must have assigned user.
            </Label>
          </Transition>
        </div>
      </div>
    );
  }
};

export default RoleInput;
